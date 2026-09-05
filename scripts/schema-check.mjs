/**
 * Asserts the JSON-LD on every sitemap route: valid JSON, the expected types
 * present, no duplicate @id, and none of the markup types that carry a
 * manual-action risk.
 *
 * This exists because structured data fails silently. A block can be malformed,
 * or claim a type the page does not support, and nothing in the build, the
 * lint, or the rendered page will say so — the only signal is a Search Console
 * message weeks later.
 *
 * Routes come from the sitemap rather than a hard-coded list, so a new page is
 * covered as soon as it is discoverable.
 *
 * Usage:  npm run schema-check
 *         BASE_URL=http://localhost:3020 npm run schema-check
 */
const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Types that must never appear. There are no verified reviews, and inventing
 *  review or rating markup is a manual-action risk, not a ranking tactic. */
const BANNED = ["Review", "AggregateRating", "ratingValue"];

/** path pattern -> types that must be present. A pattern matching no route is
 *  itself a failure: it means a template was renamed or a page disappeared. */
const EXPECTED = [
  [/^\/$/, ["Person", "ProfessionalService", "WebSite"]],
  [/^\/services\/[^/]+$/, ["Service", "BreadcrumbList", "FAQPage"]],
  [/^\/faq$/, ["FAQPage", "BreadcrumbList"]],
  [/^\/pricing$/, ["FAQPage", "BreadcrumbList"]],
  [/^\/contact$/, ["ContactPage"]],
  [/^\/portfolio\/[^/]+$/, ["BreadcrumbList"]],
  [/^\/portfolio\/[^/]+\/[^/]+$/, ["BreadcrumbList"]],
];

async function get(url) {
  const res = await fetch(url, { headers: { "user-agent": "schema-check" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

let sitemap;
try {
  sitemap = await get(`${BASE}/sitemap.xml`);
} catch (err) {
  console.error(`Could not read ${BASE}/sitemap.xml — is the server running?`);
  console.error(String(err.message || err));
  process.exit(1);
}

const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => {
    try {
      return new URL(m[1]).pathname;
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .filter((v, i, a) => a.indexOf(v) === i)
  .sort();

const failures = [];
const matchedPatterns = new Set();
const summary = [];

for (const path of paths) {
  let html;
  try {
    html = await get(`${BASE}${path}`);
  } catch (err) {
    failures.push([path, `did not load (${err.message})`]);
    continue;
  }

  const blocks = [...html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  )].map((m) => m[1]);

  const types = new Set();
  const ids = [];
  let parsed = 0;

  for (const raw of blocks) {
    let json;
    try {
      json = JSON.parse(raw);
      parsed++;
    } catch (err) {
      failures.push([path, `invalid JSON in a ld+json block: ${err.message}`]);
      continue;
    }
    const walk = (n) => {
      if (Array.isArray(n)) return n.forEach(walk);
      if (!n || typeof n !== "object") return;
      if (typeof n["@type"] === "string") types.add(n["@type"]);
      // A node *defines* an id only if it carries properties beyond @id and
      // @type. Anything with just those two is a reference, and references are
      // supposed to repeat — `#business` is legitimately pointed at from both
      // `founder` and `publisher` on the same page. Counting typed references
      // as definitions produced a false duplicate report the first time.
      if (n["@id"] && Object.keys(n).length > 2) ids.push(n["@id"]);
      Object.values(n).forEach(walk);
    };
    walk(json);
  }

  for (const banned of BANNED) {
    if (types.has(banned) || blocks.some((b) => b.includes(`"${banned}"`))) {
      failures.push([path, `emits banned markup: ${banned}`]);
    }
  }

  const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
  if (dupes.length) {
    failures.push([path, `duplicate @id defined more than once: ${[...new Set(dupes)].join(", ")}`]);
  }

  for (const [pattern, required] of EXPECTED) {
    if (!pattern.test(path)) continue;
    matchedPatterns.add(String(pattern));
    const missing = required.filter((t) => !types.has(t));
    if (missing.length) failures.push([path, `missing ${missing.join(", ")}`]);
  }

  summary.push([path, parsed, [...types].sort().join(", ")]);
}

const unmatched = EXPECTED.filter(([p]) => !matchedPatterns.has(String(p)));
for (const [p, t] of unmatched) {
  failures.push(["(no route)", `pattern ${p} matched nothing — expected ${t.join(", ")}`]);
}

if (process.env.VERBOSE) {
  for (const [path, count, types] of summary) {
    console.log(`  ${path.padEnd(48)} ${String(count).padStart(2)} block(s)  ${types}`);
  }
}

if (failures.length) {
  console.error(`\n${failures.length} schema problem(s) across ${paths.length} routes:\n`);
  for (const [path, why] of failures) console.error(`  ${path.padEnd(48)} ${why}`);
  console.error("");
  process.exit(1);
}
console.log(`All ${paths.length} sitemap routes pass the schema check.`);
