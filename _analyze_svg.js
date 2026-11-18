const fs = require("fs");
const path = require("path");
const sharpRoot = path.join(process.cwd(), "node_modules", ".pnpm", "sharp@0.34.5", "node_modules", "sharp");
const sharp = require(sharpRoot);

function topLevelGroups(svg) {
  const res = [];
  const stack = [];
  const tagRe = /<(\/?)g\b([^>]*?)(\/?)>/g;
  let t, depth = 0;
  while ((t = tagRe.exec(svg))) {
    const isClose = t[1] === "/", selfClose = t[3] === "/";
    if (!isClose && !selfClose) {
      if (depth === 0) {
        const id = (t[2].match(/id="([^"]+)"/) || [])[1] || "?";
        stack.push({ id, start: t.index, openEnd: t.index + t[0].length });
      }
      depth++;
    } else if (isClose) {
      depth--;
      if (depth === 0 && stack.length) {
        const g = stack.pop();
        res.push({ id: g.id, start: g.start, content: svg.slice(g.start, t.index + t[0].length) });
      }
    } else if (selfClose && depth === 0) {
      const id = (t[2].match(/id="([^"]+)"/) || [])[1] || "?";
      res.push({ id, start: t.index, content: t[0] });
    }
  }
  return res;
}

async function bboxOf(svgContent, w, h) {
  let buf, info;
  try {
    ({ data: buf, info } = await sharp(Buffer.from(svgContent), { density: 96 })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true }));
  } catch (e) {
    return { err: e.message.slice(0, 60) };
  }
  const { width, height, channels } = info;
  let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1, n = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = buf[y * width * channels + x * channels + 3];
      if (a > 10) {
        n++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { minX, minY, maxX, maxY, px: n };
}

function topColors(buf, info, rx0, ry0, rx1, ry1) {
  const { width, channels } = info;
  const counts = {};
  for (let y = ry0; y < ry1; y++) {
    for (let x = rx0; x < rx1; x++) {
      const i = (y * width + x) * channels;
      const hex = "#" + [buf[i], buf[i + 1], buf[i + 2]].map((v) => v.toString(16).padStart(2, "0")).join("");
      counts[hex] = (counts[hex] || 0) + 1;
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
}

(async () => {
  const files = {
    overview: { region: [300, 5, 600, 60] },
    "how-it-works": { region: [350, 5, 540, 55] },
    "protocol-stack": { region: [380, 105, 500, 150] },
  };
  for (const [name, cfg] of Object.entries(files)) {
    const file = path.join(".github", "readme", name + ".svg");
    const svg = fs.readFileSync(file, "utf8");
    const groups = topLevelGroups(svg);
    console.log("\n=== " + name + " (" + groups.length + " top-level groups) ===");
    const head = svg.slice(0, svg.indexOf("</svg>"));
    const openTag = svg.slice(svg.indexOf("<svg"), svg.indexOf(">") + 1);
    const defsM = svg.match(/<defs>[\s\S]*?<\/defs>/);
    const defs = defsM ? defsM[0] : "";
    for (const g of groups) {
      const isolated = openTag + defs + g.content + "</svg>";
      const bb = await bboxOf(isolated);
      if (!bb) { console.log(g.id, "EMPTY"); continue; }
      // Only report groups whose bbox intersects the header target region
      console.log(g.id, "bbox=(" + bb.minX + "," + bb.minY + ")-(" + bb.maxX + "," + bb.maxY + ")", "px=" + bb.px);
    }
    // top colors in target region
    const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const [rx0, ry0, rx1, ry1] = cfg.region;
    console.log("REGION colors:", JSON.stringify(topColors(data, info, rx0, ry0, rx1, ry1)));
  }
})().catch((e) => { console.error("ERR", e); process.exit(1); });
