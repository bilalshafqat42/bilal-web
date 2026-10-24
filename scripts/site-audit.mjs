/**
 * Whole-site on-page audit: every URL in the sitemap, measured from the
 * rendered page.
 *
 * Complements `onpage-check.mjs`, which scores one page against one keyword.
 * This one answers the question that scorer cannot: which pages are thin, which
 * titles will be truncated, which descriptions are the wrong length, and which
 * pages have no subheadings at all.
 *
 * Counts inside `<main>`, for the reason recorded in roadmap 341: the mega menu
 * repeats fifteen service names on every page, so a whole-document count makes
 * every page look like it covers everything.
 *
 * Usage:  npm run audit
 *         npm run audit -- http://localhost:3000
 */

// Same width table as `npm run serp`, so the two never disagree about a cut.
import { px, DESC_SIZE, DESC_LIMIT } from "./lib/serpWidth.mjs";
import { fetchPage } from "./lib/fetchPage.mjs";
// One decode for every measuring script (audit batch 3): this file had its own
// copy, which turned React's `&#x27;` apostrophe into a space.
import { text, decode, mainOf, mainText, wordCount } from "./lib/score.mjs";

const BASE = (process.argv[2] || "https://bilalshafqat.com").replace(/\/$/, "");

const sitemap = await (await fetchPage(`${BASE}/sitemap.xml`)).text();
// The sitemap lists canonical production URLs whatever server serves it. Fetch
// each path from BASE, as h1-check does, so `npm run audit -- http://localhost:3000`
// audits localhost. Until audit batch 3 it read localhost's sitemap and then
// audited the live site.
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (!paths.length) {
  console.error(`No URLs in ${BASE}/sitemap.xml. Nothing audited.`);
  process.exit(1);
}
console.error(`Auditing ${paths.length} URLs from the sitemap, fetched from ${BASE}…`);

const rows = [];
for (const path of paths) {
  const res = await fetchPage(BASE + path);
  if (!res.ok) {
    rows.push({ path, status: res.status });
    continue;
  }
  const doc = await res.text();
  const main = mainOf(doc);
  const body = mainText(main);
  const title = text(doc.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  const desc = decode(doc.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  rows.push({
    path,
    status: 200,
    words: wordCount(body),
    title,
    titleLen: title.length,
    descLen: desc.length,
    descPx: Math.round(px(desc, DESC_SIZE)),
    h2: (main.match(/<h2[\s>]/g) || []).length,
    h3: (main.match(/<h3[\s>]/g) || []).length,
    schema: /application\/ld\+json/.test(doc),
  });
}

const ok = rows.filter((r) => r.status === 200);
console.log("\n=== THIN PAGES (under 800 words in <main>) ===");
const thin = ok.filter((r) => r.words < 800).sort((a, b) => a.words - b.words);
for (const r of thin) console.log(`  ${String(r.words).padStart(5)}w  ${r.path}`);
console.log(`  ${thin.length} of ${ok.length} pages`);

console.log("\n=== TITLES OVER 60 CHARACTERS (Google truncates) ===");
const long = ok.filter((r) => r.titleLen > 60).sort((a, b) => b.titleLen - a.titleLen);
for (const r of long) console.log(`  ${String(r.titleLen).padStart(3)}  ${r.path}\n       "${r.title}"`);
if (!long.length) console.log("  none");

console.log("\n=== META DESCRIPTIONS OUTSIDE 120-160 CHARACTERS ===");
const badDesc = ok.filter((r) => r.descLen < 120 || r.descLen > 160).sort((a, b) => a.descLen - b.descLen);
for (const r of badDesc) console.log(`  ${String(r.descLen).padStart(3)}  ${r.path}`);
if (!badDesc.length) console.log("  none");

// By width as well as length: a 150-character description full of capitals
// and "m"s runs past the two-line cut that a 150-character one in lower case
// clears. 64 pages passed the character check above on 2026-10-19 and were
// still truncated in the result.
console.log(`\n=== META DESCRIPTIONS WIDER THAN ${DESC_LIMIT}px (truncated in Google) ===`);
const wideDesc = ok.filter((r) => r.descPx > DESC_LIMIT).sort((a, b) => b.descPx - a.descPx);
for (const r of wideDesc) console.log(`  ${String(r.descPx).padStart(4)}px  ${r.path}`);
if (!wideDesc.length) console.log("  none");

console.log("\n=== PAGES WITH NO <h2> ===");
const noH2 = ok.filter((r) => r.h2 === 0);
for (const r of noH2) console.log(`  ${r.path}`);
if (!noH2.length) console.log("  none");

console.log("\n=== PAGES WITH NO STRUCTURED DATA ===");
const noSchema = ok.filter((r) => !r.schema);
for (const r of noSchema) console.log(`  ${r.path}`);
if (!noSchema.length) console.log("  none");

const broken = rows.filter((r) => r.status !== 200);
console.log("\n=== NON-200 RESPONSES ===");
for (const r of broken) console.log(`  ${r.status}  ${r.path}`);
if (!broken.length) console.log("  none");

const words = ok.map((r) => r.words).sort((a, b) => a - b);
const median = words[Math.floor(words.length / 2)];
console.log(`\n=== SUMMARY ===`);
console.log(`  pages            ${ok.length}`);
console.log(`  median words     ${median}`);
console.log(`  thinnest         ${words[0]}`);
console.log(`  fattest          ${words[words.length - 1]}`);
console.log(`  under 800 words  ${thin.length}`);
console.log(`  titles too long  ${long.length}`);
console.log(`  descriptions off ${badDesc.length}`);
console.log(`  descriptions wide ${wideDesc.length}`);
console.log(`  non-200          ${broken.length}`);
console.log("");

// A broken page is a failure, not a line in a report nobody scrolls to.
if (broken.length) process.exit(1);
