import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/index.js",
    output: [
      { file: "es/index.js", format: "es" },
      { file: "lib/index.js", format: "cjs" },
    ],

    external: ["json-url"],
    plugins: [
      resolve({
        extensions: [".mjs", ".js", ".json", ".node", ".jsx"],
      }),

      babel({
        presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }]],
        babelHelpers: "bundled",
      }),
      commonjs(),
    ],
  },
];
