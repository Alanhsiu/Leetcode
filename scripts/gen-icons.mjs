// Generate the favicon / app-icon set from src/assets/icon-master.svg.
// Run once (and re-run if the master SVG changes): `node scripts/gen-icons.mjs`.
// Outputs are committed to public/ so the build itself needs no image step.
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const master = join(root, "src/assets/icon-master.svg");
const pub = join(root, "public");

const svg = await readFile(master);

const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png();

const targets = [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["favicon-48x48.png", 48],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["icon-maskable-512.png", 512],
];

for (const [name, size] of targets) {
  await png(size).toFile(join(pub, name));
  console.log("wrote", name, `${size}x${size}`);
}

// Multi-resolution favicon.ico (16/32/48) for legacy + Google.
const icoSizes = [16, 32, 48];
const icoBufs = await Promise.all(icoSizes.map((s) => png(s).toBuffer()));
await writeFile(join(pub, "favicon.ico"), await pngToIco(icoBufs));
console.log("wrote favicon.ico", icoSizes.join("/"));
