import { MdsClient } from "./client";
import { parse as shellParse } from "shell-quote";
import { Base64 } from "js-base64";
import { computePath, encodePath, formatPath } from "./pathutil";

const remoteProg_Tree = "output = (data.primary ? createPrimaryTransaction() : createReplicaTransaction()).PrefixList(base64Decode(data.prefix), { limit: data.limit, cursor: base64Decode(data.cursor), reverse: data.reverse }).Collect().map(([k, v]) => [base64Encode(k), base64Encode(v)])";
const remoteProg_Get = "let value = createReplicaTransaction().Get(base64Decode(data.key)).Wait(); output = value === null ? null : base64Encode(value);"
const remoteProg_Set = "let txn = createPrimaryTransaction(); txn.Set(base64Decode(data.key), base64Decode(data.value)); txn.Commit().Wait();";
const remoteProg_Delete = "let txn = createPrimaryTransaction(); txn.Delete(base64Decode(data.key)); txn.Commit().Wait();";
const remoteProg_PrefixDelete = "let txn = createPrimaryTransaction(); txn.PrefixDelete(base64Decode(data.key)); txn.Commit().Wait();";
// Here we used a bug in MDS where string interpolation is not checked!
const remoteProg_Move = `
let txn = createPrimaryTransaction();
data.items.map(x => [x, txn.Get(base64Decode(x.k1))]).forEach(([x, _v]) => {
let v = _v.Wait();
if(v === null) throw new Error(\`missing value: \${x.k1}\`);
txn.Set(base64Decode(x.k2), v);
txn.Delete(base64Decode(x.k1));
});
txn.Commit().Wait();
`;

export interface ReplCoreArgs {
  server?: string;
  secret?: string;
  store?: string;
  print: (s: string) => void,
  question: (s: string) => Promise<string>,
}

export class ReplCore {
  private print: (s: string) => void;
  private question: (s: string) => Promise<string>;
  private args: ReplCoreArgs;
  private client: MdsClient | null;
  private clientGen: (() => MdsClient) | null;
  private currentPath: string[] = [];

  constructor(args: ReplCoreArgs) {
    this.print = args.print;
    this.question = args.question;
    this.args = args;
    this.client = null;
    this.clientGen = null;
  }

  async init() {
    this.print("Blueboat MDS Shell\n");

    let server: string;
    if (this.args.server) {
      server = this.args.server;
    } else {
      server = await this.question("Server: ");
    }

    let secret: string;
    if (this.args.secret) {
      secret = this.args.secret;
    } else {
      secret = await this.question("Secret key: ");
    }

    let store: string;
    if (this.args.store) {
      store = this.args.store;
    } else {
      store = await this.question("Store: ");
    }

    this.clientGen = () => new MdsClient({
      endpoint: server,
      secretKey: secret,
      numLanes: 4,
      store,
    });

    while (true) {
      try {
        await this.runUntilException();
        break;
      } catch (e) {
        console.error(e);
        this.print(`\n${e}\n`);
        await this.question("Press enter to restart... ");
      }
    }
  }

  private async runUntilException() {
    if (this.client) this.client.close();
    this.client = this.clientGen!();
    await this.client.init();
    this.print(`Connected to MDS. Server version: ${this.client.getServerInfo().version}\n`);
    this.print(`Type 'help' for help.\n`);
    while (true) {
      const pathDisplay = this.currentPath.join("/");
      const _cmd = shellParse(await this.question("MDS" + (pathDisplay ? " [" + pathDisplay + "]" : "") + "> "));
      if (_cmd.findIndex(c => typeof c !== 'string') !== -1) {
        this.print("Invalid command\n");
        continue;
      }
      const cmd: string[] = <any>_cmd;
      switch (cmd[0]) {
        case "cd": {
          let dirName = cmd[1];
          if (!dirName) {
            this.print("Usage: cd <dir>\n");
            break;
          }

          this.currentPath = computePath(this.currentPath, dirName);
          break;
        }
        case "get": {
          const objname = cmd[1];
          if (!objname) {
            this.print("Usage: get <path>\n");
            break;
          }
          const path = computePath(this.currentPath, objname);
          const key = Base64.fromUint8Array(encodePath(path));
          const value = await this.client.run(remoteProg_Get, { key });
          this.print(`${value === null ? "(null)" : value}\n`);
          break;
        }
        case "get.utf8": {
          const objname = cmd[1];
          if (!objname) {
            this.print("Usage: get.utf8 <path>\n");
            break;
          }
          const path = computePath(this.currentPath, objname);
          const key = Base64.fromUint8Array(encodePath(path));
          const value = await this.client.run(remoteProg_Get, { key });
          this.print(`${value === null ? "(null)" : new TextDecoder().decode(Base64.toUint8Array(<string>value))}\n`);
          break;
        }
        case "set": {
          const objname = cmd[1];
          const value = cmd[2];
          if (!objname || value === undefined) {
            this.print("Usage: set <path> <base64_encoded_value>\n");
            break;
          }
          const path = computePath(this.currentPath, objname);
          const key = Base64.fromUint8Array(encodePath(path));
          await this.client.run(remoteProg_Set, { key, value });
          this.print("OK\n");
          break;
        }
        case "set.utf8": {
          const objname = cmd[1];
          let value = cmd[2];
          if (!objname || value === undefined) {
            this.print("Usage: set.utf8 <path> <value>\n");
            break;
          }
          const path = computePath(this.currentPath, objname);
          const key = Base64.fromUint8Array(encodePath(path));
          await this.client.run(remoteProg_Set, { key, value: Base64.fromUint8Array(new TextEncoder().encode(value)) });
          this.print("OK\n");
          break;
        }
        case "delete": {
          const objname = cmd[1];
          if (!objname) {
            this.print("Usage: delete <path>\n");
            break;
          }
          const path = computePath(this.currentPath, objname);
          const key = Base64.fromUint8Array(encodePath(path));
          const value = await this.client.run(remoteProg_Delete, { key });
          this.print("OK\n");
          break;
        }
        case "delete.recursive": {
          const objname = cmd[1];
          if (!objname) {
            this.print("Usage: delete.recursive <path>\n");
            break;
          }
          const path = computePath(this.currentPath, objname);
          const more = await this.question(`Delete everything under /${path.join('/')}? (y/n) `);
          if (more == "n") break;
          if (more != "y") {
            this.print("Invalid response\n");
            break;
          }
          const key = Base64.fromUint8Array(encodePath(path));
          await this.client.run(remoteProg_PrefixDelete, { key });
          this.print("OK\n");
          break;
        }
        case "tree":
        case "tree.reverse": {
          const reverse = cmd[0] == "tree.reverse";
          const subdir = cmd[1]
          const path = subdir ? computePath(this.currentPath, subdir) : this.currentPath;
          for await (const batch of this.runTree(encodePath(path), {
            reverse: false,
            primary: false,
            batchSize: 50,
          }, () => this.questionMore())) {
            for (const seg of batch) this.print(formatPath(seg) + "\n");
          }
          break;
        }
        case "ls": {
          const subdir = cmd[1]
          const path = subdir ? computePath(this.currentPath, subdir) : this.currentPath;
          const prefix = Base64.fromUint8Array(encodePath(path));
          const firstSeg = (x: Uint8Array) => x.slice(0, x.indexOf(0) + 1);

          let cursor: string | undefined = undefined;
          let outputCount = 0;
          const pageSize = 50;
          while (true) {
            const batchSize = 200;
            const tree = <[string, string][]>await this.client.run(remoteProg_Tree, { prefix, limit: batchSize, cursor, reverse: false });
            let uniquePrefixes = tree.map(([k, v]) => firstSeg(Base64.toUint8Array(k))).filter(x => x.length)
              .filter((x, i, a) => i == 0 || !uint8arrayEquals(x, a[i - 1]));
            this.print(uniquePrefixes.map(e => formatPath(e)).join("\n") + "\n");
            if (uniquePrefixes.length == 0) break;

            outputCount += uniquePrefixes.length;
            if (outputCount >= pageSize) {
              const more = await this.question("More? (y/n) ");
              if (more == "n") break;
              if (more != "y") {
                this.print("Invalid response\n");
                break;
              }
              outputCount = 0;
            }

            const nextCursor = uniquePrefixes[uniquePrefixes.length - 1];
            nextCursor[nextCursor.length - 1] = 1;
            cursor = Base64.fromUint8Array(nextCursor);
          }
          break;
        }
        case "change-prefix.nonatomically": {
          const oldPrefix = cmd[1];
          const newPrefix = cmd[2];
          if (!oldPrefix || !newPrefix) {
            this.print("Usage: change-prefix.nonatomically <old_prefix> <new_prefix>\n");
            break;
          }
          const oldPath = computePath(this.currentPath, oldPrefix);
          const oldPathEncoded = encodePath(oldPath);
          const newPath = computePath(this.currentPath, newPrefix);
          const newPathEncoded = encodePath(newPath);

          const prom: Promise<unknown>[] = [];

          for await (const batch of this.runTree(encodePath(oldPath), {
            reverse: false,
            primary: true,
            batchSize: 100,
          }, () => true)) {
            const items: { k1: string, k2: string }[] = [];
            for (const seg of batch) {
              const oldFullPath = new Uint8Array(oldPathEncoded.length + seg.length);
              oldFullPath.set(oldPathEncoded);
              oldFullPath.set(seg, oldPathEncoded.length);

              const newFullPath = new Uint8Array(newPathEncoded.length + seg.length);
              newFullPath.set(newPathEncoded);
              newFullPath.set(seg, newPathEncoded.length);
              items.push({ k1: Base64.fromUint8Array(oldFullPath), k2: Base64.fromUint8Array(newFullPath) });
            }

            prom.push(this.client.run(
              remoteProg_Move,
              {
                items,
              },
            ));
            this.print(`Submitted ${items.length} entries...\n`);
          }
          this.print("Waiting for completion...\n");
          await Promise.all(prom);
          this.print("OK\n");
          break;
        }
        case "help": {
          this.print("Available commands:\n");
          this.print("  cd <dir>\n");
          this.print("  get <path>\n");
          this.print("  get.utf8 <path>\n");
          this.print("  set <path> <base64_encoded_value>\n");
          this.print("  set.utf8 <path> <value>\n");
          this.print("  delete <path>\n");
          this.print("  delete.recursive <path>\n");
          this.print("  ls [dir]\n");
          this.print("  tree [dir]\n");
          this.print("  tree.reverse [dir]\n");
          this.print("  change-prefix.nonatomically <old_prefix> <new_prefix>\n");
          this.print("  help\n");
          this.print("  exit\n");
          break;
        }
        case "exit": {
          return;
        }
        default: {
          this.print("Unknown command\n");
        }
      }
    }
  }

  async questionMore(): Promise<boolean> {
    const more = await this.question("More? (y/n) ");
    if (more == "n") return false;
    if (more != "y") {
      this.print("Invalid response\n");
      return false;
    }
    return true;
  }

  async* runTree(encodedPath: Uint8Array, opts: { batchSize: number, primary: boolean, reverse: boolean }, questionMore: () => boolean | Promise<boolean>): AsyncGenerator<Uint8Array[], void, void> {
    const prefix = Base64.fromUint8Array(encodedPath);
    let cursor: string | undefined = undefined;
    while (true) {
      const tree = <[string, string][]>await this.client!.run(remoteProg_Tree, { primary: opts.primary, prefix, limit: opts.batchSize, cursor, reverse: opts.reverse });
      yield tree.map(([k, _v]) => Base64.toUint8Array(k));
      if (tree.length < opts.batchSize) break;
      if (!await questionMore()) break;
      cursor = tree[tree.length - 1][0];
    }
  }
}

function uint8arrayEquals(a: Uint8Array, b: Uint8Array) {
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}
