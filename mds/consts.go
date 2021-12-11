package mds

import "time"

const LoginVersion = "v0.1.1-alpha.7"
const MaxWebSocketIncomingMessageSize = 1024 * 512 // 512KiB
const MaxMuxWidth = 64
const PingInterval = 25 * time.Second
const MaxTransactionScriptIoSize = 1024 * 1024 * 100 // 100MiB
