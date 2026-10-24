/**
 * Shared rules for the pre-generated image variants (roadmap 419).
 *
 * Used by `scripts/image-variants.mjs` (writes the files) and
 * `scripts/image-variants-check.mjs` (fails CI when they are missing or out of
 * date). Node built-ins only, so the check runs without sharp.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const ROOT = path.resolve(import.meta.dirname, "../..");
export const PUBLIC = path.join(ROOT, "public");
export const MANIFEST = path.join(ROOT, "src/data/imageVariants.json");

/** Folders whose raster images are served through next/image. */
export const SCOPE = ["portfolio", "images", "blog"];

/**
 * Widths to cut, matching `deviceSizes` + `imageSizes` in next.config.ts so
 * every srcset entry has an exact file. 128 is left out: nothing raster is
 * shown that small, and the loader rounds it up to 256.
 */
export const WIDTHS = [256, 384, 640, 800, 1080, 1280, 1600];

/**
 * AVIF quality 47 at effort 6. 47 is exactly what Next's optimiser used (its
 * default 75, scaled by 50/80), so the look matches what visitors already get.
 * Effort 6 instead of Next's 3 makes files 2-9% smaller at the same quality,
 * affordable because this runs once rather than per request. Quality 50 was
 * tried first and came out 5-10% heavier than the live images.
 * Changing any value here changes every hash, so every URL changes with it and
 * Cloudflare can never serve a variant cut with the old settings.
 */
export const ENCODE = { quality: 47, effort: 6 };
const SETTINGS = `v2 avif q${ENCODE.quality} e${ENCODE.effort} full-width`;

/** A variant must be at least this much smaller than the next size up to be kept. */
export const MIN_SAVING = 0.1;

const RASTER = /\.(avif|jpe?g|png|webp)$/i;
/** Variant files themselves: `name.640w.avif`. */
export const VARIANT_RE = /\.\d+w\.avif$/;

/** Every in-scope source image, as a public URL path (`/portfolio/...`). */
export function sources() {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      // `og-*` files are social-share cards set in metadata, never rendered
      // through next/image, so cutting variants for them would be dead weight.
      else if (RASTER.test(e.name) && !VARIANT_RE.test(e.name) && !e.name.startsWith("og-")) {
        out.push("/" + path.relative(PUBLIC, full).split(path.sep).join("/"));
      }
    }
  };
  for (const s of SCOPE) if (fs.existsSync(path.join(PUBLIC, s))) walk(path.join(PUBLIC, s));
  return out.sort();
}

/** Every variant file on disk, as public URL paths. */
export function variantFiles() {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (VARIANT_RE.test(e.name)) out.push("/" + path.relative(PUBLIC, full).split(path.sep).join("/"));
    }
  };
  for (const s of SCOPE) if (fs.existsSync(path.join(PUBLIC, s))) walk(path.join(PUBLIC, s));
  return out.sort();
}

/** `/portfolio/a/b.jpg`, 640 -> `/portfolio/a/b.640w.avif`. Mirrored in src/lib/imageLoader.ts. */
export function variantPath(src, width) {
  return src.replace(/\.[^./]+$/, `.${width}w.avif`);
}

/** Content hash of the source plus the encode settings: the `?v=` on every URL. */
export function hashOf(src) {
  const h = crypto.createHash("sha256");
  h.update(SETTINGS);
  h.update(fs.readFileSync(path.join(PUBLIC, src)));
  return h.digest("hex").slice(0, 8);
}

export function readManifest() {
  return fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
}
