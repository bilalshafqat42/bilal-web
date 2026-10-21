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
  // 2026-10-20: opener line and FAQ heading name "digital marketing
  // freelancer in Dubai".
  "/": "2026-10-20",
  // Every route below had its copy changed on 2026-10-13 in 0ed36bc, the
  // full-site audit (roadmap 399). /pricing gained a cost heading and
  // /portfolio descriptive cover alt text on 2026-10-14.
  // 2026-10-16: build stack names Strapi; design tools named.
  "/about": "2026-10-16",
  // 2026-10-16: the CMS and custom development pages added to the listing,
  // then the CRM, app and Figma sub-pages in "by platform" blocks.
  "/services": "2026-10-16",
  "/portfolio": "2026-10-14",
  "/pricing": "2026-10-20",
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
  // 2026-10-20: "off-plan marketing in Dubai" in the opener and a heading.
  "/real-estate-marketing": "2026-10-20",
};

/** Service category pages all read from `src/data/serviceCategories.ts`,
 *  `pillars.ts` and `serviceDepth.ts`.
 *
 *  2026-10-13: the service FAQ copy was rewritten in the full-site audit
 *  (0ed36bc, roadmap 399), and the data moved from `pillars.ts` into
 *  `serviceCategories.ts`. Refresh it when service copy changes. */
export const SERVICES_CONTENT_DATE = "2026-10-13";

/** Service pages whose copy changed after `SERVICES_CONTENT_DATE`, by slug.
 *
 *  2026-10-16: six pages added (the CMS hub, four platforms, custom web
 *  development); web and app development and web design gained links to them;
 *  UI/UX, graphic design and video name the tools the work is done in. One
 *  date for every service page would either understate these or tell Google the
 *  other fourteen changed when they did not. */
export const SERVICE_CONTENT_DATES: Record<string, string> = {
  "cms-development": "2026-10-16",
  "wordpress-development": "2026-10-16",
  "wix-development": "2026-10-16",
  "squarespace-development": "2026-10-16",
  "strapi-development": "2026-10-16",
  "web-design": "2026-10-16",
  "ui-ux-design": "2026-10-16",
  "graphic-design-branding": "2026-10-16",
  "video-conversion": "2026-10-16",
  // Ten more the same day: the CRM integration hub and its four platforms,
  // React Native, iOS, Android and app back end, and Figma. Their three
  // parents (CRM, mobile, web design) gained cards and links to them.
  "crm-integration": "2026-10-16",
  "hubspot-integration": "2026-10-16",
  "salesforce-integration": "2026-10-16",
  "custom-crm-development": "2026-10-16",
  "react-native-development": "2026-10-16",
  "app-backend-development": "2026-10-16",
  "figma-design": "2026-10-16",
  "crm-marketing-automation": "2026-10-16",
  // Three more the same day: an FAQ or sentence each for strategist,
  // agency-comparison and freelance-manager questions buyers search for.
  "social-media-marketing": "2026-10-16",
  // 2026-10-19: the SEO copy pass (one buyer query per page). Custom web
  // development, Zoho, iOS and Android retitled off their parents' phrases;
  // the mobile and web hubs given "mobile app developer" and "web developer"
  // in Dubai; digital marketing, Google Ads, Facebook ads and paid marketing
  // link to /real-estate-marketing. Description-only changes are not dated.
  "zoho-crm-integration": "2026-10-19",
  "ios-app-development": "2026-10-19",
  "android-app-development": "2026-10-19",
  "mobile-app-development": "2026-10-19",
  "website-app-development": "2026-10-19",
  "digital-marketing": "2026-10-19",
  "google-ads": "2026-10-19",
  "facebook-ads": "2026-10-19",
  "paid-marketing": "2026-10-19",
  // 2026-10-20: one buyer phrase each in a heading (and for SEO, the intro):
  // "freelance SEO consultant", "LinkedIn marketing services", "custom web
  // development in Dubai".
  "seo": "2026-10-20",
  "linkedin-marketing": "2026-10-20",
  "custom-web-development": "2026-10-20",
};

export function serviceContentDate(slug: string): string {
  return SERVICE_CONTENT_DATES[slug] ?? SERVICES_CONTENT_DATE;
}

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
