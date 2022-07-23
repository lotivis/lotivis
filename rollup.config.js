import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import * as meta from "./package.json";

const banner = `/*!
 * ${meta.name} ${meta.version}
 * Copyright (c) ${new Date(new Date().getTime()).getFullYear()} ${meta.author}
 * Released under ${meta.license} License
 */`;

export default [
  {
    input: "src/index.js",
    plugins: [
      resolve(),
      postcss({
        plugins: [],
      }),
    ],
    output: [
      {
        sourcemap: true,
        name: "lotivis",
        file: meta.main,
        banner,
        format: "umd",
      },
    ],
    onwarn(message, warn) {
      if (message.code === "CIRCULAR_DEPENDENCY") return;
      warn(message);
    },
  },
];
