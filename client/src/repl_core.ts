import { ifError } from "assert";
import { MdsClient } from "./client";
import { parse as shellParse } from "shell-quote";
import { Base64 } from "js-base64";

const remoteProg_Tree = "output = createReplicaTransaction().PrefixList(base64Decode(data.prefix), data.limit, data.after).Collect().map(([k, v]) => [base64Encode(k), base64Encode(v)])";

export interface ReplCoreArgs {
  server?: string;
  secret?: string;
  store?: string;
  print: (s: string) => void,
  read: () => Promise<string>,
}

export class ReplCore {
  private print: (s: string) => void;
  private read: () => Promise<string>;
  private args: ReplCoreArgs;
  private client: MdsClient | null;
  private clientGen: (() => MdsClient) | null;
  private currentPath: string[] = [];

  constructor(args: ReplCoreArgs) {
    this.print = args.print;
    this.read = args.read;
    this.args = args;
    this.client = null;
    this.clientGen = null;
  }

  async init() {
    this.print("Blueboat MDS Shell\n");

    let server: string;
    if(this.args.server) {
      server = this.args.server;
    } else {
      this.print("Server: ");
      server = await this.read();
    }

    let secret: string;
    if(this.args.secret) {
      secret = this.args.secret;
    } else {
      this.print("Secret key: ");
      secret = await this.read();
    }

    let store: string;
    if(this.args.store) {
      store = this.args.store;
    } else {
      this.print("Store: ");
      store = await this.read();
    }

    this.print("Connecting to MDS...\n");
    this.clientGen = () => new MdsClient({
      endpoint: server,
      secretKey: secret,
      numLanes: 1,
      store,
    });

    while(true) {
      try {
        await this.runUntilException();
      } catch(e) {
        this.print(`\n${e}\n`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  private async runUntilException() {
    if(this.client) this.client.close();
    this.client = this.clientGen!();
    await this.client.init();
    this.print(`Connected to MDS. Server version: ${this.client.getServerInfo().version}\n`);
    while(true) {
      const pathDisplay = this.currentPath.join("/");
      this.print(pathDisplay + "> ");
      const _cmd = shellParse(await this.read());
      if(_cmd.findIndex(c => typeof c !== 'string') !== -1) {
        this.print("Invalid command\n");
        continue;
      }
      const cmd: string[] = <any>_cmd;
      switch(cmd[0]) {
        case "cd": {
          let dirName = cmd[1];
          if(!dirName) {
            this.print("Usage: cd <dir>\n");
            break;
          }

          if(dirName == "..") {
            this.currentPath.pop();
            break;
          }

          if(dirName == ".") {
            break;
          }

          if(!validatePathSeg(dirName)) {
            this.print("Invalid directory name\n");
            break;
          }
          this.currentPath.push(dirName);
          break;
        }
        case "tree": {
          const prefix = Base64.fromUint8Array(encodePath(this.currentPath));
          let after: string | undefined = undefined;
          while(true) {
            const tree = await this.client.run(remoteProg_Tree, { prefix, limit: 20, after });
          }
          break;
        }
        default: {
          this.print("Unknown command\n");
        }
      }
    }
  }
}

function encodePath(path: string[]): Uint8Array {
  const raw = path.map(seg => new TextEncoder().encode(seg));
  const buf = new Uint8Array(raw.reduce((acc, cur) => acc + cur.length + 2, 0));
  let offset = 0;
  for(const seg of raw) {
    buf[offset++] = 0x02;
    buf.set(seg, offset);
    offset += seg.length;
    buf[offset++] = 0x00;
  }
  return buf;
}

function validatePathSeg(seg: string): boolean {
  const encoded = new TextEncoder().encode(seg);
  for(const b of encoded) {
    if(b == 0) return false;
    if(b == 47) return false; // '/'
  }
  return true;
}
