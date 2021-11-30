import NodeModulesPolyfills from '@esbuild-plugins/node-modules-polyfill'
import { build } from 'esbuild'

const out = await build({
  entryPoints: ['./src/client.ts'],
  plugins: [NodeModulesPolyfills.default()],
  target: 'chrome90',
  platform: "browser",
  bundle: true,
  format: "esm",
  outfile: "dist/web_bundle.js",
  minify: true,
  sourcemap: "external",
})

console.log(JSON.stringify(out, null, 2));
