/* eslint-disable import/no-commonjs */
/* eslint-env es6 */

const cleanup = require('rollup-plugin-cleanup');
// const dts = require('rollup-plugin-dts').default;
const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve').default;
const terser = require('rollup-plugin-terser').terser;
const pkg = require('./package.json');

const input = 'src/js/application.js';
const inputESM = {
    'dist/chart.esm': 'src/index.esm.js',
};
// const inputESMTypings = {
//     'dist/chart.esm': 'types/index.esm.d.ts',
//     'dist/helpers.esm': 'types/helpers/index.d.ts'
// };

const banner = `/*!
 * lotivis.js v${pkg.version}
 * ${pkg.homepage}
 * (c) ${(new Date(process.env.SOURCE_DATE_EPOCH ? (process.env.SOURCE_DATE_EPOCH * 1000) : new Date().getTime())).getFullYear()} lotivis.js Contributors
 * Released under the MIT License
 */`;

module.exports = [
    // UMD builds
    // dist/chart.min.js
    // dist/chart.js
    {
        input,
        plugins: [
            json(),
            resolve(),
            cleanup({
                sourcemap: true
            })
        ],
        output: {
            name: 'lotivis',
            file: 'dist/lotivis.js',
            banner,
            format: 'umd',
            indent: false,
        },
    },
    {
        input,
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
            name: 'lotivis',
            file: 'dist/lotivis.min.js',
            format: 'umd',
            indent: false,
        },
    },
];