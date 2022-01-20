package main

import (
	"context"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/losfair/blueboat-mds/mdsclient"
	"github.com/losfair/blueboat-mds/protocol"
	"github.com/urfave/cli/v2"
	"go.uber.org/zap"
)

func main() {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}
	app := &cli.App{
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:     "server",
				Required: true,
				Usage:    "server websocket url",
				EnvVars:  []string{"MDS_SERVER"},
			},
			&cli.StringFlag{
				Name:     "store",
				Required: true,
				Usage:    "store name",
				EnvVars:  []string{"MDS_STORE"},
			},
			&cli.StringFlag{
				Name:     "secret",
				Required: true,
				Usage:    "ed25519 secret key",
				EnvVars:  []string{"MDS_SECRET"},
			},
		},
		Commands: []*cli.Command{
			{
				Name:  "list",
				Usage: "list everything under a prefix",
				Action: func(c *cli.Context) error {
					return runList(c, logger)
				},
			},
			{
				Name:  "benchlist",
				Usage: "list everything under a prefix",
				Action: func(c *cli.Context) error {
					return benchList(c, logger)
				},
			},
		},
	}

	err = app.Run(os.Args)
	if err != nil {
		logger.Panic("failed to run app", zap.Error(err))
	}
}

func runList(c *cli.Context, logger *zap.Logger) error {
	ctx := context.Background()
	config := &mdsclient.ClientConfig{
		Endpoint:  c.String("server"),
		Store:     c.String("store"),
		SecretKey: c.String("secret"),
		Width:     100,
	}
	client, err := mdsclient.NewClient(ctx, logger, config)
	if err != nil {
		return err
	}

	sess, err := client.GetSession()
	if err != nil {
		return err
	}
	rsp, err := sess.SendRequest(&protocol.Request{
		FastpathBatch: []*protocol.FastpathRequest{{
			Op: protocol.FastpathRequest_OPEN_TXN,
		}},
	})
	if err != nil {
		return err
	}
	txnId := rsp.FastpathBatch[0].TxnId
	logger.Info("txn id", zap.Uint64("txn id", txnId))
	defer func() {
		sess.SendRequest(&protocol.Request{
			FastpathBatch: []*protocol.FastpathRequest{{
				Op:    protocol.FastpathRequest_ABORT_TXN,
				TxnId: txnId,
			}},
		})
	}()

	rsp, err = sess.SendRequest(&protocol.Request{
		FastpathBatch: []*protocol.FastpathRequest{{
			Op:    protocol.FastpathRequest_LIST,
			TxnId: txnId,
			Kvp: []*protocol.KeyValuePair{{
				Key: []byte{},
			}, {
				Key: []byte{0xff},
			}},
			ListOptions: &protocol.FastpathListOptions{
				Limit:     100,
				WantValue: true,
			},
		}},
	})
	if err != nil {
		return err
	}
	for _, item := range rsp.FastpathBatch[0].Kvp {
		fmt.Println(string(item.Key))
	}
	return nil
}

func benchList(c *cli.Context, logger *zap.Logger) error {
	ctx := context.Background()
	config := &mdsclient.ClientConfig{
		Endpoint:  c.String("server"),
		Store:     c.String("store"),
		SecretKey: c.String("secret"),
		Width:     100,
	}
	client, err := mdsclient.NewClient(ctx, logger, config)
	if err != nil {
		return err
	}

	n := 1000
	m := 10000

	startTime := time.Now()

	wg := &sync.WaitGroup{}
	for i_ := 0; i_ < n; i_++ {
		i := i_
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := 0; j < m; j++ {
				if j%100 == 0 {
					logger.Info("list", zap.Int("i", i), zap.Int("j", j))
				}

				for {
					sess, err := client.GetSession()
					if err != nil {
						logger.Error("retrying 1", zap.Error(err))
						continue
					}
					rsp, err := sess.SendRequest(&protocol.Request{
						FastpathBatch: []*protocol.FastpathRequest{{
							Op: protocol.FastpathRequest_OPEN_TXN,
						}, {
							Op: protocol.FastpathRequest_LIST,
							Kvp: []*protocol.KeyValuePair{{
								Key: []byte{},
							}, {
								Key: []byte{0xff},
							}},
							ListOptions: &protocol.FastpathListOptions{
								Limit:     100,
								WantValue: true,
							},
						}, {
							Op: protocol.FastpathRequest_ABORT_TXN,
						}},
					})
					if err != nil {
						logger.Error("retrying 2", zap.Error(err))
						sess.Close()
						continue
					}
					if len(rsp.FastpathBatch) != 3 || rsp.FastpathBatch[0].Error != nil || rsp.FastpathBatch[1].Error != nil || rsp.FastpathBatch[2].Error != nil {
						panic("got remote error")
					}
					sess.Close()
					break
				}
			}
		}()
	}
	wg.Wait()
	endTime := time.Now()
	duration := endTime.Sub(startTime)
	logger.Info("benchmark", zap.Int("n", n), zap.Int("m", m), zap.Duration("duration", duration))
	return nil
}
