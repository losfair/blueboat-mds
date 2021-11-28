package mds

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/base64"
	"flag"
	"net/http"
	"os"

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
	return &Mds{
		logger: logger,
	}
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

	m.logger.Info("starting ws listener")

	http.HandleFunc("/mds", m.handle)
	return errors.Wrap(http.ListenAndServe(*listen, nil), "failed to start http server")
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
	clusterConfigBytes, err := m.readBytesValueFromReplica(m.clustersDir.Pack([]tuple.TupleElement{string(clusterNameBytes)}))
	if err != nil {
		logger.Error("failed to read cluster config", zap.Error(err))
		return
	}
	if clusterConfigBytes == nil {
		logger.Error("no cluster config")
		return
	}
	var clusterConfig protocol.Cluster
	if err := protojson.Unmarshal(clusterConfigBytes, &clusterConfig); err != nil {
		logger.Error("failed to unmarshal cluster config", zap.Error(err))
		return
	}

	session, err := NewMdsSession(logger, &clusterConfig)
	if err != nil {
		logger.Error("failed to create session", zap.Error(err))
		return
	}

	err = session.Run(c)
	if err != nil {
		logger.Error("session failed", zap.Error(err))
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
