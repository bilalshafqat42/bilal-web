/**
 * When each page's content last materially changed.
 *
 * The sitemap previously sent `new Date()` for every entry, which told Google
 * and Bing that all 23 URLs changed on every deploy. A signal that fires for
 * everything every time carries no information, and it can suppress recrawl
 * priority for the pages that genuinely did change.
 *
 * Seeded from `git log -1 --format=%cs` per source file, so the starting values
 * are real rather than invented. Refresh a line when you change that page's
 * content — not when you change its styling, since a crawler re-fetching for a
 * padding tweak is the same waste in the other direction.
 *
 * Dynamic routes derive their dates from the data file behind them, below.
 *
 * Note the keys are routes, not files. A page whose content lives mostly in a
 * component — /appointment is the example — changes without its `page.tsx`
 * being touched, so seeding purely from that one file understates it.
 */
export const contentDates: Record<string, string> = {
  // 2026-10-14: the opening statement's year count is now computed rather
  // than written by hand. 2026-10-13: hero, about band and FAQ copy
  // rewritten in the full-site audit (0ed36bc). Earlier: the FAQ section
  // (09-30), the proof wall and timeline (09-29), the about band (09-25).
  "/": "2026-10-14",
  // Every route below had its copy changed on 2026-10-13 in 0ed36bc, the
  // full-site audit (roadmap 399). /pricing gained a cost heading and
  // /portfolio descriptive cover alt text on 2026-10-14.
  "/about": "2026-10-13",
  "/services": "2026-10-13",
  "/portfolio": "2026-10-14",
  "/pricing": "2026-10-14",
  "/faq": "2026-10-13",
  "/contact": "2026-10-13",
  "/appointment": "2026-10-13",
  "/process": "2026-10-13",
  "/privacy": "2026-10-13",
  // Was missing entirely until 2026-09-29, so `dateFor` fell back to
  // `Date.now()` and this page told Google it had changed **on every single
  // deploy**, the exact signal this file exists to stop sending. Caught by
  // reading the rendered sitemap rather than the source: the route was dated
  // today while nothing about it had been touched.
  "/real-estate-marketing": "2026-10-13",
};

/** Service category pages all read from `src/data/serviceCategories.ts`,
 *  `pillars.ts` and `serviceDepth.ts`.
 *
 *  2026-10-13: the service FAQ copy was rewritten in the full-site audit
 *  (0ed36bc, roadmap 399), and the data moved from `pillars.ts` into
 *  `serviceCategories.ts`. Refresh it when service copy changes. */
export const SERVICES_CONTENT_DATE = "2026-10-13";

/** Portfolio pages all read from `src/data/caseStudies.ts` (and
 *  `caseStudyDepth.ts`). Used for the sitemap and for `dateModified` in every
 *  case study's CreativeWork schema, which until 2026-10-13 sent the build date.
 *
 *  Moved from 2026-08-28 to 2026-10-11 on 2026-10-13: the sales application
 *  case study and the LEOS restructure landed on 10-11 (`git log -1 --format=%cs
 *  src/data/caseStudies.ts`), so the older date understated a page that did
 *  not exist on 08-28. 2026-10-14: every project card now carries descriptive
 *  alt text. Refresh it when case study copy changes. */
export const PORTFOLIO_CONTENT_DATE = "2026-10-14";

/** Discipline pages carry their own copy in `src/data/disciplines.ts` as well
 *  as the shared captures, so they date from when that copy was written rather
 *  than from the case study data. */
export const DISCIPLINE_CONTENT_DATE = "2026-09-09";

// Blog dates are not kept here. Each article's `dateModified` and sitemap
// `lastModified` come from its own `updatedAt` in `src/content/blog/<slug>.json`,
// and the /blog index pages use `BLOG_UPDATED_DATE` in `blogPosts.ts`.
