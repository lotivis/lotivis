import resolve from "@rollup/plugin-node-resolve";
import execute from "rollup-plugin-execute";
import * as pkg from "./package.json";

const banner = `/*!
 * ${pkg.name} ${pkg.version}
 * Copyright (c) ${new Date(new Date().getTime()).getFullYear()} ${pkg.author}
 * Released under ${pkg.license} License
 */`;

export default [
  // UMD builds
  {
    input: "src/index.js",
    plugins: [resolve(), execute("npm run scss")],
    output: [
      {
        sourcemap: true,
        name: "lotivis",
        file: "dist/lotivis.js",
        banner,
        format: "umd",
      },
      {
        sourcemap: true,
        name: pkg.name,
        file: pkg.module,
        banner,
        format: "esm",
      },
    ],
  },
  // CJS for tests
  {
    input: "src/index.test.js",
    plugins: [
      resolve({
        jsnext: true,
      }),
      execute("npm run test"),
    ],
    output: {
      name: "lotivis.test",
      file: "dist/lotivis.test.js",
      format: "cjs",
      sourcemap: true,
    },
  },
];
