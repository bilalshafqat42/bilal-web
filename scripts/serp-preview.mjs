/**
 * What a page looks like in a Google result, measured rather than guessed.
 *
 * Exists because the useful limit is **pixel width, not character count**, and
 * every "keep titles under 60 characters" rule is an approximation of that. A
 * title of 58 narrow characters fits where 54 wide ones do not. This measures
 * the widths.
 *
 * Google renders desktop titles at roughly Arial 20px and truncates near 600px;
 * descriptions at roughly 14px, truncating near 920px across two lines. Those
 * numbers move, so treat a result near the limit as "probably fine" rather than
 * as a guarantee.
 *
 * Usage:  npm run serp
 *         npm run serp -- /pricing /services/seo
 */

const BASE = "https://bilalshafqat.com";
const paths = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["/", "/services/mobile-app-development", "/pricing", "/portfolio", "/about", "/blog"];

// Arial advance widths at 1px em, for the characters that actually appear in
// these titles. Everything unlisted falls back to an average.
const W = {
  " ": 0.278, "!": 0.278, '"': 0.355, "&": 0.667, "'": 0.191, "(": 0.333, ")": 0.333,
  ",": 0.278, "-": 0.333, ".": 0.278, "/": 0.278, ":": 0.278, ";": 0.278, "?": 0.556,
  "—": 1.0, "–": 0.556, "·": 0.278,
  a: 0.556, b: 0.556, c: 0.5, d: 0.556, e: 0.556, f: 0.278, g: 0.556, h: 0.556,
  i: 0.222, j: 0.222, k: 0.5, l: 0.222, m: 0.833, n: 0.556, o: 0.556, p: 0.556,
  q: 0.556, r: 0.333, s: 0.5, t: 0.278, u: 0.556, v: 0.5, w: 0.722, x: 0.5,
  y: 0.5, z: 0.5,
  A: 0.667, B: 0.667, C: 0.722, D: 0.722, E: 0.667, F: 0.611, G: 0.778, H: 0.722,
  I: 0.278, J: 0.5, K: 0.667, L: 0.556, M: 0.833, N: 0.722, O: 0.778, P: 0.667,
  Q: 0.778, R: 0.722, S: 0.667, T: 0.611, U: 0.722, V: 0.667, W: 0.944, X: 0.667,
  Y: 0.667, Z: 0.611,
  0: 0.556, 1: 0.556, 2: 0.556, 3: 0.556, 4: 0.556, 5: 0.556, 6: 0.556, 7: 0.556,
  8: 0.556, 9: 0.556,
};
const px = (s, size) => [...s].reduce((n, c) => n + (W[c] ?? 0.55) * size, 0);

const TITLE_LIMIT = 600; // desktop, approximate
const DESC_LIMIT = 920;  // two lines, approximate

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
   .replace(/&#x27;/g, "'").replace(/&[a-z]+;/g, " ");

/** Cut a string to a pixel budget the way a browser would, then ellipsis it. */
function truncate(s, size, limit) {
  if (px(s, size) <= limit) return { shown: s, cut: false };
  let out = "";
  for (const ch of s) {
    if (px(out + ch + "…", size) > limit) break;
    out += ch;
  }
  return { shown: out.replace(/[\s,·—-]+$/, "") + "…", cut: true };
}

console.log("");
for (const path of paths) {
  const url = BASE + path;
  const res = await fetch(url);
  if (!res.ok) { console.log(`  ${path}  HTTP ${res.status}\n`); continue; }
  const doc = await res.text();
  const title = decode((doc.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "").trim());
  const desc = decode(doc.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");

  // Google shows the breadcrumb trail from BreadcrumbList schema where it has
  // one, and the URL path otherwise.
  const crumbs = [...doc.matchAll(/"BreadcrumbList"[\s\S]*?\]/g)][0]?.[0] ?? "";
  const names = [...crumbs.matchAll(/"name":"([^"]+)"/g)].map((m) => m[1]);
  const trail = names.length
    ? names.join(" › ")
    : "bilalshafqat.com" + (path === "/" ? "" : " › " + path.slice(1).split("/").join(" › "));

  const t = truncate(title, 20, TITLE_LIMIT);
  const d = truncate(desc, 14, DESC_LIMIT);

  console.log(`  ┌─ ${url}`);
  console.log(`  │  ${trail}`);
  console.log(`  │  ${t.shown}`);
  console.log(`  │  ${d.shown}`);
  console.log(`  └─ title ${Math.round(px(title, 20))}px / ${TITLE_LIMIT}${t.cut ? "  TRUNCATED" : "  fits"}` +
              `   ·   description ${Math.round(px(desc, 14))}px / ${DESC_LIMIT}${d.cut ? "  TRUNCATED" : "  fits"}`);
  console.log("");
}
