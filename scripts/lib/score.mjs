/**
 * The on-page scorer, in one place.
 *
 * **Why this module exists.** `onpage-check.mjs` and `daily.mjs` each carried
 * their own copy of these fifteen checks, with a comment in `daily.mjs` saying
 * they were "kept in step by hand". They were not: on 2026-10-07 the daily
 * report scored `/pricing` at 84 while the real scorer said 80, because one
 * copy had the partial-credit rules and the other did not. Exactly the
 * duplication the component refactor removed from the UI, still sitting in the
 * tooling.
 *
 * Two rules encoded here, both learned the hard way:
 *
 *   - **Count inside `<main>`.** The mega menu repeats fifteen service names on
 *     every page, so a whole-document count reports every keyword as covered
 *     everywhere (roadmap 341).
 *   - **Match the way a reader does.** One optional stop word between terms, so
 *     "mobile app development in Dubai" satisfies "mobile app development
 *     dubai" (roadmap 358), and a slash or hyphen counts as a separator, so
 *     "UI/UX Designer in Dubai" satisfies "ui ux designer dubai" (roadmap 369).
 */

export const strip = (s) => s.replace(/<[^>]+>/g, " ");
export const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&[a-z]+;/g, " ");
export const text = (s) => decode(strip(s)).replace(/\s+/g, " ").trim();

const STOP = "(?:in|for|the|a|an|at|of|and|to|on)";
const SEP = `(?:\\s+(?:${STOP}\\s+)?|\\s*[/-]\\s*)`;
const esc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = (kw) => kw.trim().split(/\s+/).map(esc).join(SEP);

export const kwRegex = (kw) => new RegExp(pattern(kw), "i");
export const kwCount = (hay, kw) => (hay.match(new RegExp(pattern(kw), "gi")) || []).length;

/** The fifteen checks, scored against one rendered document. */
export function checksFor(doc, keyword) {
  const kw = keyword.toLowerCase().trim();
  const main = doc.match(/<main[\s\S]*?<\/main>/)?.[0] ?? doc;
  const body = text(main.replace(/<script[\s\S]*?<\/script>/g, ""));
  const low = body.toLowerCase();
  const words = body.split(/\s+/).filter(Boolean);

  const title = text(doc.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  const desc = decode(doc.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  const h1s = [...main.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1]));
  const subs = [...main.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map((m) => text(m[1]));
  const alts = [...main.matchAll(/<img[^>]*alt="([^"]*)"/g)].map((m) => m[1].toLowerCase());
  const internal = [...main.matchAll(/<a[^>]*href="(\/[^"]*)"/g)].map((m) => m[1]);
  const hasSchema = /<script type="application\/ld\+json">/.test(doc);

  const first100 = words.slice(0, 100).join(" ").toLowerCase();
  const count = kwCount(low, kw);
  const density = words.length ? (count * kw.split(/\s+/).length * 100) / words.length : 0;
  const re = kwRegex(kw);

  const checks = [
    { name: "Keyword in <title>", max: 12, got: re.test(title), note: title ? `"${title}"` : "no title" },
    { name: "Keyword at the START of <title>", max: 4, got: re.test(title.slice(0, kw.length + 6)), note: "Google weights the opening words" },
    { name: "<title> 60 characters or fewer", max: 4, got: title.length > 0 && title.length <= 60, note: `${title.length} chars` },
    { name: "Keyword in meta description", max: 8, got: re.test(desc), note: desc ? "" : "no description" },
    { name: "Meta description 120-160 characters", max: 4, got: desc.length >= 120 && desc.length <= 160, note: `${desc.length} chars` },
    { name: "Keyword in <h1>", max: 14, got: h1s.some((h) => re.test(h)), note: h1s[0] ? `"${h1s[0]}"` : "no h1" },
    { name: "Exactly one <h1>", max: 4, got: h1s.length === 1, note: `${h1s.length} found` },
    { name: "Keyword in an <h2> or <h3>", max: 8, got: subs.some((h) => re.test(h)), note: `${subs.length} subheadings` },
    { name: "Keyword in the first 100 words", max: 8, got: re.test(first100), note: "" },
    { name: "Keyword appears at least twice in the body", max: 8, got: count >= 2, partial: count === 1 ? 0.5 : 0, note: `${count} occurrence${count === 1 ? "" : "s"}` },
    { name: "Keyword density between 0.3% and 2.5%", max: 5, got: density >= 0.3 && density <= 2.5, note: `${density.toFixed(2)}%${density > 2.5 ? " - too high, reads as stuffing" : ""}` },
    { name: "At least 800 words in <main>", max: 9, got: words.length >= 800, partial: words.length >= 400 ? 0.5 : 0, note: `${words.length} words` },
    { name: "Keyword in an image alt", max: 4, got: alts.some((a) => re.test(a)), note: `${alts.length} images with alt` },
    { name: "At least 3 internal links", max: 4, got: internal.length >= 3, note: `${internal.length} internal links` },
    { name: "Structured data present", max: 4, got: hasSchema, note: "" },
  ];
  return { checks, words: words.length };
}

/** The score out of 100, and the earned value of each check. */
export function scoreOf(checks) {
  const total = checks.reduce((n, c) => n + c.max, 0);
  let got = 0;
  for (const c of checks) {
    c.earned = c.got ? c.max : Math.round(c.max * (c.partial ?? 0));
    got += c.earned;
  }
  return Math.round((got / total) * 100);
}
