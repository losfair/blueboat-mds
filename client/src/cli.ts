import { MdsClient } from "./client";

const yargs = require("yargs");
const { hideBin } = require('yargs/helpers')

async function run() {
  const argv = await yargs(hideBin(process.argv))
    .usage('Usage: $0 --ws <ws://server:port>')
    .demandOption(["ws"])
    .argv;
  const ws: string = argv.ws;
  const secret = process.env.MDS_SECRET;
  if(!secret) {
    console.error("MDS_SECRET is not set");
    process.exit(1);
  }

  const client = new MdsClient({
    endpoint: ws,
    secretKey: secret,
    store: "xxx",
    numLanes: 4,
  });
  await client.init();

  const res = await client.run("this.output = 42");
  console.log(res);
}

run().then(() => {
  process.exit(0);
})
.catch((err) => {
  console.error(err);
  process.exit(1);
})
