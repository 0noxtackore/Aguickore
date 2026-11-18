const path = require("path");
const sharpRoot = path.join(process.cwd(), "node_modules", ".pnpm", "sharp@0.34.5", "node_modules", "sharp");
const sharp = require(sharpRoot);
const outDir = "C:\\Users\\PC\\AppData\\Local\\Temp\\opencode";

(async () => {
  for (const f of ["overview", "how-it-works", "protocol-stack", "wordmark", "talk-to-the-team"]) {
    const input = path.join(process.cwd(), ".github", "readme", f + ".svg");
    const output = path.join(outDir, "brandcheck_" + f + ".png");
    const img = sharp(input);
    const meta = await img.metadata();
    await sharp(input).png().toFile(output);
    console.log(f, meta.width + "x" + meta.height, "->", output);
  }
})().catch((e) => {
  console.error("ERR", e.message);
  process.exit(1);
});
