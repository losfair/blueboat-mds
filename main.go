package main

import (
	"embed"
	"io/fs"
	"os"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/losfair/blueboat-mds/mds"
	"go.uber.org/zap"
)

//go:embed client/web/*
var webData embed.FS

func main() {
	zapConfig := zap.NewProductionConfig()
	if os.Getenv("MDS_DEBUG") == "1" {
		zapConfig.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
	}

	logger, err := zapConfig.Build()
	if err != nil {
		panic(err)
	}
	defer logger.Sync()

	fdb.MustAPIVersion(630)

	webFS, err := fs.Sub(&webData, "client/web")
	if err != nil {
		panic(err)
	}
	mdsInst := mds.NewMds(logger, webFS)
	if err := mdsInst.Run(); err != nil {
		logger.Panic("Error running MDS", zap.Error(err))
	}
}
