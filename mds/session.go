package mds

import (
	"encoding/base64"
	"encoding/json"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/subspace"
	"github.com/apple/foundationdb/bindings/go/src/fdb/tuple"
	"github.com/dop251/goja"
	"github.com/losfair/blueboat-mds/protocol"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/protobuf/proto"
)

type MdsSession struct {
	logger  *zap.Logger
	cluster *MdsCluster
	ss      subspace.Subspace
	vm      *goja.Runtime
}

type jsPrimaryTxn struct {
	s   *MdsSession
	txn fdb.Transaction
}

type jsReplicaTxn struct {
	s   *MdsSession
	txn fdb.ReadTransaction
}

type jsFutureByteSlice struct {
	future fdb.FutureByteSlice
}

type jsRangeResult struct {
	rr fdb.RangeResult
}

func jsTxnCore_Get(s *MdsSession, txn fdb.ReadTransaction, key string) jsFutureByteSlice {
	return jsFutureByteSlice{
		future: txn.Get(s.ss.Pack(tuple.Tuple{key})),
	}
}

func jsTxnCore_PrefixList(s *MdsSession, txn fdb.ReadTransaction, prefix string, limit uint32) jsRangeResult {
	if limit == 0 || limit > 1000 {
		panic("PrefixList: invalid limit")
	}

	r, err := fdb.PrefixRange(s.ss.Pack(tuple.Tuple{prefix}))
	if err != nil {
		panic(err)
	}
	return jsRangeResult{
		rr: txn.GetRange(r, fdb.RangeOptions{
			Limit: int(limit),
		}),
	}
}

func (t jsReplicaTxn) Get(key string) jsFutureByteSlice {
	return jsTxnCore_Get(t.s, t.txn, key)
}

func (t jsReplicaTxn) PrefixList(prefix string, limit uint32) jsRangeResult {
	return jsTxnCore_PrefixList(t.s, t.txn, prefix, limit)
}

func (f jsFutureByteSlice) Wait() []byte {
	return f.future.MustGet()
}

func (t jsPrimaryTxn) Get(key string) jsFutureByteSlice {
	return jsTxnCore_Get(t.s, t.txn, key)
}

func (t *jsPrimaryTxn) Set(key string, value []byte) {
	t.txn.Set(t.s.ss.Pack(tuple.Tuple{key}), value)
}

func (t *jsPrimaryTxn) Delete(key string) {
	t.txn.Clear(t.s.ss.Pack(tuple.Tuple{key}))
}

func (t jsPrimaryTxn) PrefixList(prefix string, limit uint32) jsRangeResult {
	return jsTxnCore_PrefixList(t.s, t.txn, prefix, limit)
}

func (t *jsPrimaryTxn) PrefixDelete(prefix string) {
	r, err := fdb.PrefixRange(t.s.ss.Pack(tuple.Tuple{prefix}))
	if err != nil {
		panic(err)
	}
	t.txn.ClearRange(r)
}

func (t *jsPrimaryTxn) Commit() {
	err := t.txn.Commit().Get()
	if err != nil {
		panic(errors.Wrap(err, "failed to commit transaction"))
	}
}

func NewMdsSession(logger *zap.Logger, cluster *MdsCluster, ss subspace.Subspace) *MdsSession {
	s := &MdsSession{
		logger:  logger,
		cluster: cluster,
		ss:      ss,
		vm:      goja.New(),
	}
	s.vm.Set("createPrimaryTransaction", s.createPrimaryTransaction)
	s.vm.Set("createReplicaTransaction", s.createReplicaTransaction)
	s.vm.Set("base64Encode", s.jsBase64Encode)
	return s
}

func (s *MdsSession) jsBase64Encode(value goja.ArrayBuffer) string {
	return base64.StdEncoding.EncodeToString(value.Bytes())
}

func (s *MdsSession) createPrimaryTransaction(call goja.FunctionCall) goja.Value {
	txn, err := s.cluster.primaryStore.CreateTransaction()
	if err != nil {
		panic(err)
	}

	return s.vm.ToValue(jsPrimaryTxn{
		s:   s,
		txn: txn,
	})
}

func (s *MdsSession) createReplicaTransaction(call goja.FunctionCall) goja.Value {
	var txn fdb.Transaction
	var err error
	if s.cluster.replicaStore != nil {
		txn, err = s.cluster.replicaStore.CreateTransaction()
		if err != nil {
			panic(err)
		}
		if err := txn.Options().SetReadLockAware(); err != nil {
			panic(err)
		}
	} else {
		txn, err = s.cluster.primaryStore.CreateTransaction()
		if err != nil {
			panic(err)
		}
	}

	return s.vm.ToValue(jsReplicaTxn{
		s:   s,
		txn: txn,
	})
}

func (s *MdsSession) Run(ingress <-chan *protocol.Request, stop <-chan struct{}, xmit func(proto.Message) error, kill func()) {
	defer func() {
		if err := recover(); err != nil {
			s.logger.Error("session panic", zap.Any("error", err))
			kill()
		}
	}()
	go func() {
		<-stop
		s.logger.Debug("interrupting vm")
		s.vm.Interrupt(nil)
	}()
	for {
		req := <-ingress
		if req == nil {
			return
		}

		_, err := s.vm.RunString(req.Program)
		outputValue := s.vm.GlobalObject().Get("output")
		s.vm.GlobalObject().Delete("output")

		if err != nil {
			s.logger.Error("failed to run program", zap.Error(err))
			err = xmit(&protocol.Response{
				Lane: req.Lane,
				Body: &protocol.Response_Error{
					Error: &protocol.ErrorResponse{
						Description: err.Error(),
					},
				},
			})
		} else {
			if outputValue == nil {
				outputValue = goja.Undefined()
			}
			var output []byte
			output, err = json.Marshal(outputValue.Export())
			if err != nil {
				s.logger.Error("failed to marshal output", zap.Error(err))
				err = xmit(&protocol.Response{
					Lane: req.Lane,
					Body: &protocol.Response_Error{
						Error: &protocol.ErrorResponse{
							Description: err.Error(),
						},
					},
				})
			} else {
				err = xmit(&protocol.Response{
					Lane: req.Lane,
					Body: &protocol.Response_Output{
						Output: string(output),
					},
				})
			}
		}

		if err != nil {
			s.logger.Error("failed to send response", zap.Error(err))
		}
	}
}
