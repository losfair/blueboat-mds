package mds

import "time"

const LoginVersion = "v0.1.4-alpha.2"
const MaxPreAuthWebSocketIncomingMessageSize = 1024 * 100 // 100KiB
const MaxWebSocketIncomingMessageSize = 1024 * 1024 * 20  // 20MiB
const MaxMuxWidth = 64
const PingInterval = 500 * time.Millisecond
const FastpathMaxConcurrency = 500
const FastpathMaxTxnConcurrency = 100
const FastpathBatchMaxSize = 100
