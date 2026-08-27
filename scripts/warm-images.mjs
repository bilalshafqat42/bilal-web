/**
 * Pre-generates every image variant the site actually uses, so the server never
 * encodes during real traffic.
 *
 * Why this exists: on cheap shared hosting the image optimizer is the most
 * expensive thing the server does — decoding a tall screenshot can need ~50MB of
 * RAM, and the first visitor to hit an uncached variant waits for it. Running
 * this once after each deploy means every variant is already on disk, so real
 * requests are served as static files in ~2ms.
 *
 * Usage:  npm run warm            (against http://localhost:3000)
 *         npm run warm -- https://bilalshafqat.com
 */
const BASE = process.argv[2] || process.env.WARM_BASE || "http://localhost:3000";

async function getText(url) {
  const res = await fetch(url, { headers: { "user-agent": "warm-images" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

// Pull page URLs straight from the sitemap so new pages are covered automatically.
async function pageUrls() {
  const xml = await getText(`${BASE}/sitemap.xml`);
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .map((u) => BASE + new URL(u).pathname);
}

// next/image emits its candidates in srcset, so the HTML already lists exactly
// the variants this layout requests — no need to guess widths.
function imageUrls(html) {
  const out = new Set();
  for (const m of html.matchAll(/\/_next\/image\?[^"'\s]+/g)) {
    out.add(BASE + m[0].replace(/&amp;/g, "&"));
  }
  return out;
}

const pages = await pageUrls();
console.log(`Warming ${pages.length} pages from ${BASE}\n`);

const all = new Set();
for (const p of pages) {
  try {
    for (const u of imageUrls(await getText(p))) all.add(u);
  } catch (e) {
    console.warn(`  skipped ${p}: ${e.message}`);
  }
}

console.log(`Found ${all.size} image variants. Requesting each...\n`);
let done = 0, miss = 0, hit = 0, failed = 0, total = 0;
// Sequential on purpose: parallel decodes are what would blow the memory ceiling
// on a small plan, which is the exact thing this script exists to avoid.
for (const url of all) {
  const t = Date.now();
  try {
    const res = await fetch(url);
    const ms = Date.now() - t;
    total += ms;
    if (!res.ok) { failed++; continue; }
    await res.arrayBuffer();
    done++;
    // Next reports cache state directly. An earlier version of this script
    // inferred it from response time (>400ms = "encoded"), which is wrong over
    // the internet: a cached 150KB image can easily take longer than that to
    // transfer, so it reported phantom encodes and the count moved around
    // randomly between runs. Trust the header, not the clock.
    const state = res.headers.get("x-nextjs-cache");
    if (state === "MISS") {
      miss++;
      console.log(`  encoded  ${String(ms).padStart(5)}ms  ${decodeURIComponent(url).split("url=")[1]?.slice(0, 58)}`);
    } else if (state === "HIT") {
      hit++;
    }
  } catch {
    failed++;
  }
}

const unknown = done - hit - miss;
console.log(`\nWarmed ${done} variants in ${(total / 1000).toFixed(1)}s.`);
console.log(`  already cached : ${hit}`);
console.log(`  newly encoded  : ${miss}`);
if (unknown) console.log(`  cache state not reported : ${unknown}`);
if (failed) console.log(`  failed : ${failed}`);
console.log(miss === 0 && failed === 0
  ? "\nEverything was already cached — nothing for a visitor to wait on."
  : "\nThose are now cached; real visitors will be served them from disk.");
