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
 *         SITE_URL=http://localhost:3000 npm run daily
 *
 * Against any SITE_URL other than production, snapshots go to a temporary
 * folder (printed at the end) unless SEO_SNAPSHOT_DIR says otherwise, so a
 * local test run never lands in the production history and skews tomorrow's
 * diff.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checksFor, scoreOf, text, mainOf, mainText, wordCount } from "./lib/score.mjs";
import { TRACKED } from "./lib/tracked.mjs";
import { fetchPage } from "./lib/fetchPage.mjs";

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

const PROD = "https://bilalshafqat.com";
const BASE = (process.env.SITE_URL || PROD).replace(/\/$/, "");
const DIR = process.env.SEO_SNAPSHOT_DIR
  ? join(process.env.SEO_SNAPSHOT_DIR, "/")
  : BASE === PROD
    ? new URL("../.seo-snapshots/", import.meta.url).pathname
    : join(mkdtempSync(join(tmpdir(), "seo-snapshots-")), "/");
// Dubai date, not UTC: a run before 4am Dubai time used to be filed under
// yesterday and overwrite yesterday's snapshot.
const dubaiDate = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai" }).format(d);
const today = dubaiDate(new Date());

// ────────────────────────────────────────────────────────── measure
const sitemap = await (await fetchPage(`${BASE}/sitemap.xml`)).text();
// The sitemap lists canonical (production) URLs. Fetch the same paths from
// BASE, so a SITE_URL run measures that server and not the live site.
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => BASE + new URL(m[1]).pathname);
if (!urls.length) {
  // Without this, an unreachable sitemap produced a "report" of 0 pages and
  // NaN average words, saved as if it were a real reading.
  console.error(`No URLs in ${BASE}/sitemap.xml. Nothing measured, no snapshot written.`);
  process.exit(1);
}

let totalWords = 0, thin = 0, broken = 0, longTitles = 0;
for (const url of urls) {
  const res = await fetchPage(url);
  if (!res.ok) { broken++; continue; }
  const doc = await res.text();
  const w = wordCount(mainText(mainOf(doc)));
  totalWords += w;
  if (w < 800) thin++;
  const t = text(doc.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  if (t.length > 60) longTitles++;
}

const pages = {};
for (const [path, kw] of TRACKED) {
  const res = await fetchPage(BASE + path);
  // null, not 0, when the page did not load: a 0 read as a 90-point drop in
  // tomorrow's diff, and as a 90-point recovery the day after.
  pages[path] = res.ok ? { kw, ...score(await res.text(), kw) } : { kw, score: null, words: null };
}

const loaded = urls.length - broken;
const snap = {
  date: today,
  site: { pages: urls.length, thin, broken, longTitles, avgWords: loaded ? Math.round(totalWords / loaded) : null },
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
// The newest snapshot at least 7 days old. The old cut-off was 6 days, so the
// "7d" column was really a 6-day comparison.
const sevenBack = new Date(Date.parse(`${today}T00:00:00Z`) - 7 * 864e5).toISOString().slice(0, 10);
const weekAgoName = files.filter((f) => f.slice(0, 10) <= sevenBack).pop();
const weekAgo = weekAgoName ? load(weekAgoName) : null;

const delta = (now, then) => {
  if (now === undefined || now === null) return "  --";
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
  console.log(`    ${label.padEnd(20)} ${String(val ?? "n/c").padStart(6)}  ${delta(val, prev?.site[k])}  ${delta(val, weekAgo?.site[k])}`);
});

console.log("\n  PAGE SCORES");
console.log(`    ${"page".padEnd(40)} ${"score".padStart(6)}  ${"1d".padStart(4)}  ${"7d".padStart(4)}   words`);
for (const [path] of TRACKED) {
  const p = snap.pages[path];
  // A page that did not load today is "not checked", never a drop.
  console.log(
    `    ${path.padEnd(40)} ${String(p.score ?? "n/c").padStart(6)}  ${delta(p.score, prev?.pages[path]?.score)}  ` +
    `${delta(p.score, weekAgo?.pages[path]?.score)}   ${String(p.words ?? "").padStart(5)}${p.score === null ? "   not checked (did not load)" : ""}`
  );
}
console.log(`\n  snapshot saved to ${DIR}${today}.json\n`);
