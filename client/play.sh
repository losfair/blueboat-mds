#!/bin/sh

set -eu
npm run build-cli
export MDS_SECRET="zBf0erloqhAOf4UAaKQeeBtonVwvOiQ2okmWjmT3EpA="
node ./dist/cli_bundle.js -s ws://localhost:3121/mds run "$1" --store xxx
