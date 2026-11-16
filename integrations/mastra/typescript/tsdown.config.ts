import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    copilotkit: "src/copilotkit.ts",
    "copilotkit-2": "src/copilotkit-2.ts",
    // Bridge-free entry: server-side / remote agents import getA2UITools +
    // planA2UIInjection from "@0noxtackore/mastra/a2ui" WITHOUT pulling the
    // AbstractAgent bridge (and its @0noxtackore/client → uuid runtime dep), which the
    // Mastra CLI bundler can't resolve.
    a2ui: "src/a2ui-tool.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  exports: true,
  fixedExtension: false,
  sourcemap: true,
  clean: true,
  minify: true,
});
