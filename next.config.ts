import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Cache-Control for HTML pages.
   *
   * **Why this exists.** Next sends prerendered pages as
   * `Cache-Control: s-maxage=31536000` — a year — with no `max-age` and no
   * revalidation. On Vercel that is safe, because a deploy purges their edge
   * cache as part of shipping. This site is self-hosted behind LiteSpeed, and
   * the moment any shared cache or CDN sits in front of it (Cloudflare's free
   * tier is the obvious next move, since two thirds of the site's 870ms TTFB
   * is connect and TLS rather than server time) that year becomes literal:
   * the CDN would serve the same HTML until 2027 and deploys would appear to
   * do nothing.
   *
   * The replacement is the standard safe trio:
   *
   *   max-age=0                  browsers always revalidate, so a visitor
   *                              never reads a stale page
   *   s-maxage=600               a CDN serves it for ten minutes, which still
   *                              absorbs essentially all traffic
   *   stale-while-revalidate     for a day after that the CDN may serve the
   *                              old copy *while* fetching a new one in the
   *                              background, so nobody waits on the origin
   *
   * Staleness is capped at ten minutes instead of a year, and the TTFB benefit
   * of a CDN is kept almost in full.
   *
   * **The matcher deliberately excludes `_next/`, `api/` and anything with a
   * dot in it.** Static chunks
   * are content-hashed and ship `max-age=31536000, immutable`, which is
   * correct and must not be overwritten — they are the one thing that *should*
   * be cached for a year. API routes set their own headers.
   */
  /** `x-powered-by: Next.js` on every response, confirmed live on 2026-10-02.
   *  It tells an attacker which framework and therefore which advisories to try,
   *  and buys nothing. Off. */
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Security headers, site-wide. Checked against the live response on
        // 2026-10-02, which carried only `content-security-policy:
        // upgrade-insecure-requests` from Hostinger and none of these.
        //
        // This matcher is deliberately `/:path*`, unlike the cache rule below:
        // every response wants these, including `sitemap.xml` and the static
        // chunks, and none of them conflicts with a Cache-Control the route
        // sets for itself.
        source: "/:path*",
        headers: [
          {
            // Tells a browser to use HTTPS for this host for a year, so a
            // first request over http cannot be intercepted before the
            // redirect. Two years is the usual value; one is enough and is
            // easier to back out of if a subdomain is ever added on http.
            // No `preload`, which is a one-way door needing a submission to
            // Chrome's list and is not worth it for this site.
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            // Stops a browser guessing a response's type. The classic case is
            // a user upload served as text/plain and sniffed as HTML.
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // No third party may frame this site, which removes clickjacking
            // against the booking and enquiry forms.
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Send the full URL within this origin and only the origin to
            // anyone else, so a query string never leaks across a link out.
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Nothing on the site asks for any of these, so deny them. A
            // browser then refuses the request outright rather than prompting.
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // Page routes only. `[^.]*` excludes anything with a dot in it, which
        // is every file-like path: `sitemap.xml`, `robots.txt`, `llms.txt` and
        // `llms-full.txt` each set their own Cache-Control deliberately in
        // their route handlers, and an over-broad matcher here silently
        // replaced them — `llms.txt` lost its `max-age=3600`. Page routes never
        // contain a dot, so this separates the two cleanly.
        source: "/:path((?!_next/|api/)[^.]*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // **www to non-www, 301.** Every page was answering on both hostnames
      // with byte-identical content — verified on the live site: `/about`
      // returned 200 at `bilalshafqat.com` and at `www.bilalshafqat.com`.
      //
      // The canonical tag already pointed at the non-www URL, which is why
      // nothing was broken, but a canonical is a *hint*. Search Console still
      // discovers, crawls and reports the www copies — usually as "Alternate
      // page with proper canonical tag", and if Google ever disagrees with the
      // hint, as "Duplicate, Google chose a different canonical than user".
      // A redirect is the instruction the hint was only suggesting.
      //
      // Matched on the `host` header rather than configured at DNS, because the
      // Next app is already what answers on www — the request reaches this
      // middleware either way. `permanent: true` is a 308, which preserves the
      // method and, like a 301, passes ranking history to the surviving URL.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bilalshafqat.com" }],
        destination: "https://bilalshafqat.com/:path*",
        permanent: true,
      },
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
      // WordPress served the homepage at /home as well as /, and Search
      // Console still lists /home/ among the 404s (last crawled 9 Sep 2026).
      // It is the same page, so this is a genuine duplicate being pointed at
      // its canonical address — not a dead tutorial URL being swept into a
      // marketing page, which is the thing the note above forbids.
      { source: "/home", destination: "/", permanent: true },
      { source: "/web-application-development", destination: "/services/website-app-development", permanent: true },
      { source: "/ui-ux-design", destination: "/services/ui-ux-design", permanent: true },
      // "Web design" intent is covered by the UI/UX page, which includes web and
      // mobile interface work.
      { source: "/web-design", destination: "/services/ui-ux-design", permanent: true },
      // WordPress category archives. Search Console lists /category/ai/,
      // /category/ui-ux-design/ and /category/design/ among the 404s.
      //
      // These redirect where the course URLs deliberately do not, and the
      // difference is whether a genuine successor exists. A category archive
      // listed the articles filed under one topic; /blog lists all 52 of them,
      // including every article those three archives held. The visitor who
      // clicked a category link wanted a list of writing and gets a list of
      // writing, which is what separates this from the soft 404 the note below
      // describes — a tutorial URL swept into a marketing page.
      //
      // Wildcarded rather than enumerated: WordPress generated an archive for
      // every category and tag it ever had, and Search Console has only
      // surfaced the three Google happened to recrawl. Paginated archives
      // (/category/design/page/2/) are caught by the same rule.
      { source: "/category/:path*", destination: "/blog", permanent: true },
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
