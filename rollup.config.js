import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import terser from "@rollup/plugin-terser";
import alias from "@rollup/plugin-alias";
import { resolve } from "path";

const name = "dist/silentium";

const bundle = (config) => {
  const isDts = config.plugins && config.plugins.some((p) => p.name === "dts");
  return {
    ...config,
    input: "src/index.ts",
    external: isDts
      ? () => false
      : (id) =>
          !/^[./]/.test(id) &&
          !id.startsWith("base/") &&
          !id.startsWith("components/") &&
          !id.startsWith("helpers/") &&
          !id.startsWith("types/") &&
          !id.startsWith("testing/"),
    plugins: [
      alias({
        entries: [
          { find: /^base\/(.*)$/, replacement: resolve("src/base/$1.ts") },
          {
            find: /^components\/(.*)$/,
            replacement: resolve("src/components/$1.ts"),
          },
          {
            find: /^helpers\/(.*)$/,
            replacement: resolve("src/helpers/$1.ts"),
          },
          { find: /^types\/(.*)$/, replacement: resolve("src/types/$1.ts") },
          {
            find: /^testing\/(.*)$/,
            replacement: resolve("src/testing/$1.ts"),
          },
        ],
      }),
      ...(config.plugins || []),
    ],
  };
};

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `${name}.cjs`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `${name}.js`,
        format: "es",
        sourcemap: true,
      },
      {
        file: `${name}.mjs`,
        format: "es",
        sourcemap: true,
      },
      {
        file: `${name}.min.mjs`,
        format: "es",
        plugins: [terser()],
        sourcemap: true,
      },
      {
        file: `${name}.min.js`,
        format: "iife",
        plugins: [terser()],
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: "es",
    },
  }),
];
