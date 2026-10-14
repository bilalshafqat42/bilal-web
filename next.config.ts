import type { NextConfig } from "next";

/**
 * Content-Security-Policy, in **report-only** mode.
 *
 * Report-only means the browser enforces nothing: it logs every request the
 * policy would have blocked to the console (and to a `report-uri`, once one
 * exists) and lets it through. That is the only safe way to introduce a CSP on
 * a site with GA4, the Meta Pixel, the Cal.com embed and Turnstile, because a
 * single missing origin in an enforcing policy silently breaks bookings or lead
 * capture with nothing in the logs to say why.
 *
 * **Switch to enforcing after a week of clean reports**: rename the header to
 * `Content-Security-Policy`. Before that, check the console on /, /appointment
 * (Cal.com), /contact (form, Turnstile) and one page after accepting cookies
 * (GA4 and the pixel only load then).
 *
 * The allowances, and what each is for:
 *
 *   'unsafe-inline' scripts   Next's own inline bootstrap, the JSON-LD blocks,
 *                             the consent-default and GA4 init snippets. Fine
 *                             for report-only; moving to nonces is the step
 *                             after enforcing, and needs dynamic rendering.
 *   'unsafe-eval'             development only (React Refresh). Never in prod.
 *   googletagmanager.com      gtag.js / gtm.js, and GTM's preview iframe.
 *   google-analytics.com,     GA4 collection endpoints (region1.* etc.).
 *   analytics.google.com
 *   connect.facebook.net      the Meta Pixel loader, fbevents.js.
 *   www.facebook.com          the pixel's /tr beacon (image and fetch).
 *   app.cal.com, cal.com      the booking embed: script, iframe and its API.
 *                             CalBooking.tsx loads the embed from the apex
 *                             `https://cal.com` origin, which `*.cal.com`
 *                             does not cover, so the apex is listed too.
 *   www.google.com,           GA4 with Google signals or a linked Google Ads
 *   *.doubleclick.net,        account: remarketing pixels (ga-audiences),
 *   googleads.g.doubleclick   the `stats.g.doubleclick.net` collect call,
 *   www.googleadservices.com  and conversion.js / its iframe.
 *   challenges.cloudflare.com Turnstile's script and iframe, if the forms load it.
 *   cloudflareinsights.com    Cloudflare Web Analytics, which Cloudflare injects
 *                             itself if it is ever put in front of the site.
 *   data: blob: images        Next's blur placeholders and inline SVG.
 *
 * **Reports** go to `/api/csp-report` (src/app/api/csp-report/route.ts), by
 * both mechanisms: `report-uri` for Firefox and Safari, and `report-to` with a
 * `Reporting-Endpoints` header for Chromium, which ignores `report-uri` when
 * `report-to` is present. Each violation becomes one line in the server log,
 * which is what "a week of clean reports" above is read from.
 */
const isDev = process.env.NODE_ENV !== "production";
const GOOGLE_ADS = "https://www.google.com https://*.doubleclick.net https://googleads.g.doubleclick.net https://www.googleadservices.com";
const CSP_REPORT_PATH = "/api/csp-report";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://connect.facebook.net https://app.cal.com https://cal.com https://challenges.cloudflare.com https://static.cloudflareinsights.com https://googleads.g.doubleclick.net https://www.googleadservices.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://www.facebook.com https://cal.com https://*.cal.com ${GOOGLE_ADS}`,
  "font-src 'self' data:",
  `connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://www.facebook.com https://connect.facebook.net https://app.cal.com https://cal.com https://*.cal.com https://challenges.cloudflare.com https://cloudflareinsights.com ${GOOGLE_ADS}`,
  "frame-src https://app.cal.com https://cal.com https://challenges.cloudflare.com https://www.googletagmanager.com https://*.doubleclick.net https://www.googleadservices.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  `report-uri ${CSP_REPORT_PATH}`,
  "report-to csp-endpoint",
].join("; ");

/**
 * Warn, never fail, when a production build has no analytics ID.
 *
 * `Analytics.tsx` renders nothing without `NEXT_PUBLIC_GA4_ID` or
 * `NEXT_PUBLIC_GTM_ID`, which is right for local work and silent in production:
 * a deploy with the variable missing ships a site that measures nothing, and
 * the first sign is an empty GA4 report a week later. The same happened to the
 * Bing verification tag (roadmap 343). A warning in the build log is the
 * cheapest place to catch it. Not an error, because a build without analytics
 * is still a working site.
 */
if (
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_GA4_ID &&
  !process.env.NEXT_PUBLIC_GTM_ID
) {
  console.warn(
    "\n[analytics] Neither NEXT_PUBLIC_GA4_ID nor NEXT_PUBLIC_GTM_ID is set. " +
      "This production build will load no analytics. Set one in the deploy environment.\n"
  );
}

/**
 * Twin every legacy redirect with its trailing-slash form.
 *
 * WordPress URLs end in a slash, and that is how Search Console and old links
 * hold them. Next's built-in slash stripping runs *before* custom redirects, so
 * `/about-me/` went `/about-me/` -> `/about-me` -> `/about`: two hops, two
 * crawls, and a redirect chain in every audit tool. With the built-in turned off
 * (`skipTrailingSlashRedirect` below) and each source listed in both forms, an
 * old URL reaches its final page in one hop. Wildcards are twinned too:
 * `/category/:path*` is matched strictly and does not match `/category/design/`.
 */
type Redirect = { source: string; destination: string; permanent: boolean };
const APEX = "https://bilalshafqat.com";
const WWW_HOST = { type: "host" as const, value: "www.bilalshafqat.com" };
const withTrailingSlash = (rules: Redirect[]): Redirect[] =>
  rules.flatMap((r) => [r, { ...r, source: `${r.source}/` }]);

const nextConfig: NextConfig = {
  /** `x-powered-by: Next.js` on every response, confirmed live on 2026-10-02.
   *  It tells an attacker which framework and therefore which advisories to try,
   *  and buys nothing. Off. */
  poweredByHeader: false,

  // The built-in `/:path+/` -> `/:path+` redirect runs before custom redirects,
  // which is what made every legacy WordPress URL a two-hop chain. Turned off so
  // the redirects below can match the slash form directly; the same stripping
  // is restored as the *last* redirect, so every other URL behaves as before.
  skipTrailingSlashRedirect: true,

  // Inlined into server and client bundles alike, so `yearsExperience()` in
  // `src/lib/site.ts` gives the same number in a server render and in the
  // hydrating client component, even across a new year.
  env: {
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
    // Whether the forms in THIS build render the Turnstile widget. The site
    // key is inlined into the client bundle at build time, so it is the build
    // that decides whether a token is ever sent. /api/lead enforces Turnstile
    // only when this is "1" AND TURNSTILE_SECRET_KEY is set at runtime.
    // Reading the site key at runtime instead meant setting both keys on
    // Hostinger without a rebuild refused every lead (reproduced 2026-10-14).
    TURNSTILE_ENABLED_AT_BUILD: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? "1" : "",
  },

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
          {
            // Report-only: logs, never blocks. See `csp` at the top of this
            // file for every allowance and for when to switch it to enforcing.
            key: "Content-Security-Policy-Report-Only",
            value: csp,
          },
          {
            // Names the endpoint the CSP's `report-to csp-endpoint` uses.
            // Relative, resolved against the page's own URL, so it works on
            // localhost as well as in production.
            key: "Reporting-Endpoints",
            value: `csp-endpoint="${CSP_REPORT_PATH}"`,
          },
        ],
      },
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
      // Logos and portfolio image files get a one-day browser TTL from a
      // Cloudflare Cache Rule ("Logos and portfolio files"), not from here:
      // Hostinger serves /public straight from LiteSpeed, so a header set here
      // never reached them, and the path pattern tried here also matched the
      // /portfolio case-study PAGES, giving HTML a one-day browser cache
      // (caught and removed 2026-10-14). Roadmap 401.
    ];
  },

  async redirects() {
    // Legacy WordPress URLs, each twinned with its trailing-slash form. Used
    // twice below: once for the www host and once for the apex.
    const legacy = withTrailingSlash([
      // **`/training` was the only genuine 404 in Search Console's list**, and
      // it is not a dead URL: on 2026-10-12 it still held 29 impressions at
      // average position 19.76 over 90 days. Google is showing a page that
      // returns 404 to real people, which is the worst of both outcomes — the
      // ranking exists and the click lands nowhere.
      //
      // It points at `/blog` rather than at a service page. The old WordPress
      // page was educational, and sending "training" traffic to a sales page
      // is the mismatch Google scores as a soft 404. If the queries behind
      // those 29 impressions turn out to be commercial, change the target.
      {
        source: "/training",
        destination: "/blog",
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
      // Pointed at the UI/UX page until 2026-10-13, when web design had no page
      // of its own. `/services/web-design` now exists and targets exactly this
      // intent, so the old URL goes to the exact successor.
      { source: "/web-design", destination: "/services/web-design", permanent: true },
      // Two articles answered "UX vs UI". The 2025 WordPress one was thinner
      // and had no recorded impressions (snapshot of 2026-10-13); the newer
      // one is the keeper, so the old URL passes whatever it has to it.
      { source: "/ux-vs-ui-the-perfect-balance-for-a-winning", destination: "/ux-designer-vs-ui-designer", permanent: true },
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
      // **Tag archives, added 2026-10-12.** The note above says WordPress made
      // an archive for every category *and tag*, but only `/category/` was ever
      // wildcarded. Search Console's "Crawled - currently not indexed" list
      // showed why that mattered: seven `/tag/` URLs in the 32, and each one
      // resolved 308 to a trailing-slash-stripped URL that then 404'd.
      //
      // A redirect into a dead end is worse than a plain 404. It costs two
      // crawls and teaches Google nothing.
      //
      // The feed rule sits first because order decides: a feed reader asking
      // for `/tag/css/feed/` should get a feed, not an article index. The
      // `/:slug/feed` rule below never caught these because it matches one
      // segment and these carry two.
      { source: "/tag/:path*/feed", destination: "/rss.xml", permanent: true },
      { source: "/tag/:path*", destination: "/blog", permanent: true },
      // WordPress RSS endpoints. Search Console listed `/feed/`,
      // `/react-hooks-explained/feed/` and `/react-usememo-hook-explained/feed/`
      // under BOTH "Not found (404)" and "Page with redirect": the
      // trailing-slash rule sent them to `/feed`, which then 404'd. A redirect
      // into a dead end costs two crawls and teaches Google nothing.
      //
      // These have a genuine successor now that `/rss.xml` exists, which is the
      // test the course URLs below fail — a feed reader asking for a feed gets
      // a feed, rather than a tutorial URL being swept into a marketing page.
      { source: "/feed", destination: "/rss.xml", permanent: true },
      { source: "/:slug/feed", destination: "/rss.xml", permanent: true },
      { source: "/comments/feed", destination: "/rss.xml", permanent: true },
      // **The course URLs still 404 deliberately.** Pointing a tutorial-intent
      // URL at a marketing page is a soft 404 — Google treats it as a poor
      // match and it can hurt the destination. Letting them de-index cleanly is
      // the honest outcome for content that no longer exists.
      //
      // `/training` was in this group until 2026-10-12, when the first full
      // Search Console export showed it holding **29 impressions at average
      // position 19.76** over 90 days. That changed the question. The rule was
      // right while the URL was dead; it is the wrong call for a URL Google is
      // actively ranking and sending people to a 404. It now points at /blog,
      // first in `legacy`.
    ]);

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
      //
      // **First, and once per legacy rule, so www plus an old URL is one hop.**
      // With the generic www rule alone, `www.../about-me/` went to
      // `bilalshafqat.com/about-me/` and only then to `/about`: two hops, the
      // chain the trailing-slash work below exists to avoid. Each legacy rule
      // is therefore repeated for the www host with an absolute apex
      // destination, and a www URL with a trailing slash goes straight to the
      // slashless apex URL. Only then does the catch-all www rule run.
      ...legacy.map((r) => ({ ...r, has: [WWW_HOST], destination: `${APEX}${r.destination}` })),
      { source: "/:path+/", has: [WWW_HOST], destination: `${APEX}/:path+`, permanent: true },
      {
        source: "/:path*",
        has: [WWW_HOST],
        destination: `${APEX}/:path*`,
        permanent: true,
      },
      ...legacy,
      // **Trailing-slash stripping, restored by hand and deliberately last.**
      // This is the rule Next adds itself, switched off above so the legacy
      // URLs could be matched first. Anything not caught above, `/about/`
      // included, still gets one 308 to its slashless form.
      { source: "/:path+/", destination: "/:path+", permanent: true },
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
