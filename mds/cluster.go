package mds

import (
	"bytes"
	"os"
	"path"
	"regexp"
	"sync"

	"github.com/apple/foundationdb/bindings/go/src/fdb"
	"github.com/losfair/blueboat-mds/protocol"
	"github.com/natefinch/atomic"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

var filenameComponentRegex = regexp.MustCompile(`[a-zA-Z0-9-]+`)
var clusterFileWriteLock sync.Mutex

type MdsCluster struct {
	logger       *zap.Logger
	primaryStore *fdb.Database
	replicaStore *fdb.Database
	RawConfig    []byte
}

func NewMdsCluster(logger *zap.Logger, tempDir, clusterName, region string, cluster *protocol.Cluster) (*MdsCluster, error) {
	regions := make([]*protocol.ClusterRegion, 0, len(cluster.Replicas)+1)
	regions = append(regions, cluster.Primary)
	regions = append(regions, cluster.Replicas...)

	logger = logger.With(zap.String("cluster", clusterName))
	s := &MdsCluster{
		logger: logger,
	}

	clusterFiles, err := refreshClusterFiles(logger, tempDir, clusterName, regions)
	if err != nil {
		return nil, errors.Wrap(err, "failed to refresh cluster files")
	}

	primaryStore, err := fdb.OpenDatabase(clusterFiles[0])
	if err != nil {
		return nil, errors.Wrap(err, "failed to open primary store")
	}
	s.primaryStore = &primaryStore

	if regions[0].Region != region {
		found := false
		for i := 1; i < len(regions); i++ {
			if regions[i].Region == region {
				found = true
				replicaStore, err := fdb.OpenDatabase(clusterFiles[i])
				if err != nil {
					return nil, errors.New("failed to open replica store")
				}
				s.replicaStore = &replicaStore
				break
			}
		}
		if !found {
			logger.Warn("no replica in our region", zap.String("region", region))
		}
	} else {
		logger.Info("primary is in our region, not connecting to replica")
	}

	return s, nil
}

func refreshClusterFiles(logger *zap.Logger, tempDir, clusterName string, regions []*protocol.ClusterRegion) ([]string, error) {
	clusterFileWriteLock.Lock()
	defer clusterFileWriteLock.Unlock()

	if !filenameComponentRegex.MatchString(clusterName) {
		return nil, errors.New("bad cluster name")
	}

	paths := make([]string, 0, len(regions))

	for _, region := range regions {
		if !filenameComponentRegex.MatchString(region.Region) {
			logger.Error("bad region name", zap.String("region", region.Region))
			continue
		}

		clusterFilePath := path.Join(tempDir, "fdb."+clusterName+"."+region.Region+".cluster")
		_, err := os.Stat(clusterFilePath)
		if err != nil {
			if !os.IsNotExist(err) {
				logger.Error("failed to stat cluster file", zap.String("path", clusterFilePath), zap.Error(err))
			} else {
				if err := atomic.WriteFile(clusterFilePath, bytes.NewReader([]byte(region.Config))); err != nil {
					logger.Error("failed to write cluster file", zap.String("path", clusterFilePath), zap.Error(err))
				} else {
					logger.Info("created cluster file", zap.String("path", clusterFilePath))
				}
			}
		} else {
			logger.Info("skipping overwriting existing cluster file", zap.String("path", clusterFilePath))
		}
		paths = append(paths, clusterFilePath)
	}
	return paths, nil
}

func (s *MdsCluster) PrimaryTransactor() fdb.Transactor {
	return s.primaryStore
}

func (s *MdsCluster) ReplicaReadTransactor() fdb.ReadTransactor {
	if s.replicaStore != nil {
		return mdsReadTransactor{s.replicaStore}
	} else {
		return s.primaryStore
	}
}
