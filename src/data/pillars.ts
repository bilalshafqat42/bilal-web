import { Target, Code2, Palette, Workflow, type LucideIcon } from "lucide-react";
import type { Accent, Faq, LedgerTag } from "./types";
import type { MegaMenuItem } from "./serviceCategories";

// Re-exported so the many existing `@/data/pillars` imports keep compiling after
// the 2026-10-13 split. New code should import from the module that owns the
// thing: `types.ts`, `menu.ts` (client-safe) or `serviceCategories.ts`.
export type { Accent, Faq, LedgerTag } from "./types";
export { accentClasses, serviceMenuColumns, type ServiceMenuColumn } from "./menu";
export * from "./serviceCategories";

export type PillarSection = {
  title: string;
  body: string;
  bullets: string[];
};

export type Pillar = {
  slug: string;
  icon: LucideIcon;
  accent: Accent;
  label: string;
  shortDescription: string;
  capabilities: string[];
  /** One-line summary for the homepage capability ledger. Separate from
   *  `shortDescription`, which is written for the services pages where there is
   *  room to breathe — at ledger width it wraps to four lines and breaks the
   *  row rhythm. */
  ledgerSummary: string;
  /** Three short tags for the ledger row. Distinct from `capabilities` for the
   *  same reason: those run to five words each and would wrap.
   *
   *  Each one links to the narrower service page it names. The row's own title
   *  is a stretched link covering the whole row, so these have to sit above it
   *  in the stacking order or the overlay swallows the click. See the
   *  `relative z-10` in `CapabilityLedger`.
   *
   *  Labels are written for a reader scanning a chip, not for a crawler: the
   *  page they point at carries the keyword, and three chips reading "SEO
   *  Dubai", "Google Ads Dubai", "Web Design Dubai" would be the kind of thing
   *  that makes a page look optimised rather than useful. */
  ledgerTags: [LedgerTag, LedgerTag, LedgerTag];
  /** Where the ledger row links. Defaults to `/services/{slug}`, but that is
   *  not always live: `design-content-conversion` was retired on 2026-08-28
   *  when its content split across four narrower category pages, and now 308s
   *  to the hub. Linking the slug anyway would send every visitor through a
   *  redirect, so that row names its real destination here. */
  ledgerHref?: string;
  heroDescription: string;
  sections: PillarSection[];
  faqs: Faq[];
};

export const pillars: Pillar[] = [
  {
    slug: "paid-marketing",
    icon: Target,
    accent: "gold",
    label: "Paid Marketing & Lead Generation",
    shortDescription:
      "I plan and run paid campaigns across Google and social platforms to bring in qualified leads, not just clicks.",
    capabilities: [
      "Google, Meta, TikTok & Snapchat Ads",
      "Email & WhatsApp Marketing",
      "Lead Generation & Demand Generation",
    ],
    ledgerSummary:
      "Ads and search that bring qualified enquiries, measured on cost per booked call rather than clicks.",
    ledgerTags: [
      { label: "Google Ads", href: "/services/google-ads" },
      { label: "Meta & TikTok ads", href: "/services/facebook-ads" },
      { label: "SEO", href: "/services/seo" },
    ],
    heroDescription:
      "Paid media only works if it's built around your actual sales pipeline, not vanity metrics. I plan, launch, and manage campaigns across every major platform, then track every lead back to cost per acquisition and revenue, not just clicks and impressions.",
    sections: [
      {
        title: "Google Ads & Performance Max",
        body: "Search is the only channel where someone tells you what they want in their own words, which is why it is almost always where a budget should start. The work is less about writing ads than about controlling what you pay for: separating brand from category so you are not bidding against people looking for you by name, separating markets so the UAE is not lumped in with the UK, and building the negative keyword list that stops the other eighty per cent of the traffic. Performance Max will spend whatever you give it and reports back very little, so it goes in after the search campaigns have told us what converts, never before.",
        bullets: ["Search, Shopping and Performance Max", "Negative keyword lists, built before launch and maintained after", "Brand and category separated, so you stop paying twice for your own name", "Conversion tracking server-side, so the reporting survives ad blockers"],
      },
      {
        title: "Meta Ads",
        body: "On Meta nobody is looking for you, so the creative does the targeting. A well-shot video of one specific thing will find the people interested in that thing more reliably than any audience setting, which is why the production matters more here than the campaign structure. The trap is instant forms: they produce a lot of leads cheaply and a meaningful share of them are not real prospects. A cheap cost per lead on a Meta report can be a very expensive cost per meeting once the calls are made, and I would rather show you the second number.",
        bullets: ["Facebook and Instagram, feed, Stories and Reels", "Creative produced rather than repurposed from a brochure", "Instant forms with a qualifying question, so volume does not drown quality", "Retargeting built on real site behaviour, not a catch-all pixel audience"],
      },
      {
        title: "TikTok Ads",
        body: "TikTok punishes advertising that looks like advertising. Creative made for Meta and reposted here reliably underperforms, because the feed is judged against organic video made by people with no budget and a better instinct for the platform. It rewards volume and iteration: several rough cuts tested quickly beats one polished film, and the winner is rarely the one that looked best in the edit. Worth testing where the product is visual and the audience skews younger, and worth skipping where it is neither.",
        bullets: ["Creative made for the platform, not adapted to it", "Several variants tested rather than one hero cut", "Spark Ads from organic posts that already earned attention", "Honest reporting on whether it is working for your product"],
      },
      {
        title: "Snapchat Ads",
        body: "Snapchat is stronger in the UAE than its global share suggests, and it is routinely skipped by advertisers who assume it is a teenage app. Reach here is cheap and the formats are native: vertical video, AR lenses, and a feed people scroll quickly. It works for awareness and for products with a visual hook, and it does not work for considered B2B purchases. I will tell you which of those you have before any budget moves.",
        bullets: ["Vertical video and story formats", "AR lenses where the product suits one", "Cheap reach for launches and awareness", "A clear answer on whether your product fits the platform"],
      },
      {
        title: "LinkedIn Advertising",
        body: "LinkedIn costs several times what the other platforms do per click, and for the right audience it is still the cheapest way to reach them. Targeting by job title, company and seniority is something no other platform does properly, which makes it the right choice for commercial property, B2B services and recruitment, and the wrong one for most residential property. Budget accordingly: the same spend that buys a broad campaign elsewhere buys a narrow one here, and narrow is the point.",
        bullets: ["Targeting by job title, company size and seniority", "Sponsored content and message ads", "Right for B2B and commercial property, usually wrong for residential", "Lead gen forms wired into the CRM rather than exported by hand"],
      },
      {
        title: "Demand Generation",
        body: "Building awareness and interest before someone is ready to buy, so there's a pipeline to convert later, not just bottom-of-funnel capture.",
        bullets: ["Top-of-funnel content & campaigns", "Retargeting sequences", "Pipeline nurturing"],
      },
      {
        title: "Lead Generation",
        body: "Turning that interest into an actual list of qualified contacts, built through landing pages, gated offers, and forms designed to capture the right leads, not just the most leads.",
        bullets: ["Landing pages & lead capture forms", "Gated content & lead magnets", "Lead qualification & CRM handoff"],
      },
      {
        // Added 2026-10-02. SEO was the largest gap on the site: the word did
        // not appear once on /services, there was no section for it anywhere in
        // this file, and "seo consultant in dubai" shows 140 searches at
        // difficulty 13 with "SEO consultant Dubai" at 480/20. The site was
        // invisible for a service it actually delivers.
        //
        // It sits under this pillar rather than its own because the pillar is
        // really "marketing" despite its name — it already holds Demand
        // Generation, Lead Generation, Email and WhatsApp.
        title: "Search Engine Optimisation (SEO)",
        body: "Technical SEO, content structure and the measurement behind both. Most sites here are not held back by keywords but by the things underneath them: pages search engines cannot read properly, titles that describe the business instead of the search, and no way to tell which rankings produced an enquiry.",
        bullets: [
          "Technical audit: crawling, indexing, Core Web Vitals, structured data",
          "Keyword and competitor research, mapped to pages rather than to a list",
          "On-page work: titles, headings, internal linking, schema",
          "Local SEO for Dubai and UAE search",
          "Reporting against enquiries rather than rankings",
        ],
      },
      {
        title: "Generative Engine Optimisation (GEO)",
        body: "Being quoted by ChatGPT, Gemini and Google's AI Overviews is becoming a separate problem from ranking, and the answer is not the same work. It depends on structured data an assistant can parse, clear and checkable claims, and content organised around questions rather than keywords.",
        bullets: [
          "Structured data an assistant can read and cite",
          "Content written as answers to real questions",
          "llms.txt and crawler access for AI agents",
          "Tracking which pages assistants actually open",
        ],
      },
      {
        title: "Email Marketing",
        body: "Email sequences and campaigns that follow up on leads and keep past clients engaged, tied into the same CRM and automation setup.",
        bullets: ["Welcome & nurture sequences", "Campaign design & copy", "List segmentation"],
      },
      {
        title: "WhatsApp Marketing",
        body: "WhatsApp is the default business channel across the UAE. I set up broadcast lists, automated replies, and lead capture flows that meet clients where they already are.",
        bullets: ["Broadcast campaigns", "Automated replies & flows", "Lead capture via WhatsApp"],
      },
      {
        title: "Performance Marketing & Optimisation",
        body: "Ongoing optimisation once campaigns are live: lowering cost per lead over time and improving the landing pages that campaigns send traffic to.",
        bullets: ["Funnel & landing page strategy", "Cost-per-lead optimisation", "Budget pacing & ROAS tracking"],
      },
    ],
    faqs: [
      {
        question: "Which ad platforms do you manage?",
        answer:
          "Google (Search, Shopping, Display, Performance Max), Meta (Facebook & Instagram), LinkedIn, and TikTok. I recommend the platform mix based on where your actual customers are, not run every channel by default.",
      },
      {
        question: "Do you handle the creative as well as the media buying?",
        answer:
          "Yes. Ad creative and copy come from the same person managing the campaigns, so there's no handoff between a media buyer and a separate designer.",
      },
      {
        question: "How is performance tracked?",
        answer:
          "Every campaign is set up with proper conversion tracking from day one, tied to leads and revenue rather than just clicks. You get visibility into real cost per lead and cost per acquisition, not vanity metrics.",
      },
    ],
  },
  {
    slug: "website-app-development",
    icon: Code2,
    accent: "violet",
    label: "Website & App Development",
    shortDescription:
      "I design and build the websites, apps, and tools your marketing and sales teams actually run on.",
    capabilities: [
      "High-Converting Landing Pages (Next.js)",
      "Web & Custom Mobile App Development",
      "Custom Marketing Tools & Calculators",
    ],
    ledgerSummary:
      "Custom code, WordPress or mobile, chosen to fit your goal and budget instead of my preference.",
    ledgerTags: [
      { label: "React & MERN", href: "/services/website-app-development" },
      { label: "Web design", href: "/services/web-design" },
      { label: "iOS & Android apps", href: "/services/mobile-app-development" },
    ],
    heroDescription:
      "A website that looks good but doesn't convert is a cost, not an asset. I design and build websites, mobile apps, and internal tools on modern, fast frameworks, built from the start to support whatever marketing is driving traffic to them.",
    sections: [
      {
        title: "Website Design & Development",
        body: "Websites built on Next.js for speed and SEO out of the box, or on WordPress, Squarespace or Wix where you want to update content yourself, designed around conversion rather than just visual polish.",
        bullets: ["High-converting landing pages", "SEO-ready page structure", "CMS integration"],
      },
      {
        title: "Mobile App Development",
        body: "Cross-platform mobile apps that extend a product or campaign onto iOS and Android, from the first build through app store submission.",
        bullets: ["Cross-platform app builds", "App store setup & submission", "Push notifications & analytics"],
      },
      {
        title: "Custom Marketing Tools & Calculators",
        body: "Bespoke tools, calculators, and internal dashboards built on the MERN stack (MongoDB, Express, React, Node.js), with PostgreSQL where the data is relational, when an off-the-shelf product doesn't fit how your team actually works.",
        bullets: ["Custom marketing applications", "Internal dashboards & tools", "APIs & third-party integrations"],
      },
    ],
    faqs: [
      {
        question: "What technology do you build with?",
        answer:
          "Next.js and React for websites and marketing tools, React Native for mobile apps, and the MERN stack (MongoDB, Express, React, Node.js) for custom applications, with PostgreSQL where the data is relational. WordPress, Squarespace and Wix where a CMS is the better fit.",
      },
      {
        question: "Can you work with our existing website instead of rebuilding it?",
        answer:
          "Often, yes, depending on the platform. I can frequently improve, extend, or fix an existing site rather than rebuild from scratch, we'll work out which makes sense once I see what you have.",
      },
      {
        question: "Do you design as well as develop?",
        answer:
          "Yes. Design and development come from the same person, so what gets designed is what actually gets built, with no handoff loss between a designer's file and a developer's build.",
      },
    ],
  },
  {
    slug: "design-content-conversion",
    icon: Palette,
    accent: "cyan",
    label: "Design, Content & Conversion",
    shortDescription:
      "I create the visuals and content behind your campaigns, then optimise the pages that turn visitors into leads.",
    capabilities: [
      "UI/UX, Web & App Design",
      "Branding & Brand Guidelines",
      "Social Media Strategy & Video",
    ],
    ledgerSummary:
      "Interfaces, creative and copy built to earn trust fast and turn existing traffic into enquiries.",
    ledgerTags: [
      { label: "Web & app UI/UX", href: "/services/ui-ux-design" },
      { label: "Brand identity", href: "/services/graphic-design-branding" },
      { label: "Social creative", href: "/services/social-media-marketing" },
    ],
    ledgerHref: "/services",
    heroDescription:
      "Good design and content should do more than look right, they should move someone from scrolling to clicking to booking a call. I handle the branding, visuals, video, and page-level testing that support that whole path, not just one piece of it.",
    sections: [
      {
        title: "UI/UX Design",
        body: "Interface design for websites and apps focused on how someone actually uses the product, not just how it looks in a mockup.",
        bullets: ["Wireframing & prototyping", "Interface design", "Usability & accessibility"],
      },
      {
        title: "Web Design",
        body: "Visual design for websites, built to hand off cleanly into development rather than existing as a disconnected mockup.",
        bullets: ["Landing page design", "Design systems", "Responsive layouts"],
      },
      {
        title: "Mobile App Design",
        body: "App interface design for iOS and Android, designed around each platform's own conventions rather than a single generic layout.",
        bullets: ["App UI design", "Design systems for apps", "App store visuals"],
      },
      {
        title: "Branding",
        body: "Logo, colour, and typography systems built to hold up across a website, social channels, and printed materials, not just a single logo file.",
        bullets: ["Logo design", "Colour & typography systems", "Brand identity"],
      },
      {
        title: "Brand Guidelines",
        body: "A documented brand guideline deck so anyone working on your brand, an agency, a new hire, a freelancer, applies it consistently.",
        bullets: ["Logo usage rules", "Colour & typography specs", "Templates & stationery"],
      },
      {
        title: "Business Profile",
        body: "Company profile decks and one-pagers used for pitching, partnerships, or investor conversations.",
        bullets: ["Company profile design", "Pitch deck design", "Print-ready layouts"],
      },
      {
        title: "Social Media Strategy & Design",
        body: "Creative direction and the actual asset design for the channels you're active on, kept consistent with your brand and built to support paid campaigns rather than sit separately from them.",
        bullets: ["Social media creatives", "Brand collateral", "Campaign-specific asset sets"],
      },
      {
        title: "Social Media Marketing",
        body: "Running the actual posting, engagement, and channel growth, not just designing assets and handing them over.",
        bullets: ["Channel management", "Community engagement", "Performance reporting"],
      },
      {
        title: "Social Media Planning",
        body: "Content calendars and campaign planning that align social content with what's actually running in paid campaigns.",
        bullets: ["Content calendars", "Campaign planning", "Cross-channel alignment"],
      },
      {
        title: "B2B & Real Estate Video Editing",
        body: "Video editing for high-ticket B2B and real estate marketing specifically: property walkthroughs, testimonials, and campaign videos edited for how those audiences actually watch and decide.",
        bullets: ["Property & project walkthroughs", "Testimonial & case study videos", "Ad & social video cuts"],
      },
      {
        title: "Conversion Rate Optimization (CRO)",
        body: "Once traffic is arriving, CRO work looks at what's actually stopping visitors from converting: page structure, copy, forms, and load speed, and tests changes against real data.",
        bullets: ["Landing page audits", "A/B testing", "Form & funnel optimisation"],
      },
    ],
    faqs: [
      {
        question: "Do you only design for real estate and B2B clients?",
        answer:
          "No, that's a specific strength given past project experience, but the same design and content process applies across industries.",
      },
      {
        question: "What does a CRO engagement actually involve?",
        answer:
          "An audit of your current pages against real user behaviour, a prioritised list of changes, then implementing and testing those changes rather than guessing what might help.",
      },
      {
        question: "Can you take over an existing brand identity, or do we need a full rebrand?",
        answer:
          "Existing brand guidelines are usually a starting point, not a blocker. Most engagements build on what you already have rather than starting from zero.",
      },
    ],
  },
  {
    slug: "crm-marketing-automation",
    icon: Workflow,
    accent: "gold",
    label: "CRM & Marketing Automation",
    shortDescription:
      "I connect your marketing, website, and sales data so leads are tracked and followed up automatically, not lost in a spreadsheet.",
    capabilities: [
      "HubSpot, Zoho & Salesforce CRM Setup",
      "Server-Side Pixel & Conversions API Tracking",
      "Marketing Automation Workflows",
    ],
    ledgerSummary:
      "Your marketing, site and sales data connected, so leads are tracked and followed up without anyone remembering to.",
    ledgerTags: [
      { label: "HubSpot, Zoho & Salesforce", href: "/services/crm-marketing-automation" },
      { label: "Email & WhatsApp", href: "/services/email-marketing" },
      { label: "Lead generation", href: "/services/digital-marketing" },
    ],
    heroDescription:
      "Most of the leads a business loses aren't lost to bad marketing, they're lost to a follow-up that never happened because nothing was tracking them properly. This pillar connects everything else, campaigns, website, and CRM, into one system that doesn't rely on someone remembering to check a spreadsheet.",
    sections: [
      {
        title: "CRM Setup (HubSpot, Zoho & Salesforce)",
        body: "Setting up or reconfiguring HubSpot, Zoho, or Salesforce so leads from every channel land in one place, with the pipeline stages and fields that match how your team actually sells.",
        bullets: ["CRM setup & configuration", "Pipeline & lead-stage design", "Team onboarding"],
      },
      {
        title: "Server-Side Tracking & Conversions API",
        body: "Server-side pixel and Conversions API setup for Meta and Google, so conversion data keeps flowing accurately even as browser-based tracking becomes less reliable.",
        bullets: ["Server-side pixel setup", "Conversions API integration", "Cross-platform attribution"],
      },
      {
        title: "Marketing Automation Workflows",
        body: "Automated follow-up sequences, lead scoring, and internal notifications, so a new lead gets a response in minutes, not whenever someone next opens their inbox.",
        bullets: ["Automated email & follow-up sequences", "Lead scoring & routing", "Internal notifications & alerts"],
      },
      {
        title: "Growth Marketing",
        body: "Running structured experiments across acquisition, conversion, and retention together, not just one channel in isolation, so a win in one place compounds instead of staying stuck there.",
        bullets: ["Cross-channel experimentation", "Full-funnel testing, not just ads", "Retention & lifecycle campaigns"],
      },
    ],
    faqs: [
      {
        question: "Which CRMs do you work with?",
        answer:
          "HubSpot, Zoho, and Salesforce most often. If you're using something else, get in touch and we'll confirm fit.",
      },
      {
        question: "What is server-side tracking, and why does it matter?",
        answer:
          "It's a way of sending conversion data, like a completed lead form, directly from your server to platforms like Meta and Google, instead of relying only on a browser-based pixel. It matters because browser tracking has become far less reliable: ad blockers, cookie restrictions, and iOS privacy changes all reduce what a standard pixel can see.",
      },
      {
        question: "We already have a CRM, can you just fix the automation?",
        answer:
          "Yes. Most of this work is improving or rebuilding automation inside a CRM you already have, not necessarily replacing it.",
      },
    ],
  },
];

export function getPillarBySlug(slug: string): Pillar | undefined {
  return pillars.find((pillar) => pillar.slug === slug);
}

/** Resolves a menu item to the section that holds its actual content. */
export function resolveItem(item: MegaMenuItem) {
  const pillar = getPillarBySlug(item.pillarSlug);
  const section = pillar?.sections.find((sec) => sec.title === item.title);
  return section && pillar ? { pillar, section } : undefined;
}

/**
 * The three disciplines, as the homepage and the Services menu both state them.
 *
 * Added 2026-10-06. The homepage said "Four disciplines" and the menu said
 * three, which is a contradiction a visitor can notice, and the fourth pillar
 * was the weakest of the four anyway: "Design, Content & Conversion" has had no
 * page of its own since 2026-08-28, and "CRM & Marketing Automation" is a
 * capability rather than a discipline. Calling it a quarter of the business
 * overstated it.
 *
 * Three is also what Bilal is: marketer, designer, developer. It is his GitHub
 * bio, his Behance headline and the sentence that sells him. One taxonomy in
 * the menu, on the homepage, in the bio and on every profile is worth more over
 * a year than any clever grouping.
 *
 * **Deliberately separate from `pillars`.** That array still has four entries
 * and is read by the contact form's dropdown, the 404 page and the item-to-
 * pillar mapping, none of which make a claim about disciplines. Collapsing it
 * would mean rewriting routing for a presentational change.
 */
export type HomeDiscipline = {
  label: string;
  summary: string;
  /** A real page. No redirects: the old design pillar pointed at `/services`
   *  because its own slug 308s, which worked and read as a loose end. */
  href: string;
  tags: LedgerTag[];
};

export const homeDisciplines: HomeDiscipline[] = [
  {
    label: "Marketing",
    summary:
      "Paid advertising, search, social and email, run as one sequence and measured on cost per enquiry rather than clicks.",
    href: "/services/digital-marketing",
    tags: [
      { label: "Google Ads", href: "/services/google-ads" },
      { label: "Meta & TikTok ads", href: "/services/facebook-ads" },
      { label: "SEO", href: "/services/seo" },
    ],
  },
  {
    label: "Design",
    summary:
      "Interfaces, brand and creative built to earn trust quickly and turn the traffic you already have into enquiries.",
    href: "/services/ui-ux-design",
    tags: [
      { label: "Web & app UI/UX", href: "/services/ui-ux-design" },
      { label: "Web design", href: "/services/web-design" },
      { label: "Brand identity", href: "/services/graphic-design-branding" },
    ],
  },
  {
    label: "Development",
    summary:
      "Websites, mobile apps and the CRM and tracking behind them, so the marketing has something built for it to point at.",
    href: "/services/website-app-development",
    tags: [
      { label: "React & Next.js", href: "/services/website-app-development" },
      { label: "iOS & Android apps", href: "/services/mobile-app-development" },
      { label: "CRM & tracking", href: "/services/crm-marketing-automation" },
    ],
  },
];

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
