package mds

import (
	"encoding/base64"
	"encoding/json"
	"time"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/subspace"
	"github.com/dop251/goja"
	"github.com/losfair/blueboat-mds/protocol"
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
	s      *MdsSession
	future fdb.FutureByteSlice
}

type jsRangeResult struct {
	rr fdb.RangeResult
}

type jsFutureNil struct {
	future fdb.FutureNil
}

func jsTxnCore_Get(s *MdsSession, txn fdb.ReadTransaction, key goja.Value) jsFutureByteSlice {
	rawKey := append([]byte(nil), s.ss.Bytes()...)
	rawKey = append(rawKey, s.normalizeJsBytes(key)...)
	return jsFutureByteSlice{
		s:      s,
		future: txn.Get(fdb.Key(rawKey)),
	}
}

func jsTxnCore_PrefixList(s *MdsSession, txn fdb.ReadTransaction, prefix goja.Value, limit uint32) jsRangeResult {
	if limit == 0 || limit > 1000 {
		panic("PrefixList: invalid limit")
	}
	rawKey := append([]byte(nil), s.ss.Bytes()...)
	rawKey = append(rawKey, s.normalizeJsBytes(prefix)...)
	r, err := fdb.PrefixRange(fdb.Key(rawKey))
	if err != nil {
		panic(err)
	}
	return jsRangeResult{
		rr: txn.GetRange(r, fdb.RangeOptions{
			Limit: int(limit),
		}),
	}
}

func (t jsReplicaTxn) Get(key goja.Value) jsFutureByteSlice {
	return jsTxnCore_Get(t.s, t.txn, key)
}

func (t jsReplicaTxn) PrefixList(prefix goja.Value, limit uint32) jsRangeResult {
	return jsTxnCore_PrefixList(t.s, t.txn, prefix, limit)
}

func (f jsFutureByteSlice) Wait() goja.ArrayBuffer {
	buf := f.future.MustGet()
	if buf == nil {
		return goja.ArrayBuffer{}
	} else {
		return f.s.vm.NewArrayBuffer(buf)
	}
}

func (f jsFutureNil) Wait() {
	f.future.MustGet()
}

func (t jsPrimaryTxn) Get(key goja.Value) jsFutureByteSlice {
	return jsTxnCore_Get(t.s, t.txn, key)
}

func (t jsPrimaryTxn) Set(key goja.Value, value goja.Value) goja.Value {
	rawKey := append([]byte(nil), t.s.ss.Bytes()...)
	rawKey = append(rawKey, t.s.normalizeJsBytes(key)...)
	t.txn.Set(fdb.Key(rawKey), t.s.normalizeJsBytes(value))
	return goja.Undefined()
}

func (t jsPrimaryTxn) Delete(key goja.Value) {
	rawKey := append([]byte(nil), t.s.ss.Bytes()...)
	rawKey = append(rawKey, t.s.normalizeJsBytes(key)...)
	t.txn.Clear(fdb.Key(rawKey))
}

func (t jsPrimaryTxn) PrefixList(prefix goja.Value, limit uint32) jsRangeResult {
	return jsTxnCore_PrefixList(t.s, t.txn, prefix, limit)
}

func (t jsPrimaryTxn) PrefixDelete(prefix goja.Value) {
	rawKey := append([]byte(nil), t.s.ss.Bytes()...)
	rawKey = append(rawKey, t.s.normalizeJsBytes(prefix)...)
	r, err := fdb.PrefixRange(fdb.Key(rawKey))
	if err != nil {
		panic(err)
	}
	t.txn.ClearRange(r)
}

func (t jsPrimaryTxn) Commit() jsFutureNil {
	return jsFutureNil{future: t.txn.Commit()}
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
	s.vm.Set("base64Decode", s.jsBase64Decode)
	s.vm.Set("stringToArrayBuffer", s.stringToArrayBuffer)
	s.vm.Set("arrayBufferToString", s.arrayBufferToString)
	return s
}

func (s *MdsSession) jsBase64Encode(value goja.ArrayBuffer) string {
	return base64.StdEncoding.EncodeToString(value.Bytes())
}

func (s *MdsSession) jsBase64Decode(value string) goja.ArrayBuffer {
	b, err := base64.StdEncoding.DecodeString(value)
	if err != nil {
		panic(err)
	}
	return s.vm.NewArrayBuffer(b)
}

func (s *MdsSession) stringToArrayBuffer(value string) goja.ArrayBuffer {
	return s.vm.NewArrayBuffer([]byte(value))
}

func (s *MdsSession) arrayBufferToString(value goja.ArrayBuffer) string {
	return string(value.Bytes())
}

func (s *MdsSession) normalizeJsBytes(value goja.Value) []byte {
	exp := value.Export()
	if v, ok := exp.(goja.ArrayBuffer); ok {
		return v.Bytes()
	} else if v, ok := exp.(string); ok {
		return []byte(v)
	} else {
		panic("cannot normalize js value to bytes")
	}
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

		var data interface{}
		if req.Data != "" {
			if err := json.Unmarshal([]byte(req.Data), &data); err != nil {
				s.logger.Panic("failed to unmarshal request data", zap.Error(err))
			}
		}

		startTime := time.Now()
		s.vm.GlobalObject().Set("data", s.vm.ToValue(data))
		_, err := s.vm.RunString(req.Program)
		endTime := time.Now()
		s.logger.Debug("execution time", zap.Duration("duration", endTime.Sub(startTime)))

		outputValue := s.vm.GlobalObject().Get("output")
		s.vm.GlobalObject().Delete("output")
		s.vm.GlobalObject().Delete("data")

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
