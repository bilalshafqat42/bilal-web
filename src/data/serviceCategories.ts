import type { Accent, Faq } from "./types";
import { serviceMenuColumns, type MenuColumn } from "./menu";
import { yearsExperience } from "@/lib/site";

/**
 * The fifteen service category pages: their copy, and the menu items that point
 * at their sections.
 *
 * Split out of `pillars.ts` on 2026-10-13, which had grown to 1,312 lines. The
 * menu and the page still read from one array here, so they cannot describe
 * different things. What changed is that the client never imports it: the
 * header receives `buildServiceMenu()` as props instead. `pillars.ts`
 * re-exports everything below, so existing imports keep working.
 */

export type MegaMenuItem = {
  title: string;
  pillarSlug: string;
};

export type MegaMenuGroup = {
  /** Category page slug. Three deliberately reuse existing pillar slugs
   *  (paid-marketing, website-app-development, crm-marketing-automation) so those
   *  already-indexed URLs keep working rather than needing redirects. */
  slug: string;
  title: string;
  accent: Accent;
  /** Page-level copy. Kept here rather than in a separate file so the menu and
   *  the page it points at can never describe different things. */
  headline: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  /** The "Typical timeline" line in the Services menu preview rail.
   *
   *  **Only set where this site already publishes the answer**, and each one
   *  below names the FAQ it is condensed from. A timeline is a service promise:
   *  inventing one would be the same fault as the prototype's fabricated
   *  "Recent work" figures, which were dropped for the same reason. Seven of
   *  the fifteen have no published answer and show no timeline rather than a
   *  guessed one. */
  railTimeline?: string;
  faqs: Faq[];
  items: MegaMenuItem[];
  /** The page this one sits under, by slug. Added 2026-10-16 with the CMS and
   *  custom development pages, the first service pages below another service
   *  page. Drives the visible breadcrumb and the BreadcrumbList schema, so the
   *  two cannot disagree: Services › Website & App Development › CMS
   *  Development › WordPress Development. URLs stay flat on purpose; the
   *  hierarchy is stated, not encoded in the path. */
  parent?: string;
  /** A short name for tight spaces (the footer's platform row). */
  shortTitle?: string;
  /** The h2 over the long-form section. Defaults to "How {title} works in
   *  practice", with the title cased by `titleInSentence`. */
  depthHeading?: string;
  /** Other service pages this one should send a reader to, as cards near the
   *  top rather than in the "Other services" list at the bottom. The CMS hub
   *  uses it to put its four platforms and custom development in front of the
   *  reader; each platform page uses it for its siblings. */
  related?: { heading: string; intro: string; slugs: string[] };
  /** The heading over this page's sub-pages on /services. Defaults to
   *  "{title} by platform", which reads right for the CMS platforms and wrong
   *  for a single Figma page under Web Design. */
  subPagesHeading?: string;
};

/** Product and platform names that keep their capitals mid-sentence. */
const KEEP_CASE = new Set(["Google", "Ads", "Facebook", "Meta", "LinkedIn"]);

/** A page title as it reads inside a sentence: "Google Ads", "UI/UX design",
 *  "CRM & MarTech integration", "paid marketing". The old default lowercased
 *  the whole title and rendered "How google ads works" and "How ui/ux design
 *  works" on live pages. Acronyms and mixed-case names (any word with more than
 *  one capital) and the names above keep their casing; ordinary words drop it. */
export function titleInSentence(title: string): string {
  return title
    .split(" ")
    .map((w) => (KEEP_CASE.has(w) || (w.match(/[A-Z]/g)?.length ?? 0) > 1 ? w : w.toLowerCase()))
    .join(" ");
}

export function getCategoryBySlug(slug: string): MegaMenuGroup | undefined {
  return megaMenuGroups.find((g) => g.slug === slug);
}

/** The chain of pages above one, outermost first, not including itself. */
export function categoryAncestors(slug: string): MegaMenuGroup[] {
  const out: MegaMenuGroup[] = [];
  let current = getCategoryBySlug(slug);
  while (current?.parent) {
    const parent = getCategoryBySlug(current.parent);
    if (!parent || out.includes(parent)) break;
    out.unshift(parent);
    current = parent;
  }
  return out;
}

/** The slugs the Services menu lists. The four CMS platform pages are not in
 *  it: they are reached from the CMS hub, its siblings and the footer, so the
 *  menu keeps one entry per buyer decision rather than one per tool. */
export function isInServiceMenu(slug: string): boolean {
  return serviceMenuColumns.some((c) => c.slugs.includes(slug));
}

/** Service pages listed in the menu, in data order. What /services shows as
 *  cards and what "Other services" lists at the foot of each page. */
export function menuGroups(): MegaMenuGroup[] {
  return megaMenuGroups.filter((g) => isInServiceMenu(g.slug));
}

/** Pages that sit under `slug` but are not in the menu themselves, depth
 *  first: a hub, then the pages under that hub. Recursive since 2026-10-16,
 *  when CRM Integration became the first hub that is itself off the menu, so
 *  Zoho, HubSpot, Salesforce and custom CRM (two levels below the menu's CRM
 *  page) still reach /services and the footer. It only descends through pages
 *  that are off the menu: CMS Development is in the menu and lists its own
 *  platforms, so Website & App Development does not list them a second time. */
export function subPagesOf(slug: string, seen: Set<string> = new Set([slug])): MegaMenuGroup[] {
  // `seen` guards against two pages naming each other as parent, which would
  // otherwise recurse until the build runs out of stack.
  return megaMenuGroups
    .filter((g) => g.parent === slug && !isInServiceMenu(g.slug) && !seen.has(g.slug))
    .flatMap((g) => {
      seen.add(g.slug);
      return [g, ...subPagesOf(g.slug, seen)];
    });
}

// Curated mega-menu grouping: 8 standalone columns by discipline (paid ads,
// social/digital marketing, dev, UI/UX, graphic design, CRM/MarTech, video),
// independent of the underlying 4 pillar pages. Each item carries its own
// pillarSlug since "CRM & MarTech Integration" deliberately pulls Performance
// Marketing in from the Paid Marketing pillar. Every item title must exactly
// match a section title on its pillarSlug's page, since the link is built
// from `slugify(item.title)` matching that section's anchor id.
/**
 * The number of service categories, spelled out for prose.
 *
 * Added 2026-09-24 (roadmap 213.6). The /services h1, its meta description and
 * llms.txt all said "eight" while this array held nine and the page rendered
 * nine cards — a count a visitor can check by looking. Reading it from the data
 * is the only version that cannot drift again.
 *
 * Extended to twenty on 2026-10-13 so it can also spell the years of
 * experience, which `yearsExperience()` now computes rather than a hard-coded
 * "fifteen" that would go stale every January.
 */
const COUNT_WORDS = [
  "zero", "one", "two", "three", "four", "five",
  "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
  "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty",
] as const;

export function spellCount(n: number): string {
  return COUNT_WORDS[n] ?? String(n);
}

// Titles rewritten 2026-10-02 (roadmap 320, Phase 1). Every competing
  // freelance site in Dubai leads its title with the search phrase and puts the
  // name second — thirteen of thirteen, checked live. This site was the only one
  // doing it the other way, which is why sumayyalatheef.com outranks it on six
  // backlinks and domain authority 4.
  //
  // Two of these carried no "Dubai" at all and none carried "freelance", which
  // is the one word that makes these terms winnable: agencies will not use it.
  //
  // Each measured against Google's ~600px title budget before shipping, because
  // the September 23 shortening exists for exactly that reason. Widest here is
  // 545px; six of the nine are narrower than what they replace.
export const megaMenuGroups: MegaMenuGroup[] = [
  {
    slug: "paid-marketing",
    title: "Paid Marketing",
    headline: "Paid marketing in Dubai, reported as cost per lead rather than impressions",
    intro:
      "Paid marketing in Dubai only works when it is built around the sales pipeline it feeds. I plan, launch and manage campaigns across Google and every major social platform, with conversion tracking configured before a dirham is spent, so performance is measured against real enquiries rather than clicks and reach.",
    // Narrowed 2026-10-04 when Google Ads got its own page below. "Google Ads &
    // Paid Ads" carried two searches and so competed for neither — the same
    // ampersand problem fixed on the designer and developer pages in Phase 2.
    // This is now the hub: the platform sections live here, Google Ads has the
    // volume and therefore its own page.
    metaTitle: "Freelance Paid Marketing in Dubai | Bilal Shafqat",
    metaDescription:
      "Freelance paid marketing in Dubai across Google, Meta, TikTok and LinkedIn, with conversion tracking from day one and reporting in cost per lead.",
    // Condensed from "How long before the numbers mean anything?"
    railTimeline: "Two to four weeks before the numbers mean anything",
    faqs: [
      {
        question: "Which platforms do you manage?",
        answer:
          "Google Search, Shopping, Display and Performance Max, Meta across Facebook and Instagram, plus TikTok, Snapchat and LinkedIn. I recommend the mix based on where your buyers actually are rather than running every channel by default.",
      },
      {
        question: "Do you handle the creative as well as the buying?",
        answer:
          "Yes. Ad creative and copy come from the same person managing the spend, so there is no handoff between a media buyer and a separate designer.",
      },
      {
        question: "What does reporting look like?",
        answer:
          "Cost per lead and cost per acquisition tied to real enquiries, not impressions and engagement. Tracking is configured before launch so the numbers mean something from the first week.",
      },
    ],
    accent: "gold",
    items: [
      { title: "Google Ads & Performance Max", pillarSlug: "paid-marketing" },
      { title: "Meta Ads", pillarSlug: "paid-marketing" },
      { title: "TikTok Ads", pillarSlug: "paid-marketing" },
      { title: "Snapchat Ads", pillarSlug: "paid-marketing" },
      { title: "LinkedIn Advertising", pillarSlug: "paid-marketing" },
    ],
  },
  {
    // Added 2026-10-04 (Phase 3). Google Ads is the only one of the five
    // platforms with measured demand: "Google Ads agency Dubai" 390 searches at
    // difficulty **9**, plus "google ads agency in dubai" 170/11, "google
    // adwords company dubai" 170/11 and "google ads dubai" 140/24 — roughly 870
    // searches across the variants, at the lowest difficulty on the board.
    //
    // Meta, TikTok, Snapchat and LinkedIn are deliberately NOT pages. None of
    // them appeared in Ubersuggest's suggestions for this site, which is weak
    // evidence of low volume rather than proof of none, and four near-identical
    // pages chasing nothing is the doorway pattern this plan rejects (roadmap
    // 320). They are deepened sections on the hub with working anchors —
    // `/services/paid-marketing#tiktok-ads` is already a destination a prospect
    // can be sent to and an assistant can cite.
    //
    // If Bilal's four-credit check comes back with real volume on any of them,
    // that one becomes a page and is written to rank rather than to prove.
    slug: "google-ads",
    title: "Google Ads",
    accent: "cyan",
    headline: "Google Ads in Dubai: the one channel where people type what they want",
    intro:
      "Everywhere else you interrupt someone. On search they have typed the thing they are looking for, in their own words, which makes Google Ads in Dubai the shortest route from a budget to an enquiry and usually the place to start. It is also the easiest place to waste money, because the default settings are built to spend it.",
    metaTitle: "Freelance Google Ads in Dubai | Bilal Shafqat",
    metaDescription:
      "Google Ads in Dubai planned and managed by a freelancer, with tracking built before the spend starts and reporting in enquiries rather than clicks.",
    // Condensed from "How soon will I see results?"
    railTimeline: "Clicks immediately, useful conclusions in weeks",
    faqs: [
      {
        question: "What budget do I need to start?",
        answer:
          "Enough for the data to mean something, which is the real constraint rather than any minimum Google sets. A campaign running on a token amount produces numbers too small to draw conclusions from, and that is the worst outcome: you spend and learn nothing. Decide what you can commit for three months before launching, not after.",
      },
      {
        question: "Why is my cost per click so high in Dubai?",
        answer:
          "Because in several sectors here you are bidding against portals and agencies with far larger budgets. Property is the clearest case. That is not always fixable, and the honest answer is sometimes that a term is not worth buying at any price. What is fixable is how much of your spend reaches people who were never going to convert, which is usually most of it.",
      },
      {
        question: "Should I use Performance Max?",
        answer:
          "Eventually, rarely first. It will spend whatever you give it and tell you very little about where it went. Run search campaigns until you know which terms and audiences convert, then let Performance Max work from that, with brand excluded so it does not take credit for people who were already looking for you.",
      },
      {
        question: "Do you work in my account or your own?",
        answer:
          "Yours, under your billing, with you as owner. This matters more than it sounds: an agency that builds campaigns in its own account keeps the conversion history when the relationship ends, and you start from zero with whoever comes next. Your data should stay yours.",
      },
      {
        question: "How soon will I see results?",
        answer:
          "Clicks immediately, useful conclusions in weeks. The first fortnight is mostly learning which searches you are actually showing for, which is rarely what anyone expected. Judge it on cost per qualified enquiry after a month, not on the dashboard after three days.",
      },
    ],
    items: [
      { title: "Google Ads & Performance Max", pillarSlug: "paid-marketing" },
      { title: "Lead Generation", pillarSlug: "paid-marketing" },
      { title: "Performance Marketing & Optimisation", pillarSlug: "paid-marketing" },
    ],
  },
  {
    // Added 2026-10-04 after the four-credit check, which overturned the prior.
    //
    // "meta ads dubai" has **no measurable search volume** — but the term
    // people actually type is **"facebook ads dubai", at 90 searches**, which
    // is the same volume as "freelance web developer dubai" and higher than
    // several terms that already have pages. The platform renamed itself in
    // 2021 and the searches did not follow.
    //
    // The SERP is unusually open: the top ten average **0 backlinks** at domain
    // authority 34, and the sites holding it (lengreo.com, lucidly.ae,
    // bigalc.ae) have 0, 0 and 0 respectively. There is nothing to outrank.
    //
    // The page is named for the search, not for the brand's current name.
    slug: "facebook-ads",
    title: "Facebook & Meta Ads",
    accent: "violet",
    headline: "Facebook ads in Dubai: the creative targets, the form decides what you get",
    intro:
      "Nobody opens Facebook or Instagram to buy something, so Facebook ads in Dubai have to earn attention rather than capture it. That makes the creative the real targeting mechanism, and it makes the lead form the place where most budgets quietly go wrong.",
    metaTitle: "Freelance Facebook Ads in Dubai | Bilal Shafqat",
    metaDescription:
      "Facebook ads in Dubai across Facebook and Instagram, measured on qualified enquiries rather than the cheap leads instant forms tend to produce.",
    faqs: [
      {
        question: "Why do my Meta leads never answer the phone?",
        answer:
          "Because instant forms are designed to be easy, and easy produces volume rather than intent. Somebody taps twice between two videos and the form auto-fills from their profile without them reading it. The fix is friction in the right place: one qualifying question the idle tapper will not bother with, and a follow-up call within minutes rather than the next working day.",
      },
      {
        question: "Facebook or Instagram?",
        answer:
          "Both, from one campaign, with the placements decided by where the results actually come from rather than by assumption. In the UAE the split varies enormously by product and by audience age, and it is cheap to find out and expensive to guess.",
      },
      {
        question: "Do you make the creative or do I supply it?",
        answer:
          "I make it, and that is usually the deciding factor. A campaign is mostly creative here, and repurposed brochure images perform badly against video made for the feed. If you have a brand team producing assets, I will work to them and say honestly when the creative is the thing holding the account back.",
      },
      {
        question: "How much should I budget?",
        answer:
          "Enough to get out of the learning phase on each campaign, which is the real floor rather than any minimum Meta publishes. Spreading a small budget across five audiences keeps all five learning and none converting. Fewer campaigns with more behind each is almost always the better call at the start.",
      },
      {
        question: "Is it worth it for property?",
        answer:
          "For awareness and for launches, yes, and the cost per lead will look excellent next to Google. For qualified buyers it needs the tracking and the qualification in place first, or you end up paying for volume that your sales team then has to filter by hand. There is a longer piece on this site comparing it directly with Google Ads for Dubai property.",
      },
    ],
    items: [
      { title: "Meta Ads", pillarSlug: "paid-marketing" },
      { title: "Social Media Marketing", pillarSlug: "design-content-conversion" },
      { title: "Lead Generation", pillarSlug: "paid-marketing" },
    ],
  },
  {
    // Added 2026-10-04, same check. "linkedin ads dubai" has no measurable
    // volume and its SERP returned **no results at all**; "linkedin marketing
    // dubai" has **70 searches**, with "linkedin marketing services in dubai"
    // at 30. So the page is LinkedIn marketing, not LinkedIn ads.
    //
    // TikTok and Snapchat got no page from the same check: neither term has
    // volume, TikTok's best related search is "is tiktok banned in dubai" (50,
    // wrong intent entirely) and its top ten averages **818 backlinks** because
    // ads.tiktok.com holds it. Both stay as sections on the paid hub.
    slug: "linkedin-marketing",
    title: "LinkedIn Marketing",
    accent: "cyan",
    headline: "LinkedIn marketing in Dubai, the one place you can target a job title",
    intro:
      "LinkedIn marketing in Dubai costs several times what the other platforms do per click, and for a narrow commercial audience it is still the cheapest way to reach them. Targeting by job title, company size and seniority is something no other channel does properly, which makes it right for B2B and commercial property and wrong for most residential.",
    metaTitle: "Freelance LinkedIn Marketing in Dubai | Bilal Shafqat",
    metaDescription:
      "LinkedIn marketing in Dubai for B2B and commercial property, targeted by job title and company rather than by interest, and wired into your CRM.",
    faqs: [
      {
        question: "Why is LinkedIn so expensive?",
        answer:
          "Because the targeting is worth it to advertisers who need it. You are paying for the ability to reach heads of procurement at companies over a certain size, which no other platform can do. Judge it on cost per qualified conversation rather than cost per click, and for the right audience it is often the cheapest channel by that measure.",
      },
      {
        question: "Is LinkedIn worth it for real estate?",
        answer:
          "For commercial property and for investor audiences, often yes. For residential, usually not, and I would rather tell you that than take the budget. The exception is a development aimed squarely at a professional segment you can name, where the targeting earns its premium.",
      },
      {
        question: "Ads, or organic content, or both?",
        answer:
          "For most UAE businesses, organic content from a real person outperforms the company page by a wide margin, and costs nothing but time. Ads work best amplifying content that already earned engagement rather than running cold. If you have a founder willing to post, start there.",
      },
      {
        question: "Can lead gen forms feed my CRM?",
        answer:
          "Yes, and they should. LinkedIn lead gen forms convert well because they pre-fill from the profile, which is also why they need the same qualifying question Meta forms do. Wired into the CRM with the campaign attached, so the source survives to the point where someone can tell you whether it produced revenue.",
      },
    ],
    items: [
      { title: "LinkedIn Advertising", pillarSlug: "paid-marketing" },
      { title: "Demand Generation", pillarSlug: "paid-marketing" },
      { title: "Lead Generation", pillarSlug: "paid-marketing" },
    ],
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    headline: "Social media marketing in Dubai, handled end to end rather than handed over",
    intro:
      "Most social media marketing in Dubai stops at delivering assets. This covers the whole thing: the strategy, the content calendar, the creative itself, and the actual posting and engagement. Because the same person also runs the paid campaigns, organic and paid reinforce each other instead of running as separate projects.",
    metaTitle: "Social Media Marketing in Dubai | Bilal Shafqat",
    metaDescription:
      "Social media marketing in Dubai: strategy, content, posting and community, run by the same freelancer handling the paid campaigns beside it.",
    faqs: [
      {
        question: "Do you post as well as design?",
        answer:
          "Yes. Channel management, community engagement and performance reporting are included, not just handing over a folder of assets.",
      },
      {
        question: "How does this connect to paid campaigns?",
        answer:
          "The same creative direction runs across both, so an organic post and a paid ad look like they came from one brand. That is the practical advantage of one person covering both.",
      },
    ],
    accent: "cyan",
    items: [
      { title: "Social Media Strategy & Design", pillarSlug: "design-content-conversion" },
      { title: "Social Media Marketing", pillarSlug: "design-content-conversion" },
      { title: "Social Media Planning", pillarSlug: "design-content-conversion" },
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing & Outreach",
    headline: "Digital marketing in Dubai, run as one sequence rather than four",
    intro:
      "Digital marketing in Dubai is usually bought as a bundle and delivered as four separate projects, which is where the money goes. Demand generation builds awareness before someone is ready to buy, lead generation captures it, email and WhatsApp follow it up, and the tracking tells you which of them worked. Run by one person as one sequence, they compound instead of leaking. You get the full path from first awareness to a contact sitting in your CRM with a next action against it.",
    // The URL is /services/digital-marketing and the category is called
    // "Digital Marketing & Outreach", but the title said neither — it opened on
    // "Lead Generation", so the page Bilal wants found for "digital marketing"
    // never used the phrase in the one field that matters most.
    metaTitle: "Digital Marketing in Dubai | Bilal Shafqat",
    metaDescription:
      "Digital marketing in Dubai from one freelance specialist: paid ads, search, email and WhatsApp, run as one sequence rather than four projects.",
    faqs: [
      {
        question: "What is the difference between demand generation and lead generation?",
        answer:
          "Demand generation builds awareness and interest among people who are not ready to buy. Lead generation captures contact details from those who are. You need both: capture alone runs out of people to capture.",
      },
      {
        question: "Why WhatsApp?",
        answer:
          "It is the default business channel across the UAE. Broadcast campaigns, automated replies and lead capture flows there reach people where they already are, rather than where a marketing textbook says they should be.",
      },
    ],
    accent: "gold",
    items: [
      { title: "Demand Generation", pillarSlug: "paid-marketing" },
      { title: "Lead Generation", pillarSlug: "paid-marketing" },
      { title: "Email Marketing", pillarSlug: "paid-marketing" },
      { title: "WhatsApp Marketing", pillarSlug: "paid-marketing" },
    ],
  },
  {
    slug: "website-app-development",
    title: "Website & App Development",
    headline: "Web development in Dubai by a freelance web developer who builds for the marketing",
    intro:
      "Web development in Dubai is easy to buy and harder to buy well, because a site that looks good but does not convert is a cost, not an asset. As a freelance web developer in Dubai, I start from the campaigns that will send traffic to the site rather than from the homepage. I build on Next.js for speed and search performance, React Native for mobile, and the MERN stack for custom tools.",
    // Narrowed 2026-10-02, once mobile got its own page in the category above.
    // "Web & App Developer" carried both and so was aimed at neither, which is
    // the mistake this whole phase exists to undo. Mobile searches now land on
    // the mobile page; this one is for "web developer Dubai".
    // Retargeted 2026-10-16 at Bilal's request: "web development dubai" first,
    // with "freelance web developer in dubai" and "freelance web development
    // in dubai" as the secondary phrases. The title leads with the head term
    // because the scorer and Google both weight the opening words.
    metaTitle: "Web Development in Dubai | Freelance Web Developer",
    metaDescription:
      "Freelance web development in Dubai: Next.js and WordPress sites, landing pages and custom tools, from a web developer who also runs the ads.",
    // Condensed from "How long does a website take?"
    railTimeline: "Landing page two weeks, a full site four to eight",
    faqs: [
      {
        question: "What do you build with?",
        answer:
          "Next.js and React for websites and landing pages, React Native for mobile apps, the MERN stack with MongoDB or PostgreSQL for custom applications, and WordPress, Wix, Squarespace or Strapi where a CMS suits you better.",
      },
      {
        question: "Can you improve our existing site instead of rebuilding?",
        answer:
          "Often, yes. Many engagements extend or fix what is already there rather than starting over. We work out which makes sense once I have seen it.",
      },
      {
        question: "Do you design as well as build?",
        answer:
          "Yes, so what gets designed is what gets built, with nothing lost between a designer's file and a developer's implementation.",
      },
      {
        // Added 2026-10-16 for the secondary phrase. The answer restates the
        // handover section below rather than adding a new claim.
        question: "Is freelance web development in Dubai a risk for a business?",
        answer:
          "Only if the work is locked to the freelancer. The repository, the hosting account and the documentation are in your name from the start, so the site can move to an in-house developer or another supplier without a rebuild.",
      },
    ],
    accent: "violet",
    // "web development in Dubai" is this page's phrase, not the custom page's,
    // which keeps "custom" in front of it in every heading.
    depthHeading: "How web development in Dubai works in practice",
    items: [
      { title: "Website Design & Development", pillarSlug: "website-app-development" },
      { title: "Mobile App Development", pillarSlug: "website-app-development" },
      { title: "Custom Marketing Tools & Calculators", pillarSlug: "website-app-development" },
    ],
    related: {
      heading: "A CMS, or a custom build",
      intro:
        "Most web projects come down to one decision before any design starts: a CMS your own team edits, or something built in code because it has to do more than publish pages. Each has its own page.",
      slugs: ["cms-development", "custom-web-development"],
    },
  },
  // ---------------------------------------------------------------------------
  // CMS and custom development, added 2026-10-16 at Bilal's request. He
  // confirmed real project work on WordPress (with Elementor and ACF), Wix,
  // Squarespace and Strapi, and on the MERN stack, React, Next.js, TypeScript
  // and PHP.
  //
  // One buyer query per page (roadmap 398 §5): "cms development dubai" for the
  // hub, "<platform> developer dubai" for each platform, "custom web
  // development dubai" for the custom page. None of the six had a measured
  // volume when they shipped; they are in `scripts/lib/tracked.mjs` so the
  // daily report shows whether they earn impressions. The existing pages keep
  // their targets: "web development dubai" (since 2026-10-16) stays on website-app-development and
  // "web designer dubai" (with "wordpress web design dubai" as a section) on
  // web-design, which now links to the WordPress page rather than competing
  // with it.
  //
  // Each platform page argues when that platform is the wrong choice as well
  // as the right one. Four pages each saying "this platform is great" would be
  // the doorway pattern 398 rules out; four pages that disagree with each
  // other about who should use them are four different answers.
  //
  // Placed after website-app-development so the section it shares with the
  // custom page ("Custom Marketing Tools & Calculators") keeps resolving to
  // that page in the site search, which takes the first match.
  {
    slug: "cms-development",
    title: "CMS Development",
    accent: "violet",
    parent: "website-app-development",
    headline: "CMS development in Dubai, chosen by who edits the site and what the campaigns need",
    intro:
      "CMS development in Dubai usually starts with the wrong question: which platform is best. The useful questions are who will edit the site every week, how much content it has to carry, and what the campaigns pointed at it need from it. I build on WordPress, Wix, Squarespace and Strapi, and recommend the one that fits those answers rather than the one I prefer to build.",
    metaTitle: "CMS Development in Dubai | Bilal Shafqat",
    metaDescription:
      "CMS development in Dubai on WordPress, Wix, Squarespace and Strapi, chosen by who edits the site, with tracking and CRM forms built in.",
    depthHeading: "Choosing a CMS, and building it for marketing",
    related: {
      heading: "Pick the platform, or skip the CMS",
      intro:
        "Each platform has its own page: when it fits, when it does not, and what I build on it. If none of them fits, custom development is the fifth option.",
      slugs: [
        "wordpress-development",
        "wix-development",
        "squarespace-development",
        "strapi-development",
        "custom-web-development",
      ],
    },
    faqs: [
      {
        question: "Which CMS is best for a small business in Dubai?",
        answer:
          "There is no best in the abstract. For an owner-run brochure site, Wix or Squarespace is usually right: you can change it yourself and there is nothing to maintain. Once several people publish every week or the site carries hundreds of pages, WordPress earns its upkeep. Strapi only makes sense when content is structured and reused across a website, an app or several languages.",
      },
      {
        question: "Can you move my site from one CMS to another?",
        answer:
          "Yes. The work that matters is not copying pages, it is keeping what the old site earned: every URL either kept or redirected, titles and descriptions carried over, and the tracking and forms tested before the switch rather than after. A migration done without redirects throws away whatever search history the old pages had.",
      },
      {
        question: "Will I be able to edit the site myself?",
        answer:
          "That is the point of a CMS, so the build is judged on it. Before handover, the person who will actually edit the site does it in front of me: adds a page, changes a price, swaps an image. If that needs a manual, the build is not finished.",
      },
    ],
    items: [
      { title: "CMS Selection & Planning", pillarSlug: "website-app-development" },
      { title: "CMS Migration & Redirects", pillarSlug: "website-app-development" },
      { title: "Editor Training & Handover", pillarSlug: "website-app-development" },
    ],
  },
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    shortTitle: "WordPress",
    accent: "violet",
    parent: "cms-development",
    headline: "A WordPress developer in Dubai who builds the theme, not the plugin pile",
    intro:
      "Most slow, fragile WordPress sites were not built, they were assembled: a bought theme, a page builder on top, and twenty plugins doing jobs nobody remembers adding. As a WordPress developer in Dubai, I build the other kind: a theme made for your business, editing your marketing team can use without breaking the layout, and the tracking and CRM forms wired in from the first day.",
    metaTitle: "Freelance WordPress Developer in Dubai | Bilal Shafqat",
    metaDescription:
      "WordPress developer in Dubai: custom themes with Elementor and ACF, fast pages your team can edit, and lead forms that feed your CRM.",
    depthHeading: "How a WordPress build works in practice",
    related: {
      heading: "Other CMS options",
      intro:
        "WordPress is not always the right answer. These are the alternatives I build on, and the CMS page compares all four side by side.",
      slugs: ["cms-development", "wix-development", "squarespace-development", "strapi-development"],
    },
    faqs: [
      {
        question: "Do you use Elementor or build without a page builder?",
        answer:
          "Both, and the choice depends on who edits the site. Elementor suits a team that wants to build new layouts themselves, as long as it is set up with your fonts, colours and a small set of saved sections so pages stay on brand. For a team that edits content rather than layouts, a custom theme with ACF fields is faster, tidier and harder to break.",
      },
      {
        question: "Can you fix or speed up my existing WordPress site?",
        answer:
          "Usually, yes. Most slow WordPress sites are slow because of what was installed: a heavy theme, several plugins doing overlapping jobs, oversized images and scripts loading on every page. I audit first and tell you whether a clean-up gets you there or whether a rebuild is the better value over a year.",
      },
      {
        question: "Who looks after updates and security?",
        answer:
          "Someone has to, every month. WordPress itself, the theme and every plugin receive updates, and an unpatched plugin is a common way for a WordPress site to be compromised. I can run it as a care plan, or set it up so your own team or host can, with backups that are tested rather than assumed.",
      },
    ],
    items: [
      { title: "Custom WordPress Themes", pillarSlug: "website-app-development" },
      { title: "Elementor & ACF Builds", pillarSlug: "website-app-development" },
      { title: "WordPress Speed, SEO & Lead Forms", pillarSlug: "website-app-development" },
    ],
  },
  {
    slug: "wix-development",
    title: "Wix Development",
    shortTitle: "Wix",
    accent: "cyan",
    parent: "cms-development",
    headline: "A Wix developer in Dubai for owners who want to run the site themselves",
    intro:
      "Wix is the right call more often than developers admit. If you own a small business, update the site yourself and need it live in weeks rather than months, a Wix site set up properly will serve you well. As a Wix developer in Dubai, my job is the part owners usually skip: the structure, SEO and tracking that decide whether the site brings enquiries or just exists.",
    metaTitle: "Freelance Wix Developer in Dubai | Bilal Shafqat",
    metaDescription:
      "Wix developer in Dubai for small businesses: sites you can run yourself, campaign landing pages, and SEO, GA4 and Meta Pixel set up properly.",
    depthHeading: "How a Wix site is built in practice",
    related: {
      heading: "Other CMS options",
      intro:
        "If Wix is too limited for what you need, or more than you need, these are the alternatives. The CMS page compares all four.",
      slugs: ["cms-development", "squarespace-development", "wordpress-development", "strapi-development"],
    },
    faqs: [
      {
        question: "Is Wix good enough for a business website?",
        answer:
          "For a small business that maintains its own site, yes. It is reliable, the editor is easy, and hosting, security and updates are handled for you. It stops being enough when you need many editors with different permissions, complex custom functionality, or full control over speed and code.",
      },
      {
        question: "Can a Wix site rank on Google?",
        answer:
          "Yes. Wix lets you set titles, descriptions, URLs, redirects and structured data per page, which covers what most small sites need. What holds Wix sites back is usually the content rather than the platform: pages with no clear subject, images with no text, and a homepage trying to rank for everything at once.",
      },
      {
        question: "Can I move away from Wix later?",
        answer:
          "Not easily, and you should know that before you start. A Wix site cannot be exported to another host, so leaving means rebuilding the design elsewhere, although your text, images and domain come with you. For most small businesses that is an acceptable trade for never having to maintain anything.",
      },
    ],
    items: [
      { title: "Wix Website Setup", pillarSlug: "website-app-development" },
      { title: "Wix Campaign Landing Pages", pillarSlug: "website-app-development" },
      { title: "Wix SEO & Tracking", pillarSlug: "website-app-development" },
    ],
  },
  {
    slug: "squarespace-development",
    title: "Squarespace Development",
    shortTitle: "Squarespace",
    accent: "gold",
    parent: "cms-development",
    headline: "A Squarespace developer in Dubai for design-led sites that still bring enquiries",
    intro:
      "Squarespace is the platform for businesses whose work sells on how it looks: architects, interior designers, photographers, studios and consultancies with a strong brand. Its templates are well designed and hard to make ugly, which is why so many sites look the same. As a Squarespace developer in Dubai, I make it look like yours, then set up the lead capture and tracking it does not do for you.",
    metaTitle: "Freelance Squarespace Developer in Dubai | Bilal Shafqat",
    metaDescription:
      "Squarespace developer in Dubai for portfolio and brochure sites: custom design you can maintain, lead capture, and GA4 and Meta Pixel tracking.",
    depthHeading: "How a Squarespace site is built in practice",
    related: {
      heading: "Other CMS options",
      intro:
        "If Squarespace is not the right fit, these are the alternatives, and the CMS page compares all four side by side.",
      slugs: ["cms-development", "wix-development", "wordpress-development", "strapi-development"],
    },
    faqs: [
      {
        question: "Squarespace or Wix?",
        answer:
          "Both suit an owner-run site. Squarespace leads on design: its templates and typography are more refined and it is harder to produce something that looks cluttered. Wix gives more layout freedom and a larger app market, which helps when you need features beyond a brochure. If your work sells visually, Squarespace usually wins. If you need more moving parts, Wix.",
      },
      {
        question: "Squarespace or WordPress?",
        answer:
          "Squarespace if you want a polished site you never have to maintain and it will stay small. WordPress if several people will publish often, you need custom content types such as listings, or you want full control of speed, code and hosting. WordPress gives you more and asks more of you in return.",
      },
      {
        question: "Can I update a Squarespace site myself?",
        answer:
          "Yes, that is its strength. The editor is visual, sections can be duplicated, and the site styles keep new pages consistent. I set those styles and build reusable sections so that a page you add later looks like part of the same site rather than an addition.",
      },
    ],
    items: [
      { title: "Squarespace Website Design", pillarSlug: "website-app-development" },
      { title: "Squarespace Portfolio Sites", pillarSlug: "website-app-development" },
      { title: "Squarespace Lead Capture & Tracking", pillarSlug: "website-app-development" },
    ],
  },
  {
    slug: "strapi-development",
    title: "Strapi Development",
    shortTitle: "Strapi",
    accent: "cyan",
    parent: "cms-development",
    headline: "A Strapi developer in Dubai for headless content with a fast Next.js front end",
    intro:
      "Strapi is a headless CMS: your team edits content in a clean admin panel, and a separate front end, usually Next.js, turns it into pages. That split is worth paying for when you publish a lot of structured content, in more than one language, to more than one place. As a Strapi developer in Dubai, I build both halves, with the landing pages, lead forms and tracking your campaigns need, and I will tell you plainly when a simpler CMS would do.",
    metaTitle: "Freelance Strapi Developer in Dubai | Bilal Shafqat",
    metaDescription:
      "Strapi developer in Dubai building headless CMS back ends with Next.js front ends: structured, multilingual content, fast pages and clear roles.",
    depthHeading: "How a Strapi and Next.js build works in practice",
    related: {
      heading: "Simpler options first",
      intro:
        "Strapi is the most capable option here and the one most likely to be more than a project needs. These are the alternatives worth ruling out first.",
      // Wix and Squarespace added 2026-10-16: both of their pages already
      // list Strapi, and this was the only platform page that did not list
      // all three siblings.
      slugs: ["cms-development", "wordpress-development", "wix-development", "squarespace-development", "custom-web-development"],
    },
    faqs: [
      {
        question: "What is a headless CMS?",
        answer:
          "A CMS that stores and manages content but does not decide how it looks. Editors work in an admin panel, and the content is delivered through an API to whatever displays it: a website, a mobile app, a sales screen. WordPress and Wix combine the two; a headless CMS keeps them apart, which is faster and more flexible, and needs a developer for the front end.",
      },
      {
        question: "When is Strapi overkill?",
        answer:
          "When the site is mostly pages rather than structured content, when one or two people edit it, or when there is no developer to look after the front end afterwards. A twenty-page company site does not need a headless CMS. WordPress or a site builder will be quicker to launch and less expensive to run.",
      },
      {
        question: "Strapi or WordPress?",
        answer:
          "WordPress if your team wants to build and lay out pages themselves and the content is mostly articles and landing pages. Strapi if the content is structured and reused, such as projects, units, agents and locations in two languages, and speed matters enough to justify a separate front end. WordPress can also run headless, which is sometimes the right middle ground.",
      },
    ],
    items: [
      { title: "Strapi Content Modelling", pillarSlug: "website-app-development" },
      { title: "Next.js Front End for Strapi", pillarSlug: "website-app-development" },
      { title: "Multilingual Content & Roles", pillarSlug: "website-app-development" },
    ],
  },
  {
    slug: "custom-web-development",
    title: "Custom Web Development",
    accent: "violet",
    parent: "website-app-development",
    headline: "Custom web development in Dubai for the tools a CMS cannot build",
    intro:
      "Custom web development in Dubai is worth paying for when a site has to do something rather than say something: calculate, filter, log people in, read from a CRM, or load instantly on a weak connection. I build those in React, Next.js and Node, on the MERN stack where an application needs one, and wire them into the campaigns and CRM they serve, which is the part a development shop usually leaves to someone else.",
    metaTitle: "Custom Web Development in Dubai | Bilal Shafqat",
    metaDescription:
      "Custom web development in Dubai in React, Next.js and the MERN stack: portals, dashboards and calculators wired into your CRM and ads.",
    depthHeading: "How custom web development works in practice",
    related: {
      heading: "Not sure you need custom?",
      intro:
        "A custom build is the right answer less often than developers suggest. These pages cover the alternatives and the rest of the web and app work.",
      slugs: ["cms-development", "website-app-development", "mobile-app-development"],
    },
    faqs: [
      {
        question: "When does a custom build beat a CMS?",
        answer:
          "When the site is really an application: a portal people log into, a dashboard that reads live data, a calculator with real logic, or an integration a plugin cannot do reliably. Also when speed is decisive and every unnecessary script costs you enquiries. For a marketing site that mostly publishes pages, a CMS is usually the better answer.",
      },
      {
        question: "What is the MERN stack?",
        answer:
          "MongoDB, Express, React and Node.js: a database, a server framework, a front-end library and the runtime the server runs on, all in JavaScript. One language from the database to the browser makes applications quicker to build and easier to hand over. Where the data is relational and heavily reported on, PostgreSQL replaces MongoDB.",
      },
      {
        question: "Do you write TypeScript?",
        answer:
          "Yes, for anything that will be maintained beyond launch. TypeScript catches a whole class of mistakes before the code runs and makes a project far easier for the next developer to pick up. Small scripts and prototypes can stay in plain JavaScript.",
      },
    ],
    items: [
      { title: "MERN Stack Applications", pillarSlug: "website-app-development" },
      { title: "React & Next.js Front Ends", pillarSlug: "website-app-development" },
      { title: "Custom Marketing Tools & Calculators", pillarSlug: "website-app-development" },
    ],
  },
  {
    // Added 2026-10-02 (roadmap 320, Phase 2). Split out of
    // `website-app-development`, which covered web and mobile on one page.
    //
    // The measured case for splitting is the strongest on the whole keyword
    // board: "mobile app development dubai" is **2,400 searches at difficulty
    // 13**, "mobile app development company dubai" 1,900 at 12, and "android
    // app development dubai" 260 at **7**. Nothing else combines that volume
    // with that little competition.
    //
    // A page cannot rank for two different searches at once. "Website & App
    // Development" was aimed at neither "web developer Dubai" nor "mobile app
    // developer Dubai", so it lost both. The web page keeps its slug and its
    // ranking history; this one is new.
    //
    // "mobile app development company dubai" is deliberately not the target.
    // Same reason as the SEO agency term in the category below: one person is
    // not a company, and the site does not claim to be one.
    slug: "mobile-app-development",
    title: "Mobile App Development",
    accent: "violet",
    headline: "Mobile app development in Dubai, by the person who markets it too",
    intro:
      "Mobile app development in Dubai fails somewhere other than the code, most of the time. Apps ship without analytics, so nobody can say which screen loses people. They launch with no campaign behind them, so the download numbers never arrive. Or they are built as a separate thing from the website and the two never share a user, a login or a number. One codebase in React Native, the back end behind it, and the launch campaign pointing at it, from the same person.",
    // "Freelance" added 2026-10-02 at Bilal's request, for consistency with the
    // other eleven. It costs 95px (418 → 513, still inside the ~600 budget) and
    // keeps "Mobile App Developer in Dubai" intact as a phrase, so the match for
    // the measured term is unaffected. The word is also the one that makes these
    // terms winnable at all — agencies will not use it (roadmap 319).
    metaTitle: "Mobile App Development in Dubai | Bilal Shafqat",
    metaDescription:
      "Mobile app development in Dubai: React Native for iOS and Android, with the back end, analytics and launch campaign built in. Real client work.",
    // Condensed from "How long does an app take?"
    railTimeline: "Months rather than weeks, scope decides",
    faqs: [
      {
        question: "Native or React Native?",
        answer:
          "React Native for almost everything a business needs: one codebase for iOS and Android, which means one build and one set of fixes rather than two. Native earns its cost when the app leans on hardware in a way the bridge handles badly, which is rarer than it is claimed to be. The LEOS app on this site is built in React Native for iOS and Android from one codebase.",
      },
      {
        question: "How long does an app take?",
        answer:
          "A focused app with a clear scope is usually a few months rather than a few weeks, and the build is rarely the long part. Store review, content, and the decisions that get deferred until something is on a screen take longer than people expect. I would rather give you a range after seeing the scope than a number now that we both know is wrong.",
      },
      {
        question: "Do you submit to the App Store and Play Store?",
        answer:
          "Yes, under your developer accounts rather than mine. That matters at the end of the relationship: an app published under a supplier's account is one you cannot update without them. The accounts should be yours from the first submission.",
      },
      {
        question: "Can you market the app as well as build it?",
        answer:
          "That is the reason to use me rather than a development shop. The tracking goes in during the build instead of being retrofitted, the store listing is written as a conversion page, and the launch campaign is planned against the same funnel. Most apps are built by one supplier and marketed by another, and the join is where the measurement disappears.",
      },
      {
        question: "What happens after launch?",
        answer:
          "Apps need maintenance whether or not you plan for it: OS updates break things, store requirements change, and the first month of real usage always reveals something. Budget for it. I will tell you honestly whether that is a retainer with me or a handover to your own team.",
      },
    ],
    items: [
      { title: "Mobile App Development", pillarSlug: "website-app-development" },
      { title: "Mobile App Design", pillarSlug: "design-content-conversion" },
      { title: "Custom Marketing Tools & Calculators", pillarSlug: "website-app-development" },
    ],
    // Added 2026-10-16 with the four pages below. This page keeps "mobile app
    // development dubai" (position 4.3 for "mobile app development" in the
    // 2026-10-16 snapshot, the site's only query close to page one), so the
    // children are linked from here rather than taking any of its copy.
    related: {
      heading: "Choose the platform, then the back end",
      intro:
        "Each part of an app has its own page: React Native, which is how I build for iOS and Android at once, the iPhone and Android specifics, and the back end that holds the data.",
      slugs: [
        "react-native-development",
        "ios-app-development",
        "android-app-development",
        "app-backend-development",
      ],
    },
    subPagesHeading: "Mobile apps by platform",
  },
  // ---------------------------------------------------------------------------
  // React Native, iOS, Android and app back end, added 2026-10-16 at Bilal's
  // request. All four are honest about the stack: he builds iOS and Android
  // apps in **React Native**, not Swift or Kotlin, and each platform page says
  // so in an FAQ and recommends a native developer where that is the better
  // hire. The real work behind them is sales team apps for real estate (3D
  // property views, CRM data, live project data); the LEOS mobile app is the
  // published React Native case study. Nothing here claims a live store
  // listing for LEOS: its case study deliberately leaves that announcement to
  // the client.
  //
  // Queries: "react native developer dubai", "ios app developer dubai",
  // "android app developer dubai" and "app back end development dubai".
  // iOS and Android targeted "<platform> app development dubai" until
  // 2026-10-16 ("android app development dubai" had 260 searches on the
  // 2026-10-02 board, the only measured volume of the four). Both titles
  // contained "app development in Dubai", so they competed with the mobile
  // hub for its query; they now lead with "<platform> app developer".
  {
    slug: "react-native-development",
    title: "React Native Development",
    shortTitle: "React Native",
    accent: "violet",
    parent: "mobile-app-development",
    headline: "A React Native developer in Dubai, one app for iPhone and Android",
    intro:
      "A React Native developer in Dubai can save you building the same app twice. One codebase runs on iPhone and Android, so every screen, fix and update is done once. I build in React Native for the work it suits best, which is most business apps. Mine include sales team apps for real estate with 3D property views, CRM data and live project information, built by someone who also runs the marketing that sends people to download them.",
    metaTitle: "React Native Developer in Dubai | Bilal Shafqat",
    metaDescription:
      "React Native developer in Dubai: one codebase for iOS and Android, real estate sales apps with 3D views and CRM data, and tracking built in.",
    depthHeading: "How React Native development works in practice",
    related: {
      heading: "The platforms and the back end",
      intro:
        "React Native covers iPhone and Android from one codebase, and each platform's store still has its own rules. These pages cover the iPhone and Android specifics and the back end behind the app.",
      slugs: [
        "mobile-app-development",
        "ios-app-development",
        "android-app-development",
        "app-backend-development",
      ],
    },
    faqs: [
      {
        question: "Is React Native fast enough?",
        answer:
          "For most business apps, yes. Lists, forms, maps, media and animation run smoothly when the app is built with care: long lists virtualised, images sized for the screen, and heavy work kept off the main thread. Where an app needs constant heavy graphics or unusual hardware access, native code may be the better tool, and React Native can call native modules for just those parts.",
      },
      {
        question: "React Native or Flutter?",
        answer:
          "Both are mature. I build in React Native because it is JavaScript and TypeScript, the same languages as the website and the back end, so one person can work across all three and code such as validation and API calls can be shared. If you already have a Flutter team, staying with Flutter is usually the right call.",
      },
      {
        question: "Do you use Expo?",
        answer:
          "Usually, yes. Expo handles builds, over-the-air updates and much of the native configuration, which shortens the work without limiting what most apps can do. Where an app needs a native library Expo does not include, a development build adds it.",
      },
    ],
    items: [
      { title: "React Native App Builds", pillarSlug: "website-app-development" },
      { title: "Real Estate Sales Apps", pillarSlug: "website-app-development" },
      { title: "App Performance & Release", pillarSlug: "website-app-development" },
    ],
  },
  {
    slug: "ios-app-development",
    title: "iOS App Development",
    shortTitle: "iOS",
    accent: "cyan",
    parent: "mobile-app-development",
    headline: "An iOS app developer in Dubai, from the first build to App Store approval",
    intro:
      "An iOS app developer in Dubai spends half the job building and half getting through Apple. The app has to work on every current iPhone and, for sales teams, on the iPad in the sales centre, then pass App Review, carry accurate privacy labels and ask for permissions at the right moment. I build iOS apps in React Native, so the same code can also ship to Android, and take them through TestFlight and the App Store under your developer account.",
    // Retitled 2026-10-16 from "iOS App Development in Dubai". That title and
    // h1 contained "app development in Dubai", the phrase the mobile hub owns,
    // and split the site's only near-page-one query between three pages. The
    // children now lead with the platform and the person; the hub keeps the
    // phrase.
    metaTitle: "iOS App Developer in Dubai | Bilal Shafqat",
    metaDescription:
      "iOS app developer in Dubai building iPhone and iPad apps in React Native: TestFlight, App Store review, push notifications and install tracking.",
    depthHeading: "How an iOS app build works in practice",
    related: {
      heading: "The rest of the app",
      intro:
        "The iPhone version is one part of the job. These pages cover how the app is built, the Android side and the back end it runs on.",
      slugs: [
        "mobile-app-development",
        "react-native-development",
        "android-app-development",
        "app-backend-development",
      ],
    },
    faqs: [
      {
        question: "Do you write native Swift?",
        answer:
          "No. I build iOS apps in React Native, which produces a real iOS app using Apple's own interface components, and lets the same code run on Android. For an app that depends on the newest Apple frameworks on day one, or on heavy graphics, a Swift developer is the better hire, and I will say so before we start.",
      },
      {
        question: "How long does App Store review take?",
        answer:
          "Most reviews are completed quickly, usually within days, but a rejection restarts the clock, so the real risk is the rejection rather than the queue. Common reasons are missing privacy details, a login the reviewer cannot get past, placeholder content and payments that bypass Apple's in-app purchase rules. Each is checked before submission.",
      },
      {
        question: "Do I need an Apple Developer account?",
        answer:
          "Yes, and it should be in your company's name, not your developer's. An organisation account needs a D-U-N-S number, which can take time to obtain, so it is worth starting early. The annual membership fee is paid by you directly to Apple.",
      },
    ],
    items: [
      { title: "iPhone & iPad App Builds", pillarSlug: "website-app-development" },
      { title: "App Store Submission & Review", pillarSlug: "website-app-development" },
      { title: "iOS Push Notifications & Tracking", pillarSlug: "website-app-development" },
    ],
  },
  {
    slug: "android-app-development",
    title: "Android App Development",
    shortTitle: "Android",
    accent: "gold",
    parent: "mobile-app-development",
    headline: "An Android app developer in Dubai, testing on the phones your customers carry",
    intro:
      "Android is often treated as the port that follows the iPhone version. It should not be: it runs on a far wider range of phones, screen sizes and OS versions, and plenty of your customers are on one of them. As an Android app developer in Dubai, I build in React Native from the same codebase as iOS, test on real devices including older and budget models, and publish through Google Play Console under your account, with install tracking in place so every download and lead can be traced to the campaign that brought it.",
    // Retitled 2026-10-16, for the same reason as the iOS page above.
    metaTitle: "Android App Developer in Dubai | Bilal Shafqat",
    metaDescription:
      "Android app developer in Dubai building in React Native: Google Play submission, testing on real devices, Play Console and install tracking.",
    depthHeading: "How an Android app build works in practice",
    related: {
      heading: "The rest of the app",
      intro:
        "Android is one half of the job. These pages cover how the app is built, the iPhone side and the back end it runs on.",
      slugs: [
        "mobile-app-development",
        "react-native-development",
        "ios-app-development",
        "app-backend-development",
      ],
    },
    faqs: [
      {
        question: "Do you build in Kotlin?",
        answer:
          "No. I build Android apps in React Native, which produces a real Android app and shares its code with the iOS version. Apps that need deep, Android-specific hardware work or the newest platform features on day one are better served by a Kotlin developer, and I will tell you if yours is one of them.",
      },
      {
        question: "How does Google Play review work?",
        answer:
          "Every new app and update is reviewed against Google Play's policies before it goes live, and new personal developer accounts have to run a closed test with real testers before they can publish to production. Organisation accounts are verified separately. The Data safety form, content rating and target audience are completed in Play Console as part of the submission.",
      },
      {
        question: "Which Android versions will the app support?",
        answer:
          "Google Play sets a target API level that apps must meet, and React Native sets its own minimum Android version. Within those limits, the range is chosen from your audience: supporting very old versions costs testing time, while dropping them can cut off customers. I check the decision against the device data you have before the build starts.",
      },
    ],
    items: [
      { title: "Android App Builds", pillarSlug: "website-app-development" },
      { title: "Google Play Submission & Play Console", pillarSlug: "website-app-development" },
      { title: "Android Device Testing & Tracking", pillarSlug: "website-app-development" },
    ],
  },
  {
    slug: "app-backend-development",
    title: "App Back-End Development",
    shortTitle: "Back end",
    accent: "cyan",
    parent: "mobile-app-development",
    headline: "App back-end development in Dubai: Firebase or MongoDB, chosen for what the app does",
    intro:
      "Most of an app's work happens where users never look. App back-end development in Dubai covers the database, the logins, the APIs the app calls, the admin panel your team runs it from and the connection to your CRM, so every lead the app captures arrives with the campaign that brought it. I build on Firebase where realtime sync and speed to launch matter, and on MongoDB with Node and Express where the data, queries and integrations need more control, and I explain which suits your app before writing any code.",
    metaTitle: "App Back-End Development in Dubai | Bilal Shafqat",
    metaDescription:
      "App back-end development in Dubai: Firebase or MongoDB, Node and Express APIs, admin panels and CRM sync for iOS and Android apps.",
    depthHeading: "How app back-end development works in practice",
    related: {
      heading: "The app in front of it",
      intro:
        "A back end serves an app, and often a website as well. These pages cover the app itself and the web side that can share the same back end.",
      slugs: [
        "mobile-app-development",
        "react-native-development",
        "ios-app-development",
        "android-app-development",
        "custom-web-development",
      ],
    },
    faqs: [
      {
        question: "Firebase or MongoDB?",
        answer:
          "Firebase if the app needs realtime updates, simple data and a fast launch with logins and hosting handled for you. MongoDB, with a Node and Express API, if the data needs complex queries and reporting, has to join your CRM and other systems, or must not be tied to one cloud provider. Some apps use both: Firebase for logins and notifications, MongoDB for the business data.",
      },
      {
        question: "Does my app need a backend at all?",
        answer:
          "Only if the app stores data that changes, has user accounts or talks to other systems. A simple content app can read from a CMS. Most business apps do need one, because leads, bookings, availability and users all have to live somewhere your team can manage.",
      },
      {
        question: "Will the back end scale?",
        answer:
          "Both options scale well beyond what most business apps need, if the data is modelled properly. What causes trouble is design rather than load: queries that read whole collections, missing indexes, and in Firebase, data structured so every screen downloads more than it shows. Those are avoided at the design stage, which costs far less than fixing them later.",
      },
    ],
    items: [
      { title: "Firebase App Back Ends", pillarSlug: "website-app-development" },
      { title: "Node & Express APIs on MongoDB", pillarSlug: "website-app-development" },
      { title: "Admin Panels & CRM Sync", pillarSlug: "website-app-development" },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    headline: "A UI/UX designer in Dubai, judged on how the product gets used",
    intro:
      "A mockup that wins approval and then confuses users has failed, which is the only test a UI/UX designer in Dubai should be judged on. UI and UX work here covers wireframing, prototyping and interface design for both web and mobile, with each platform's own conventions respected rather than one generic layout stretched across both. Designs hand off cleanly into development because the same person builds them.",
    // Narrowed 2026-10-02 from "Freelance Web & App Designer in Dubai". That
    // title tried to carry web design and product design at once, which is the
    // same mistake "Website & App Development" made and the reason mobile was
    // split out in the category above. Web design now has its own page; this
    // one keeps UI/UX and product work, which is a different search and a
    // different buyer.
    metaTitle: "Freelance UI/UX Designer in Dubai | Bilal Shafqat",
    metaDescription:
      "Freelance UI/UX designer in Dubai: wireframing, prototyping, web and mobile interface design and design systems, from someone who builds them.",
    faqs: [
      {
        question: "Do you deliver design systems or one-off screens?",
        answer:
          "Design systems where the product will keep growing, single screens where it will not. Building a system for a one-page campaign site is wasted effort.",
      },
      {
        question: "Is accessibility part of this?",
        answer:
          "Usability and accessibility are considered as part of the design rather than retrofitted, which is considerably cheaper than fixing it later.",
      },
    ],
    accent: "cyan",
    items: [
      { title: "UI/UX Design", pillarSlug: "design-content-conversion" },
      { title: "Web Design", pillarSlug: "design-content-conversion" },
      { title: "Mobile App Design", pillarSlug: "design-content-conversion" },
    ],
  },
  {
    // Added 2026-10-02 (roadmap 320, Phase 2, final item). Split out of
    // `ui-ux-design` for the same reason mobile was split out of
    // `website-app-development`: one page cannot rank for two different
    // searches, and "Freelance Web & App Designer" was aimed at neither.
    //
    // Measured: "freelance web designer dubai" 140-170 searches at difficulty
    // 7-20 depending on which Ubersuggest report you read, and "web design
    // freelancer dubai" at difficulty 4. The numbers move between reports,
    // which is worth knowing — they are estimates, not readings.
    //
    // The head term "web design" is **not** the target: difficulty 60, and the
    // top ten average 47,700 backlinks against this site's eleven referring
    // domains. That is the number that started this whole plan (roadmap 319).
    slug: "web-design",
    title: "Web Design",
    accent: "gold",
    // Retargeted 2026-10-07 (roadmap 368). The page scored 41/100 for "web
    // designer dubai" on 1,804 words and sixteen subheadings — not a thin page,
    // a page whose title claimed a phrase the body contained **zero** times.
    // The same title/body mismatch found on the homepage, five service pages
    // and four articles, and the fifth time this exact fault has been measured.
    //
    // The headline and intro now carry the phrase; the h1 is what the scorer
    // weights heaviest at 14 points and it was the single largest miss.
    headline: "A freelance web designer in Dubai who designs around the enquiry, not the template",
    intro:
      "A website that looks good and converts nobody is a cost. Most of what a web designer in Dubai actually decides is not visual: what the first screen has to say, how few steps stand between interest and an enquiry, and what gets cut. The visual work comes after those, and is much easier once they are settled.",
    // Deliberately still opening on "Freelance" rather than on the search
    // phrase, which costs 4 points on the "keyword at the START of title"
    // check. "Freelance" is the word that makes these terms winnable at all,
    // since agencies will not use it (roadmap 319), and Bilal asked for it on
    // all twelve titles. Four points is the right price for that.
    metaTitle: "Freelance Web Designer in Dubai | Bilal Shafqat",
    metaDescription:
      "Freelance web designer in Dubai, designing websites and landing pages around enquiries rather than a template, by the person who builds them.",
    faqs: [
      {
        question: "Do you design in Figma or straight in code?",
        answer:
          "Figma for anything with stakeholders, because changing a decision is cheap there and expensive once it is built. Straight into code for a landing page where the layout is settled and the work is in the detail. I will tell you which one your project is rather than defaulting to the one that bills more hours.",
      },
      {
        question: "Can you design it if someone else builds it?",
        answer:
          "Yes, and the handover is where these projects usually lose their quality. I hand over a file a developer can actually build from, with the states, the breakpoints and the edge cases drawn rather than implied. If you want, I will review the build against the design before it goes live.",
      },
      {
        question: "What about WordPress or Wix?",
        answer:
          "Both are fine, and for a lot of businesses they are the right answer: you can run the site yourself without calling anyone. The design work does not change much; what changes is how much of it survives the platform. I will say early if what you want is going to fight the tool you have chosen.",
      },
      {
        question: "How is this different from a design agency?",
        answer:
          "You work with the person designing it. There is no account manager translating your feedback and no junior doing the work the pitch was won on. The trade is capacity: one person has a ceiling. If you need several designs a week across several brands, an agency is the better answer.",
      },
      {
        question: "Do you do the copy as well?",
        answer:
          "I write the structure and the working copy, because layout and words are the same decision. You cannot design a page around content that does not exist yet. If you have a writer or a brand voice, I design to it and say where the structure is fighting the words.",
      },
    ],
    items: [
      { title: "Web Design", pillarSlug: "design-content-conversion" },
      { title: "UI/UX Design", pillarSlug: "design-content-conversion" },
      { title: "Conversion Rate Optimization (CRO)", pillarSlug: "design-content-conversion" },
    ],
    // Added 2026-10-16 with the Figma page below. This page keeps "web
    // designer dubai"; the Figma page takes "figma designer dubai" and "figma
    // to website", which is a different buyer: someone who has a design
    // question about the file and the handover, not about what the site is for.
    related: {
      heading: "Designed in Figma, built to match",
      intro:
        "The file and the build each have their own page: how a design is done in Figma and handed over, and the platforms it is built on afterwards.",
      slugs: ["figma-design", "wordpress-development", "custom-web-development"],
    },
    subPagesHeading: "Web design in Figma",
  },
  // ---------------------------------------------------------------------------
  // Figma, added 2026-10-16 at Bilal's request. Targets "figma designer dubai"
  // and "figma to website". Kept off the two neighbouring queries on purpose:
  // "web designer dubai" is web-design (what the site should be and do) and
  // "ui ux designer dubai" is ui-ux-design (how a product is used). This page
  // is about the file itself: prototypes for sign-off, components and the
  // handover into WordPress or Next.js. All three link to each other.
  {
    slug: "figma-design",
    title: "Figma Design",
    shortTitle: "Figma",
    accent: "cyan",
    parent: "web-design",
    headline: "A Figma designer in Dubai whose files are made to be built",
    intro:
      "A Figma file can look finished and still be impossible to build from: no states, no components, spacing that changes from screen to screen. As a Figma designer in Dubai, I design websites, landing pages and apps in Figma as the working source for the build, with prototypes your stakeholders can click through and sign off, a component library that keeps it consistent, and a handover into WordPress or Next.js that I can carry out myself. Because I also run the campaigns, landing pages are designed around the ad that sends the traffic and the lead form it has to fill.",
    metaTitle: "Figma Designer in Dubai, Figma to Website | Bilal Shafqat",
    metaDescription:
      "Figma designer in Dubai: website, landing page and app design, clickable prototypes for sign-off, design systems, and Figma to website builds.",
    depthHeading: "How Figma design works in practice",
    related: {
      heading: "Either side of the file",
      intro:
        "What the site should be, how a product is used and what it is built on each have their own page. This one is about the Figma file in between.",
      slugs: ["web-design", "ui-ux-design", "wordpress-development", "custom-web-development"],
    },
    faqs: [
      {
        question: "Can you turn our Figma design into a website?",
        answer:
          "Yes. Figma to website is most of what happens after a design is signed off: built in WordPress where your team will edit it, or in Next.js where speed and custom functionality matter. Because I read Figma files the way they were meant to be built, spacing, type and components come across as designed rather than approximated.",
      },
      {
        question: "Do you work in our Figma account, or your own?",
        answer:
          "Yours, ideally. The file lives in your organisation's Figma account, I am invited as an editor, and nothing needs transferring at the end. If you do not have one, I set it up in your name rather than keeping the work in mine.",
      },
      {
        question: "Is Figma only for apps?",
        answer:
          "No. Figma suits anything that ends up on a screen: websites, landing pages, apps, dashboards, email layouts and social templates. For print, such as brochures and company profiles, InDesign and Illustrator are still the right tools, and that sits with the graphic design and branding work.",
      },
    ],
    items: [
      { title: "Website & Landing Page Design in Figma", pillarSlug: "design-content-conversion" },
      { title: "Figma Prototypes & Design Systems", pillarSlug: "design-content-conversion" },
      { title: "Figma to Website Handover", pillarSlug: "design-content-conversion" },
    ],
  },
  {
    slug: "graphic-design-branding",
    title: "Graphic Design & Branding",
    headline: "A graphic designer in Dubai for identity that holds up beyond the logo file",
    intro:
      "A logo is the easy part, and it is the smallest thing a graphic designer in Dubai is actually asked for. What matters is whether the identity still works on a website, an ad, a brochure and a pitch deck once other people are applying it. Graphic design in Dubai covers far more than the mark: logo, colour and typography systems, documented brand guidelines so anyone can apply them consistently, and the company profile and pitch materials that carry the brand into a room.",
    metaTitle: "Freelance Graphic Designer in Dubai | Bilal Shafqat",
    metaDescription:
      "Freelance graphic designer in Dubai: logo design, colour and typography systems, documented brand guidelines, company profiles and pitch decks.",
    // Condensed from "How long does a brand project take?"
    railTimeline: "Two to four weeks for an identity with guidelines",
    faqs: [
      {
        question: "Do we need a full rebrand?",
        answer:
          "Usually not. Existing brand guidelines are a starting point, not a blocker, and most engagements build on what you already have.",
      },
      {
        question: "What is in a brand guidelines deck?",
        answer:
          "Logo usage rules, colour and typography specifications, and templates, so an agency, a new hire or a freelancer applies your brand the same way you would.",
      },
    ],
    accent: "cyan",
    items: [
      { title: "Branding", pillarSlug: "design-content-conversion" },
      { title: "Brand Guidelines", pillarSlug: "design-content-conversion" },
      { title: "Business Profile", pillarSlug: "design-content-conversion" },
    ],
  },
  {
    slug: "crm-marketing-automation",
    title: "CRM & MarTech Integration",
    headline: "A CRM consultant in Dubai for the layer where leads get lost",
    intro:
      "Most leads a business loses were not lost to bad marketing, which is why a CRM consultant in Dubai is usually called in after the ads are already working. They were lost to a follow-up that never happened, because nothing was tracking them properly. This connects campaigns, website and CRM into one system: HubSpot, Zoho or Salesforce configured around how your team actually sells, server-side tracking so conversion data survives browser restrictions, and automation so a new enquiry gets a response in minutes.",
    metaTitle: "Freelance CRM Consultant in Dubai | Bilal Shafqat",
    metaDescription:
      "Freelance CRM consultant in Dubai: HubSpot, Zoho and Salesforce setup, server-side tracking, Conversions API and automation workflows.",
    faqs: [
      {
        question: "Which CRMs do you work with?",
        answer:
          "HubSpot, Zoho and Salesforce most often. If you use something else, get in touch and we will confirm fit.",
      },
      {
        question: "What is server-side tracking and why does it matter?",
        answer:
          "It sends conversion data, such as a completed form, directly from your server to platforms like Meta and Google, instead of relying only on a browser pixel. It matters because ad blockers, cookie restrictions and iOS privacy changes have made browser tracking substantially less reliable.",
      },
      {
        question: "We already have a CRM. Can you just fix the automation?",
        answer:
          "Yes. Most of this work improves or rebuilds automation inside a CRM you already own rather than replacing it.",
      },
    ],
    accent: "gold",
    items: [
      { title: "CRM Setup (HubSpot, Zoho & Salesforce)", pillarSlug: "crm-marketing-automation" },
      { title: "Server-Side Tracking & Conversions API", pillarSlug: "crm-marketing-automation" },
      { title: "Marketing Automation Workflows", pillarSlug: "crm-marketing-automation" },
      { title: "Performance Marketing & Optimisation", pillarSlug: "paid-marketing" },
      { title: "Growth Marketing", pillarSlug: "crm-marketing-automation" },
    ],
    // Added 2026-10-16 with the five CRM pages below. This page keeps "crm
    // consultant dubai"; the integration hub and the platform pages each take
    // their own query and link back here for the tracking and automation side.
    related: {
      heading: "CRM integration, by platform",
      intro:
        "Getting every lead into one CRM, and choosing which CRM, has its own page. Each platform I work with has a page of its own too, and so does building a CRM from scratch.",
      slugs: [
        "crm-integration",
        "zoho-crm-integration",
        "hubspot-integration",
        "salesforce-integration",
        "custom-crm-development",
      ],
    },
    subPagesHeading: "CRM integration by platform",
  },
  // ---------------------------------------------------------------------------
  // CRM integration and its four platforms, added 2026-10-16 at Bilal's
  // request. What each page claims is what he confirmed:
  //
  //   - Zoho CRM: lead management at real estate developers in Dubai, social
  //     lead forms (Meta lead ads) flowing into the CRM, WhatsApp follow-up
  //     automation.
  //   - HubSpot: on his CV. Kept general: forms, lifecycle stages, workflows,
  //     ad and site tracking, reporting. No named HubSpot client.
  //   - Salesforce: **Marketing Cloud only.** EDMs designed to its templates,
  //     sales offer content, CloudPages showing company sales data to sales
  //     managers in a custom application. The page says plainly that Sales
  //     Cloud admin and Apex are not offered.
  //   - Custom CRM: worked inside a brokerage's custom CRM, and built his own
  //     CRM and reporting platform. Not named, no customers claimed.
  //
  // One buyer query per page (roadmap 398 §5): "crm integration dubai" for the
  // hub, "<platform> integration dubai" for each platform and "custom crm
  // development dubai" for the build. "crm consultant dubai" stays on
  // crm-marketing-automation. None had a measured volume when they shipped;
  // all five are in `scripts/lib/tracked.mjs`.
  //
  // Not in the Services menu (roadmap: keep it marketing-led). Reached from the
  // CRM page's cards, the /services "by platform" block, the footer row and
  // the site search.
  {
    slug: "crm-integration",
    title: "CRM Integration",
    accent: "gold",
    parent: "crm-marketing-automation",
    headline: "CRM integration in Dubai that puts every lead, and what it cost, in one view",
    intro:
      "CRM integration in Dubai usually gets asked for as a plumbing job: connect the website form to the CRM. The real problem is larger. Leads arrive from Meta lead forms, Google Ads, WhatsApp, portals and the website, sit in two or three systems that disagree, and nobody can say what a qualified lead actually cost. I connect those sources into one view, route each lead to the right person within minutes, and keep the duplicates out.",
    metaTitle: "CRM Integration in Dubai | Bilal Shafqat",
    metaDescription:
      "CRM integration in Dubai: Meta, Google Ads, WhatsApp and web forms into one CRM, with lead routing, deduplication and cost per qualified lead.",
    depthHeading: "Connecting every lead source to one CRM",
    related: {
      heading: "Pick the CRM, or build one",
      intro:
        "Each CRM I work with has its own page: what I connect to it, where it fits and where it does not. If none of them fits how your team sells, a custom CRM is the fourth option.",
      slugs: [
        "zoho-crm-integration",
        "hubspot-integration",
        "salesforce-integration",
        "custom-crm-development",
      ],
    },
    faqs: [
      {
        question: "What does CRM integration actually include?",
        answer:
          "Every place a lead can come from, connected to one CRM with its source attached: website and landing page forms, Meta and Google lead forms, WhatsApp, and portal or partner feeds where they exist. Then the rules on top: who gets each lead, what counts as a duplicate, and which events go back to the ad platforms so they optimise towards qualified leads rather than form fills.",
      },
      {
        question: "Can you integrate the CRM we already have?",
        answer:
          "Usually, yes, and it is normally the better option. Most CRMs a Dubai business already pays for can do what is needed. The gaps tend to be in how the sources are connected and how the fields are set up, not in the software. I audit first and only recommend a change of platform when the current one genuinely cannot do the job.",
      },
      {
        question: "Is Zapier enough, or do we need a developer?",
        answer:
          "For a few low-volume sources, an automation tool such as Zapier or Make is often enough and quick to change. Once volumes grow, or a lead has to be checked for duplicates and routed by rules before it lands, a direct API integration is more reliable and easier to monitor. I use whichever the volume and the stakes justify, and document it either way.",
      },
    ],
    items: [
      { title: "CRM Lead Source Integration", pillarSlug: "crm-marketing-automation" },
      { title: "Lead Routing & Deduplication", pillarSlug: "crm-marketing-automation" },
      { title: "Unified Lead Reporting", pillarSlug: "crm-marketing-automation" },
    ],
  },
  {
    slug: "zoho-crm-integration",
    title: "Zoho CRM Integration",
    shortTitle: "Zoho",
    accent: "cyan",
    parent: "crm-integration",
    headline: "A Zoho CRM consultant in Dubai for sales teams that live on lead forms and WhatsApp",
    intro:
      "Zoho CRM is the system many Dubai real estate developers and brokerages actually run on, because it does a great deal for a modest licence. It is also easy to set up badly. As a Zoho CRM consultant in Dubai, I have managed leads in Zoho CRM for real estate developers: Meta lead forms and website enquiries flowing straight in with their campaign attached, assigned to the right salesperson, and followed up on WhatsApp before the buyer has moved on to the next developer.",
    // Retitled 2026-10-16 from "Zoho CRM Integration in Dubai", which scored
    // 92 on "crm integration dubai" and so competed with the CRM integration
    // hub for its own query. The page now leads with the consultant and
    // links up to the hub for the general question.
    metaTitle: "Zoho CRM Consultant in Dubai | Bilal Shafqat",
    metaDescription:
      "Zoho CRM consultant in Dubai: Meta lead ads, web forms and WhatsApp into Zoho, with lead assignment, follow-up automation and reports.",
    depthHeading: "How a Zoho CRM setup works in practice",
    related: {
      heading: "Other CRMs, side by side",
      intro:
        "Zoho is not the right answer for every team. The CRM integration page compares the options, and each of the others has its own page.",
      slugs: ["crm-integration", "hubspot-integration", "salesforce-integration", "custom-crm-development"],
    },
    faqs: [
      {
        question: "Can Meta lead ads go straight into Zoho CRM?",
        answer:
          "Yes. Zoho has a native connection for Facebook and Instagram lead ads, and where a campaign needs more control, a webhook or an automation tool does the same job with extra fields. Either way the lead arrives within seconds with the campaign, ad set and form attached, rather than being downloaded as a spreadsheet the next morning.",
      },
      {
        question: "Can Zoho CRM send WhatsApp messages?",
        answer:
          "Through the WhatsApp Business Platform, yes, using Zoho's own integration or a connected provider. Approved message templates can go out automatically when a lead arrives, and replies are logged against the contact so the conversation is not stuck on one agent's phone. The template rules are Meta's, so they are planned before launch rather than discovered after it.",
      },
      {
        question: "Zoho CRM or Zoho One?",
        answer:
          "Zoho CRM is the sales system on its own. Zoho One bundles it with many other Zoho apps, such as forms, campaigns, a help desk and analytics, under one licence per employee. If you will genuinely use three or four of those apps, Zoho One is often the better value. If you only need the CRM, it is more than you need. I check against what your team will actually use.",
      },
    ],
    items: [
      { title: "Zoho CRM Setup for Real Estate", pillarSlug: "crm-marketing-automation" },
      { title: "Meta Lead Ads into Zoho", pillarSlug: "crm-marketing-automation" },
      { title: "Zoho WhatsApp Follow-up Automation", pillarSlug: "crm-marketing-automation" },
    ],
  },
  {
    slug: "hubspot-integration",
    title: "HubSpot Integration",
    shortTitle: "HubSpot",
    accent: "violet",
    parent: "crm-integration",
    headline: "HubSpot integration in Dubai, set up so marketing and sales read the same numbers",
    intro:
      "HubSpot is the CRM marketing teams find easiest to adopt, and the one most often left half set up: forms that create contacts with no source, lifecycle stages nobody moves, and reports that count everything as a lead. HubSpot integration in Dubai, done properly, connects your website, ads and WhatsApp to HubSpot, defines what each stage means, and builds the workflows and reports that let marketing and sales agree on one number.",
    metaTitle: "HubSpot Integration in Dubai | Bilal Shafqat",
    metaDescription:
      "HubSpot integration in Dubai: forms, ads and site tracking into HubSpot, lifecycle stages that mean something, workflows and reports sales trusts.",
    depthHeading: "How a HubSpot integration works in practice",
    related: {
      heading: "Other CRMs, side by side",
      intro:
        "HubSpot suits marketing-led teams best. If that is not you, the CRM integration page compares the options and each has its own page.",
      slugs: ["crm-integration", "zoho-crm-integration", "salesforce-integration", "custom-crm-development"],
    },
    faqs: [
      {
        question: "Do I need HubSpot forms, or can I keep my own?",
        answer:
          "Either works. HubSpot forms are the quickest route and link the submission to the visitor automatically. Your own forms, on WordPress or a custom site, can post to HubSpot through its Forms API or be captured by the tracking code, which keeps your design and still ties the submission to the visitor's history. I choose by what the site is built on.",
      },
      {
        question: "Can HubSpot connect to Google Ads and Meta?",
        answer:
          "Yes. HubSpot's ads tool links Google Ads, Facebook and Instagram, and LinkedIn accounts, syncs lead form submissions into HubSpot, and can send lifecycle stage changes back to the platforms as conversion events. The platforms then learn which clicks became qualified leads, rather than which ones filled in a form.",
      },
      {
        question: "Which HubSpot plan do I need?",
        answer:
          "It depends on the features you will actually use, and HubSpot's own pricing page is the reference because plans and limits change. As a rule, the free tools are enough to start capturing and organising leads, and more advanced automation and custom reporting sit on the higher tiers. I recommend the lowest plan that does what you need, not the highest.",
      },
    ],
    items: [
      { title: "HubSpot Forms & Tracking", pillarSlug: "crm-marketing-automation" },
      { title: "HubSpot Lifecycle Stages & Workflows", pillarSlug: "crm-marketing-automation" },
      { title: "HubSpot Ads & Reporting", pillarSlug: "crm-marketing-automation" },
    ],
  },
  {
    slug: "salesforce-integration",
    title: "Salesforce Integration",
    shortTitle: "Salesforce",
    accent: "cyan",
    parent: "crm-integration",
    headline: "Salesforce integration in Dubai, from Marketing Cloud email to lead capture",
    intro:
      "Most Salesforce work in Dubai is quoted as an admin project. Mine is the marketing side. I have designed EDMs to Salesforce Marketing Cloud templates, written and laid out sales offer emails, and built CloudPages that put company sales data in front of sales managers in a custom application. Salesforce integration, as I do it, means connecting your campaigns and lead capture to Salesforce so marketing is measured in the system sales already lives in.",
    metaTitle: "Salesforce Integration in Dubai | Bilal Shafqat",
    metaDescription:
      "Salesforce integration in Dubai for marketing: Marketing Cloud EDMs and CloudPages, campaign tracking and lead capture into Salesforce.",
    depthHeading: "How Salesforce integration works on the marketing side",
    related: {
      heading: "If Salesforce is more than you need",
      intro:
        "Salesforce is the most configurable CRM and the one most likely to need its own administrator. These are the alternatives, compared on the CRM integration page.",
      slugs: ["crm-integration", "zoho-crm-integration", "hubspot-integration", "custom-crm-development"],
    },
    faqs: [
      {
        question: "Do you do Salesforce admin and Apex development?",
        answer:
          "No, and it is better to know that up front. Deep Sales Cloud configuration, Apex code and complex permission models belong with a certified Salesforce administrator or partner. My work is the marketing layer: Marketing Cloud email and CloudPages, and getting campaign and lead data into Salesforce correctly. On a larger project I work alongside your admin rather than instead of them.",
      },
      {
        question: "What are CloudPages?",
        answer:
          "CloudPages is the Marketing Cloud tool for building web pages that read from and write to Marketing Cloud data: landing pages, forms, preference centres and small internal pages. Because they can display data held in Marketing Cloud, they are useful beyond campaigns, for example a page that presents sales figures to the sales managers who need them.",
      },
      {
        question: "Can you design EDMs for Salesforce Marketing Cloud?",
        answer:
          "Yes, that is the core of the work. Emails are designed to your Marketing Cloud templates and content blocks, so your team can reuse them for the next offer, built to read properly on a phone and across the main email clients, and tested before they go anywhere near your list.",
      },
    ],
    items: [
      { title: "Marketing Cloud Email Design", pillarSlug: "crm-marketing-automation" },
      { title: "CloudPages & Sales Data Pages", pillarSlug: "crm-marketing-automation" },
      { title: "Campaign & Lead Capture into Salesforce", pillarSlug: "crm-marketing-automation" },
    ],
  },
  {
    slug: "custom-crm-development",
    title: "Custom CRM Development",
    shortTitle: "Custom CRM",
    accent: "gold",
    parent: "crm-integration",
    headline: "Custom CRM development in Dubai, for when off-the-shelf no longer fits how you sell",
    intro:
      "Custom CRM development in Dubai makes sense in fewer cases than developers suggest, and in those cases it is the thing that works. When your sales process, lead sources and reporting no longer fit Zoho, HubSpot or Salesforce without a stack of workarounds, a CRM built for how you sell can be easier and less expensive to live with. I have worked inside a brokerage's custom CRM and built my own CRM and reporting platform, on the MERN stack and Next.js.",
    metaTitle: "Custom CRM Development in Dubai | Bilal Shafqat",
    metaDescription:
      "Custom CRM development in Dubai on MERN and Next.js: lead intake, attribution, ad platform syncs and reports built around how your team sells.",
    depthHeading: "How custom CRM development works in practice",
    related: {
      heading: "Rule out off-the-shelf first",
      intro:
        "A custom CRM is the right answer less often than an off-the-shelf one. These are the alternatives, and the wider custom build work.",
      slugs: [
        "crm-integration",
        "zoho-crm-integration",
        "hubspot-integration",
        "salesforce-integration",
        "custom-web-development",
      ],
    },
    faqs: [
      {
        question: "When is a custom CRM better than Zoho or HubSpot?",
        answer:
          "When the workarounds have become the system: data copied between tools every day, reports rebuilt by hand in spreadsheets, a sales process the CRM cannot represent, or per-user licences across a large team for features nobody uses. If an off-the-shelf CRM can do the job with sensible configuration, it is the better answer, and I will say so.",
      },
      {
        question: "Who owns the code and the data?",
        answer:
          "You do. The repository, the database and the hosting accounts are in your name from the start, and the data can be exported in standard formats at any time. A custom CRM that only its developer can reach is a worse lock-in than any licence.",
      },
      {
        question: "Can a custom CRM connect to Meta, Google Ads and WhatsApp?",
        answer:
          "Yes, and those connections are usually the reason to build one. Lead forms arrive by webhook, ad spend is pulled from the platforms' APIs so cost per lead is calculated rather than typed in, and WhatsApp messages go through the WhatsApp Business Platform. Each integration is monitored, because an API change that silently stops leads is the main risk of owning the system.",
      },
    ],
    items: [
      { title: "Custom CRM Lead Intake & Pipelines", pillarSlug: "crm-marketing-automation" },
      { title: "Attribution & Ad Platform Syncs", pillarSlug: "crm-marketing-automation" },
      { title: "Custom Sales Reporting Dashboards", pillarSlug: "crm-marketing-automation" },
    ],
  },
  {
    // Added 2026-10-02 (roadmap 320, Phase 2). The largest gap measured: the
    // word "SEO" appeared nowhere on /services, no section for it existed in
    // this file, and the site therefore could not rank for a service it
    // delivers. "seo consultant in dubai" is 140 searches at difficulty 13;
    // "SEO consultant Dubai" is 480 at 20.
    //
    // **Consultant, not agency.** "seo agency in dubai" is 8,100 searches at
    // difficulty 17 and is the largest number on the whole keyword board. It is
    // also a term this site must not claim: Bilal is one person without a trade
    // licence, and calling himself an agency would be a false statement about
    // what a client is buying. The consultant variants are the honest ones and
    // they are winnable.
    slug: "seo",
    title: "SEO & AI Search",
    accent: "cyan",
    headline: "What an SEO consultant in Dubai is actually hired to fix",
    intro:
      "Two things have to be true for search to bring you work. The pages have to be readable by a crawler and aimed at what someone actually types, and the result has to be worth clicking when it appears. Most sites fail the second long before the first, and most of what an SEO consultant in Dubai gets hired for sits there: pages that rank for the company name, which only people who already know you ever search.",
    metaTitle: "Freelance SEO Consultant in Dubai | Bilal Shafqat",
    metaDescription:
      "Freelance SEO consultant in Dubai covering technical SEO, local search and AI visibility, measured against enquiries rather than rankings.",
    // Condensed from "How long does SEO take in Dubai?"
    railTimeline: "Weeks for technical fixes, six to twelve months for rankings",
    faqs: [
      {
        question: "Can you get me to number one?",
        answer:
          "Nobody can promise that, and anyone who does is describing a search term nobody uses. What I can tell you before we start is whether a term is winnable: the number of backlinks the current top ten carry, and whether the first page is already taken by portals and AI answers. For some terms the honest answer is that paid is your only route onto page one, and it is better to know that before you fund a year of content.",
      },
      {
        question: "How long does SEO take in Dubai?",
        answer:
          "For a new site on a competitive commercial term, plan on six to twelve months. For long, specific, lower-competition phrases, sometimes weeks. The variable is not effort, it is how much authority the pages above you already have.",
      },
      {
        question: "Are you an SEO agency?",
        answer:
          `No, and the distinction matters when you compare quotes. I am one person. You get the work done by someone with ${spellCount(yearsExperience())} years behind it rather than by a junior under an account manager, and you get one person's capacity rather than a team's. If you need six deliverables a week across several channels, an agency is genuinely the better answer and I will say so.`,
      },
      {
        question: "What is GEO and do I need it?",
        answer:
          "Generative Engine Optimisation: being quoted inside ChatGPT, Gemini and Google's AI Overviews rather than ranking below them. It is early, the search volume for the term itself is near zero, and it is already affecting results: this site gets AI assistants opening its pages because someone asked a question. The work overlaps with good SEO but is not identical: it rewards structured data and clear, checkable claims over keyword placement.",
      },
      {
        question: "How will I know it worked?",
        answer:
          "Enquiries, not rankings. Rankings are a diagnostic and they move for reasons that have nothing to do with you. Before any work starts I want conversion tracking firing on a real enquiry and leads landing in your CRM with their source attached, because without that neither of us can tell SEO from luck.",
      },
    ],
    items: [
      { title: "Search Engine Optimisation (SEO)", pillarSlug: "paid-marketing" },
      { title: "Generative Engine Optimisation (GEO)", pillarSlug: "paid-marketing" },
      { title: "Demand Generation", pillarSlug: "paid-marketing" },
    ],
  },
  {
    /** Added 2026-09-17 at Bilal's request (roadmap 206).
     *
     *  **This page argues method, not results, and that is deliberate.** No case
     *  study on this site involves an email campaign, so there is nothing to
     *  derive proof from. Rather than pad it with plausible outcomes nobody can
     *  point at, every claim here describes how the work is done. The page says
     *  so in the open, because a service page with no proof that pretends
     *  otherwise is worse than one that is honest about it. */
    slug: "email-marketing",
    title: "Email Marketing",
    accent: "gold",
    headline: "Email marketing in Dubai is only as good as the CRM behind it",
    intro:
      "Most email marketing in Dubai fails for reasons that are not writing problems. The sequence fires from a list nobody segmented, to contacts a form dropped in with no source attached, about an offer that stopped running. Email is the last step of a chain, and it fails where the chain does, which is usually two steps earlier, in the form or the CRM.",
    metaTitle: "Freelance Email Marketing in Dubai | Bilal Shafqat",
    metaDescription:
      "Email marketing in Dubai: welcome and nurture sequences, list segmentation and campaign design, wired into the CRM that actually feeds them.",
    faqs: [
      {
        question: "Do you have a published email case study?",
        answer:
          "Not yet. The work on this site is website, app, launch campaign and social, and none of those write-ups involve an email sequence. I would rather tell you that than show you a number you cannot check. If email is the main thing you need, ask on the call and I will be straight about whether I am the right person for it.",
      },
      {
        question: "Is email still worth it in the UAE when everyone uses WhatsApp?",
        answer:
          "They do different jobs. WhatsApp is immediate and personal, which makes it right for a hot lead and wrong for a fourteen-message nurture sequence nobody asked for. Email carries the long middle: the buyer six months out who is not ready to talk. Most setups here need both, with the CRM deciding which channel a contact is on.",
      },
      {
        question: "Which platform do you work in?",
        answer:
          "Whichever one your CRM already talks to. I set up HubSpot, Zoho and Salesforce, and the email tool that matters is the one that shares a contact record with them rather than keeping a second list that drifts out of date. If you have no CRM yet, that decision comes first and the email tool follows it.",
      },
      {
        question: "Do you write the emails or just build the sequence?",
        answer:
          "Both, and they are hard to separate usefully, because the sequence structure is a writing decision. If you have a brand voice or an in-house writer, I will build to it and say where the structure is fighting the copy.",
      },
    ],
    items: [
      { title: "Email Marketing", pillarSlug: "paid-marketing" },
      { title: "WhatsApp Marketing", pillarSlug: "paid-marketing" },
      { title: "CRM & MarTech Integration", pillarSlug: "crm-marketing-automation" },
    ],
  },
  {
    slug: "video-conversion",
    title: "Video & Conversion",
    headline: "A video editor in Dubai, plus the pages that convert what the video sends",
    intro:
      "Hiring a video editor in Dubai and a conversion specialist separately is how the two stop talking: one drives attention, the other decides whether that attention turns into an enquiry. This covers video editing for how high-consideration audiences actually watch, alongside conversion rate work on the pages that traffic lands on, tested against real behaviour rather than opinion.",
    metaTitle: "Freelance Video Editor in Dubai | Bilal Shafqat",
    metaDescription:
      "Freelance video editor in Dubai, plus conversion rate optimisation, landing page audits and A/B testing on the pages that video sends traffic to.",
    // Condensed from "How long does a video take?"
    railTimeline: "Days from supplied footage, not weeks",
    faqs: [
      {
        question: "What kind of video do you edit?",
        answer:
          "Project and property walkthroughs, testimonial and case study films, and cut-downs for paid and organic social. The editing is shaped by how that particular audience watches.",
      },
      {
        question: "What does a CRO engagement involve?",
        answer:
          "An audit of your pages against real user behaviour, a prioritised list of changes, then implementing and testing them rather than guessing which might help.",
      },
    ],
    accent: "cyan",
    items: [
      { title: "B2B & Real Estate Video Editing", pillarSlug: "design-content-conversion" },
      { title: "Conversion Rate Optimization (CRO)", pillarSlug: "design-content-conversion" },
    ],
  },
];

/**
 * The Services menu as the header renders it: four columns, each service
 * reduced to the handful of fields the menu and its preview rail read.
 *
 * Server-side only. The result is passed to the header as props, so the client
 * receives roughly fifteen titles and sentences rather than this whole file.
 * A slug in `serviceMenuColumns` with no matching group is dropped, as the
 * header did before.
 */
export function buildServiceMenu(): MenuColumn[] {
  return serviceMenuColumns.map((column) => ({
    title: column.title,
    services: column.slugs.flatMap((slug) => {
      const group = getCategoryBySlug(slug);
      if (!group) return [];
      return [
        {
          slug: group.slug,
          title: group.title,
          accent: group.accent,
          summary: firstSentence(group.intro),
          points: group.items.slice(0, 3).map((item) => item.title),
          ...(group.railTimeline ? { timeline: group.railTimeline } : {}),
        },
      ];
    }),
  }));
}

/** The first sentence of a page's intro, which is written as a standalone
 *  opening line on every one of the fifteen. Split on a full stop followed by
 *  whitespace, so "Next.js" and "4.6x" survive. */
function firstSentence(text: string): string {
  const match = text.match(/^.*?[.?!](?=\s|$)/);
  return (match ? match[0] : text).trim();
}
