import NodeModulesPolyfills from '@esbuild-plugins/node-modules-polyfill'
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill'
import { build } from 'esbuild'

const out = await build({
  entryPoints: ['./src/webcli.ts'],
  plugins: [
    NodeModulesPolyfills.default(),
    GlobalsPolyfills.default({
      process: true,
      buffer: true,
    })
  ],
  target: 'chrome90',
  platform: "browser",
  bundle: true,
  format: "esm",
  outfile: "web/app.min.js",
  minify: true,
  sourcemap: true,
  define: {
    "global": "window",
    "setImmediate": "setTimeout",
    "clearImmediate": "clearTimeout",
  }
})

console.log(JSON.stringify(out, null, 2));
