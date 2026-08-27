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
    // Capped at 1600 because that is now the widest raster source on the site.
    // Any larger entry only ever produced an upscale — more bytes, no more
    // detail, and a re-encode of already-lossy AVIF on our own CPU.
    deviceSizes: [640, 800, 1080, 1280, 1600],
    imageSizes: [128, 256, 384],

    // Default is 4 hours, after which a variant is re-encoded from scratch on
    // the next request — repeated CPU cost for an image that never changes.
    // Filenames are content-addressed, so a long TTL is safe: a changed image
    // gets a new URL rather than a stale cache hit.
    minimumCacheTTL: 2592000, // 30 days
  },
};

export default nextConfig;
