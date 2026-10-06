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

const BASE = (process.argv[2] || "https://bilalshafqat.com").replace(/\/$/, "");

const strip = (s) => s.replace(/<[^>]+>/g, " ");
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&[a-z]+;/g, " ");
const text = (s) => decode(strip(s)).replace(/\s+/g, " ").trim();

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.error(`Auditing ${urls.length} URLs from the sitemap…`);

const rows = [];
for (const url of urls) {
  const res = await fetch(url);
  const path = url.replace(BASE, "") || "/";
  if (!res.ok) {
    rows.push({ path, status: res.status });
    continue;
  }
  const doc = await res.text();
  const main = doc.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";
  const body = text(main.replace(/<script[\s\S]*?<\/script>/g, ""));
  const title = text(doc.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  const desc = decode(doc.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  rows.push({
    path,
    status: 200,
    words: body.split(/\s+/).filter(Boolean).length,
    title,
    titleLen: title.length,
    descLen: desc.length,
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
console.log("");
