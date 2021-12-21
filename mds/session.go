package mds

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"time"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/subspace"
	"github.com/dop251/goja"
	js_ast "github.com/dop251/goja/ast"
	"github.com/dop251/goja/parser"
	"github.com/golang/groupcache/lru"
	"github.com/losfair/blueboat-mds/protocol"
	"github.com/zeebo/blake3"
	"go.uber.org/zap"
	"google.golang.org/protobuf/proto"
)

type MdsSession struct {
	logger    *zap.Logger
	cluster   *MdsCluster
	ss        subspace.Subspace
	vm        *goja.Runtime
	progCache *lru.Cache
	ioSize    int
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
	s          *MdsSession
	fullPrefix []byte
	rr         fdb.RangeResult
	wantValue  bool
}

type jsFutureNil struct {
	s      *MdsSession
	txn    fdb.Transaction
	future fdb.FutureNil
}

type jsFdbError struct {
	code      int
	retryable bool
}

func (e jsFdbError) String() string {
	return fmt.Sprintf("foundationdb error %d (retryable: %t)", e.code, e.retryable)
}

func (e jsFdbError) IsRetryable() bool {
	return e.retryable
}

func (s *MdsSession) throwFdbError(txn *fdb.Transaction, err error) {
	if x, ok := err.(fdb.Error); ok {
		retryable := txn != nil && txn.OnError(x).Get() == nil
		panic(s.vm.ToValue(jsFdbError{code: x.Code, retryable: retryable}))
	} else {
		panic(s.vm.ToValue(err.Error()))
	}
}

func jsTxnCore_Get(s *MdsSession, txn fdb.ReadTransaction, key goja.Value) jsFutureByteSlice {
	rawKey := append([]byte(nil), s.ss.Bytes()...)
	rawKey = append(rawKey, s.normalizeJsBytes(key)...)
	s.checkAndIncIoSize(len(rawKey))
	return jsFutureByteSlice{
		s:      s,
		future: txn.Get(fdb.Key(rawKey)),
	}
}

func jsTxnCore_PrefixList(s *MdsSession, txn fdb.ReadTransaction, prefix goja.Value, options *goja.Object) jsRangeResult {
	prefixNormalized := s.normalizeJsBytes(prefix)
	rawKey := append([]byte(nil), s.ss.Bytes()...)
	rawKey = append(rawKey, prefixNormalized...)
	s.checkAndIncIoSize(len(rawKey))
	r, err := fdb.PrefixRange(fdb.Key(rawKey))
	if err != nil {
		panic(s.vm.ToValue(err.Error()))
	}

	reverseJsv := options.Get("reverse")
	reverse := false
	if reverseJsv != nil {
		reverse = reverseJsv.ToBoolean()
	}

	wantValueJsv := options.Get("wantValue")
	wantValue := false
	if wantValueJsv != nil {
		wantValue = wantValueJsv.ToBoolean()
	}

	limitJsv := options.Get("limit")
	if limitJsv == nil {
		panic(s.vm.ToValue("limit option is required"))
	}
	limit := limitJsv.ToInteger()

	cursor := options.Get("cursor")

	if limit <= 0 || limit > 50000 {
		panic(s.vm.ToValue("PrefixList: invalid limit"))
	}

	if cursor != nil && !cursor.SameAs(goja.Undefined()) && !cursor.SameAs(goja.Null()) {
		cursorNormalized := s.normalizeJsBytes(cursor)

		keyOverride := make([]byte, 0, len(s.ss.Bytes())+len(prefixNormalized)+len(cursorNormalized)+1)
		keyOverride = append(keyOverride, s.ss.Bytes()...)
		keyOverride = append(keyOverride, prefixNormalized...)
		keyOverride = append(keyOverride, cursorNormalized...)
		s.checkAndIncIoSize(len(keyOverride))

		if reverse {
			r.End = fdb.Key(keyOverride)
		} else {
			keyOverride = append(keyOverride, 0)
			r.Begin = fdb.Key(keyOverride)
		}
	}

	return jsRangeResult{
		s:          s,
		fullPrefix: rawKey,
		rr: txn.GetRange(r, fdb.RangeOptions{
			Limit:   int(limit),
			Reverse: reverse,
		}),
		wantValue: wantValue,
	}
}

func (t jsReplicaTxn) Get(key goja.Value) jsFutureByteSlice {
	return jsTxnCore_Get(t.s, t.txn, key)
}

func (t jsReplicaTxn) PrefixList(prefix goja.Value, options *goja.Object) jsRangeResult {
	return jsTxnCore_PrefixList(t.s, t.txn, prefix, options)
}

func (f jsFutureByteSlice) Wait() goja.Value {
	buf, err := f.future.Get()
	if err != nil {
		f.s.throwFdbError(nil, err)
	}
	if buf == nil {
		return goja.Null()
	} else {
		f.s.checkAndIncIoSize(len(buf))
		return f.s.vm.ToValue(f.s.vm.NewArrayBuffer(buf))
	}
}

func (f jsFutureNil) Wait() {
	err := f.future.Get()
	if err != nil {
		f.s.throwFdbError(&f.txn, err)
	}
}

func (t jsPrimaryTxn) Get(key goja.Value) jsFutureByteSlice {
	return jsTxnCore_Get(t.s, t.txn, key)
}

func (t jsPrimaryTxn) Set(key goja.Value, value goja.Value) goja.Value {
	rawKey := append([]byte(nil), t.s.ss.Bytes()...)
	rawKey = append(rawKey, t.s.normalizeJsBytes(key)...)
	t.s.checkAndIncIoSize(len(rawKey))

	valueBytes := t.s.normalizeJsBytes(value)
	t.s.checkAndIncIoSize(len(valueBytes))

	t.txn.Set(fdb.Key(rawKey), valueBytes)
	return goja.Undefined()
}

func (t jsPrimaryTxn) Delete(key goja.Value) {
	rawKey := append([]byte(nil), t.s.ss.Bytes()...)
	rawKey = append(rawKey, t.s.normalizeJsBytes(key)...)
	t.s.checkAndIncIoSize(len(rawKey))
	t.txn.Clear(fdb.Key(rawKey))
}

func (t jsPrimaryTxn) PrefixList(prefix goja.Value, options *goja.Object) jsRangeResult {
	return jsTxnCore_PrefixList(t.s, t.txn, prefix, options)
}

func (t jsPrimaryTxn) PrefixDelete(prefix goja.Value) {
	rawKey := append([]byte(nil), t.s.ss.Bytes()...)
	rawKey = append(rawKey, t.s.normalizeJsBytes(prefix)...)
	t.s.checkAndIncIoSize(len(rawKey))
	r, err := fdb.PrefixRange(fdb.Key(rawKey))
	if err != nil {
		panic(t.s.vm.ToValue(err.Error()))
	}
	t.txn.ClearRange(r)
}

func (t jsPrimaryTxn) Commit() jsFutureNil {
	return jsFutureNil{s: t.s, txn: t.txn, future: t.txn.Commit()}
}

func (r jsRangeResult) Collect() []goja.Value {
	it := r.rr.Iterator()
	var out []goja.Value

	r.s.checkAndIncIoSize(0)

	for it.Advance() {
		kv, err := it.Get()
		if err != nil {
			r.s.throwFdbError(nil, err)
		}
		r.s.checkAndIncIoSize(len(kv.Key))

		value := goja.Null()
		if r.wantValue {
			r.s.checkAndIncIoSize(len(kv.Value))
			value = r.s.vm.ToValue(r.s.vm.NewArrayBuffer(kv.Value))
		}
		pair := r.s.vm.ToValue([]goja.Value{
			r.s.vm.ToValue(r.s.vm.NewArrayBuffer(kv.Key[len(r.fullPrefix):])),
			value,
		})
		out = append(out, pair)
	}
	return out
}

func NewMdsSession(logger *zap.Logger, cluster *MdsCluster, ss subspace.Subspace) *MdsSession {
	s := &MdsSession{
		logger:    logger,
		cluster:   cluster,
		ss:        ss,
		vm:        goja.New(),
		progCache: lru.New(16),
	}

	s.vm.Set("createPrimaryTransaction", s.createPrimaryTransaction)
	s.vm.Set("createReplicaTransaction", s.createReplicaTransaction)
	s.vm.Set("base64Encode", s.jsBase64Encode)
	s.vm.Set("base64Decode", s.jsBase64Decode)
	s.vm.Set("stringToArrayBuffer", s.stringToArrayBuffer)
	s.vm.Set("arrayBufferToString", s.arrayBufferToString)
	return s
}

func (s *MdsSession) checkAndIncIoSize(size int) {
	s.ioSize += size
}

func (s *MdsSession) jsBase64Encode(value goja.Value) goja.Value {
	if value.SameAs(goja.Undefined()) {
		return goja.Undefined()
	} else if value.SameAs(goja.Null()) {
		return goja.Null()
	} else {
		return s.vm.ToValue(base64.StdEncoding.EncodeToString(s.normalizeJsBytes(value)))
	}
}

func (s *MdsSession) jsBase64Decode(value goja.Value) goja.Value {
	if value.SameAs(goja.Undefined()) {
		return goja.Undefined()
	} else if value.SameAs(goja.Null()) {
		return goja.Null()
	} else {
		strValue, ok := value.Export().(string)
		if !ok {
			panic(s.vm.ToValue("base64Decode: expected string"))
		}

		b, err := base64.StdEncoding.DecodeString(strValue)
		if err != nil {
			panic(s.vm.ToValue(err.Error()))
		}
		return s.vm.ToValue(s.vm.NewArrayBuffer(b))
	}
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
		panic(s.vm.ToValue("cannot normalize js value to bytes"))
	}
}

func (s *MdsSession) createPrimaryTransaction(call goja.FunctionCall) goja.Value {
	txn, err := s.cluster.primaryStore.CreateTransaction()
	if err != nil {
		panic(s.vm.ToValue(err.Error()))
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
			panic(s.vm.ToValue(err.Error()))
		}
		if err := txn.Options().SetReadLockAware(); err != nil {
			panic(s.vm.ToValue(err.Error()))
		}
	} else {
		txn, err = s.cluster.primaryStore.CreateTransaction()
		if err != nil {
			panic(s.vm.ToValue(err.Error()))
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

		s.ioSize = 0
		var prog *goja.Program
		hash := blake3.Sum256([]byte(req.Program))
		progIfc, cachePresence := s.progCache.Get(hash)
		if cachePresence {
			prog = progIfc.(*goja.Program)
		} else {
			startTime := time.Now()
			newProg, err := CompileScript(req.Program)
			if err != nil {
				s.logger.Error("failed to compile script", zap.Error(err))
				err = xmit(&protocol.Response{
					Lane: req.Lane,
					Body: &protocol.Response_Error{
						Error: &protocol.ErrorResponse{
							Description: err.Error(),
						},
					},
				})
				if err != nil {
					s.logger.Error("failed to send response", zap.Error(err))
				}
				continue
			}
			endTime := time.Now()
			prog = newProg
			s.progCache.Add(hash, prog)
			s.logger.Debug("compiled script", zap.String("program", req.Program), zap.Duration("duration", endTime.Sub(startTime)))
		}

		var data interface{}
		if req.Data != "" {
			if err := json.Unmarshal([]byte(req.Data), &data); err != nil {
				s.logger.Panic("failed to unmarshal request data", zap.Error(err))
			}
		}

		startTime := time.Now()
		s.vm.GlobalObject().Set("data", s.vm.ToValue(data))
		_, err := s.vm.RunProgram(prog)
		endTime := time.Now()
		s.logger.Debug("execution time", zap.Duration("duration", endTime.Sub(startTime)))

		outputValue := s.vm.GlobalObject().Get("output")
		s.vm.GlobalObject().Delete("output")
		s.vm.GlobalObject().Delete("data")

		if err != nil {
			retryable := false
			if jserr, ok := err.(*goja.Exception); ok {
				if val := jserr.Value(); val != nil {
					exp := val.Export()
					if err, ok := exp.(jsFdbError); ok {
						if err.retryable {
							retryable = true
						}
					}
				}
			}
			s.logger.Error("failed to run program", zap.Error(err), zap.Bool("retryable", retryable))
			err = xmit(&protocol.Response{
				Lane: req.Lane,
				Body: &protocol.Response_Error{
					Error: &protocol.ErrorResponse{
						Description: err.Error(),
						Retryable:   retryable,
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

func CompileScript(script string) (*goja.Program, error) {
	ast, err := goja.Parse("<stdin>", script, parser.WithDisableSourceMaps)
	if err != nil {
		return nil, err
	}

	body := &js_ast.BlockStatement{
		List: ast.Body,
	}
	ast.Body = []js_ast.Statement{body}

	return goja.CompileAST(ast, false)
}
