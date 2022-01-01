/* eslint-env es6 */
const resolve = require("@rollup/plugin-node-resolve").default;
const execute = require("rollup-plugin-execute");
const pkg = require("./package.json");
const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");

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
      babel({
        exclude: "node_modules/**"
      }),
      resolve({
        jsnext: true
      }),
      commonjs(),
      execute("sass src/index.scss > dist/lotivis.css"),
      execute("sass --style compressed src/index.scss > dist/lotivis.min.css")
    ],
    output: {
      sourcemap: true,
      name: "lotivis",
      file: "dist/lotivis.js",
      banner,
      format: "umd",
      // esModule: false,
      exports: "named",
      indent: false
    }
  },
  // Tests
  {
    input: "src/index.tests.js",
    plugins: [resolve()],
    output: {
      sourcemap: true,
      name: "lotivis",
      file: "dist/lotivis.tests.js",
      format: "umd",
      esModule: false,
      exports: "named",
      indent: false
    }
  }
];
