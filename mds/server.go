package mds

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/base64"
	"flag"
	"net/http"
	"os"
	"sync"
	"sync/atomic"
	"time"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/directory"
	"github.com/apple/foundationdb/bindings/go/src/fdb/subspace"
	"github.com/apple/foundationdb/bindings/go/src/fdb/tuple"
	"github.com/gorilla/websocket"
	"github.com/losfair/blueboat-mds/protocol"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
	"gopkg.in/yaml.v2"
)

var wsUpgrader = websocket.Upgrader{}

type Mds struct {
	logger            *zap.Logger
	backdoorPublicKey string
	primaryRootStore  *fdb.Database
	replicaRootStore  *fdb.Database
	dir               directory.Directory
	clustersDir       directory.DirectorySubspace
	storesDir         directory.DirectorySubspace
	usersDir          directory.DirectorySubspace
	region            string
	tempDir           string
	clusters          atomic.Value // map[string]*MdsCluster
}

type mdsReadTransactor struct {
	backing *fdb.Database
}

func (t mdsReadTransactor) ReadTransact(cb func(fdb.ReadTransaction) (interface{}, error)) (interface{}, error) {
	return t.backing.Transact(func(txn fdb.Transaction) (interface{}, error) {
		if err := txn.Options().SetReadLockAware(); err != nil {
			return nil, err
		}
		return cb(txn)
	})
}

func NewMds(logger *zap.Logger) *Mds {
	tempDir, err := os.MkdirTemp("", "blueboat-mds-")
	if err != nil {
		logger.Panic("failed to create temp dir", zap.Error(err))
	}
	logger.Info("created temp dir", zap.String("dir", tempDir))

	m := &Mds{
		logger:  logger,
		tempDir: tempDir,
	}
	m.clusters.Store(make(map[string]*MdsCluster))
	return m
}

func (m *Mds) PrimaryTransactor() fdb.Transactor {
	return m.primaryRootStore
}

func (m *Mds) ReplicaReadTransactor() fdb.ReadTransactor {
	if m.replicaRootStore != nil {
		return mdsReadTransactor{m.replicaRootStore}
	} else {
		return m.primaryRootStore
	}
}

func (m *Mds) Run() error {
	listen := flag.String("listen", "", "listen address")
	configPath := flag.String("config", "", "config file")
	backdoorPublicKey := flag.String("backdoor-public-key", "", "backdoor public key")
	flag.Parse()

	if *backdoorPublicKey != "" {
		m.logger.Warn("backdoor login enabled")
		m.backdoorPublicKey = *backdoorPublicKey
	}

	configData, err := os.ReadFile(*configPath)
	if err != nil {
		return errors.Wrap(err, "failed to read config file")
	}

	var config MdsConfig
	if err := yaml.Unmarshal(configData, &config); err != nil {
		return errors.Wrap(err, "failed to parse config file")
	}

	if config.Region == "" {
		return errors.New("region is required")
	}

	m.region = config.Region

	if config.RootStore.Primary == "" {
		return errors.New("primary root store must be specified")
	}

	primaryRootStore, err := fdb.OpenDatabase(config.RootStore.Primary)
	if err != nil {
		return errors.Wrap(err, "failed to open primary root store")
	}
	m.primaryRootStore = &primaryRootStore
	m.logger.Info("opened primary root store")

	if config.RootStore.Replica != "" {
		replicaRootStore, err := fdb.OpenDatabase(config.RootStore.Replica)
		if err != nil {
			return errors.Wrap(err, "failed to open replica root store")
		}
		m.replicaRootStore = &replicaRootStore
		m.logger.Info("opened replica root store")
	}

	nodeSS := subspace.Sub(config.RootStore.Subspace, "n")
	contentSS := subspace.Sub(config.RootStore.Subspace, "c")
	m.dir = directory.NewDirectoryLayer(nodeSS, contentSS, false)
	m.clustersDir, err = m.dir.CreateOrOpen(m.PrimaryTransactor(), []string{"clusters"}, nil)
	if err != nil {
		return errors.Wrap(err, "failed to create or open clusters directory")
	}
	m.storesDir, err = m.dir.CreateOrOpen(m.PrimaryTransactor(), []string{"stores"}, nil)
	if err != nil {
		return errors.Wrap(err, "failed to create or open stores directory")
	}
	m.usersDir, err = m.dir.CreateOrOpen(m.PrimaryTransactor(), []string{"users"}, nil)
	if err != nil {
		return errors.Wrap(err, "failed to create or open users directory")
	}

	m.logger.Info("opening clusters")
	if err := m.openClustersOnce(); err != nil {
		return errors.Wrap(err, "failed to open clusters")
	}

	m.logger.Info("spawning periodic cluster reloader")
	go m.periodicallyReloadClusters()

	m.logger.Info("starting ws listener")
	http.HandleFunc("/mds", m.handle)
	return errors.Wrap(http.ListenAndServe(*listen, nil), "failed to start http server")
}

func (m *Mds) periodicallyReloadClusters() {
	for {
		time.Sleep(30 * time.Second)
		if err := m.openClustersOnce(); err != nil {
			m.logger.Error("failed to reload clusters", zap.Error(err))
		}
	}
}

func (m *Mds) lookupCluster(name string) (*MdsCluster, error) {
	clusters := m.clusters.Load().(map[string]*MdsCluster)
	c, ok := clusters[name]
	if !ok {
		return nil, errors.Errorf("cluster %s not found", name)
	}
	return c, nil
}

func (m *Mds) openClustersOnce() error {
	oldClusters := m.clusters.Load().(map[string]*MdsCluster)
	clusters := make(map[string]*MdsCluster)

	ifc, err := m.ReplicaReadTransactor().ReadTransact(func(txn fdb.ReadTransaction) (interface{}, error) {
		return txn.GetRange(m.clustersDir, fdb.RangeOptions{}).GetSliceWithError()
	})
	if err != nil {
		return err
	}
	kv := ifc.([]fdb.KeyValue)
	for _, pair := range kv {
		tuple, err := m.clustersDir.Unpack(pair.Key)
		if err != nil {
			m.logger.Error("failed to unpack cluster key", zap.Error(err))
			continue
		}
		if len(tuple) < 1 {
			m.logger.Error("cluster key is an empty tuple", zap.Binary("key", pair.Key))
			continue
		}
		clusterName, ok := tuple[0].(string)
		if !ok {
			m.logger.Error("cluster key is not a string", zap.Binary("key", pair.Key))
			continue
		}
		if old, ok := oldClusters[clusterName]; ok {
			clusters[clusterName] = old
			continue
		}

		var clusterConfig protocol.Cluster
		if err := protojson.Unmarshal(pair.Value, &clusterConfig); err != nil {
			m.logger.Error("failed to unmarshal cluster config", zap.Error(err))
			continue
		}
		cluster, err := NewMdsCluster(m.logger, m.tempDir, clusterName, m.region, &clusterConfig)
		if err != nil {
			m.logger.Error("failed to create MdsCluster", zap.String("name", clusterName), zap.Error(err))
			continue
		}
		clusters[clusterName] = cluster
		m.logger.Info("opened cluster", zap.String("name", clusterName))
	}

	m.clusters.Store(clusters)
	return nil
}

func (m *Mds) readRoleListFromReplica(key fdb.KeyConvertible) (*protocol.RoleList, error) {
	data, err := m.readBytesValueFromReplica(key)
	if err != nil {
		return nil, err
	}
	if data == nil {
		return nil, nil
	}
	var grants protocol.RoleList
	if err := protojson.Unmarshal(data, &grants); err != nil {
		return nil, err
	}
	return &grants, nil
}

func (m *Mds) checkStorePermission(publicKey []byte, store directory.DirectorySubspace) (bool, error) {
	userRoles, err := m.readRoleListFromReplica(m.usersDir.Pack([]tuple.TupleElement{base64.StdEncoding.EncodeToString(publicKey)}))
	if err != nil {
		return false, err
	}
	roleMap := make(map[string]struct{})
	for _, r := range userRoles.Roles {
		roleMap[r] = struct{}{}
	}

	storeRoleGrants, err := m.readRoleListFromReplica(store.Pack([]tuple.TupleElement{"role-grants"}))
	if err != nil {
		return false, err
	}

	for _, role := range storeRoleGrants.Roles {
		if _, ok := roleMap[role]; ok {
			return true, nil
		}
	}
	return false, nil
}

func (m *Mds) handle(w http.ResponseWriter, r *http.Request) {
	logger := m.logger.With(zap.String("remote", r.RemoteAddr))
	logger.Info("new connection")

	c, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		logger.Error("failed to upgrade connection", zap.Error(err))
		return
	}
	defer c.Close()

	loginChallenge := protocol.LoginChallenge{
		Challenge: make([]byte, 32),
	}
	if _, err := rand.Read(loginChallenge.Challenge); err != nil {
		logger.Error("failed to generate challenge", zap.Error(err))
		return
	}

	if err := writeProtoMsg(c, &loginChallenge); err != nil {
		logger.Error("failed to write login challenge", zap.Error(err))
		return
	}

	var loginMsg protocol.Login
	if err := readProtoMsg(c, &loginMsg); err != nil {
		logger.Error("failed to read login message", zap.Error(err))
		return
	}

	if loginMsg.MuxWidth == 0 || loginMsg.MuxWidth > 16 {
		logger.Error("invalid mux width", zap.Uint32("width", loginMsg.MuxWidth))
		return
	}

	if len(loginMsg.PublicKey) != ed25519.PublicKeySize {
		logger.Error("invalid public key size", zap.Int("size", len(loginMsg.PublicKey)))
		return
	}

	if !ed25519.Verify(loginMsg.PublicKey, loginChallenge.Challenge, loginMsg.Signature) {
		logger.Error("invalid signature")
		return
	}

	store, err := m.storesDir.Open(m.ReplicaReadTransactor(), []string{loginMsg.Store}, nil)
	if err != nil {
		logger.Error("failed to open store", zap.String("name", loginMsg.Store), zap.Error(err))
		return
	}

	permissionOk, err := m.checkStorePermission(loginMsg.PublicKey, store)
	if err != nil {
		logger.Error("failed to check store permission", zap.Error(err))
		return
	}

	publicKeyB64 := base64.StdEncoding.EncodeToString(loginMsg.PublicKey)
	if !permissionOk && m.backdoorPublicKey != "" && publicKeyB64 == m.backdoorPublicKey {
		logger.Warn("backdoor login")
		permissionOk = true
	}

	logger.Info("login", zap.String("store", loginMsg.Store), zap.String("user", publicKeyB64), zap.Bool("ok", permissionOk))

	loginResponse := protocol.LoginResponse{
		Ok: permissionOk,
	}
	if err := writeProtoMsg(c, &loginResponse); err != nil {
		logger.Error("failed to write login response", zap.Error(err))
		return
	}
	if !permissionOk {
		return
	}

	logger = logger.With(zap.String("store", loginMsg.Store), zap.String("user", publicKeyB64))

	clusterNameBytes, err := m.readBytesValueFromReplica(store.Pack([]tuple.TupleElement{"name"}))
	if err != nil {
		logger.Error("failed to read cluster name", zap.Error(err))
		return
	}
	if clusterNameBytes == nil {
		logger.Error("no cluster name")
		return
	}

	clusterName := string(clusterNameBytes)
	cluster, err := m.lookupCluster(clusterName)
	if err != nil {
		logger.Error("failed to lookup cluster", zap.Error(err))
		return
	}

	channels := make([]chan *protocol.Request, 0, int(loginMsg.MuxWidth))
	for i := uint32(0); i < loginMsg.MuxWidth; i++ {
		channels = append(channels, make(chan *protocol.Request, 64))
	}
	defer func() {
		for _, ch := range channels {
			close(ch)
		}
	}()

	var xmitMu sync.Mutex

	for i := 0; i < int(loginMsg.MuxWidth); i++ {
		session := NewMdsSession(logger.With(zap.Int("lane", i)), cluster)
		go session.Run(channels[i], func(m proto.Message) error {
			xmitMu.Lock()
			defer xmitMu.Unlock()
			return writeProtoMsg(c, m)
		})
	}

	for {
		var msg protocol.Request
		if err := readProtoMsg(c, &msg); err != nil {
			logger.Error("failed to read request", zap.Error(err))
			return
		}

		lane := int(msg.Lane)
		if lane < 0 || lane >= len(channels) {
			logger.Error("invalid lane", zap.Int("lane", lane))
			continue
		}

		channels[lane] <- &msg
	}
}

func (m *Mds) readBytesValueFromReplica(key fdb.KeyConvertible) ([]byte, error) {
	ifc, err := m.ReplicaReadTransactor().ReadTransact(func(txn fdb.ReadTransaction) (interface{}, error) {
		return txn.Get(key).Get()
	})
	if err != nil {
		return nil, err
	}
	return ifc.([]byte), nil
}

func writeProtoMsg(c *websocket.Conn, msg proto.Message) error {
	data, err := proto.Marshal(msg)
	if err != nil {
		return err
	}
	if err := c.WriteMessage(websocket.BinaryMessage, data); err != nil {
		return err
	}
	return nil
}

func readProtoMsg(c *websocket.Conn, out proto.Message) error {
	_, message, err := c.ReadMessage()
	if err != nil {
		return err
	}
	return proto.Unmarshal(message, out)
}
