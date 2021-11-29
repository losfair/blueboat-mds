import WebSocket from "isomorphic-ws";
import { mds } from "./protocol";
import * as ed25519 from '@noble/ed25519';
import { Base64 } from 'js-base64';

export class MdsClient {
  private ws: WebSocket | null;
  private endpoint: string;
  private secretKey: Uint8Array;
  private publicKey: Uint8Array | null;
  private store: string;

  constructor({ endpoint, secretKey, store }: { endpoint: string, secretKey: string, store: string }) {
    this.ws = null;
    this.publicKey = null;
    this.store = store;
    this.endpoint = endpoint;
    this.secretKey = Base64.toUint8Array(secretKey);
    if (this.secretKey.length != 32) {
      throw new Error('Invalid secret key');
    }
  }

  async init() {
    this.publicKey = await ed25519.getPublicKey(this.secretKey);
    console.log(`[MdsClient] public key: ${Base64.fromUint8Array(this.publicKey)}`)
    this.ws = new WebSocket(this.endpoint);
    this.ws.onerror = (e) => {
      console.error("ws error", e);
    }
    this.ws.onclose = (e) => {
      console.error("ws close", e);
    }

    const authProm: Promise<void> = new Promise((resolve, reject) => {
      this.ws!.on('open', () => {
        console.log('[MdsClient] connected');
        this.ws!.onmessage = async (event) => {
          try {
            const challenge = mds.LoginChallenge.decode(normalizeWsData(event.data));
            const sig = await ed25519.sign(challenge.challenge, this.secretKey);
            const login = mds.Login.encode({
              store: this.store,
              publicKey: this.publicKey!,
              signature: sig,
              muxWidth: 8,
            })
            this.ws!.send(login.finish());
            this.ws!.onmessage = async (event) => {
              try {
                const loginResult = mds.LoginResponse.decode(normalizeWsData(event.data));
                if (loginResult.ok) {
                  this.ws!.onmessage = (event) => {
                    console.error("unknown ws event", event);
                  }
                  resolve();
                } else {
                  reject(new Error('Login failed'));
                }
              } catch (e) {
                reject(e);
              }
            }
          } catch (e) {
            reject(e);
          }
        };
      });
    });
    await authProm;
    console.log("[MdsClient] logged in");
  }
}

function normalizeWsData(data: WebSocket.Data): Uint8Array {
  if (data instanceof Uint8Array) {
    return data;
  } else {
    throw new Error('Invalid WebSocket data type');
  }
}