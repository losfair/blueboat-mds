package mds

import (
	"github.com/gorilla/websocket"
	"go.uber.org/zap"
)

type MdsSession struct {
	logger *zap.Logger
	cluster *MdsCluster
}

func NewMdsSession(logger *zap.Logger, cluster *MdsCluster) *MdsSession {
	return &MdsSession{
		logger:  logger,
		cluster: cluster,
	}
}

func (s *MdsSession) Run(c *websocket.Conn) error {
	return nil
}