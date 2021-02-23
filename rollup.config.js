/* eslint-env es6 */
const resolve = require('@rollup/plugin-node-resolve').default;
const pkg = require('./package.json');

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
      file: 'dist/lotivis.js',
      banner,
      format: 'umd',
      esModule: false,
      exports: "named",
      indent: false,
    },
  }
];
