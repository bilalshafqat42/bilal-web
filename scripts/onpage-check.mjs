/**
 * On-page SEO score for one page against one keyword, out of 100.
 *
 * Why this exists: Bilal asked for the score Yoast and Rank Math show in
 * WordPress. Those are plugins, this site is Next.js, and there is no plugin to
 * install. More to the point, those scores are a checklist written by a plugin
 * author, not a signal from Google. A green 100 in Yoast means you satisfied
 * Yoast. It does not mean you rank.
 *
 * So this is the same idea with one difference that matters: it measures the
 * **rendered** page from a live URL rather than a CMS field, which is the whole
 * method this project runs on. Eight times now a title has claimed a keyword
 * the body did not contain, and only reading the output caught it.
 *
 * The fifteen checks live in `lib/score.mjs`, shared with `daily.mjs`. They used
 * to be duplicated and drifted: on 2026-10-07 the daily report scored
 * `/pricing` at 84 while this scorer said 80.
 *
 * Usage:
 *   npm run onpage                                    every tracked page
 *   npm run onpage -- "<url>" "<keyword>"             one page, in detail
 *
 * What it cannot tell you: whether the page will rank. On-page is the half you
 * control and it is necessary rather than sufficient. Backlinks decide the
 * order. A 100 here with no links still loses to a 60 with fifty.
 */

import { checksFor, scoreOf } from "./lib/score.mjs";
import { TRACKED } from "./lib/tracked.mjs";
import { fetchPage } from "./lib/fetchPage.mjs";

const BASE = process.env.SITE_URL || "https://bilalshafqat.com";
const [, , url, keyword] = process.argv;

const fetchDoc = async (u) => {
  const res = await fetchPage(u, { headers: { "user-agent": "onpage-check" } });
  if (!res.ok) throw new Error(`${u} returned HTTP ${res.status}`);
  return res.text();
};

const verdict = (p) => (p >= 90 ? "excellent" : p >= 75 ? "good" : p >= 55 ? "needs work" : "poor");

// ─────────────────────────────────────────────── no arguments: the whole board
if (!url || !keyword) {
  console.log(`\n  ON-PAGE SCORES   ${BASE}\n`);
  console.log(`    ${"page".padEnd(40)} ${"keyword".padEnd(42)} score`);
  let worst = null;
  let failedLoads = 0;
  for (const [path, kw] of TRACKED) {
    let score;
    try {
      const { checks } = checksFor(await fetchDoc(BASE + path), kw);
      score = scoreOf(checks);
    } catch (err) {
      // Reported as a failure, not as a score of 0: a page that did not load
      // has not been measured (audit batch 3).
      failedLoads++;
      console.log(`    ${path.padEnd(40)} ${kw.padEnd(42)} FAILED  ${err.message}`);
      continue;
    }
    if (!worst || score < worst[2]) worst = [path, kw, score];
    console.log(`    ${path.padEnd(40)} ${kw.padEnd(42)} ${String(score).padStart(5)}`);
  }
  if (worst) {
    console.log(`\n  Lowest: ${worst[0]} at ${worst[2]}.`);
    console.log(`  For the detail on any one page:\n`);
    console.log(`      npm run onpage -- "${BASE}${worst[0]}" "${worst[1]}"\n`);
  }
  if (failedLoads) {
    console.error(`  ${failedLoads} page(s) did not load and were not scored.\n`);
    process.exit(2);
  }
  process.exit(0);
}

// ─────────────────────────────────────────────── one page, every check printed
let doc;
try {
  doc = await fetchDoc(url);
} catch (err) {
  console.error(`\n  Could not load the page, so it was not scored: ${err.message}\n`);
  process.exit(2);
}
const { checks } = checksFor(doc, keyword);
const pct = scoreOf(checks);
const pad = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s.padEnd(n));

console.log(`\n  ${url}`);
console.log(`  keyword: "${keyword}"\n`);
for (const c of checks) {
  const mark = c.got ? "PASS" : c.earned ? "PART" : "MISS";
  console.log(`  ${mark}  ${pad(c.name, 44)} ${String(c.earned).padStart(2)}/${String(c.max).padEnd(2)}  ${c.note}`);
}
console.log(`\n  SCORE: ${pct}/100  (${verdict(pct)})\n`);
console.log("  On-page only. This is the half you control, and it is necessary");
console.log("  rather than sufficient: backlinks decide the order between pages");
console.log("  that have all done their on-page properly.\n");

process.exit(pct >= 55 ? 0 : 1);
