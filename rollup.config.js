/* eslint-env es6 */
const resolve = require('@rollup/plugin-node-resolve').default;
const pkg = require('./package.json');
const postcss = require('rollup-plugin-postcss');

const banner = `/*!
 * lotivis.js v${pkg.version}
 * ${pkg.homepage}
 * (c) ${(new Date(new Date().getTime())).getFullYear()} lotivis.js Lukas Danckwerth
 * Released under the MIT License
 */`;

module.exports = [
  // UMD builds
  {
    input: 'src/index.js',
    plugins: [ resolve() ],
    output: {
      sourcemap: true,
      name: 'lotivis',
    file: 'docs/js/lotivis.js',
      banner,
      format: 'umd',
      esModule: false,
      exports: "named",
      indent: false,
    },
  },
  {
    input: 'src/index.scss',
    plugins: [
      postcss({
        extract: true,
        use: ['sass'],
      }),
    ],
    output: {
      name: 'lotivis',
      file: 'docs/css/lotivis.css',
    },
  },
  // Tests
  {
    input: 'src/index.tests.js',
    plugins: [ resolve() ],
    output: {
      sourcemap: true,
      name: 'lotivis',
      file: 'dist/lotivis.tests.js',
      banner,
      format: 'umd',
      esModule: false,
      exports: "named",
      indent: false,
    },
  },
];
