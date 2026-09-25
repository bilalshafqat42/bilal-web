/**
 * The site-wide Open Graph card.
 *
 * Exists because of a measurement rather than a preference. On 2026-09-25 only
 * 6 of the 30 sitemap routes carried an `og:image` — the case studies, which
 * set their own — and the other 24 carried none. A link with no image shares as
 * a bare text row on WhatsApp, LinkedIn and Slack.
 *
 * **Why this is a constant and not just the root layout's value.** Next's
 * metadata merge replaces `openGraph` wholesale when a route declares one; it
 * does not merge field by field. So every page that set its own title and
 * description — /pricing, /faq, the nine service categories, the four
 * discipline pages — silently dropped the parent's image along with it. Adding
 * the image to the root layout took coverage from 6 to 15, not to 30. Spreading
 * this into each of those blocks is what closes the remaining gap, and it keeps
 * the URL in one place so the next page to declare `openGraph` has something to
 * reach for.
 *
 * **JPEG, deliberately.** WhatsApp and Facebook share one link-preview crawler
 * and it renders JPEG, PNG, GIF and WebP only. An AVIF `og:image` is fetched
 * and then silently not drawn, which is the trap the LEOS card hit on
 * 2026-09-23.
 *
 * **Absolute URL, deliberately.** Several crawlers will not resolve a relative
 * one, and a share card that works everywhere except LinkedIn is not working.
 *
 * The artwork itself is a functional default: the portrait already on the site,
 * the name, the one-line service summary and the domain, on the site's ground.
 * Replacing `public/images/og-default.jpg` with a designed 1200x630 JPEG at the
 * same path changes every one of the 30 cards and needs no code change.
 */
export const OG_IMAGE_URL = "https://bilalshafqat.com/images/og-default.jpg";

export const OG_IMAGES = [
  {
    url: OG_IMAGE_URL,
    width: 1200,
    height: 630,
    alt: "Bilal Shafqat — paid marketing, web and app development, design and CRM automation, Dubai",
  },
];
