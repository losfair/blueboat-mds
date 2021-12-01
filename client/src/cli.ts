import { MdsClient } from "./client";
import * as fs from "fs";
import * as winston from "winston";
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import { ReplCore } from "./repl_core";

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

async function interactive(server: string, store: string) {
  const rl = readline.createInterface({
    input,
    output,
  })

  const repl = new ReplCore({
    server,
    store,
    secret: process.env.MDS_SECRET,
    print(s: string) {
      rl.write(s);
    },
    question(s: string) {
      return new Promise(resolve => rl.question(s, resolve));
    },
  });
  await repl.init()
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
    .positional('script', {
      describe: 'path to transaction script',
      type: 'string',
    })
}, (argv: any) => {
  const script = fs.readFileSync(argv.script, "utf-8");
  terminateWith(run(argv.server, argv.store, script));
})
.command('repl', 'start repl', (yargs: any) => {
  return yargs
}, (argv: any) => {
  terminateWith(interactive(argv.server, argv.store));
})
.option('server', {
  alias: "s",
  demandOption: true,
  type: 'string',
  description: 'Blueboat MDS server URL (ws://server:port)',
})
.option('store', {
  type: 'string',
  demandOption: true,
  description: 'name of the store to use',
})
.parse()
