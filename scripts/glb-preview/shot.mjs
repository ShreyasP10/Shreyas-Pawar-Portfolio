import { chromium } from "@playwright/test";

/**
 * Screenshots a GLB model in the preview harness for visual tuning.
 * Usage: node scripts/glb-preview/shot.mjs <model> <cam> [rx] [ry] [rz] [scale] [x] [y] [z]
 * Start the server first: node scripts/glb-preview/server.mjs
 */
const [model, cam, rx = "0", ry = "0", rz = "0", scale = "1", x = "0", y = "0", z = "0"] = process.argv.slice(2);

if (!model || !cam) {
  console.error("usage: node scripts/glb-preview/shot.mjs <model> <cam> [rx] [ry] [rz] [scale] [x] [y] [z]");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 640, height: 640 } });
const url = `http://localhost:4444/?model=${model}&cam=${cam}&rx=${rx}&ry=${ry}&rz=${rz}&scale=${scale}&x=${x}&y=${y}&z=${z}`;
await page.goto(url);
await page.waitForTimeout(6000);
const out = `scripts/glb-preview/shots/${model}-${cam}-${rx}-${ry}-${rz}-${scale}.png`;
await page.screenshot({ path: out });
console.log("saved", out);
await browser.close();
