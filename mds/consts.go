package mds

import "time"

const LoginVersion = "v0.1.0-alpha.2"
const MaxWebSocketIncomingMessageSize = 1024 * 512 // 512KB
const MaxMuxWidth = 16
const PingInterval = 25 * time.Second
