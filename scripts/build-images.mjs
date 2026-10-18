// Pre-builds responsive WebP copies of the local photos into public/_img/, one per width that
// next/image asks for (see `images.imageSizes` / `deviceSizes` in next.config.ts, and
// src/lib/imageLoader.ts). This replaces Vercel Image Optimization, which is a paid quota.
// Runs before `next build` (npm "prebuild") and skips copies that are already up to date.
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..", "public");
const OUT = path.join(ROOT, "_img");
const DIRS = ["products", "flakes", "metallics", "fuzion", "solids", "photos"];
const FILES = ["logo.png"];
// Keep in sync with IMAGE_WIDTHS in src/lib/imageLoader.ts and next.config.ts.
const WIDTHS = [64, 128, 256, 384, 640, 828, 1080, 1600];
const SOURCE = /\.(jpe?g|png|webp)$/i;

async function sources() {
  const list = [...FILES];
  for (const dir of DIRS) {
    for (const name of await readdir(path.join(ROOT, dir))) if (SOURCE.test(name)) list.push(`${dir}/${name}`);
  }
  return list;
}

async function isFresh(out, srcTime) {
  try {
    return (await stat(out)).mtimeMs >= srcTime;
  } catch {
    return false;
  }
}

async function build(rel) {
  const src = path.join(ROOT, rel);
  const srcTime = (await stat(src)).mtimeMs;
  const base = rel.replace(SOURCE, "");
  await mkdir(path.dirname(path.join(OUT, base)), { recursive: true });
  let made = 0;
  for (const width of WIDTHS) {
    const out = path.join(OUT, `${base}-${width}.webp`);
    if (await isFresh(out, srcTime)) continue;
    await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 72, effort: 4 }).toFile(out);
    made++;
  }
  return made;
}

const files = await sources();
let made = 0;
for (let i = 0; i < files.length; i += 8) {
  made += (await Promise.all(files.slice(i, i + 8).map(build))).reduce((a, b) => a + b, 0);
}
console.log(`build-images: ${files.length} photos, ${made} WebP copies written to public/_img`);
