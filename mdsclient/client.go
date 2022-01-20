package mdsclient

import (
	"context"
	"crypto/ed25519"
	"encoding/base64"
	"net"
	"runtime"
	"sync"
	"sync/atomic"
	"time"
	"unsafe"

	"github.com/cenkalti/backoff/v4"
	"github.com/gorilla/websocket"
	"github.com/losfair/blueboat-mds/protocol"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/protobuf/proto"
)

var handshakeTimeout = 5 * time.Second

type Client struct {
	secretKey ed25519.PrivateKey
	config    *ClientConfig
	logger    *zap.Logger
	ctx       context.Context

	atomicWs *WsConn // atomic
}

type WsConn struct {
	version        string
	region         string
	conn           *websocket.Conn
	readerShutdown chan struct{}
	writeMu        sync.Mutex
	lanePool       chan int
	laneCompletion sync.Map // map[int]chan *protocol.Response
	pingInterval   time.Duration
}

func (ws *WsConn) NextReadDeadline() time.Time {
	return time.Now().Add(ws.pingInterval + 3*time.Second)
}

type ClientConfig struct {
	Endpoint  string
	Store     string
	SecretKey string
	Width     int
}

type Session struct {
	client *Client
	conn   *WsConn
	laneId int
	rspCh  chan *protocol.Response
	closed uint32
}

func NewClient(ctx context.Context, logger *zap.Logger, config *ClientConfig) (*Client, error) {
	secretKey_, err := base64.StdEncoding.DecodeString(config.SecretKey)
	if err != nil {
		return nil, err
	}

	if len(secretKey_) != 32 {
		return nil, errors.New("secret key must be 32 bytes")
	}

	secretKey := ed25519.NewKeyFromSeed(secretKey_)
	client := &Client{
		secretKey: secretKey,
		config:    config,
		ctx:       ctx,
		logger:    logger,
	}

	go client.worker()

	return client, nil
}

func (s *Session) doClose(gc bool) {
	if atomic.CompareAndSwapUint32(&s.closed, 0, 1) {
		if gc {
			s.client.logger.Error("session was not closed - resource leak")
		}
		s.conn.laneCompletion.Delete(s.laneId)
		s.conn.lanePool <- s.laneId
	}
}

func (s *Session) Close() {
	s.doClose(false)
}

func (c *Client) grabConn() *WsConn {
	return (*WsConn)(atomic.LoadPointer((*unsafe.Pointer)(unsafe.Pointer(&c.atomicWs))))
}

func (c *Client) GetPublicKey() ed25519.PublicKey {
	return c.secretKey.Public().(ed25519.PublicKey)
}

func (c *Client) GetSession() (*Session, error) {
	strategy := backoff.NewExponentialBackOff()
	strategy.MaxElapsedTime = 0
	strategy.InitialInterval = 2 * time.Millisecond
	strategy.MaxInterval = 1 * time.Second

	var conn *WsConn
	for {
		conn = c.grabConn()
		if conn != nil {
			break
		}

		next := strategy.NextBackOff()
		if next == backoff.Stop {
			panic("unexpected backoff stop")
		}
		sleeper := time.NewTimer(next)
		select {
		case <-c.ctx.Done():
			sleeper.Stop()
			return nil, errors.New("context cancelled")
		case <-sleeper.C:
		}
	}

	var laneId int
	select {
	case <-c.ctx.Done():
		return nil, errors.New("context cancelled")
	case <-conn.readerShutdown:
		return nil, errors.New("reader shutdown")
	case laneId = <-conn.lanePool:
	}
	rspCh := make(chan *protocol.Response, 1)
	conn.laneCompletion.Store(laneId, rspCh)

	sess := &Session{
		client: c,
		conn:   conn,
		laneId: laneId,
		rspCh:  rspCh,
	}
	runtime.SetFinalizer(sess, func(sess *Session) {
		sess.doClose(true)
	})

	return sess, nil
}

func (s *Session) SendRequest(req *protocol.Request) (*protocol.Response, error) {
	req.Lane = uint32(s.laneId)
	serialized, err := proto.Marshal(req)
	if err != nil {
		return nil, err
	}

	s.conn.writeMu.Lock()
	err = s.conn.conn.WriteMessage(websocket.BinaryMessage, serialized)
	s.conn.writeMu.Unlock()

	if err != nil {
		return nil, err
	}

	var rsp *protocol.Response
	select {
	case <-s.client.ctx.Done():
		return nil, errors.New("context cancelled")
	case <-s.conn.readerShutdown:
		return nil, errors.New("reader shutdown")
	case rsp = <-s.rspCh:
	}
	return rsp, nil
}

func (c *Client) connectOnceThreadSafeWithBackoff() (*WsConn, error) {
	strategy := backoff.NewExponentialBackOff()
	strategy.MaxElapsedTime = 0
	strategy.InitialInterval = 10 * time.Millisecond
	strategy.MaxInterval = 25 * time.Second

	for {
		ws, err := c.connectOnceThreadSafe()
		if err == nil {
			return ws, nil
		}
		c.logger.Error("failed to connect", zap.Error(err))

		next := strategy.NextBackOff()
		if next == backoff.Stop {
			panic("unexpected backoff stop")
		}
		sleeper := time.NewTimer(next)
		select {
		case <-c.ctx.Done():
			sleeper.Stop()
			return nil, errors.New("context cancelled")
		case <-sleeper.C:
		}
	}
}

func (c *Client) connectOnceThreadSafe() (*WsConn, error) {
	rawConn, _, err := websocket.DefaultDialer.DialContext(c.ctx, c.config.Endpoint, nil)
	if err != nil {
		return nil, err
	}
	defer func() {
		if rawConn != nil {
			rawConn.Close()
		}
	}()
	err = rawConn.SetReadDeadline(time.Now().Add(handshakeTimeout))
	if err != nil {
		return nil, err
	}

	var loginChallenge protocol.LoginChallenge
	if err = readProtoMsg(rawConn, &loginChallenge); err != nil {
		return nil, err
	}

	sig := ed25519.Sign(c.secretKey, loginChallenge.Challenge)
	publicKey := c.GetPublicKey()
	loginAnswer := &protocol.Login{
		Store:     c.config.Store,
		PublicKey: []byte(publicKey),
		Signature: sig,
		MuxWidth:  1, // unused in fastpath
	}
	if err = writeProtoMsg(rawConn, loginAnswer); err != nil {
		return nil, err
	}

	var loginRsp protocol.LoginResponse
	if err = readProtoMsg(rawConn, &loginRsp); err != nil {
		return nil, errors.Wrap(err, "failed to read login response")
	}

	if !loginRsp.Ok {
		return nil, errors.New("login failed: " + loginRsp.Error)
	}

	conn := &WsConn{
		version:        loginChallenge.Version,
		region:         loginRsp.Region,
		conn:           rawConn,
		readerShutdown: make(chan struct{}),
		lanePool:       make(chan int, c.config.Width),
		pingInterval:   time.Duration(loginRsp.PingIntervalMs) * time.Millisecond,
	}
	for i := 0; i < c.config.Width; i++ {
		conn.lanePool <- i + 1
	}
	err = conn.conn.SetReadDeadline(conn.NextReadDeadline())
	if err != nil {
		return nil, err
	}

	rawConn.SetPingHandler(func(appData string) error {
		conn.writeMu.Lock()
		defer conn.writeMu.Unlock()

		err := conn.conn.SetReadDeadline(conn.NextReadDeadline())
		if err != nil {
			return err
		}

		// https://github.com/gorilla/websocket/blob/v1.4.2/conn.go#L1131
		err = conn.conn.WriteControl(websocket.PongMessage, []byte(appData), time.Now().Add(time.Second))
		if err == websocket.ErrCloseSent {
			return nil
		} else if e, ok := err.(net.Error); ok && e.Temporary() {
			return nil
		}
		return err
	})

	c.logger.Info("connected", zap.String("region", conn.region), zap.String("version", conn.version), zap.Duration("ping_interval", conn.pingInterval))
	rawConn = nil

	return conn, nil
}

func (c *Client) worker() {
	shutdownWs := func() {
		c.atomicWs.conn.Close()
		close(c.atomicWs.readerShutdown)
		atomic.StorePointer((*unsafe.Pointer)(unsafe.Pointer(&c.atomicWs)), nil)
	}
	for {
		select {
		case <-c.ctx.Done():
			return
		default:
			// We are the unique writer, so no need to use atomic access for read here
			if c.atomicWs == nil {
				newConn, err := c.connectOnceThreadSafeWithBackoff()
				if err != nil {
					c.logger.Error("giving up connect", zap.Error(err))
					return
				}
				atomic.StorePointer((*unsafe.Pointer)(unsafe.Pointer(&c.atomicWs)), unsafe.Pointer(newConn))
			}
		outer:
			for {
				var msg protocol.Response
				err := readProtoMsg(c.atomicWs.conn, &msg)
				if err != nil {
					c.logger.Error("failed to read response", zap.Error(err))
					shutdownWs()
					break
				}
				backChannel_, ok := c.atomicWs.laneCompletion.Load(int(msg.Lane))
				if !ok {
					c.logger.Error("unknown lane", zap.Int("lane", int(msg.Lane)))
					shutdownWs()
					break
				}
				backChannel := backChannel_.(chan *protocol.Response)
				select {
				case backChannel <- &msg:
				default:
					c.logger.Error("writing to back channel should not block", zap.Int("lane", int(msg.Lane)))
					shutdownWs()
					break outer
				}
			}
		}
	}
}

func writeProtoMsg(c *websocket.Conn, msg proto.Message) error {
	data, err := proto.Marshal(msg)
	if err != nil {
		return err
	}
	if err := c.WriteMessage(websocket.BinaryMessage, data); err != nil {
		return err
	}
	return nil
}

func readProtoMsg(c *websocket.Conn, out proto.Message) error {
	_, message, err := c.ReadMessage()
	if err != nil {
		return err
	}
	return proto.Unmarshal(message, out)
}
