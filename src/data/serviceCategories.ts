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
};

export function getCategoryBySlug(slug: string): MegaMenuGroup | undefined {
  return megaMenuGroups.find((g) => g.slug === slug);
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
    metaTitle: "Freelance Paid Marketing in Dubai — Bilal Shafqat",
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
    metaTitle: "Freelance Google Ads in Dubai — Bilal Shafqat",
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
    metaTitle: "Freelance Facebook Ads in Dubai — Bilal Shafqat",
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
    metaTitle: "Freelance LinkedIn Marketing in Dubai — Bilal Shafqat",
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
    metaTitle: "Social Media Marketing in Dubai — Bilal Shafqat",
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
    metaTitle: "Digital Marketing in Dubai — Bilal Shafqat",
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
    headline: "A freelance web developer in Dubai who builds for the marketing pointed at it",
    intro:
      "A site that looks good but does not convert is a cost, not an asset, and most of what a web developer in Dubai is asked for is the second half of that. I build on Next.js for speed and search performance, React Native for mobile, and the MERN stack for custom tools, designed from the start around whatever campaigns will be sending traffic to them.",
    // Narrowed 2026-10-02, once mobile got its own page in the category above.
    // "Web & App Developer" carried both and so was aimed at neither, which is
    // the mistake this whole phase exists to undo. Mobile searches now land on
    // the mobile page; this one is for "web developer Dubai".
    metaTitle: "Freelance Web Developer in Dubai — Bilal Shafqat",
    metaDescription:
      "Freelance web developer in Dubai building Next.js and WordPress sites, landing pages and custom tools, for someone who runs the campaigns.",
    // Condensed from "How long does a website take?"
    railTimeline: "Landing page two weeks, a full site four to eight",
    faqs: [
      {
        question: "What do you build with?",
        answer:
          "Next.js and React for websites and landing pages, React Native for mobile apps, the MERN stack with MongoDB or PostgreSQL for custom applications, and WordPress, Squarespace or Wix where a CMS suits you better.",
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
    ],
    accent: "violet",
    items: [
      { title: "Website Design & Development", pillarSlug: "website-app-development" },
      { title: "Mobile App Development", pillarSlug: "website-app-development" },
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
    metaTitle: "Mobile App Development in Dubai — Bilal Shafqat",
    metaDescription:
      "Mobile app development in Dubai: React Native for iOS and Android, with the back end, analytics and launch campaign built in. Shipped work.",
    // Condensed from "How long does an app take?"
    railTimeline: "Months rather than weeks, scope decides",
    faqs: [
      {
        question: "Native or React Native?",
        answer:
          "React Native for almost everything a business needs: one codebase for iOS and Android, which halves the build and halves the maintenance forever after. Native earns its cost when the app leans on hardware in a way the bridge handles badly, which is rarer than it is claimed to be. The LEOS app on this site is React Native and runs on both stores.",
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
    metaTitle: "Freelance UI/UX Designer in Dubai — Bilal Shafqat",
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
    metaTitle: "Freelance Web Designer in Dubai — Bilal Shafqat",
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
          "Both are fine, and for a lot of businesses they are the right answer — you can run the site yourself without calling anyone. The design work does not change much; what changes is how much of it survives the platform. I will say early if what you want is going to fight the tool you have chosen.",
      },
      {
        question: "How is this different from a design agency?",
        answer:
          "You work with the person designing it. There is no account manager translating your feedback and no junior doing the work the pitch was won on. The trade is capacity: one person has a ceiling. If you need several designs a week across several brands, an agency is the better answer.",
      },
      {
        question: "Do you do the copy as well?",
        answer:
          "I write the structure and the working copy, because layout and words are the same decision — you cannot design a page around content that does not exist yet. If you have a writer or a brand voice, I design to it and say where the structure is fighting the words.",
      },
    ],
    items: [
      { title: "Web Design", pillarSlug: "design-content-conversion" },
      { title: "UI/UX Design", pillarSlug: "design-content-conversion" },
      { title: "Conversion Rate Optimization (CRO)", pillarSlug: "design-content-conversion" },
    ],
  },
  {
    slug: "graphic-design-branding",
    title: "Graphic Design & Branding",
    headline: "A graphic designer in Dubai for identity that holds up beyond the logo file",
    intro:
      "A logo is the easy part, and it is the smallest thing a graphic designer in Dubai is actually asked for. What matters is whether the identity still works on a website, an ad, a brochure and a pitch deck once other people are applying it. Graphic design in Dubai covers far more than the mark: logo, colour and typography systems, documented brand guidelines so anyone can apply them consistently, and the company profile and pitch materials that carry the brand into a room.",
    metaTitle: "Freelance Graphic Designer in Dubai — Bilal Shafqat",
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
    metaTitle: "Freelance CRM Consultant in Dubai — Bilal Shafqat",
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
    metaTitle: "Freelance SEO Consultant in Dubai — Bilal Shafqat",
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
          "Generative Engine Optimisation: being quoted inside ChatGPT, Gemini and Google's AI Overviews rather than ranking below them. It is early, the search volume for the term itself is near zero, and it is already affecting results — this site gets AI assistants opening its pages because someone asked a question. The work overlaps with good SEO but is not identical: it rewards structured data and clear, checkable claims over keyword placement.",
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
      "Most email marketing in Dubai fails for reasons that are not writing problems. The sequence fires from a list nobody segmented, to contacts a form dropped in with no source attached, about an offer that stopped running. Email is the last step of a chain, and it fails where the chain does — which is usually two steps earlier, in the form or the CRM.",
    metaTitle: "Freelance Email Marketing in Dubai — Bilal Shafqat",
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
          "They do different jobs. WhatsApp is immediate and personal, which makes it right for a hot lead and wrong for a fourteen-message nurture sequence nobody asked for. Email carries the long middle — the buyer six months out who is not ready to talk. Most setups here need both, with the CRM deciding which channel a contact is on.",
      },
      {
        question: "Which platform do you work in?",
        answer:
          "Whichever one your CRM already talks to. I set up HubSpot, Zoho and Salesforce, and the email tool that matters is the one that shares a contact record with them rather than keeping a second list that drifts out of date. If you have no CRM yet, that decision comes first and the email tool follows it.",
      },
      {
        question: "Do you write the emails or just build the sequence?",
        answer:
          "Both, and they are hard to separate usefully — the sequence structure is a writing decision. If you have a brand voice or an in-house writer, I will build to it and say where the structure is fighting the copy.",
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
    metaTitle: "Freelance Video Editor in Dubai — Bilal Shafqat",
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
