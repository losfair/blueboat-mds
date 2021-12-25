import { build } from 'esbuild';
import dts from 'npm-dts';
import fs from "fs";

const targetDeps = Object.keys(JSON.parse(fs.readFileSync("../packaging/bluemds/package.json", "utf8")).dependencies);
console.log("Target deps", targetDeps);

const shared = {
  entryPoints: ['src/bluemds.ts'],
  platform: "node",
  bundle: true,
  external: targetDeps,
};

await build({
  ...shared,
  outfile: '../packaging/bluemds/index.js',
});

await build({
  ...shared,
  outfile: '../packaging/bluemds/index.esm.js',
  format: 'esm',
});

await new dts.Generator({
  entry: 'src/bluemds.ts',
  output: '../packaging/bluemds/index.d.ts',
  logLevel: "debug",
  force: true,
}, true, true).generate()

console.log("done")