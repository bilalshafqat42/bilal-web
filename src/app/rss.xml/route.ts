import { blogPosts } from "@/data/blogPosts";

/**
 * RSS 2.0 feed for the writing.
 *
 * **Built for the dead end, not for the subscribers.** Search Console on
 * 2026-10-07 listed `/feed/` and `/{slug}/feed/` under both "Not found (404)"
 * and "Page with redirect": the trailing-slash rule sent them to `/feed`, which
 * then 404'd. A redirect into a dead end is worse than a plain 404, because
 * Google spends two crawls to learn nothing. Those URLs now have somewhere real
 * to land (the redirects live in `next.config.ts`).
 *
 * RSS is **not** a ranking factor and this is not pretending to be one. The
 * honest case for it is that it costs half an hour, it closes the dead end, and
 * the handful of people who still use a reader can follow the writing without
 * being asked for an email address.
 *
 * Generated from `blogPosts` rather than hand-maintained, for the reason
 * `llms.txt` records above it: the static version of that file listed 6 of 20
 * pages because somebody had to remember.
 */

const SITE = "https://bilalshafqat.com";

/** XML has five characters that cannot appear raw in text or an attribute.
 *  Missing one produces a feed that parses in a browser and fails in a reader,
 *  which is the worst kind of broken: it looks fine. */
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** RFC 822, which is what RSS 2.0 requires. `toUTCString` emits exactly that.
 *  `published` is a date with no time, so it is read as midnight UTC rather
 *  than as local midnight, which would shift the date by a day for anyone east
 *  of Greenwich — this site's whole audience. */
const rfc822 = (d: string) => new Date(`${d}T00:00:00Z`).toUTCString();

export async function GET() {
  const posts = [...blogPosts].sort((a, b) => b.published.localeCompare(a.published));
  const latest = posts[0]?.published;

  const items = posts
    .map((p) =>
      [
        "    <item>",
        `      <title>${esc(p.title)}</title>`,
        `      <link>${SITE}/${p.slug}</link>`,
        // `isPermaLink="false"` because the guid is an identity, not an address.
        // Left as true, a reader that cannot fetch the URL may drop the item.
        `      <guid isPermaLink="false">${SITE}/${p.slug}</guid>`,
        `      <pubDate>${rfc822(p.published)}</pubDate>`,
        `      <description>${esc(p.description)}</description>`,
        ...p.tags.map((t) => `      <category>${esc(t)}</category>`),
        "    </item>",
      ].join("\n")
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bilal Shafqat — Writing</title>
    <link>${SITE}/blog</link>
    <description>Notes on digital marketing, design and development from Dubai.</description>
    <language>en</language>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${latest ? `    <lastBuildDate>${rfc822(latest)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // Same trio as the HTML pages in `next.config.ts`, and for the same
      // reason: a shared cache must not hold this for a year.
      "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
