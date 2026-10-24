/**
 * Fails when the pre-cut image variants (roadmap 419) and the manifest the
 * loader reads have drifted from public/:
 *
 *   - an image in scope with no manifest entry (added, script not run)
 *   - a source whose contents changed since its variants were cut
 *   - a manifest entry whose source or any variant file is missing
 *   - a variant file nothing points at
 *
 * The loader only emits URLs listed in the manifest, so when this passes every
 * srcset entry on the site is a file that exists. Node built-ins only.
 *
 * Fix any failure with `npm run image-variants`, then commit what it writes.
 */
import fs from "node:fs";
import path from "node:path";
import { PUBLIC, sources, variantFiles, variantPath, hashOf, readManifest } from "./lib/imageVariants.mjs";

const manifest = readManifest();
const problems = [];
const all = sources();

for (const src of all) {
  const e = manifest[src];
  if (!e) { problems.push(`no variants for ${src}`); continue; }
  if (e.v !== hashOf(src)) problems.push(`${src} changed since its variants were cut`);
  for (const w of e.widths) {
    if (!fs.existsSync(path.join(PUBLIC, variantPath(src, w)))) problems.push(`missing ${variantPath(src, w)}`);
  }
}
for (const src of Object.keys(manifest)) {
  if (!all.includes(src)) problems.push(`manifest lists ${src}, which is not in public/ (or is out of scope)`);
}
const wanted = new Set(Object.entries(manifest).flatMap(([src, e]) => e.widths.map((w) => variantPath(src, w))));
for (const f of variantFiles()) if (!wanted.has(f)) problems.push(`orphan variant ${f}`);

if (problems.length) {
  console.error(`Image variants out of date (${problems.length}):`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error("\nRun `npm run image-variants` and commit the files it writes.");
  process.exit(1);
}
const count = Object.values(manifest).reduce((n, e) => n + e.widths.length, 0);
console.log(`Image variants OK: ${all.length} sources, ${count} variant files, all present and current.`);
