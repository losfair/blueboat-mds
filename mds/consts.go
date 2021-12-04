package mds

import "time"

const LoginVersion = "v0.1.0-alpha.3"
const MaxWebSocketIncomingMessageSize = 1024 * 512 // 512KiB
const MaxMuxWidth = 16
const PingInterval = 25 * time.Second
const MaxTransactionScriptIoSize = 1024 * 1024 * 100 // 100MiB
