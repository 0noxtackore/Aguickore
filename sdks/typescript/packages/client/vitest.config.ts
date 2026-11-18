import path from "path";
import { mergeConfig, defineConfig } from "vitest/config";
import baseConfig from "../../vitest.base";

export default mergeConfig(
  baseConfig,
  defineConfig({
    resolve: {
      alias: {
        "@/": path.resolve(__dirname, "./src") + "/",
        // Subpath first: the bare alias would otherwise swallow it.
        "@0noxtackore/core/schemas": path.resolve(__dirname, "../core/src/schemas.ts"),
        "@0noxtackore/core": path.resolve(__dirname, "../core/src/index.ts"),
        "@0noxtackore/proto": path.resolve(__dirname, "../proto/src/index.ts"),
        "@0noxtackore/encoder": path.resolve(__dirname, "../encoder/src/index.ts"),
      },
    },
  }),
);
