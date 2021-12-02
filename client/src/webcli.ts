import { Base64 } from "js-base64";
import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';
import * as ed25519 from '@noble/ed25519';
import { ReplCore, ReplCoreArgs } from "./repl_core";
import winston from "winston";

const local_echo = require('local-echo');

let wsUrl = new URL(location.origin);
wsUrl.protocol = wsUrl.protocol == "https:" ? "wss:" : "ws:";
wsUrl.pathname = "/mds";

winston.configure({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
  ]
});

async function openTerminal(secretKey: Uint8Array) {
  const termElem = <HTMLDivElement>document.getElementById('terminal');
  termElem.style.display = 'block';

  const term = new Terminal();
  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);

  const localEcho = new local_echo.default();
  term.loadAddon(localEcho);

  term.open(termElem);
  fitAddon.fit();
  window.addEventListener('resize', () => fitAddon.fit());

  const replArgs: ReplCoreArgs = {
    print(s: string) {
      localEcho.print(s);
    },
    question(s: string) {
      return localEcho.read(s);
    },
    server: wsUrl.toString(),
    secret: Buffer.from(secretKey).toString("base64"),
  };
  const repl = new ReplCore(replArgs);
  await repl.init();
}

function setWsUrl(u: string) {
  wsUrl = new URL(u);
}

function decodeSk(skElem: HTMLInputElement): Uint8Array | null {
  let value: Uint8Array;
  try {
    value = Base64.toUint8Array(skElem.value);
  } catch(e) {
    return null;
  }
  if(value.length != 32) {
    return null;
  }

  return value;
}

async function refreshPk(skElem: HTMLInputElement, pkElem: HTMLPreElement, connectBtn: HTMLButtonElement) {
  const value = decodeSk(skElem);
  if(!value) {
    pkElem.innerText = "";
    connectBtn.disabled = true;
    return;
  }
  connectBtn.disabled = false;
  let pubkey = await ed25519.getPublicKey(value);
  pkElem.innerText = "pub: " + Buffer.from(pubkey).toString("hex");
}

window.addEventListener("load", () => {
  const skElem = <HTMLInputElement>document.getElementById("secret-key");
  const pkElem = <HTMLPreElement>document.getElementById("public-key");
  const connectBtn = <HTMLButtonElement>document.getElementById("connect-btn");
  skElem.value = localStorage.getItem("secret-key") || "";
  refreshPk(skElem, pkElem, connectBtn);
  skElem.addEventListener("keyup", () => refreshPk(skElem, pkElem, connectBtn));
  connectBtn.addEventListener("click", async () => {
    const value = decodeSk(skElem);
    if(!value) {
      return;
    }
    localStorage.setItem("secret-key", skElem.value);
    openTerminal(value);
  });
});

(window as any).setWsUrl = setWsUrl;