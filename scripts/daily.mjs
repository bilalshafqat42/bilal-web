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

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { checksFor, scoreOf, text } from "./lib/score.mjs";
import { TRACKED } from "./lib/tracked.mjs";

/** One scorer, shared with `onpage-check.mjs`.
 *
 *  This file used to carry its own copy of the fifteen checks, with a comment
 *  saying they were "kept in step by hand". They were not: on 2026-10-07 this
 *  report scored `/pricing` at 84 while the real scorer said 80, because one
 *  copy had the partial-credit rules and the other did not. A daily report that
 *  disagrees with the tool it is summarising is worse than no report. */
const score = (doc, kw) => {
  const { checks, words } = checksFor(doc, kw);
  return { score: scoreOf(checks), words };
};

const BASE = "https://bilalshafqat.com";
const DIR = new URL("../.seo-snapshots/", import.meta.url).pathname;
const today = new Date().toISOString().slice(0, 10);

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
console.log(`    ${"page".padEnd(40)} ${"score".padStart(6)}  ${"1d".padStart(4)}  ${"7d".padStart(4)}   words`);
for (const [path] of TRACKED) {
  const p = snap.pages[path];
  console.log(
    `    ${path.padEnd(40)} ${String(p.score).padStart(6)}  ${delta(p.score, prev?.pages[path]?.score)}  ` +
    `${delta(p.score, weekAgo?.pages[path]?.score)}   ${String(p.words).padStart(5)}`
  );
}
console.log(`\n  snapshot saved to .seo-snapshots/${today}.json\n`);
