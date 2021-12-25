declare module 'bluemds/build_bluemds_package' {
  export {};

}
declare module 'bluemds/esbuild_web' {
  export {};

}
declare module 'bluemds/playground/hello' {

}
declare module 'bluemds/src/bluemds' {
  export { MdsClient } from "bluemds/src/client";
  export { encodePath, tryPrettyPrintPath } from "bluemds/src/pathutil";

}
declare module 'bluemds/src/cli' {
  export {};

}
declare module 'bluemds/src/client' {
  export interface MdsServerInfo {
      version: string;
  }
  export class MdsClient {
      private ws;
      private endpoint;
      private secretKey;
      private publicKey;
      private store;
      private lanePool;
      private laneSem;
      private numLanes;
      private laneCompletions;
      private broken;
      private serverInfo;
      constructor({ endpoint, secretKey, store, numLanes }: {
          endpoint: string;
          secretKey: string;
          store: string;
          numLanes: number;
      });
      init(): Promise<void>;
      close(): void;
      getServerInfo(): MdsServerInfo;
      private resetWsHandlers;
      private onWsMessage;
      private onWsError;
      private onWsClose;
      private grabLane;
      private releaseLane;
      private waitResponse;
      run(program: string, data?: unknown, retryable?: boolean): Promise<unknown>;
  }

}
declare module 'bluemds/src/index' {

}
declare module 'bluemds/src/pathutil' {
  export function computePath(current: string[], append: string): string[];
  export function formatPath(path: Uint8Array): string;
  export function tryPrettyPrintPath(path: Uint8Array): string | undefined;
  export function encodePath(path: string[]): Uint8Array;

}
declare module 'bluemds/src/protocol' {
  export = $root;
  var $root: $protobuf.Root;
  import $protobuf = require("protobufjs/minimal");

}
declare module 'bluemds/src/repl_core' {
  export interface ReplCoreArgs {
      server?: string;
      secret?: string;
      store?: string;
      print: (s: string) => void;
      question: (s: string) => Promise<string>;
  }
  export class ReplCore {
      private print;
      private question;
      private args;
      private client;
      private clientGen;
      private currentPath;
      constructor(args: ReplCoreArgs);
      init(): Promise<void>;
      private runUntilException;
      questionMore(): Promise<boolean>;
      runTree(encodedPath: Uint8Array, opts: {
          batchSize: number;
          primary: boolean;
          reverse: boolean;
      }, questionMore: () => boolean | Promise<boolean>): AsyncGenerator<Uint8Array[], void, void>;
  }

}
declare module 'bluemds/src/webcli' {
  export {};

}
declare module 'bluemds' {
  import main = require('bluemds/src/bluemds');
  export = main;
}