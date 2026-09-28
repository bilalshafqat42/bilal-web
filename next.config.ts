import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /about-me was a real WordPress URL with existing links and ranking
      // history, so it is redirected rather than left to 404. 308 is permanent,
      // which is what passes the old page's equity to the new one.
      { source: "/about-me", destination: "/about", permanent: true },
      // Retired 2026-08-28: this pillar's content split across four narrower
      // category pages (UI/UX, Graphic Design, Video & Conversion, Social Media),
      // so there is no single successor. The hub lists all four, which makes it a
      // genuine destination rather than a soft 404.
      { source: "/services/design-content-conversion", destination: "/services", permanent: true },
      // WordPress service URLs with an exact successor. These carry commercial
      // intent and a direct equivalent exists, so a 308 sends both the searcher
      // and the ranking history somewhere genuinely relevant.
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/web-application-development", destination: "/services/website-app-development", permanent: true },
      { source: "/ui-ux-design", destination: "/services/ui-ux-design", permanent: true },
      // "Web design" intent is covered by the UI/UX page, which includes web and
      // mobile interface work.
      { source: "/web-design", destination: "/services/ui-ux-design", permanent: true },
      // Deliberately NOT redirecting /training or the course URLs. Bilal has
      // stopped offering training, and pointing a tutorial-intent URL at a
      // marketing page is a soft 404 — Google treats it as a poor match and it
      // can hurt the destination. Letting them 404 lets those pages de-index
      // cleanly, which is the honest outcome for content that no longer exists.
    ];
  },
  images: {
    // Next's default is ["image/webp"] only, so AVIF sources were being
    // re-encoded down to WebP. Listing AVIF first lets browsers that accept it
    // (all current ones) negotiate the smaller format, with WebP as the fallback.
    formats: ["image/avif", "image/webp"],

    // This site is self-hosted on Hostinger, so every variant is encoded by our
    // own CPU rather than a CDN's. Next's defaults allow 8 device widths + 7
    // image widths = up to 15 sizes per image, doubled across two formats.
    // Trimmed to the widths this layout actually requests. 2048 and 3840 are
    // dropped because no source image here is wider than 1928px, so they only
    // ever produced upscales.
    // 800 rather than Next's legacy 828: the social sources are exactly 800px,
    // and a 2x phone needs ~680px for these tiles. With 828 in the list Next
    // upscaled 800 -> 828 and re-encoded an already-lossy AVIF, which added
    // weight with no extra detail. 800 gives an exact match instead.
    // Capped at 1600, because nothing on the site is *displayed* above 1600 CSS
    // px. `bilal-shirt.avif` used to break the "nothing exceeds 1928px" claim
    // above at 3368x5056 — 17 megapixels decoded on our own CPU to produce a
    // 1600px variant, on the site's most-requested image. Downsampled to 1800px
    // on 2026-09-28: measured 2244ms to 1463ms for a full set of five variants,
    // a 35% saving, and the 1600px output came out *smaller* (164KB to 155KB)
    // because the discarded detail was only adding noise. No source in `public/`
    // now exceeds 1800px.
    // Any larger entry only ever produced an upscale — more bytes, no more
    // detail, and a re-encode of already-lossy AVIF on our own CPU.
    deviceSizes: [640, 800, 1080, 1280, 1600],
    imageSizes: [128, 256, 384],

    // Default is 4 hours, after which a variant is re-encoded from scratch on
    // the next request — repeated CPU cost for an image that never changes.
    //
    // **The original justification here was wrong and is worth correcting.** It
    // said filenames are content-addressed so a long TTL is safe. They are not:
    // `/images/bilal-shirt.avif` and everything under `/portfolio` are plain
    // paths with no hash. Next's optimiser caches on source path, width and
    // quality rather than on file contents, so **replacing an image in place
    // keeps serving the old variant for up to 30 days.**
    //
    // Hit on 2026-09-25 while re-cutting five thumbnails: the page kept serving
    // the previous crops, and a measurement run reported them at the old aspect
    // ratio long after the files had changed.
    //
    // The TTL is still right — it saves real CPU on a box that has little. The
    // rule that goes with it is: **when you replace an image, give it a new
    // filename**, or clear `.next/cache/images` as part of the deploy, before
    // the `npm run warm` pass.
    minimumCacheTTL: 2592000, // 30 days
  },
};

export default nextConfig;
