import { MdsClient } from "./client";
import * as fs from "fs";
import * as winston from "winston";
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';
import { ReplCore } from "./repl_core";

const yargs = require("yargs");

interface BenchStat {
  workerStats: WorkerStat[],
}

interface WorkerStat {
  latency: number[],
}

async function benchOnce(workerIndex: number, client: MdsClient, iterationsPerWorker: number, stats: BenchStat) {
  for(let i = 0; i < iterationsPerWorker; i++) {
    let k1 = "\x02bench\x00\x02" + Math.floor(Math.random() * 1000) + "\x00";
    let k2 = "\x02bench\x00\x02" + Math.floor(Math.random() * 1000) + "\x00";
    let v = "" + Math.random();

    let startTime = Date.now();
    await client.run("let t1 = createPrimaryTransaction(); t1.Get(data.k1).Wait(); t1.Set(data.k2, data.v); t1.Commit().Wait();", {
      k1,
      k2,
      v,
    }, true);
    let endTime = Date.now();
    winston.info(`committed`, { workerIndex, i, latency: endTime - startTime });
    stats.workerStats[workerIndex].latency.push(endTime - startTime);
  }
}

async function bench(server: string, store: string) {
  const secret = process.env.MDS_SECRET;
  if(!secret) {
    console.error("MDS_SECRET is not set");
    process.exit(1);
  }

  const numClients = 5;
  const numWorkers = 300;
  const iterationsPerWorker = 100;
  const clients = await Promise.all(Array(numClients).fill(0).map(async () => {
    const client = new MdsClient({
      endpoint: server,
      secretKey: secret,
      store,
      numLanes: 64,
    });
    await client.init();
    return client;
  }));

  const stats: BenchStat = {
    workerStats: Array(numWorkers).fill(0).map(() => ({
      latency: [],
    })),
  }

  const startTime = Date.now();
  const tasks: Promise<void>[] = Array(numWorkers).fill(0).map((_x, i) => benchOnce(i, clients[i % clients.length], iterationsPerWorker, stats));
  await Promise.all(tasks);
  const endTime = Date.now();
  console.log(`${endTime - startTime}ms, ${numWorkers * iterationsPerWorker / ((endTime - startTime) / 1000)} ops/s`);
}

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
.command('bench', 'benchmark', (yargs: any) => yargs, (argv: any) => {
  terminateWith(bench(argv.server, argv.store));
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
