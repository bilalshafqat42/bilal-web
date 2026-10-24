/**
 * Cuts smaller AVIF copies of every image under public/portfolio, public/images
 * and public/blog, and records them in src/data/imageVariants.json for the
 * custom next/image loader (src/lib/imageLoader.ts). Roadmap 419.
 *
 * Why: /_next/image is bypassed at Cloudflare (it ignores `Vary: Accept`), so
 * every visitor waited for our Hostinger CPU to re-encode an image that was
 * already optimised, often into a bigger file (Texdale: 348 KB source, 489 KB
 * out, 2.4-4.8 s). Plain files in /public are cached at Cloudflare's edge. With
 * pre-cut widths the srcset points at static, cacheable URLs and phones still
 * get phone-sized files.
 *
 * Run after adding or replacing an image, then commit the new files and the
 * manifest:
 *
 *   npm run image-variants
 *
 * Unchanged sources are skipped, so a rerun is quick. `npm run image-check`
 * (in CI) fails if this was forgotten.
 *
 * Note: originals are never modified. Replacing one in place is still safe,
 * because the `?v=` hash on every URL changes with the file's contents.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  PUBLIC, MANIFEST, WIDTHS, ENCODE, MIN_SAVING,
  sources, variantFiles, variantPath, hashOf, readManifest,
} from "./lib/imageVariants.mjs";

// HEIF (and so AVIF) cannot encode a side longer than 16384px. Every variant
// here is narrower than its source, so this only guards a future tall capture.
const HEIF_MAX = 16384;

const old = readManifest();
const next = {};
const force = process.argv.includes("--force");
let made = 0, skipped = 0;

for (const src of sources()) {
  const file = path.join(PUBLIC, src);
  const hash = hashOf(src);
  const prev = old[src];
  if (!force && prev && prev.v === hash && prev.widths.every((w) => fs.existsSync(path.join(PUBLIC, variantPath(src, w))))) {
    next[src] = prev;
    skipped++;
    continue;
  }

  const meta = await sharp(file).metadata();
  const width = meta.width, height = meta.height;
  const sourceBytes = fs.statSync(file).size;

  // Largest first: each variant must undercut the next size up by MIN_SAVING,
  // or it is a near-duplicate that only adds a file to download and cache.
  //
  // Every source is also tried at its own width. A JPG/PNG always wins there
  // (AVIF is a fraction of the size). Many "hand-optimised" AVIFs win too: they
  // were saved at a higher quality than the site displays, so at full width
  // Next's re-encode was smaller (the Cavendish capture: 392 KB original,
  // 222 KB at quality 47). Where the original is already the smaller file, as
  // with Texdale's capture, the original stays the top of the ladder.
  const targets = [width, ...WIDTHS.filter((w) => w < width).sort((a, b) => b - a)];
  const kept = [];
  let ceiling = sourceBytes;
  for (const w of targets) {
    const h = Math.round((height * w) / width);
    if (h > HEIF_MAX) { console.warn(`  skip ${src} @${w}: ${h}px tall exceeds AVIF max`); continue; }
    const buf = await sharp(file).rotate().resize(w).avif(ENCODE).toBuffer();
    if (buf.length > ceiling * (1 - MIN_SAVING)) continue;
    fs.writeFileSync(path.join(PUBLIC, variantPath(src, w)), buf);
    kept.push(w);
    ceiling = buf.length;
    made++;
  }

  // Remove variants from an earlier cut that this one did not keep.
  for (const w of prev?.widths ?? []) {
    if (!kept.includes(w)) fs.rmSync(path.join(PUBLIC, variantPath(src, w)), { force: true });
  }

  next[src] = { w: width, v: hash, widths: kept.sort((a, b) => a - b) };
  console.log(`  ${src}  ${width}x${height}  -> ${kept.length ? kept.join(", ") : "none"}`);
}

// Variants whose source was deleted, renamed or moved out of scope.
const wanted = new Set(Object.entries(next).flatMap(([src, e]) => e.widths.map((w) => variantPath(src, w))));
let removed = 0;
for (const f of variantFiles()) {
  if (!wanted.has(f)) { fs.rmSync(path.join(PUBLIC, f)); removed++; }
}

const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 1) + "\n");
console.log(`\n${Object.keys(sorted).length} sources, ${made} variants written, ${skipped} unchanged, ${removed} stale removed.`);
console.log(`Manifest: ${path.relative(process.cwd(), MANIFEST)}`);
