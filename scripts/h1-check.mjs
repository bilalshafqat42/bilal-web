/**
 * Asserts that every route in the sitemap has exactly one non-empty <h1>, and
 * that no heading loses a word boundary at a line break.
 *
 * This exists because /process shipped with none. `SectionHeading` renders an
 * `h2` by default, so any page whose only heading comes from that component has
 * no `h1` at all unless it explicitly passes `as="h1"`. That is a silent
 * failure: the page looks correct, the build passes, and lint says nothing.
 * Bing's site scan reported it before a human noticed.
 *
 * Routes come from the sitemap rather than a hard-coded list, so a new page is
 * covered the moment it becomes discoverable — which is exactly when it starts
 * to matter.
 *
 * The second assertion was added 2026-10-02. `/appointment` rendered
 *
 *     Let's talk about<br /><span>what you need</span>
 *
 * which looks right and reads "Let's talk aboutwhat you need": a `<br>` ends a
 * line and contributes no character, so the two words ran together in the text
 * content. That is what a screen reader announces and what a search engine
 * reads as the heading, and nothing about the rendered page shows it. It
 * surfaced only because an unrelated SEO-tool flag sent me to look at that URL.
 *
 * The test compares the heading's text with the same heading as it would read
 * if every `<br>` were a space. If those differ, the markup implies a boundary
 * the DOM does not have.
 *
 * No browser. Every page here is server-rendered, so the heading is in the
 * initial HTML and a fetch is enough.
 *
 * Usage:  npm run h1-check                      (against localhost:3000)
 *         BASE_URL=http://localhost:3020 npm run h1-check
 */
const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Strips tags and entities so an `h1` containing only a <span> still counts as
 *  text, while an empty or whitespace-only one does not. */
function textOf(html) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function get(url) {
  const res = await fetch(url, { headers: { "user-agent": "h1-check" } });
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

if (!paths.length) {
  console.error("Sitemap parsed but contained no <loc> entries.");
  process.exit(1);
}

const failures = [];
for (const path of paths) {
  let html;
  try {
    html = await get(`${BASE}${path}`);
  } catch (err) {
    failures.push([path, `did not load (${err.message})`]);
    continue;
  }
  const found = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => textOf(m[1]));
  if (found.length === 0) failures.push([path, "no <h1>"]);
  else if (found.length > 1) failures.push([path, `${found.length} <h1> elements: ${found.join(" | ").slice(0, 90)}`]);
  else if (!found[0]) failures.push([path, "<h1> is empty"]);

  // h1, h2 and h3: a `<br>` between two words joins them in the text content.
  for (const m of html.matchAll(/<(h[1-3])\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const raw = m[2];
    if (!/<br\b/i.test(raw)) continue;
    const asRead = textOf(raw);
    const asWritten = textOf(raw.replace(/<br\s*\/?>/gi, " "));
    if (asRead !== asWritten) {
      failures.push([path, `<${m[1]}> loses a space at a <br>: "${asRead.slice(0, 60)}"`]);
    }
  }
}

if (failures.length) {
  console.error(`\n${failures.length} of ${paths.length} routes failed the h1 check:\n`);
  for (const [path, why] of failures) console.error(`  ${path.padEnd(46)} ${why}`);
  console.error("");
  process.exit(1);
}
console.log(`All ${paths.length} sitemap routes have exactly one non-empty h1.`);
