/**
 * Submits every page in the sitemap to IndexNow.
 *
 * IndexNow is a push protocol: instead of waiting for a crawler to notice a
 * change, you tell the engines directly. One submission reaches Bing, Yandex,
 * Seznam and Naver — they share the feed. Google does not participate, so this
 * complements Search Console rather than replacing it.
 *
 * Worth doing here specifically: Bing already sends this site ~8K impressions,
 * several times what Google does, so faster indexing there has real value.
 *
 * Usage:  npm run indexnow                     (production)
 *         npm run indexnow -- https://staging.example.com
 */
const BASE = (process.argv[2] || "https://bilalshafqat.com").replace(/\/$/, "");
const KEY = process.env.INDEXNOW_KEY || "cfc44ddc83791ced09cff999b9915876";

const host = new URL(BASE).host;

// The key must be readable at the site root or the whole submission is rejected.
const keyUrl = `${BASE}/${KEY}.txt`;
const keyRes = await fetch(keyUrl).catch(() => null);
if (!keyRes?.ok) {
  console.error(`Key file not reachable at ${keyUrl} (HTTP ${keyRes?.status ?? "no response"}).`);
  console.error("IndexNow will reject the submission until that file is deployed. Nothing sent.");
  process.exit(1);
}
const served = (await keyRes.text()).trim();
if (served !== KEY) {
  console.error(`Key file contents do not match INDEXNOW_KEY. Nothing sent.`);
  process.exit(1);
}
console.log(`Key verified at ${keyUrl}\n`);

const sitemapRes = await fetch(`${BASE}/sitemap.xml`).catch(() => null);
if (!sitemapRes?.ok) {
  console.error(`Sitemap not readable at ${BASE}/sitemap.xml (HTTP ${sitemapRes?.status ?? "no response"}). Nothing sent.`);
  process.exit(1);
}
const xml = await sitemapRes.text();
const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
// IndexNow wants every URL on the submitted host. A staging sitemap lists the
// canonical production URLs, so submitting it as-is would announce production
// pages under the staging key and host. Only same-host URLs go.
const urlList = listed.filter((u) => {
  try {
    return new URL(u).host === host;
  } catch {
    return false;
  }
});
if (listed.length !== urlList.length) {
  console.error(`Skipping ${listed.length - urlList.length} sitemap URL(s) not on ${host}.`);
}
if (!urlList.length) {
  console.error(`No URLs on ${host} in the sitemap. Nothing sent.`);
  process.exit(1);
}

console.log(`Submitting ${urlList.length} URLs to IndexNow...`);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: keyUrl, urlList }),
});

// 200 = accepted, 202 = accepted but key still being validated. Both are fine.
if (res.status === 200 || res.status === 202) {
  console.log(`\nAccepted (HTTP ${res.status}). Bing, Yandex, Seznam and Naver have been notified.`);
  urlList.forEach((u) => console.log(`  ${u}`));
} else {
  console.error(`\nRejected: HTTP ${res.status} ${await res.text().catch(() => "")}`);
  process.exit(1);
}
