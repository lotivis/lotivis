/* eslint-env es6 */
const resolve = require("@rollup/plugin-node-resolve").default;
const execute = require("rollup-plugin-execute");
const pkg = require("./package.json");
// import { babel } from "@rollup/plugin-babel";

const banner = `/*!
 * lotivis.js v${pkg.version}
 * ${pkg.homepage}
 * (c) ${new Date(
   new Date().getTime()
 ).getFullYear()} lotivis.js Lukas Danckwerth
 * Released under the MIT License
 */`;

module.exports = [
  // UMD builds
  {
    input: "src/index.js",
    plugins: [
      resolve({
        jsnext: true,
      }),
      // babel({ babelHelpers: "bundled" }),
      execute("sass src/index.scss > dist/lotivis.css"),
      execute("sass --style compressed src/index.scss > dist/lotivis.min.css"),
    ],
    output: {
      sourcemap: true,
      name: "lotivis",
      file: "dist/lotivis.js",
      banner,
      format: "umd",
    },
  },
  {
    input: "src/index.test.js",
    plugins: [
      resolve({
        jsnext: true,
      }),
    ],
    output: {
      sourcemap: true,
      name: "lotivis.test",
      file: "dist/lotivis.test.js",
      format: "umd",
    },
  },
];
