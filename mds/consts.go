package mds

import "time"

const LoginVersion = "v0.1.3-alpha.2"
const MaxPreAuthWebSocketIncomingMessageSize = 1024 * 100 // 100KiB
const MaxWebSocketIncomingMessageSize = 1024 * 1024 * 20  // 20MiB
const MaxMuxWidth = 64
const PingInterval = 25 * time.Second
