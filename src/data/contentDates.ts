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
  // 2026-10-24: the hero line opens with the name, for the brand query
  // (roadmap 420).
  "/": "2026-10-24",
  // Every route below had its copy changed on 2026-10-13 in 0ed36bc, the
  // full-site audit (roadmap 399). /pricing gained a cost heading and
  // /portfolio descriptive cover alt text on 2026-10-14.
  // 2026-10-16: build stack names Strapi; design tools named.
  // 2026-10-19: "Industries I have worked in" (roadmap 417), which this line
  // missed. 2026-10-24: the work section shows the three disciplines rather
  // than four pillar cards; subcontracting sentence (audit batch 2).
  "/about": "2026-10-24",
  // 2026-10-16: the CMS and custom development pages added to the listing,
  // then the CRM, app and Figma sub-pages in "by platform" blocks.
  // 2026-10-26: the free health check card under the listing.
  "/services": "2026-10-26",
  // 2026-10-26: the free website and marketing health check offer, new.
  "/free-website-health-check": "2026-10-26",
  // 2026-10-24: opener and description cover Texdale as well as LEOS; paid
  // marketing marked as having a case study (audit batch 2).
  "/portfolio": "2026-10-24",
  "/pricing": "2026-10-20",
  // 2026-10-24: the industry answer names both published sectors.
  "/faq": "2026-10-24",
  // 2026-10-26: a line pointing at the free health check.
  "/contact": "2026-10-26",
  // 2026-10-24: description no longer leads with the name (roadmap 420).
  "/appointment": "2026-10-24",
  "/process": "2026-10-13",
  // 2026-10-24: cookie names and lifetimes (audit batch 2). The page's own
  // LAST_UPDATED says the same.
  "/privacy": "2026-10-24",
  // Was missing entirely until 2026-09-29, so `dateFor` fell back to
  // `Date.now()` and this page told Google it had changed **on every single
  // deploy**, the exact signal this file exists to stop sending. Caught by
  // reading the rendered sitemap rather than the source: the route was dated
  // today while nothing about it had been touched.
  // 2026-10-20: "off-plan marketing in Dubai" in the opener and a heading.
  // 2026-10-24: "real estate website design in Dubai" in a heading.
  "/real-estate-marketing": "2026-10-24",
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
  // 2026-10-24: see the roadmap 420 note at the end of this list.
  "web-design": "2026-10-24",
  "ui-ux-design": "2026-10-16",
  "graphic-design-branding": "2026-10-24",
  "video-conversion": "2026-10-16",
  // Ten more the same day: the CRM integration hub and its four platforms,
  // React Native, iOS, Android and app back end, and Figma. Their three
  // parents (CRM, mobile, web design) gained cards and links to them.
  "crm-integration": "2026-10-16",
  "hubspot-integration": "2026-10-16",
  "salesforce-integration": "2026-10-16",
  "custom-crm-development": "2026-10-16",
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
  // ios and android: 2026-10-24, proof block added (audit batch 2).
  "ios-app-development": "2026-10-24",
  "android-app-development": "2026-10-24",
  "website-app-development": "2026-10-19",
  // 2026-10-24: two FAQ answers name the UAE and the UK, matching areaServed.
  "digital-marketing": "2026-10-24",
  "facebook-ads": "2026-10-19",
  // 2026-10-20: one buyer phrase each in a heading (and for SEO, the intro):
  // "freelance SEO consultant", "LinkedIn marketing services", "custom web
  // development in Dubai".
  "linkedin-marketing": "2026-10-20",
  "custom-web-development": "2026-10-20",
  // 2026-10-24 (roadmap 420): the Ubersuggest targets, one phrase each in a
  // heading or FAQ question. SEO also gained a "Local SEO in Dubai" section;
  // web design a short UAE and Abu Dhabi section; graphic design a reworded
  // FAQ question. Web design and graphic design are dated in place above.
  "seo": "2026-10-24",
  // 2026-10-24 (audit batch 2): the mobile, React Native, iOS and Android
  // pages and web design now show their portfolio proof block.
  "react-native-development": "2026-10-24",
  "mobile-app-development": "2026-10-24",
  "google-ads": "2026-10-24",
  "paid-marketing": "2026-10-24",
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
export const PORTFOLIO_CONTENT_DATE = "2026-10-24";

/** Each published client's own date, for its case study pages (overview,
 *  projects, app page). Added 2026-10-24 (audit batch 2): one shared date meant
 *  publishing Texdale either left it dated 10-14, before it existed, or told
 *  Google every LEOS page changed the day Texdale went up.
 *
 *  From `git log` on the client's lines in `caseStudies.ts` and
 *  `caseStudyDepth.ts`: LEOS last changed on 2026-10-16 (the app wording in
 *  2978560), Texdale was published on 2026-10-24 (cca652b). A client not
 *  listed falls back to `PORTFOLIO_CONTENT_DATE`. */
export const CLIENT_CONTENT_DATES: Record<string, string> = {
  "leos-developments": "2026-10-16",
  texdale: "2026-10-24",
};

export function clientContentDate(clientSlug: string): string {
  return CLIENT_CONTENT_DATES[clientSlug] ?? PORTFOLIO_CONTENT_DATE;
}

/** Discipline pages carry their own copy in `src/data/disciplines.ts` as well
 *  as the shared captures, so they date from when that copy was written rather
 *  than from the case study data.
 *
 *  Was 2026-09-09 until 2026-10-24, though `disciplines.ts` changed on 10-13,
 *  10-14, 10-16, 10-19 and 10-24 (Texdale's captures and the web development
 *  intro naming it). `npm run discipline-check` now warns when the data files
 *  have a newer commit than these dates. */
export const DISCIPLINE_CONTENT_DATE = "2026-10-24";

// Blog dates are not kept here. Each article's `dateModified` and sitemap
// `lastModified` come from its own `updatedAt` in `src/content/blog/<slug>.json`,
// and the /blog index pages use `BLOG_UPDATED_DATE` in `blogPosts.ts`.
