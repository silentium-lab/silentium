import { defineConfig } from "vitest/config";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    pool: "forks",
    poolOptions: {
      forks: {
        execArgv: ["--expose-gc"],
      },
    },
  },
  resolve: {
    alias: {
      base: resolve(__dirname, "src/base"),
      components: resolve(__dirname, "src/components"),
      helpers: resolve(__dirname, "src/helpers"),
      types: resolve(__dirname, "src/types"),
      testing: resolve(__dirname, "src/testing"),
    },
  },
});
