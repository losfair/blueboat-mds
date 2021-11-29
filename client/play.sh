#!/bin/sh

set -e
npm run build-cli
export MDS_SECRET="zBf0erloqhAOf4UAaKQeeBtonVwvOiQ2okmWjmT3EpA="
node ./dist/cli_bundle.js --ws ws://localhost:3121/mds 
