package mds

import (
	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/losfair/blueboat-mds/protocol"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/protobuf/proto"
)

type MdsSession struct {
	logger  *zap.Logger
	cluster *MdsCluster
	replicaTxn fdb.ReadTransaction
	primaryTxn fdb.Transaction
}

func NewMdsSession(logger *zap.Logger, cluster *MdsCluster) *MdsSession {
	return &MdsSession{
		logger:  logger,
		cluster: cluster,
	}
}

func (s *MdsSession) handleReadonly(req *protocol.ReadonlyRequest) (proto.Message, error) {
	return nil, errors.New("not implemented")
}

func (s *MdsSession) handleWritable(req *protocol.WritableRequest) (proto.Message, error) {
	return nil, errors.New("not implemented")
}

func (s *MdsSession) Run(ingress <-chan *protocol.Request, xmit func(proto.Message) error) {
	for {
		req := <-ingress
		if req == nil {
			return
		}

		var res proto.Message
		var err error

		if roBody, ok := req.Body.(*protocol.Request_Readonly); ok {
			res, err = s.handleReadonly(roBody.Readonly)
		} else if rwBody, ok := req.Body.(*protocol.Request_Writable); ok {
			res, err = s.handleWritable(rwBody.Writable)
		} else {
			err = errors.New("unknown request type")
		}

		if err != nil {
			s.logger.Error("failed to handle request", zap.Error(err))
			err = xmit(&protocol.Response{
				Body: &protocol.Response_Error{
					Error: &protocol.ErrorResponse{
						Description: err.Error(),
					},
				},
			})
		} else {
			err = xmit(res)
		}
		if err != nil {
			s.logger.Error("failed to send response", zap.Error(err))
		}
	}
}
