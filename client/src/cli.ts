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

  try {
    const res = await client.run("throw new Error('xxx');");
    console.log(res);
  } catch(e) {
    console.log(e);
  }

  try {
    const res = await client.run("throw new Error('yyy');");
    console.log(res);
  } catch(e) {
    console.log(e);
  }

  {
    const res = await client.run("1 + 2");
    console.log(res);
  }

  {
    const res = await client.run("output = 1");
    console.log(res);
  }

  {
    const res = await client.run("3 + 4");
    console.log(res);
  }

  {
    const res = await client.run(`
    var txn = createPrimaryTransaction();
    txn.Set("hello", "world");
    txn.Commit().Wait();
    `);
    console.log(res);
  }

  {
    const res = await client.run(`
    var txn = createPrimaryTransaction();
    output = arrayBufferToString(txn.Get("hello").Wait());
    `);
    console.log(res);
  }
}

run().then(() => {
  process.exit(0);
})
.catch((err) => {
  console.error(err);
  process.exit(1);
})
