package mds

import (
	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/gorilla/websocket"
	"github.com/losfair/blueboat-mds/protocol"
	"go.uber.org/zap"
)

type MdsSession struct {
	logger       *zap.Logger
	primaryStore *fdb.Database
	replicaStore *fdb.Database
}

func NewMdsSession(logger *zap.Logger, cluster *protocol.Cluster) (*MdsSession, error) {
	s := &MdsSession{
		logger: logger,
	}
	return s, nil
}

func (s *MdsSession) Run(c *websocket.Conn) error {
	return nil
}

func (s *MdsSession) PrimaryTransactor() fdb.Transactor {
	return s.primaryStore
}

func (s *MdsSession) ReplicaReadTransactor() fdb.ReadTransactor {
	if s.replicaStore != nil {
		return mdsReadTransactor{s.replicaStore}
	} else {
		return s.primaryStore
	}
}
