/**
 * The daily report: measure everything, save it, and diff it against yesterday
 * and against a week ago.
 *
 * Bilal asked for a constant report rather than a one-off audit, because the
 * number that matters in SEO is almost never today's figure. It is the
 * direction of travel, and you cannot see direction from a single reading.
 *
 * Snapshots are written to `.seo-snapshots/YYYY-MM-DD.json`, which is
 * gitignored: these are measurements of a live site, not source, and committing
 * one a day would add a year of noise to the history for no benefit.
 *
 * Usage:  npm run daily
 *         npm run daily -- --json      (machine-readable, no diff)
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";

const BASE = "https://bilalshafqat.com";
const DIR = new URL("../.seo-snapshots/", import.meta.url).pathname;
const today = new Date().toISOString().slice(0, 10);

/** The pages worth tracking daily, with the keyword each is built for. */
const TRACKED = [
  ["/", "freelance digital marketer in dubai"],
  ["/services/mobile-app-development", "mobile app development dubai"],
  ["/services/web-design", "web designer dubai"],
  ["/services/digital-marketing", "digital marketing in dubai"],
  ["/services/social-media-marketing", "social media marketing in dubai"],
  ["/services/seo", "seo consultant dubai"],
  ["/services/google-ads", "google ads agency dubai"],
  ["/services/graphic-design-branding", "graphic design in dubai"],
  ["/pricing", "freelance digital marketer costs in dubai"],
  ["/portfolio", "digital marketing portfolio dubai"],
];

const strip = (s) => s.replace(/<[^>]+>/g, " ");
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
   .replace(/&[a-z]+;/g, " ");
const text = (s) => decode(strip(s)).replace(/\s+/g, " ").trim();

/** The same fifteen factors `onpage-check.mjs` scores, kept in step by hand.
 *  Duplicated rather than imported because that script prints rather than
 *  exports, and refactoring it would mean touching a tool that works. */
function score(doc, kw) {
  const main = doc.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";
  const body = text(main.replace(/<script[\s\S]*?<\/script>/g, ""));
  const low = body.toLowerCase();
  const words = body.split(/\s+/).filter(Boolean);
  const title = text(doc.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  const desc = decode(doc.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  const h1s = [...main.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1]));
  const subs = [...main.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map((m) => text(m[1]));
  const alts = [...main.matchAll(/<img[^>]*alt="([^"]*)"/g)].map((m) => m[1].toLowerCase());
  const internal = [...main.matchAll(/<a[^>]*href="(\/[^"]*)"/g)].length;
  const first100 = words.slice(0, 100).join(" ").toLowerCase();
  // Stop-word tolerant, matching onpage-check.mjs. A page saying "mobile app
  // development in Dubai" satisfies the keyword "mobile app development dubai";
  // literal matching marked it down for being written in English.
  const STOP = "(?:in|for|the|a|an|at|of|and|to|on)";
  const esc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pat = kw.trim().split(/\s+/).map(esc).join(`\\s+(?:${STOP}\\s+)?`);
  const kwRe = new RegExp(pat, "i");
  const count = (low.match(new RegExp(pat, "gi")) || []).length;
  const density = words.length ? (count * kw.split(/\s+/).length * 100) / words.length : 0;

  const checks = [
    [12, kwRe.test(title)],
    [4, kwRe.test(title.slice(0, kw.length + 8))],
    [4, title.length > 0 && title.length <= 60],
    [8, kwRe.test(desc)],
    [4, desc.length >= 120 && desc.length <= 160],
    [14, h1s.some((h) => kwRe.test(h))],
    [4, h1s.length === 1],
    [8, subs.some((h) => kwRe.test(h))],
    [8, kwRe.test(first100)],
    [8, count >= 2, count === 1 ? 0.5 : 0],
    [5, density >= 0.3 && density <= 2.5],
    [9, words.length >= 800, words.length >= 400 ? 0.5 : 0],
    [4, alts.some((a) => kwRe.test(a))],
    [4, internal >= 3],
    [4, /application\/ld\+json/.test(doc)],
  ];
  const total = checks.reduce((n, c) => n + c[0], 0);
  const got = checks.reduce((n, c) => n + (c[1] ? c[0] : Math.round(c[0] * (c[2] ?? 0))), 0);
  return { score: Math.round((got / total) * 100), words: words.length };
}

// ────────────────────────────────────────────────────────── measure
const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

let totalWords = 0, thin = 0, broken = 0, longTitles = 0;
for (const url of urls) {
  const res = await fetch(url);
  if (!res.ok) { broken++; continue; }
  const doc = await res.text();
  const main = doc.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "";
  const w = text(main.replace(/<script[\s\S]*?<\/script>/g, "")).split(/\s+/).filter(Boolean).length;
  totalWords += w;
  if (w < 800) thin++;
  const t = text(doc.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  if (t.length > 60) longTitles++;
}

const pages = {};
for (const [path, kw] of TRACKED) {
  const res = await fetch(BASE + path);
  pages[path] = res.ok ? { kw, ...score(await res.text(), kw) } : { kw, score: 0, words: 0 };
}

const snap = {
  date: today,
  site: { pages: urls.length, thin, broken, longTitles, avgWords: Math.round(totalWords / urls.length) },
  pages,
};

mkdirSync(DIR, { recursive: true });
writeFileSync(`${DIR}${today}.json`, JSON.stringify(snap, null, 2));

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(snap, null, 2));
  process.exit(0);
}

// ────────────────────────────────────────────────────────── compare
const files = readdirSync(DIR).filter((f) => f.endsWith(".json") && f !== `${today}.json`).sort();
const load = (f) => JSON.parse(readFileSync(DIR + f, "utf8"));
const prev = files.length ? load(files[files.length - 1]) : null;
const weekAgoName = files.filter((f) => f.slice(0, 10) <= new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10)).pop();
const weekAgo = weekAgoName ? load(weekAgoName) : null;

const delta = (now, then) => {
  if (then === undefined || then === null) return "    ";
  const d = now - then;
  if (d === 0) return "   ·";
  return `${d > 0 ? "+" : ""}${d}`.padStart(4);
};

console.log(`\n  DAILY SEO REPORT   ${today}`);
console.log(`  ${prev ? `vs ${prev.date}` : "no previous snapshot"}${weekAgo && weekAgo.date !== prev?.date ? `   ·   vs ${weekAgo.date}` : ""}\n`);

console.log("  SITE");
const siteRows = [
  ["pages", snap.site.pages], ["average words", snap.site.avgWords],
  ["pages under 800w", snap.site.thin], ["titles over 60", snap.site.longTitles],
  ["broken", snap.site.broken],
];
const siteKeys = ["pages", "avgWords", "thin", "longTitles", "broken"];
siteRows.forEach(([label, val], i) => {
  const k = siteKeys[i];
  console.log(`    ${label.padEnd(20)} ${String(val).padStart(6)}  ${delta(val, prev?.site[k])}  ${delta(val, weekAgo?.site[k])}`);
});

console.log("\n  PAGE SCORES");
console.log(`    ${"page".padEnd(38)} ${"score".padStart(6)}  ${"1d".padStart(4)}  ${"7d".padStart(4)}   words`);
for (const [path] of TRACKED) {
  const p = snap.pages[path];
  console.log(
    `    ${path.padEnd(38)} ${String(p.score).padStart(6)}  ${delta(p.score, prev?.pages[path]?.score)}  ` +
    `${delta(p.score, weekAgo?.pages[path]?.score)}   ${String(p.words).padStart(5)}`
  );
}
console.log(`\n  snapshot saved to .seo-snapshots/${today}.json\n`);
