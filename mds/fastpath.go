package mds

import (
	"sync"
	"sync/atomic"

	"github.com/pkg/errors"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/apple/foundationdb/bindings/go/src/fdb/subspace"
	"github.com/losfair/blueboat-mds/protocol"
	"go.uber.org/zap"
	"google.golang.org/protobuf/proto"
)

var RetryableFastpathError = errors.New("retryable fastpath error")

type Fastpath struct {
	logger          *zap.Logger
	cluster         *MdsCluster
	ss              subspace.Subspace
	perm            StorePermission
	concurrencySem  chan struct{}
	txnSem          chan struct{}
	inflightTxns    map[uint64]*managedTxn
	inflightTxnId   uint64
	inflightTxnMu   sync.RWMutex
	txnPool_primary sync.Pool
	txnPool_replica sync.Pool
}

type managedTxn struct {
	txn fdb.Transaction

	atomicReadonly uint32 // atomic to prevent data race with pooling

	replica bool
}

func (txn *managedTxn) GetReadonly() bool {
	return atomic.LoadUint32(&txn.atomicReadonly) == 1
}

func (txn *managedTxn) SetReadonly(x bool) {
	if x {
		atomic.StoreUint32(&txn.atomicReadonly, 1)
	} else {
		atomic.StoreUint32(&txn.atomicReadonly, 0)
	}
}

type batchState struct {
	txnZeroRedirect uint64
}

func NewFastpath(logger *zap.Logger, cluster *MdsCluster, ss subspace.Subspace, perm StorePermission) *Fastpath {
	fp := &Fastpath{
		logger:         logger,
		cluster:        cluster,
		ss:             ss,
		perm:           perm,
		concurrencySem: make(chan struct{}, FastpathMaxConcurrency),
		txnSem:         make(chan struct{}, FastpathMaxTxnConcurrency),
		inflightTxns:   make(map[uint64]*managedTxn),
	}
	return fp
}

func (fp *Fastpath) mustLoadTxn(id uint64) *managedTxn {
	fp.inflightTxnMu.RLock()
	txn, ok := fp.inflightTxns[id]
	fp.inflightTxnMu.RUnlock()
	if !ok {
		panic(errors.Errorf("invalid txn id %d", id))
	}
	return txn
}

func (fp *Fastpath) Handle(req *protocol.Request, stop <-chan struct{}, xmit func(proto.Message) error, kill func()) {
	select {
	case fp.concurrencySem <- struct{}{}:
	case <-stop:
		return
	}
	go func() {
		defer func() {
			if err := recover(); err != nil {
				fp.logger.Error("fastpath panic", zap.Any("error", err))
				kill()
			}
			<-fp.concurrencySem
		}()
		if len(req.FastpathBatch) > FastpathBatchMaxSize {
			panic(errors.Errorf("fastpath batch size %d exceeds max %d", len(req.FastpathBatch), FastpathBatchMaxSize))
		}
		bs := &batchState{}
		rspVec := make([]*protocol.FastpathResponse, 0, len(req.FastpathBatch))
		for _, fpReq := range req.FastpathBatch {
			rsp, err := fp.handleOnce(bs, fpReq, stop)
			if err != nil {
				rspVec = append(rspVec, &protocol.FastpathResponse{
					Error: &protocol.ErrorResponse{
						Description: err.Error(),
						Retryable:   errors.Is(err, RetryableFastpathError),
					},
				})
				break
			} else {
				rspVec = append(rspVec, rsp)
			}
		}
		err := xmit(&protocol.Response{
			Lane:          req.Lane,
			FastpathBatch: rspVec,
		})
		if err != nil {
			panic(errors.Wrap(err, "xmit error"))
		}
	}()
}

func (fp *Fastpath) returnTxnToPool(txn *managedTxn) {
	txn.txn.Reset()
	if !txn.replica {
		fp.txnPool_primary.Put(txn)
	} else {
		fp.txnPool_replica.Put(txn)
	}
}

func (fp *Fastpath) handleOnce(batchState *batchState, req *protocol.FastpathRequest, stop <-chan struct{}) (*protocol.FastpathResponse, error) {
	if req.TxnId == 0 {
		req.TxnId = batchState.txnZeroRedirect
	}

	switch req.Op {
	case protocol.FastpathRequest_COMMIT_TXN:
		{
			if err := fp.checkWritePerm(); err != nil {
				return nil, err
			}

			fp.inflightTxnMu.Lock()
			txn, ok := fp.inflightTxns[req.TxnId]
			if ok {
				delete(fp.inflightTxns, req.TxnId)
				<-fp.txnSem
			}
			fp.inflightTxnMu.Unlock()

			if !ok {
				panic(errors.Errorf("invalid txn id %d", req.TxnId))
			}

			if txn.GetReadonly() {
				return nil, errors.New("COMMIT called on read-only transaction")
			}

			err := txn.txn.Commit().Get()
			if err != nil {
				if x, ok := err.(fdb.Error); ok {
					if txn.txn.OnError(x).Get() == nil {
						return nil, errors.Wrap(RetryableFastpathError, err.Error())
					}
				}
				return nil, err
			}
			fp.returnTxnToPool(txn)
			return &protocol.FastpathResponse{}, nil
		}
	case protocol.FastpathRequest_ABORT_TXN:
		{
			fp.inflightTxnMu.Lock()
			txn, ok := fp.inflightTxns[req.TxnId]
			if ok {
				delete(fp.inflightTxns, req.TxnId)
				<-fp.txnSem
			}
			fp.inflightTxnMu.Unlock()

			if !ok {
				panic(errors.Errorf("invalid txn id %d", req.TxnId))
			}
			fp.returnTxnToPool(txn)
			return &protocol.FastpathResponse{}, nil
		}
	case protocol.FastpathRequest_OPEN_TXN:
		{
			select {
			case <-stop:
				return nil, errors.New("stopped")
			case fp.txnSem <- struct{}{}:
			}
			var txn *managedTxn
			shouldReleaseSem := true
			defer func() {
				if shouldReleaseSem {
					<-fp.txnSem
				}
			}()
			if !req.IsPrimary && fp.cluster.replicaStore != nil {
				cachedTxn := fp.txnPool_replica.Get()
				if cachedTxn != nil {
					t := cachedTxn.(*managedTxn)
					txn = t
				} else {
					newTxn, err := fp.cluster.replicaStore.CreateTransaction()
					if err != nil {
						return nil, err
					}
					txn = &managedTxn{
						txn:     newTxn,
						replica: true,
					}
				}
				if err := txn.txn.Options().SetReadLockAware(); err != nil {
					return nil, err
				}
			} else {
				cachedTxn := fp.txnPool_primary.Get()
				if cachedTxn != nil {
					t := cachedTxn.(*managedTxn)
					txn = t
				} else {
					newTxn, err := fp.cluster.primaryStore.CreateTransaction()
					if err != nil {
						return nil, err
					}
					txn = &managedTxn{
						txn:     newTxn,
						replica: false,
					}
				}
			}
			txn.SetReadonly(!req.IsPrimary)

			fp.inflightTxnMu.Lock()
			fp.inflightTxnId += 1
			txnId := fp.inflightTxnId
			fp.inflightTxns[txnId] = txn
			fp.inflightTxnMu.Unlock()

			batchState.txnZeroRedirect = txnId

			// Now we have successfully inserted the txn into the inflightTxns map, the commit/abort
			// routines will deal with releasing the semaphore.
			shouldReleaseSem = false
			return &protocol.FastpathResponse{
				TxnId: txnId,
			}, nil
		}
	case protocol.FastpathRequest_GET:
		{
			txn := fp.mustLoadTxn(req.TxnId)
			out, err := txn.txn.Get(fp.constructKey(req.Kvp[0].Key)).Get()
			if err != nil {
				return nil, err
			}
			outKvp := make([]*protocol.KeyValuePair, 0, 1)
			if out != nil {
				outKvp = append(outKvp, &protocol.KeyValuePair{
					Value: out,
				})
			}
			return &protocol.FastpathResponse{
				Kvp: outKvp,
			}, nil
		}
	case protocol.FastpathRequest_SET:
		{
			if err := fp.checkWritePerm(); err != nil {
				return nil, err
			}
			txn := fp.mustLoadTxn(req.TxnId)
			if txn.GetReadonly() {
				return nil, errors.New("SET called on read-only transaction")
			}
			txn.txn.Set(fp.constructKey(req.Kvp[0].Key), req.Kvp[0].Value)
			return &protocol.FastpathResponse{}, nil
		}
	case protocol.FastpathRequest_DELETE:
		{
			if err := fp.checkWritePerm(); err != nil {
				return nil, err
			}
			txn := fp.mustLoadTxn(req.TxnId)
			if txn.GetReadonly() {
				return nil, errors.New("DELETE called on read-only transaction")
			}
			txn.txn.Clear(fp.constructKey(req.Kvp[0].Key))
			return &protocol.FastpathResponse{}, nil
		}
	case protocol.FastpathRequest_LIST:
		{
			if req.ListOptions.Limit > 50000 || req.ListOptions.Limit <= 0 {
				return nil, errors.New("invalid list limit")
			}
			txn := fp.mustLoadTxn(req.TxnId)
			startKey := fp.constructKey(req.Kvp[0].Key)
			endKey := fp.constructKey(req.Kvp[1].Key)
			out, err := txn.txn.GetRange(fdb.KeyRange{
				Begin: startKey,
				End:   endKey,
			}, fdb.RangeOptions{
				Limit:   int(req.ListOptions.Limit),
				Reverse: req.ListOptions.Reverse,
			}).GetSliceWithError()
			if err != nil {
				return nil, err
			}
			ssBytes := fp.ss.Bytes()
			kvpOut := make([]*protocol.KeyValuePair, len(out))
			for i := range out {
				kvpOut[i] = &protocol.KeyValuePair{
					Key: out[i].Key[len(ssBytes):],
				}
				if req.ListOptions.WantValue {
					kvpOut[i].Value = out[i].Value
				}
			}
			return &protocol.FastpathResponse{
				Kvp: kvpOut,
			}, nil
		}
	default:
		{
			panic(errors.Errorf("unknown fastpath request type %d", req.Op))
		}
	}
}

func (fp *Fastpath) constructKey(key []byte) fdb.Key {
	k := append([]byte(nil), fp.ss.Bytes()...)
	k = append(k, key...)
	return fdb.Key(k)
}

func (fp *Fastpath) checkWritePerm() error {
	if fp.perm != StorePermissionReadWrite {
		return errors.New("write permission required")
	}
	return nil
}
