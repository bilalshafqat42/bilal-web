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

// The width table and limits live in lib/serpWidth.mjs, shared with
// site-audit.mjs so both measure descriptions the same way.
import { px, TITLE_LIMIT, DESC_LIMIT } from "./lib/serpWidth.mjs";

const BASE = "https://bilalshafqat.com";
const paths = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["/", "/services/mobile-app-development", "/pricing", "/portfolio", "/about", "/blog"];

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
