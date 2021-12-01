import { MdsClient } from "./client";
import { parse as shellParse } from "shell-quote";
import { Base64 } from "js-base64";

const remoteProg_Tree = "output = createReplicaTransaction().PrefixList(base64Decode(data.prefix), data.limit, base64Decode(data.after)).Collect().map(([k, v]) => [base64Encode(k), base64Encode(v)])";
const remoteProg_Get = "let value = createReplicaTransaction().Get(base64Decode(data.key)).Wait(); output = value === null ? null : base64Encode(value);"
const remoteProg_Set = "let txn = createPrimaryTransaction(); txn.Set(base64Decode(data.key), base64Decode(data.value)); txn.Commit().Wait();";
const remoteProg_Delete = "let txn = createPrimaryTransaction(); txn.Delete(base64Decode(data.key)); txn.Commit().Wait();";

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
      numLanes: 1,
      store,
    });

    while (true) {
      try {
        await this.runUntilException();
        break;
      } catch (e) {
        this.print(`\n${e}\n`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  private async runUntilException() {
    if (this.client) this.client.close();
    this.client = this.clientGen!();
    await this.client.init();
    this.print(`Connected to MDS. Server version: ${this.client.getServerInfo().version}\n`);
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
            this.print("Usage: get <objname>\n");
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
            this.print("Usage: get.utf8 <objname>\n");
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
            this.print("Usage: set <objname> <base64_encoded_value>\n");
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
            this.print("Usage: set.utf8 <objname> <value>\n");
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
            this.print("Usage: delete <objname>\n");
            break;
          }
          const path = computePath(this.currentPath, objname);
          const key = Base64.fromUint8Array(encodePath(path));
          const value = await this.client.run(remoteProg_Delete, { key });
          this.print("OK\n");
          break;
        }
        case "tree": {
          const subdir = cmd[1]
          const path = subdir ? computePath(this.currentPath, subdir) : this.currentPath;
          const prefix = Base64.fromUint8Array(encodePath(path));
          let after: string | undefined = undefined;
          while (true) {
            const limit = 20;
            const tree = <[string, string][]>await this.client.run(remoteProg_Tree, { prefix, limit, after });
            this.print(tree.map(e => `${formatPath(Base64.toUint8Array(e[0]))}: ${e[1]}`).join("\n") + "\n");
            if (tree.length < limit) break;

            const more = await this.question("More? (y/n) ");
            if (more == "n") break;
            if (more != "y") {
              this.print("Invalid response\n");
              break;
            }

            after = tree[tree.length - 1][0];
          }
          break;
        }
        case "help": {
          this.print("Available commands:\n");
          this.print("  cd <dir>\n");
          this.print("  get <path>\n");
          this.print("  get.utf8 <path>\n");
          this.print("  set <path> <value>\n");
          this.print("  set.utf8 <path> <value>\n");
          this.print("  delete <path>\n");
          this.print("  tree [dir]\n");
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
}

function computePath(current: string[], append: string): string[] {
  const segs = append.split("/").filter(x => x);

  const out = append.startsWith("/") ? [] : [...current]
  for(const seg of segs) {
    if(!validatePathSeg(seg)) throw new Error("Invalid path");
    if (seg == "..") {
      out.pop();
      continue;
    }
    if (seg == ".") {
      continue;
    }
    out.push(seg);
  }

  return out;
}

function formatPath(path: Uint8Array): string {
  const pretty = tryPrettyPrintPath(path);
  if (pretty === undefined) {
    return '[b] ' + Base64.fromUint8Array(path);
  } else {
    return '[p] ' + pretty;
  }
}

function tryPrettyPrintPath(path: Uint8Array): string | undefined {
  let idx = 0;
  let segs: string[] = [];
  while (idx < path.length) {
    if (path[idx] == 0x02) {
      let seg: number[] = [];
      let fin = false;
      idx++;
      while (idx < path.length) {
        let b = path[idx++];
        if (b == 0x00) {
          fin = true;
          break;
        }
        seg.push(b);
      }
      if (!fin) return undefined;
      segs.push(new TextDecoder().decode(Uint8Array.from(seg)));
    } else {
      return undefined;
    }
  }
  return segs.join("/");
}

function encodePath(path: string[]): Uint8Array {
  const raw = path.map(seg => new TextEncoder().encode(seg));
  const buf = new Uint8Array(raw.reduce((acc, cur) => acc + cur.length + 2, 0));
  let offset = 0;
  for (const seg of raw) {
    buf[offset++] = 0x02;
    buf.set(seg, offset);
    offset += seg.length;
    buf[offset++] = 0x00;
  }
  return buf;
}

function validatePathSeg(seg: string): boolean {
  const encoded = new TextEncoder().encode(seg);
  for (const b of encoded) {
    if (b == 0) return false;
    if (b == 47) return false; // '/'
  }
  return true;
}
