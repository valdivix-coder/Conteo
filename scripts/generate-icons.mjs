// Rasterises scripts/icon-source.svg into the PWA icon set using Playwright's Chromium.
// Usage: node scripts/generate-icons.mjs   (requires `playwright` resolvable)
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = await readFile(new URL("./icon-source.svg", import.meta.url), "utf8");

const targets = [
  { file: "pwa-192.png", size: 192, scale: 1 },
  { file: "pwa-512.png", size: 512, scale: 1 },
  // Maskable: keep the mark inside the 80 % safe zone.
  { file: "pwa-maskable-512.png", size: 512, scale: 0.78 },
  { file: "apple-touch-icon.png", size: 180, scale: 0.9 },
  { file: "favicon-32.png", size: 32, scale: 1.15 }
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const page = await browser.newPage();
for (const { file, size, scale } of targets) {
  const svg = source
    .replace('transform="translate(256 256) scale(var(--scale, 1)) translate(-256 -256)"', `transform="translate(256 256) scale(${scale}) translate(-256 -256)"`)
    .replace("<svg ", `<svg width="${size}" height="${size}" `);
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  await page.screenshot({ path: `${root}public/${file}`, clip: { x: 0, y: 0, width: size, height: size } });
  console.log(`✓ public/${file}`);
}
await browser.close();
