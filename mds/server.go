package mds

import "go.uber.org/zap"

type Mds struct {
	logger *zap.Logger
}

func NewMds(logger *zap.Logger) *Mds {
	return &Mds{
		logger: logger,
	}
}

func (m *Mds) Run() error {
	m.logger.Info("mds started")
	return nil
}
