import { MdsClient } from "./client";
import * as fs from "fs";
import * as winston from "winston";

const yargs = require("yargs");

async function run(server: string, store: string, program: string) {
  const secret = process.env.MDS_SECRET;
  if(!secret) {
    console.error("MDS_SECRET is not set");
    process.exit(1);
  }

  const client = new MdsClient({
    endpoint: server,
    secretKey: secret,
    store,
    numLanes: 1,
  });
  await client.init();
  const out = await client.run(program);
  console.log(JSON.stringify(out));
}

function terminateWith<T>(p: Promise<T>) {
  p.then(() => {
    process.exit(0);
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

winston.configure({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error", "warn", "notice", "info", "debug"],
    }),
  ]
});

yargs.command('run <script>', 'run a transaction script', (yargs: any) => {
  return yargs
    .option('store', {
      type: 'string',
      demandOption: true,
      description: 'name of the store to use',
    })
    .positional('script', {
      describe: 'path to transaction script',
      type: 'string',
    })
}, (argv: any) => {
  const script = fs.readFileSync(argv.script, "utf-8");
  terminateWith(run(argv.server, argv.store, script));
})
.option('server', {
  alias: "s",
  demandOption: true,
  type: 'string',
  description: 'Blueboat MDS server URL (ws://server:port)',
})
.parse()
