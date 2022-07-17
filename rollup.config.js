import resolve from "@rollup/plugin-node-resolve";
import execute from "rollup-plugin-execute";
import * as pkg from "./package.json";

const banner = `/*!
 * ${pkg.name} ${pkg.version}
 * Copyright (c) ${new Date(new Date().getTime()).getFullYear()} ${pkg.author}
 * Released under ${pkg.license} License
 */`;

export default [
    {
        input: "src/index.js",
        plugins: [resolve()],
        output: [
            {
                sourcemap: true,
                name: "lotivis",
                file: pkg.main,
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
