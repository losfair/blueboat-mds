package main

import (
	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/losfair/blueboat-mds/mds"
	"go.uber.org/zap"
)

func main() {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}
	defer logger.Sync()

	fdb.MustAPIVersion(630)
	mdsInst := mds.NewMds(logger)
	if err := mdsInst.Run(); err != nil {
		logger.Panic("Error running MDS", zap.Error(err))
	}
}
