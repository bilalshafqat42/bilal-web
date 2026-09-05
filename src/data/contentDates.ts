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
  "/": "2026-09-05",
  "/about": "2026-09-05",
  "/services": "2026-09-04",
  "/portfolio": "2026-09-04",
  "/pricing": "2026-09-05",
  "/faq": "2026-09-05",
  "/contact": "2026-09-05",
  "/appointment": "2026-09-05",
  "/process": "2026-09-05",
  "/privacy": "2026-09-05",
};

/** Service category pages all read from `src/data/pillars.ts`. */
export const SERVICES_CONTENT_DATE = "2026-09-03";

/** Portfolio pages all read from `src/data/caseStudies.ts`. */
export const PORTFOLIO_CONTENT_DATE = "2026-08-28";
