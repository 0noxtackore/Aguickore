import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    "@0noxtackore/client",
    "@0noxtackore/core",
    "@anthropic-ai/claude-agent-sdk",
    "@anthropic-ai/sdk",
    "zod",
  ],
});

