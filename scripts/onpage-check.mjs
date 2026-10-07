/**
 * On-page SEO score for one page against one keyword, out of 100.
 *
 * Why this exists: Bilal asked for the score Yoast and Rank Math show in
 * WordPress. Those are plugins, this site is Next.js, and there is no plugin to
 * install. More to the point, those scores are a checklist written by a plugin
 * author, not a signal from Google. A green 100 in Yoast means you satisfied
 * Yoast. It does not mean you rank.
 *
 * So this is the same idea with two differences that matter here. It measures
 * the **rendered** page from a running server rather than a CMS field, which is
 * the whole method this project runs on: four times in two days a title has
 * claimed a keyword the body did not contain, and only reading the output
 * caught it. And it scores inside `<main>`, because the mega menu repeats all
 * fifteen service names on every page and a whole-document count says every
 * keyword is covered everywhere (roadmap 341).
 *
 * Usage:
 *   node scripts/onpage-check.mjs "<url>" "<keyword>"
 *   node scripts/onpage-check.mjs https://bilalshafqat.com/ "freelance digital marketer in dubai"
 *
 * What it cannot tell you: whether the page will rank. On-page is the half you
 * control and it is necessary rather than sufficient. Backlinks decide the
 * order. A 100 here with no links still loses to a 60 with fifty.
 */

const [, , url, keyword] = process.argv;
if (!url || !keyword) {
  console.error('Usage: node scripts/onpage-check.mjs "<url>" "<keyword>"');
  process.exit(1);
}

const kw = keyword.toLowerCase().trim();
const res = await fetch(url, { headers: { "user-agent": "onpage-check" } });
if (!res.ok) {
  console.error(`${url} returned HTTP ${res.status}`);
  process.exit(1);
}
const doc = await res.text();

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

const main = doc.match(/<main[\s\S]*?<\/main>/)?.[0] ?? doc;
const mainNoScript = main.replace(/<script[\s\S]*?<\/script>/g, "");
const body = text(mainNoScript);
const low = body.toLowerCase();
const words = body.split(/\s+/).filter(Boolean);

const title = text(doc.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
const desc = decode(doc.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
const h1s = [...main.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1]));
const subs = [...main.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map((m) => text(m[1]));
const alts = [...main.matchAll(/<img[^>]*alt="([^"]*)"/g)].map((m) => m[1].toLowerCase());
const internal = [...main.matchAll(/<a[^>]*href="(\/[^"]*)"/g)].map((m) => m[1]);
const hasSchema = /<script type="application\/ld\+json">/.test(doc);

/**
 * Match a keyword the way a search engine does, not the way `includes` does.
 *
 * Added 2026-10-06 after this scorer reported `/services/mobile-app-development`
 * at 29/100 for "mobile app development dubai" on a page whose title, h1 and
 * intro all said "mobile app development **in** Dubai". Google handles that
 * stop word; literal string matching does not, and the page was being marked
 * down for being written in English.
 *
 * The fix allows an optional stop word between any two keyword terms rather
 * than stripping stop words from both sides, which would make "marketing in
 * Dubai" match "marketing Dubai agency" and report a pass that is not real.
 */
const STOP = "(?:in|for|the|a|an|at|of|and|to|on)";

/**
 * The separator allowed between two keyword terms.
 *
 * Whitespace, optionally one stop word, **or a slash or hyphen**.
 *
 * The slash was added 2026-10-07 after this scorer reported
 * `/services/ui-ux-design` at 29/100 for "ui ux designer dubai" on a page whose
 * title and h1 both say "UI/UX Designer in Dubai". Google treats `UI/UX` and
 * `UI UX` as the same thing; splitting the keyword on whitespace and then
 * demanding whitespace in the page does not, and the page was marked down for
 * punctuation. Same class of bug as the stop-word one below it: the tool was
 * wrong, not the page.
 *
 * Hyphens for the same reason — "e-commerce", "cross-platform".
 */
const SEP = `(?:\\s+(?:${STOP}\\s+)?|\\s*[/-]\\s*)`;
const escape = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function kwPattern(kw) {
  return kw.trim().split(/\s+/).map(escape).join(SEP);
}
function kwRegex(kw) {
  return new RegExp(kwPattern(kw), "i");
}
/** How many times the keyword appears, stop words and slashes allowed between
 *  terms. */
function kwCount(hay, kw) {
  return (hay.match(new RegExp(kwPattern(kw), "gi")) || []).length;
}

const first100 = words.slice(0, 100).join(" ").toLowerCase();
const count = kwCount(low, kw);
const density = words.length ? (count * kw.split(/\s+/).length * 100) / words.length : 0;

/** Each check scores `max` when `got` is true, or `part` of it when `partial`. */
const checks = [
  {
    name: "Keyword in <title>",
    max: 12,
    got: kwRegex(kw).test(title),
    note: title ? `"${title}"` : "no title",
  },
  {
    name: "Keyword at the START of <title>",
    max: 4,
    got: kwRegex("^\\s*" + kw).test(title) || kwRegex(kw).test(title.slice(0, kw.length + 6)),
    note: "Google weights the opening words",
  },
  {
    name: "<title> 60 characters or fewer",
    max: 4,
    got: title.length > 0 && title.length <= 60,
    note: `${title.length} chars`,
  },
  {
    name: "Keyword in meta description",
    max: 8,
    got: kwRegex(kw).test(desc),
    note: desc ? "" : "no description",
  },
  {
    name: "Meta description 120-160 characters",
    max: 4,
    got: desc.length >= 120 && desc.length <= 160,
    note: `${desc.length} chars`,
  },
  {
    name: "Keyword in <h1>",
    max: 14,
    got: h1s.some((h) => kwRegex(kw).test(h)),
    note: h1s[0] ? `"${h1s[0]}"` : "no h1",
  },
  {
    name: "Exactly one <h1>",
    max: 4,
    got: h1s.length === 1,
    note: `${h1s.length} found`,
  },
  {
    name: "Keyword in an <h2> or <h3>",
    max: 8,
    got: subs.some((h) => kwRegex(kw).test(h)),
    note: `${subs.length} subheadings`,
  },
  {
    name: "Keyword in the first 100 words",
    max: 8,
    got: kwRegex(kw).test(first100),
    note: "",
  },
  {
    name: "Keyword appears at least twice in the body",
    max: 8,
    got: count >= 2,
    partial: count === 1 ? 0.5 : 0,
    note: `${count} occurrence${count === 1 ? "" : "s"}`,
  },
  {
    name: "Keyword density between 0.3% and 2.5%",
    max: 5,
    got: density >= 0.3 && density <= 2.5,
    note: `${density.toFixed(2)}%${density > 2.5 ? " - too high, reads as stuffing" : ""}`,
  },
  {
    name: "At least 800 words in <main>",
    max: 9,
    got: words.length >= 800,
    partial: words.length >= 400 ? 0.5 : 0,
    note: `${words.length} words`,
  },
  {
    name: "Keyword in an image alt",
    max: 4,
    got: alts.some((a) => kwRegex(kw).test(a)),
    note: `${alts.length} images with alt`,
  },
  {
    name: "At least 3 internal links",
    max: 4,
    got: internal.length >= 3,
    note: `${internal.length} internal links`,
  },
  {
    name: "Structured data present",
    max: 4,
    got: hasSchema,
    note: "",
  },
];

let score = 0;
const total = checks.reduce((n, c) => n + c.max, 0);
const pad = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s.padEnd(n));

console.log(`\n  ${url}`);
console.log(`  keyword: "${keyword}"\n`);
for (const c of checks) {
  const earned = c.got ? c.max : Math.round(c.max * (c.partial ?? 0));
  score += earned;
  const mark = c.got ? "PASS" : earned ? "PART" : "MISS";
  console.log(`  ${mark}  ${pad(c.name, 44)} ${String(earned).padStart(2)}/${String(c.max).padEnd(2)}  ${c.note}`);
}

const pct = Math.round((score / total) * 100);
const verdict = pct >= 90 ? "excellent" : pct >= 75 ? "good" : pct >= 55 ? "needs work" : "poor";
console.log(`\n  SCORE: ${pct}/100  (${verdict})\n`);
console.log("  On-page only. This is the half you control, and it is necessary");
console.log("  rather than sufficient: backlinks decide the order between pages");
console.log("  that have all done their on-page properly.\n");

process.exit(pct >= 55 ? 0 : 1);
