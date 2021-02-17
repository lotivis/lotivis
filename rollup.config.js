/* eslint-disable import/no-commonjs */
/* eslint-env es6 */

const cleanup = require('rollup-plugin-cleanup');
const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve').default;
const terser = require('rollup-plugin-terser').terser;
const pkg = require('./package.json');
import scss from 'rollup-plugin-scss';

const inputJS = 'src/js/application.js';
const inputSCSS = 'src/scss/main.scss';

const banner = `/*!
 * lotivis.js v${pkg.version}
 * ${pkg.homepage}
 * (c) ${(new Date(process.env.SOURCE_DATE_EPOCH ? (process.env.SOURCE_DATE_EPOCH * 1000) : new Date().getTime())).getFullYear()} lotivis.js Lukas Danckwerth
 * Released under the MIT License
 */`;

module.exports = [
  // UMD builds
  // dist/lotivis.min.js
  // dist/lotivis.js
  {
    input: inputJS,
    plugins: [
      json(),
      resolve(),
      cleanup({
        sourcemap: true
      })
    ],
    output: {
      sourcemap: true,
      name: 'lotivis',
      file: 'example/public/js/lotivis.js',
      banner,
      format: 'umd',
      indent: false,
    },
  },
  {
    input: inputJS,
    plugins: [
      json(),
      resolve(),
      terser({
        output: {
          preamble: banner
        }
      })
    ],
    output: {
      sourcemap: true,
      name: 'lotivis',
      file: 'example/public/js/lotivis.min.js',
      format: 'umd',
      indent: false,
    },
  },
  {
    input: inputSCSS,
    plugins: [
      scss({
        output: "./example/public/css/lotivis.css",
        failOnError: true
      })
    ],
    output: {
      dir: "./example/public/css",
    }
  },
  {
    input: inputSCSS,
    plugins: [
      scss({
        output: "./example/public/css/lotivis.min.css",
        outputStyle: "compressed",
        failOnError: true
      })
    ],
    output: {
      dir: "./example/public/css",
    }
  }
];
