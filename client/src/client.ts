import WebSocket from "isomorphic-ws";
import { mds } from "./protocol";
import * as ed25519 from '@noble/ed25519';
import { Base64 } from 'js-base64';
import { Sema } from "async-sema";
import winston from "winston";

export interface MdsServerInfo {
  version: string;
}

export class MdsClient {
  private ws: WebSocket | null;
  private endpoint: string;
  private secretKey: Uint8Array;
  private publicKey: Uint8Array | null;
  private store: string;
  private lanePool: number[];
  private laneSem: Sema;
  private numLanes: number;
  private laneCompletions: Map<number, { resolve: (res: mds.Response) => void, reject: (err: Error) => void }> = new Map();
  private broken: boolean = false;
  private serverInfo: MdsServerInfo | null = null;

  constructor({ endpoint, secretKey, store, numLanes }: { endpoint: string, secretKey: string, store: string, numLanes: number }) {
    this.ws = null;
    this.publicKey = null;
    this.store = store;
    this.endpoint = endpoint;
    this.secretKey = Base64.toUint8Array(secretKey);
    if (this.secretKey.length != 32) {
      throw new Error('Invalid secret key');
    }
    this.numLanes = numLanes;
    this.laneSem = new Sema(numLanes);
    this.lanePool = [];
    for (let i = 0; i < numLanes; i++) {
      this.lanePool.push(i);
    }
  }

  async init() {
    this.publicKey = await ed25519.getPublicKey(this.secretKey);
    winston.info(`[MdsClient] public key: ${Base64.fromUint8Array(this.publicKey)}`)
    this.ws = new WebSocket(this.endpoint);

    const authProm: Promise<MdsServerInfo> = new Promise((resolve, reject) => {
      this.ws!.onerror = (e) => {
        reject(new Error(`ws error: ${e.error}`));
      }
      this.ws!.onclose = (e) => {
        reject(new Error(`ws closed: ${e.reason}`));
      }

      this.ws!.on('open', () => {
        winston.info('[MdsClient] connected');
        this.ws!.onmessage = async (event) => {
          try {
            const challenge = mds.LoginChallenge.decode(normalizeWsData(event.data));
            const sig = await ed25519.sign(challenge.challenge, this.secretKey);
            const login = mds.Login.encode({
              store: this.store,
              publicKey: this.publicKey!,
              signature: sig,
              muxWidth: this.numLanes,
            })
            this.ws!.send(login.finish());
            this.ws!.onmessage = async (event) => {
              this.resetWsHandlers();
              try {
                const loginResult = mds.LoginResponse.decode(normalizeWsData(event.data));
                if (loginResult.ok) {
                  resolve({
                    version: challenge.version,
                  });
                } else {
                  reject(new Error('Login failed'));
                }
              } catch (e) {
                reject(e);
              }
            }
          } catch (e) {
            this.resetWsHandlers();
            reject(e);
          }
        };
      });
    });
    this.serverInfo = await authProm;
    winston.info("[MdsClient] logged in");
    this.ws!.onmessage = this.onWsMessage.bind(this);
    this.ws!.onerror = this.onWsError.bind(this);
    this.ws!.onclose = this.onWsClose.bind(this);
  }

  close() {
    this.ws?.close();
  }

  getServerInfo(): MdsServerInfo {
    if(!this.serverInfo) throw new Error("not initialized");
    return this.serverInfo;
  }

  private resetWsHandlers() {
    this.ws!.onmessage = (event) => {
      winston.error("unknown ws event", event);
    }
    this.ws!.onerror = (event) => {
      winston.error("ws error", event);
    }
    this.ws!.onclose = (event) => {
      winston.error("ws close", event);
    }
  }

  private onWsMessage(e: WebSocket.MessageEvent) {
    const msg = mds.Response.decode(normalizeWsData(e.data));
    this.laneCompletions.get(msg.lane)!.resolve(msg);
    this.laneCompletions.delete(msg.lane);
  }

  private onWsError(e: WebSocket.ErrorEvent) {
    winston.error("ws error", e);
    this.laneCompletions.forEach((v, k) => {
      v.reject(new Error("websocket error"));
    })
    this.laneCompletions = new Map();
    this.broken = true;
  }

  private onWsClose(e: WebSocket.CloseEvent) {
    winston.error("onWsClose", e)
    this.laneCompletions.forEach((v, k) => {
      v.reject(new Error("websocket closed"));
    })
    this.laneCompletions = new Map();
    this.broken = true;
  }

  private async grabLane(): Promise<number> {
    await this.laneSem.acquire();
    const lane = this.lanePool.pop();
    if (typeof lane !== "number") throw new Error("lane pool is empty");
    return lane;
  }

  private releaseLane(lane: number) {
    this.lanePool.push(lane);
    this.laneSem.release();
  }

  private waitResponse(lane: number): Promise<mds.Response> {
    return new Promise((resolve, reject) => {
      if (this.broken) {
        reject(new Error("websocket broken"));
      } else {
        this.laneCompletions.set(lane, { resolve, reject });
      }
    });
  }

  async run(program: string, data?: unknown): Promise<unknown> {
    const lane = await this.grabLane();
    try {
      const reqI: mds.IRequest = {
        lane,
        program,
      };
      if(data !== undefined) {
        reqI.data = JSON.stringify(data);
      }
      const req = mds.Request.encode(reqI);
      this.ws!.send(req.finish());
      const res = await this.waitResponse(lane);
      if (res.error) {
        throw new Error("remote error: " + res.error.description);
      }
      return JSON.parse(res.output!);
    } finally {
      this.releaseLane(lane);
    }
  }
}

function normalizeWsData(data: WebSocket.Data): Uint8Array {
  if (data instanceof Uint8Array) {
    return data;
  } else {
    throw new Error('Invalid WebSocket data type');
  }
}