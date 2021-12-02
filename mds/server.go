package mds

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/hex"
	"flag"
	"io/fs"
	"net/http"
	"os"
	"sync"
	"sync/atomic"
	"time"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
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

var wsUpgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Mds struct {
	logger            *zap.Logger
	backdoorPublicKey string
	primaryRootStore  *fdb.Database
	replicaRootStore  *fdb.Database
	subspace          subspace.Subspace
	region            string
	tempDir           string
	clusters          atomic.Value // map[string]*MdsCluster
	webData           fs.FS
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

func NewMds(logger *zap.Logger, webData fs.FS) *Mds {
	tempDir, err := os.MkdirTemp("", "blueboat-mds-")
	if err != nil {
		logger.Panic("failed to create temp dir", zap.Error(err))
	}
	logger.Info("created temp dir", zap.String("dir", tempDir))

	m := &Mds{
		logger:  logger,
		tempDir: tempDir,
		webData: webData,
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
	listen := flag.String("l", "", "listen address")
	configPath := flag.String("c", "", "config file")
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

	m.subspace = subspace.Sub(config.RootStore.Subspace)

	m.logger.Info("opening clusters")
	if err := m.openClustersOnce(); err != nil {
		return errors.Wrap(err, "failed to open clusters")
	}

	m.logger.Info("spawning periodic cluster reloader")
	go m.periodicallyReloadClusters()

	m.logger.Info("starting ws listener")
	http.HandleFunc("/mds", m.handle)
	http.Handle("/", http.FileServer(http.FS(m.webData)))
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
	clustersSub := m.subspace.Sub("clusters")

	ifc, err := m.ReplicaReadTransactor().ReadTransact(func(txn fdb.ReadTransaction) (interface{}, error) {
		return txn.GetRange(clustersSub, fdb.RangeOptions{}).GetSliceWithError()
	})
	if err != nil {
		return err
	}
	kv := ifc.([]fdb.KeyValue)
	for _, pair := range kv {
		tuple, err := clustersSub.Unpack(pair.Key)
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

	for k := range oldClusters {
		if _, ok := clusters[k]; !ok {
			m.logger.Info("removed old cluster", zap.String("name", k))
		}
	}

	m.clusters.Store(clusters)
	return nil
}

func (m *Mds) readRoleListFromReplica(key fdb.KeyConvertible) (*protocol.RoleList, error) {
	var grants protocol.RoleList
	_, err := m.readProtojsonFromReplica(key, &grants)
	return &grants, err
}

func (m *Mds) readProtojsonFromReplica(key fdb.KeyConvertible, out proto.Message) (bool, error) {
	data, err := m.readBytesValueFromReplica(key)
	if err != nil {
		return false, err
	}
	if data == nil {
		return false, nil
	}
	if err := protojson.Unmarshal(data, out); err != nil {
		return false, err
	}
	return true, nil
}

func (m *Mds) checkStorePermission(publicKey []byte, store subspace.Subspace) (bool, error) {
	usersSub := m.subspace.Sub("users")
	userRoles, err := m.readRoleListFromReplica(usersSub.Pack([]tuple.TupleElement{hex.EncodeToString(publicKey), "roles"}))
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

	c.SetReadLimit(MaxWebSocketIncomingMessageSize)

	loginChallenge := protocol.LoginChallenge{
		Challenge: make([]byte, 32),
		Version:   LoginVersion,
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

	if loginMsg.MuxWidth == 0 || loginMsg.MuxWidth > MaxMuxWidth {
		logger.Error("invalid mux width", zap.Uint32("width", loginMsg.MuxWidth))
		return
	}

	if len(loginMsg.PublicKey) != ed25519.PublicKeySize {
		logger.Error("invalid public key size", zap.Int("size", len(loginMsg.PublicKey)))
		return
	}

	if !ed25519.Verify(loginMsg.PublicKey, loginChallenge.Challenge, loginMsg.Signature) {
		logger.Error("invalid signature", zap.Binary("publicKey", loginMsg.PublicKey), zap.Binary("signature", loginMsg.Signature), zap.Binary("challenge", loginChallenge.Challenge))
		return
	}

	// Now we are authenticated but NOT authorized.
	store := m.subspace.Sub("stores").Sub(loginMsg.Store)
	permissionOk, err := m.checkStorePermission(loginMsg.PublicKey, store)
	if err != nil {
		logger.Error("failed to check store permission", zap.Error(err))
		return
	}

	publicKeyHex := hex.EncodeToString(loginMsg.PublicKey)
	if !permissionOk && m.backdoorPublicKey != "" && publicKeyHex == m.backdoorPublicKey {
		logger.Warn("backdoor login")
		permissionOk = true
	}

	logger.Info("login", zap.String("store", loginMsg.Store), zap.String("user", publicKeyHex), zap.Bool("ok", permissionOk))

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

	// Now we are authenticated and authorized.
	logger = logger.With(zap.String("store", loginMsg.Store), zap.String("user", publicKeyHex))

	var storeInfo protocol.StoreInfo
	storeInfoKey := store.Pack([]tuple.TupleElement{"info"})
	ok, err := m.readProtojsonFromReplica(storeInfoKey, &storeInfo)
	if err != nil {
		logger.Error("failed to read store info", zap.Error(err))
		return
	}
	if !ok {
		logger.Error("store not found", zap.Binary("storeInfoKey", storeInfoKey))
		return
	}

	cluster, err := m.lookupCluster(storeInfo.Cluster)
	if err != nil {
		logger.Error("failed to lookup cluster", zap.Error(err))
		return
	}

	storeSS := subspace.Sub(storeInfo.Subspace)

	channels := make([]chan *protocol.Request, 0, int(loginMsg.MuxWidth))
	for i := uint32(0); i < loginMsg.MuxWidth; i++ {
		channels = append(channels, make(chan *protocol.Request, 1))
	}
	defer func() {
		for _, ch := range channels {
			close(ch)
		}
	}()

	stop := make(chan struct{})
	defer close(stop)

	var xmitMu sync.Mutex

	for i := 0; i < int(loginMsg.MuxWidth); i++ {
		session := NewMdsSession(logger.With(zap.Int("lane", i)), cluster, storeSS)
		go session.Run(channels[i], stop, func(m proto.Message) error {
			xmitMu.Lock()
			defer xmitMu.Unlock()
			return writeProtoMsg(c, m)
		}, func() {
			c.Close()
		})
	}

	for {
		var msg protocol.Request
		if err := readProtoMsg(c, &msg); err != nil {
			if _, ok := err.(*websocket.CloseError); ok {
				logger.Info("connection closed")
			} else {
				logger.Error("failed to read request", zap.Error(err))
			}
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
