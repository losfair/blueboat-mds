#!/bin/sh

set -e
cd "$(dirname $0)"
protoc -I=./protocol --go_out=./protocol ./protocol/mds.proto
