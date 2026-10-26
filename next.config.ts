import type { NextConfig } from "next";

/**
 * Content-Security-Policy, in **report-only** mode.
 *
 * Report-only means the browser enforces nothing: it logs every request the
 * policy would have blocked to the console and to `/api/csp-report` (see
 * **Reports** below) and lets it through. That is the only safe way to introduce a CSP on
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
 *   www.facebook.com          the pixel's /tr beacon (image and fetch), and
 *                             also form-action and frame-src: fbevents.js
 *                             falls back to posting a hidden form to /tr/
 *                             through a hidden iframe on some events.
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
  "frame-src https://www.facebook.com https://app.cal.com https://cal.com https://challenges.cloudflare.com https://www.googletagmanager.com https://*.doubleclick.net https://www.googleadservices.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://www.facebook.com",
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
        // From the Search Console 404 export of 2026-10-15: a portfolio path
        // from the old /portfolio/leos/ structure, with an exact successor.
        // (The capitalised /About from the same export is handled in
        // src/proxy.ts: these rules match case-insensitively, so a "/About"
        // source here also caught "/about" and looped.)
        { source: "/portfolio/leos/hadley-heights/social-media", destination: "/portfolio/leos-developments/hadley-heights", permanent: true },
        // From the "Blocked by robots.txt" and "Crawled, not indexed" exports
        // of the same day: the old WordPress web development page, and the
        // long first slug of the string-methods article, which kept the short one.
        { source: "/web-development", destination: "/services/website-app-development", permanent: true },
        { source: "/master-javascript-string-methods-the-essential-guide-for-developers", destination: "/master-javascript-string-methods", permanent: true },
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
      // Merged 2026-10-26 (roadmap 405 phase 3): twelve thin or overlapping
      // articles Google had crawled and chosen not to index. Anything unique in
      // each was moved into the stronger article on the same subject, and the
      // old URL passes whatever it has to that article. None of the twelve had
      // recorded impressions in the 2026-10-26 snapshot.
      { source: "/6-unique-powerful-figma-plugins", destination: "/6-best-ai-powered-figma-plugins", permanent: true },
      { source: "/most-useful-react-hooks", destination: "/react-hooks-explained", permanent: true },
      { source: "/react-built-in-hooks-vs-additional-hooks", destination: "/react-hooks-explained", permanent: true },
      { source: "/top-react-design-patterns", destination: "/5-must-know-react-component-patterns", permanent: true },
      { source: "/redux-made-easy-beginners-guide-to-state-management-in-react-js", destination: "/react-state-management-usestate-vs-redux-vs-context", permanent: true },
      { source: "/react-js-state-management-for-beginners", destination: "/react-state-management-usestate-vs-redux-vs-context", permanent: true },
      { source: "/master-redux-toolkit", destination: "/react-state-management-usestate-vs-redux-vs-context", permanent: true },
      { source: "/typescript-guide-for-javascript-programmers", destination: "/how-javascript-developers-can-learn-typescript", permanent: true },
      { source: "/10-reasons-why-node-js-is-the-best-choice", destination: "/learn-node-js-from-scratch", permanent: true },
      { source: "/javascript-es6-features-a-comprehensive-guide", destination: "/7-javascript-concepts-to-learn-before-react", permanent: true },
      { source: "/5-ui-ux-design-trends-you-cant-ignore-in-2025", destination: "/exploring-key-trends-in-modern-user-interfaces", permanent: true },
      { source: "/optimizing-react-applications-advanced-techniques", destination: "/react-tips-and-tricks-for-efficient-development", permanent: true },
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
    // **Static files, not the optimiser (roadmap 419, 2026-10-24).** Every
    // <Image> goes through `src/lib/imageLoader.ts`, which points each srcset
    // entry at an AVIF cut ahead of time by `npm run image-variants` and stored
    // next to its original in /public. Nothing is encoded per request any more.
    //
    // Why: Cloudflare must bypass `/_next/image` (it ignores `Vary: Accept`, so
    // it served JPEG to AVIF browsers, roadmap 400), which left every image
    // request waiting on our Hostinger CPU. Measured live on 2026-10-24:
    // Texdale's capture through `/_next/image` took 2.4-4.8s and came out at
    // 489KB from a 348KB source; the same file as a static path was a
    // Cloudflare HIT in about 1s. Static variants keep the responsive widths
    // and get the edge cache.
    //
    // With a custom loader Next answers `/_next/image` with a 404, so the old
    // URLs are redirected to the original file in `src/proxy.ts`, for cached
    // HTML and anything Google Images still holds. (Not in `redirects()`:
    // Next compiles custom routes with `(?!/_next)`, so they never match it.)
    //
    // **Replacing an image in place is now safe.** The old rule here was "give
    // a replaced image a new filename", because the optimiser cached on path
    // for 30 days. Every URL the loader emits carries `?v=<content hash>`, and
    // Cloudflare keys on the query string, so new contents mean a new URL. Run
    // `npm run image-variants` after the replacement; `npm run image-check`
    // (CI) fails until you do.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",

    // These still decide which widths appear in each srcset, and the variant
    // script cuts exactly these widths (`WIDTHS` in scripts/lib/imageVariants.mjs
    // must match). Nothing on the site is displayed above 1600 CSS px and no
    // source is wider than 1800px. 128 is dropped: no raster image is shown that
    // small, and it only added a duplicate srcset entry.
    deviceSizes: [640, 800, 1080, 1280, 1600],
    imageSizes: [256, 384],
  },
};

export default nextConfig;
