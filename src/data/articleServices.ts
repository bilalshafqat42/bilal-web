import { megaMenuGroups } from "@/data/pillars";
import type { BlogPost } from "@/data/blogPosts";

/**
 * Which service each recovered article should point a reader at.
 *
 * The problem this solves, measured from Search Console on 2026-09-30: the 13
 * article pages that earn impressions earn 6,933 of them between them, and the
 * commercial pages earn almost none. The articles are where the audience is.
 * Until now the only route off an article was `/appointment` and a block of
 * copy reading "I build the web and mobile products these notes come out of" —
 * which is true of the React posts and simply wrong on an article about UI/UX
 * design websites or Figma plugins. A reader who had just been told about icon
 * libraries was being asked whether they needed a product built.
 *
 * So the route off an article is now the service the article is actually about,
 * and the copy is written per service rather than once for all 52.
 *
 * Driven from `post.tags`, which the articles already carry, rather than a
 * hand-maintained slug list: a slug list would need an edit every time a post
 * is added and would silently miss it when nobody remembered. Tags were set in
 * WordPress by the person who wrote the posts, so they describe the subject
 * better than anything we would infer from the title.
 */

/** Tags in priority order. First match wins, so a post tagged both "Figma" and
 *  "UI UX Design" resolves the same way regardless of tag order, and the React
 *  posts tagged "Javascript" as well resolve to development rather than
 *  flapping between the two.
 *
 *  Priority matters most where the two lists overlap: "CSS" and "Flexbox" sit
 *  under development rather than design because the posts carrying them are
 *  about writing the CSS, not about the visual decision behind it. */
const TAG_ROUTES: { service: string; tags: string[] }[] = [
  // The commercial tags come first, ahead of the subject tags the recovered
  // WordPress posts carry. An article written to be found by a Dubai business
  // owner comparing agencies has an unambiguous destination, and nothing below
  // should be able to outrank it: "Digital Marketing" beating "Pricing" to the
  // services hub would be a silent downgrade of the only articles on this site
  // with buying intent behind them.
  {
    service: "paid-marketing",
    tags: ["Paid Ads"],
  },
  {
    service: "digital-marketing",
    tags: ["Digital Marketing", "Seo"],
  },
  // Ahead of UI/UX: a post about choosing or briefing a website's design
  // belongs on the web design page, which until 2026-10-13 had no article
  // pointing at it at all.
  {
    service: "web-design",
    tags: ["Web Design"],
  },
  {
    service: "ui-ux-design",
    tags: ["UI UX Design", "Figma", "Design"],
  },
  // Added 2026-10-16 with the CRM, app and Figma sub-pages. Same rule as the
  // CMS routes below: specific before general, and no article carries these
  // tags yet, so nothing currently routed changes. "best-crm-for-dubai-real-
  // estate" stays on digital marketing through its "Digital Marketing" tag,
  // which sits above. "Figma" deliberately stays on UI/UX: the two Figma
  // posts are about plugins, a designer's question rather than a hiring one,
  // and moving them would be a routing change nobody asked for.
  { service: "zoho-crm-integration", tags: ["Zoho", "Zoho CRM"] },
  { service: "hubspot-integration", tags: ["HubSpot"] },
  { service: "salesforce-integration", tags: ["Salesforce", "Salesforce Marketing Cloud"] },
  { service: "custom-crm-development", tags: ["Custom CRM"] },
  { service: "crm-integration", tags: ["CRM", "CRM Integration"] },
  { service: "ios-app-development", tags: ["iOS"] },
  { service: "android-app-development", tags: ["Android"] },
  { service: "react-native-development", tags: ["React Native"] },
  { service: "app-backend-development", tags: ["Firebase", "MongoDB"] },
  {
    service: "mobile-app-development",
    tags: ["Mobile Apps"],
  },
  // Added 2026-10-16 with the CMS and custom development pages. Ahead of
  // "Web Development" so a post about one platform reaches that platform's page
  // rather than the general one. No article carries these tags yet; the routes
  // exist so the first one that does is linked correctly on the day it ships.
  // "WordPress or Next.js" deliberately stays on web development: it compares
  // across the two pages rather than belonging to either, and roadmap 405 put
  // it on that page's reading list to get it crawled. The CMS hub and the
  // WordPress page link to it from their copy instead.
  { service: "wordpress-development", tags: ["WordPress", "Elementor"] },
  { service: "wix-development", tags: ["Wix"] },
  { service: "squarespace-development", tags: ["Squarespace"] },
  { service: "strapi-development", tags: ["Strapi", "Headless CMS"] },
  { service: "cms-development", tags: ["CMS"] },
  { service: "custom-web-development", tags: ["Custom Web Development", "MERN Stack"] },
  {
    service: "website-app-development",
    tags: [
      "Web Development",
      "React Js",
      "React Hooks",
      "Redux",
      "Node JS",
      "Typescript",
      "Javascript",
      "Es6",
      "CSS",
      "Flexbox",
    ],
  },
];

/** The pitch, per service.
 *
 *  Written to follow the article rather than to sell over the top of it. A
 *  reader who has just finished a 500-word explainer has not asked to be sold
 *  to, so each one names the work plainly and says what a first conversation
 *  costs, which is nothing.
 *
 *  `eyebrow` and `heading` stay short because they render inside a centred
 *  panel at `t-h2`; `body` carries the specifics. */
type Pitch = { eyebrow: string; heading: string; accent: string; body: string };

const PITCHES: Record<string, Pitch> = {
  "paid-marketing": {
    eyebrow: "Campaign work",
    heading: "Want this",
    accent: "spent better?",
    body:
      "I plan and run paid campaigns across Google, Meta, TikTok, Snapchat and LinkedIn, with the tracking built before the spend starts so the reporting is cost per enquiry rather than cost per click.",
  },
  "web-design": {
    eyebrow: "Website work",
    heading: "Want a site that",
    accent: "brings enquiries?",
    body:
      "I design websites built around the campaigns that send people to them, so the page a visitor lands on is written and laid out to turn that visit into an enquiry. A first conversation costs nothing.",
  },
  "ui-ux-design": {
    eyebrow: "Design work",
    heading: "Want this",
    accent: "designed properly?",
    body:
      "Reading about good interface design is the easy part. I design the websites, apps and product interfaces these notes come out of, working directly with you rather than through an account manager.",
  },
  "mobile-app-development": {
    eyebrow: "App work",
    heading: "Need the app",
    accent: "actually built?",
    body:
      "I build iOS and Android apps in React Native, with the back-end and the store submission included rather than left as somebody else's problem. A first conversation costs nothing.",
  },
  "website-app-development": {
    eyebrow: "Build work",
    heading: "Need this",
    accent: "built properly?",
    body:
      "I build the web and mobile products these notes come out of, in React, React Native and Node. A first conversation costs nothing and often ends with a smaller scope than you expected.",
  },
  "cms-development": {
    eyebrow: "Website work",
    heading: "Not sure which",
    accent: "CMS to choose?",
    body:
      "I build on WordPress, Wix, Squarespace and Strapi, and choose between them by who edits the site and what the campaigns need from it. A first conversation costs nothing.",
  },
  "wordpress-development": {
    eyebrow: "WordPress work",
    heading: "Want WordPress",
    accent: "built properly?",
    body:
      "I build custom WordPress themes your marketing team can edit, with the tracking and CRM forms wired in from the start rather than added by a plugin later. A first conversation costs nothing.",
  },
  "wix-development": {
    eyebrow: "Wix work",
    heading: "Want a Wix site",
    accent: "that brings enquiries?",
    body:
      "I set up Wix sites that owners can run themselves, with SEO, tracking and lead forms configured properly from day one. A first conversation costs nothing.",
  },
  "squarespace-development": {
    eyebrow: "Squarespace work",
    heading: "Want Squarespace",
    accent: "done properly?",
    body:
      "I build design-led Squarespace sites you can maintain yourself, with tracking and lead capture set up so the site is measured, not just admired. A first conversation costs nothing.",
  },
  "strapi-development": {
    eyebrow: "Headless CMS work",
    heading: "Need structured",
    accent: "content at speed?",
    body:
      "I build Strapi back ends with Next.js front ends for teams that publish a lot of structured content, and I will tell you when it is more than you need. A first conversation costs nothing.",
  },
  "custom-web-development": {
    eyebrow: "Build work",
    heading: "Need something a",
    accent: "CMS cannot do?",
    body:
      "I build custom web applications in React, Next.js and Node, with the tracking and CRM connections a marketing team needs. A first conversation costs nothing.",
  },
  "crm-integration": {
    eyebrow: "CRM work",
    heading: "Leads in five",
    accent: "different places?",
    body:
      "I connect forms, lead ads and WhatsApp to one CRM, with routing, deduplication and cost per qualified lead in a single view. A first conversation costs nothing.",
  },
  "zoho-crm-integration": {
    eyebrow: "Zoho work",
    heading: "Want Zoho",
    accent: "set up properly?",
    body:
      "I connect Meta lead ads and web forms to Zoho CRM, with assignment rules and WhatsApp follow-up, so every lead reaches the right person fast. A first conversation costs nothing.",
  },
  "hubspot-integration": {
    eyebrow: "HubSpot work",
    heading: "Want HubSpot",
    accent: "everyone trusts?",
    body:
      "I finish HubSpot setups: forms and ads connected, lifecycle stages defined with sales, and reports both teams accept. A first conversation costs nothing.",
  },
  "salesforce-integration": {
    eyebrow: "Salesforce work",
    heading: "Marketing Cloud",
    accent: "working harder?",
    body:
      "I design Marketing Cloud EDMs and CloudPages and connect campaigns and lead capture to Salesforce, alongside your administrator. A first conversation costs nothing.",
  },
  "custom-crm-development": {
    eyebrow: "CRM build work",
    heading: "Outgrown your",
    accent: "CRM?",
    body:
      "I build custom CRMs on MERN and Next.js with lead intake, attribution and ad platform syncs, and I will tell you if configuration would do instead. A first conversation costs nothing.",
  },
  "react-native-development": {
    eyebrow: "App work",
    heading: "One app for",
    accent: "iOS and Android?",
    body:
      "I build iOS and Android apps in React Native, with the tracking and CRM connections in from the first release. A first conversation costs nothing.",
  },
  "ios-app-development": {
    eyebrow: "iOS work",
    heading: "Need an app",
    accent: "on the App Store?",
    body:
      "I build iPhone and iPad apps in React Native and take them through TestFlight and App Review under your account. A first conversation costs nothing.",
  },
  "android-app-development": {
    eyebrow: "Android work",
    heading: "Need an app",
    accent: "on Google Play?",
    body:
      "I build Android apps in React Native, test them on real devices across the range and publish through Play Console under your account. A first conversation costs nothing.",
  },
  "app-backend-development": {
    eyebrow: "Back-end work",
    heading: "Firebase or",
    accent: "MongoDB?",
    body:
      "I build app back ends on Firebase or on Node and MongoDB, with admin panels and CRM sync, and explain which suits your app first. A first conversation costs nothing.",
  },
  "digital-marketing": {
    eyebrow: "Growth work",
    heading: "Want people to",
    accent: "actually find it?",
    body:
      "A site nobody reaches is a site nobody buys from. I handle the search, content and outreach side of getting a business found, measured against enquiries rather than impressions.",
  },
};

/** The fallback, for the handful of posts whose tags name a tool rather than a
 *  discipline: "AI", "ChatGPT", "DeepSeek", "Tools". Pointing those at a
 *  specific service would be a guess, so they go to the hub, which is a real
 *  destination listing all nine. */
const FALLBACK = {
  href: "/services",
  label: "all services",
  pitch: {
    eyebrow: "Working together",
    heading: "Got a project",
    accent: "in mind?",
    body:
      "Marketing, design and development under one roof, run by one person rather than handed between three. A first conversation costs nothing and often ends with a smaller scope than you expected.",
  } satisfies Pitch,
};

export type ArticleService = {
  /** The service page to link to. */
  href: string;
  /** How the service is named in the link, e.g. "UI/UX Design". */
  label: string;
  pitch: Pitch;
};

/**
 * Resolve an article to the service it should send a reader to.
 *
 * Never returns undefined: an article with no matching tag resolves to the
 * services hub. A dead end is the thing this module exists to remove, so
 * falling back to nothing would defeat it.
 */
export function serviceForArticle(post: BlogPost): ArticleService {
  for (const route of TAG_ROUTES) {
    if (!post.tags.some((t) => route.tags.includes(t))) continue;
    // Read the label from the menu data rather than restating it here. The
    // group titles are what the nav, /services and llms.txt already use, so a
    // rename lands in one place instead of drifting out of step the way the
    // "eight services" copy did.
    const group = megaMenuGroups.find((g) => g.slug === route.service);
    if (!group) continue;
    return {
      href: `/services/${group.slug}`,
      label: group.title,
      pitch: PITCHES[route.service] ?? FALLBACK.pitch,
    };
  }
  return { href: FALLBACK.href, label: FALLBACK.label, pitch: FALLBACK.pitch };
}
