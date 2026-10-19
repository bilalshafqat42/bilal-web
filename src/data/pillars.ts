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
        body: "Websites built on Next.js for speed and SEO out of the box, or on WordPress, Wix, Squarespace or Strapi where you want to update content yourself, designed around conversion rather than just visual polish.",
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
      // The sections below back the CMS and custom development pages added
      // 2026-10-16 (see `serviceCategories.ts`). They live in this pillar
      // because a page's "What this covers" list resolves to pillar sections,
      // and this is the pillar the work belongs to.
      {
        title: "CMS Selection & Planning",
        body: "Choosing the platform against four things before any design starts: who edits the site and how often, how much content it carries and in how many languages, what the campaigns need from it (landing pages, tracking, forms that feed a CRM), and what it will cost to run in two years rather than just to launch.",
        bullets: ["A platform recommendation with the trade-offs written down", "Content model and page templates planned up front", "Tracking and CRM requirements set before the build"],
      },
      {
        title: "CMS Migration & Redirects",
        body: "Moving a site between platforms without losing what it has earned. Every URL is mapped and either kept or redirected, page titles and descriptions come across, and forms, GA4 and the Meta Pixel are tested on the new site before the domain switches.",
        bullets: ["URL map and 301 redirects", "Content and metadata migration", "Tracking and form tests before go-live"],
      },
      {
        title: "Editor Training & Handover",
        body: "A CMS is only worth having if the people who edit it can use it without calling anyone. Handover means your editor adding a page and changing a form in front of me, a short written guide for the tasks they will repeat, and every account in your name.",
        bullets: ["Hands-on training for your editors", "A short written guide for repeat tasks", "Accounts, domain and hosting in your name"],
      },
      {
        title: "Custom WordPress Themes",
        body: "A theme built for your site rather than a multipurpose theme bought for its demo. It loads only what your pages use, matches the design exactly, and gives editors fields and blocks that fit your content instead of a hundred options they will never need.",
        bullets: ["Theme built from your design, not a demo", "Blocks or ACF fields matched to your content", "No plugin for what a few lines of code can do"],
      },
      {
        title: "Elementor & ACF Builds",
        body: "Elementor where your team wants to build layouts themselves, set up with global colours, fonts and saved sections so new pages stay on brand. Advanced Custom Fields where they edit structured content such as projects, team members or listings, so the layout cannot be broken by accident.",
        bullets: ["Elementor with global styles and saved templates", "ACF fields and custom post types", "Editing set up around your marketing team"],
      },
      {
        title: "WordPress Speed, SEO & Lead Forms",
        body: "The parts that decide whether the site earns its keep: pages that load fast on a phone, titles, schema and redirects handled properly, and forms that send every enquiry to your CRM with its campaign source, alongside GA4 and Meta Pixel events through Google Tag Manager.",
        bullets: ["Core Web Vitals checked on mobile", "Technical SEO and redirects", "Forms into HubSpot, Zoho or Salesforce, with tracking"],
      },
      {
        title: "Wix Website Setup",
        body: "A Wix site structured before it is designed: the pages your buyers actually need, navigation that leads to an enquiry, and a layout checked on a phone first. Built in the Wix editor or Wix Studio, so you can keep editing it yourself after handover.",
        bullets: ["Site structure planned around enquiries", "Mobile layout checked page by page", "Handover so you can edit it yourself"],
      },
      {
        title: "Wix Campaign Landing Pages",
        body: "Pages built for a specific ad campaign rather than sending it to the homepage: one offer, one form, the same promise as the ad, and a thank-you page the ad platforms can count as a conversion. Kept out of the site menu, so campaign traffic does not wander.",
        bullets: ["One page per campaign offer", "Short forms built for phones", "Thank-you pages for conversion tracking"],
      },
      {
        title: "Wix SEO & Tracking",
        body: "Titles, descriptions, URLs and redirects set on every page, Google Search Console verified, and GA4, Google Tag Manager and the Meta Pixel connected through Wix's marketing integrations, so you can see which campaign brought each enquiry.",
        bullets: ["Page-level SEO settings and redirects", "GA4, GTM and Meta Pixel connected", "Search Console verified, sitemap submitted"],
      },
      {
        title: "Squarespace Website Design",
        body: "A template used as a starting point, not a finished design. Typography, spacing, colour and image treatment are set at site level so your brand reads through, with custom CSS where the built-in options run out.",
        bullets: ["Site styles set to your brand", "Custom CSS where the template stops", "Every page checked on a phone"],
      },
      {
        title: "Squarespace Portfolio Sites",
        body: "Portfolio and project pages for work that sells on images: galleries that load quickly, project pages with enough words to be found in search, and a clear route from admiring the work to asking about it.",
        bullets: ["Project and gallery pages", "Images sized and described for speed and search", "An enquiry route on every project"],
      },
      {
        title: "Squarespace Lead Capture & Tracking",
        body: "Forms that ask only what you need and send it somewhere useful, plus GA4, the Meta Pixel and Google Tag Manager installed so each enquiry can be traced to the campaign or search that produced it.",
        bullets: ["Short enquiry forms", "GA4, GTM and Meta Pixel", "Form entries passed to email or a CRM"],
      },
      {
        title: "Strapi Content Modelling",
        body: "Designing the content types before anything is built: what a project, a unit, an agent or a location is made of, which fields are required, and how they relate. Done well, editors fill in forms that make sense to them and every page is built from consistent data.",
        bullets: ["Content types and relations planned with your team", "Required fields and validation", "Draft and publish workflow"],
      },
      {
        title: "Next.js Front End for Strapi",
        body: "A Next.js site that reads from Strapi's API and renders pages on the server, so they are fast on a phone and readable by search engines and AI crawlers. Pages refresh when an editor publishes, without a developer redeploying the site.",
        bullets: ["Server-rendered Next.js pages", "Refresh on publish through webhooks", "SEO fields controlled by editors"],
      },
      {
        title: "Multilingual Content & Roles",
        body: "Strapi's built-in internationalisation for English, Arabic and any other language you sell in, with each translation linked to its original. Roles and permissions so an agent can update a listing, a marketer can publish a page, and nobody can change what they should not.",
        bullets: ["English, Arabic and more", "Roles and permissions per team", "One media library across languages"],
      },
      {
        title: "MERN Stack Applications",
        body: "Web applications on MongoDB, Express, React and Node.js, with PostgreSQL where the data is relational: portals people log into, dashboards that read live data from a CRM, and internal tools that replace a spreadsheet the sales team has outgrown.",
        bullets: ["Client and broker portals", "Dashboards on live CRM data", "APIs and third-party integrations"],
      },
      {
        title: "React & Next.js Front Ends",
        body: "Fast, server-rendered sites and landing pages in Next.js and React, written in TypeScript, with tracking, forms and CRM connections built into the code rather than added through plugins. PHP where an existing system or host calls for it.",
        bullets: ["Next.js and React in TypeScript", "Server rendering for speed and search", "PHP for existing systems"],
      },
      // The sections below back the React Native, iOS, Android and app back-end
      // pages added 2026-10-16 (see `serviceCategories.ts`). Every one is
      // React Native: no Swift or Kotlin claim anywhere in them.
      {
        title: "React Native App Builds",
        body: "iOS and Android apps built from one React Native codebase in TypeScript, using Expo where it fits, with each platform's own navigation and conventions respected rather than one layout forced onto both.",
        bullets: ["One codebase for iOS and Android", "TypeScript and Expo", "Platform conventions respected"],
      },
      {
        title: "Real Estate Sales Apps",
        body: "Apps for property sales teams: 3D views of buildings and floors, unit availability read from the CRM, live project data such as pricing and progress, and brochures shared from inside the app so the follow-up leaves the meeting with the buyer.",
        bullets: ["3D property and floor views", "Availability read from the CRM", "Live project data and sharing"],
      },
      {
        title: "App Performance & Release",
        body: "Apps that stay smooth on mid-range phones, with virtualised lists, sized images and fewer re-renders, then builds, beta testing and store releases managed through launch and the updates after it.",
        bullets: ["Performance on mid-range devices", "Beta testing on both platforms", "Release and update process"],
      },
      {
        title: "iPhone & iPad App Builds",
        body: "iOS apps for iPhone and iPad built in React Native, with layouts designed for the larger iPad screen where a sales team presents from a tablet, rather than a phone layout stretched to fit.",
        bullets: ["iPhone and iPad layouts", "Apple's own interface components", "Tablet presentation set-ups"],
      },
      {
        title: "App Store Submission & Review",
        body: "Submission through App Store Connect under your Apple Developer account: TestFlight betas, screenshots and listing copy, privacy details, and the checks that prevent the common App Review rejections.",
        bullets: ["TestFlight beta testing", "Listing, screenshots and privacy labels", "App Review preparation"],
      },
      {
        title: "iOS Push Notifications & Tracking",
        body: "Push notifications through Apple's service, asked for at a moment that makes sense to the user, plus install and in-app event tracking set up to respect App Tracking Transparency.",
        bullets: ["Push notifications", "Install and in-app event tracking", "App Tracking Transparency handled"],
      },
      {
        title: "Android App Builds",
        body: "Android apps built in React Native from the same code as iOS, with Android's own back behaviour, permissions, notification channels and layouts handled properly rather than copied from the iPhone version.",
        bullets: ["Same codebase as iOS", "Android navigation and permissions", "Notification channels"],
      },
      {
        title: "Google Play Submission & Play Console",
        body: "Publishing through Google Play Console under your account: app bundles, testing tracks, staged rollouts, the Data safety form, and a store listing written to convert rather than filled in at the end.",
        bullets: ["Testing tracks and staged rollouts", "Data safety and content rating", "Store listing copy and graphics"],
      },
      {
        title: "Android Device Testing & Tracking",
        body: "Testing on real Android phones across ages, sizes and makers, including budget devices and large font settings, then install attribution and in-app events connected to your campaigns and CRM.",
        bullets: ["Real-device testing across the range", "Install referrer attribution", "Events into GA4 and ad platforms"],
      },
      {
        title: "Firebase App Back Ends",
        body: "Firebase for apps that need realtime data, logins and notifications quickly: Firestore, Authentication, Cloud Functions and Cloud Messaging, with security rules written before launch rather than after a scare.",
        bullets: ["Firestore and Authentication", "Cloud Functions and messaging", "Security rules from day one"],
      },
      {
        title: "Node & Express APIs on MongoDB",
        body: "Node and Express APIs on MongoDB for apps with complex data, reporting and integrations: validated, versioned and logged, so the older app versions still on people's phones keep working.",
        bullets: ["REST APIs with validation", "Versioning for older app releases", "Indexes and aggregation for reports"],
      },
      {
        title: "Admin Panels & CRM Sync",
        body: "A web admin panel your team runs the app from, built in React or Next.js, and connections to your CRM so leads, bookings and users created in the app reach the sales team without anyone copying them across.",
        bullets: ["Admin panel with roles", "CRM sync for leads and bookings", "Push notification sending"],
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
        title: "Conversion Rate Optimisation (CRO)",
        body: "Once traffic is arriving, CRO work looks at what's actually stopping visitors from converting: page structure, copy, forms, and load speed, and tests changes against real data.",
        bullets: ["Landing page audits", "A/B testing", "Form & funnel optimisation"],
      },
      // Back the Figma page added 2026-10-16.
      {
        title: "Website & Landing Page Design in Figma",
        body: "Websites and campaign landing pages designed in Figma on a phone-first layout, with every state drawn and the real copy in place, so the file shows exactly what will be built.",
        bullets: ["Phone-first layouts", "States and breakpoints drawn", "Real copy, not placeholder text"],
      },
      {
        title: "Figma Prototypes & Design Systems",
        body: "Clickable prototypes for stakeholders to try and sign off, and a component library with variables and variants so every screen is assembled from the same parts.",
        bullets: ["Clickable prototypes", "Components, variants and variables", "A shared library across files"],
      },
      {
        title: "Figma to Website Handover",
        body: "Figma to website builds in WordPress or Next.js, with design tokens carried into code, assets exported at the right sizes, and the build checked against the file before launch.",
        bullets: ["Figma to WordPress or Next.js", "Tokens carried into CSS", "Build reviewed against the design"],
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
      // The sections below back the CRM integration hub and its four platform
      // pages, added 2026-10-16 (see `serviceCategories.ts`).
      {
        title: "CRM Lead Source Integration",
        body: "Every lead source connected to one CRM with its origin attached: website and landing page forms, Meta and Google lead forms, WhatsApp, and portal or partner feeds where they exist. Each one is tested end to end before launch, so nothing arrives without its campaign.",
        bullets: ["Forms, lead ads and WhatsApp into one CRM", "UTMs and click IDs kept on every lead", "End-to-end tests for each source"],
      },
      {
        title: "Lead Routing & Deduplication",
        body: "Rules that decide who gets each lead and what counts as the same person: assignment by project, language or rotation, alerts when a lead waits too long, and duplicates matched on phone and email before they become three records for three agents.",
        bullets: ["Assignment rules and rotation", "Response-time alerts", "Duplicate matching on phone and email"],
      },
      {
        title: "Unified Lead Reporting",
        body: "Ad spend from the platforms joined to outcomes in the CRM, so reports show leads, qualified leads and cost per qualified lead by source and campaign, and the qualified ones go back to Google and Meta as conversions.",
        bullets: ["Leads and qualified leads by source", "Cost per qualified lead", "Offline conversions back to the ad platforms"],
      },
      {
        title: "Zoho CRM Setup for Real Estate",
        body: "Zoho CRM configured for property: modules and fields for projects, units and brokers, lead stages that match how your sales team works, and assignment rules so each enquiry reaches the right person.",
        bullets: ["Custom modules for projects and units", "Lead stages and Blueprint processes", "Assignment rules and roles"],
      },
      {
        title: "Meta Lead Ads into Zoho",
        body: "Facebook and Instagram lead forms connected to Zoho CRM, so every lead arrives within seconds with its campaign, ad set and form attached, alongside website enquiries and other social lead forms.",
        bullets: ["Native or webhook connection", "Phone numbers in international format", "Campaign and ad attached to the lead"],
      },
      {
        title: "Zoho WhatsApp Follow-up Automation",
        body: "A first WhatsApp message sent automatically when a lead arrives, using an approved template, with replies logged against the contact in Zoho and follow-up tasks created for the agent who owns it.",
        bullets: ["Approved WhatsApp templates", "Conversations logged in Zoho", "Follow-up tasks and reminders"],
      },
      {
        title: "HubSpot Forms & Tracking",
        body: "Website and landing page forms connected to HubSpot, whether they are HubSpot forms or your own, with the tracking code installed so each contact carries its original source, campaign and page history.",
        bullets: ["HubSpot or custom forms", "Original source and UTM properties", "Tracking code alongside GA4 and GTM"],
      },
      {
        title: "HubSpot Lifecycle Stages & Workflows",
        body: "Lifecycle stages and lead status defined with your sales team, then workflows that move contacts on real triggers, assign owners, create tasks and send the follow-up nobody has to remember.",
        bullets: ["Stage definitions agreed with sales", "Owner rotation and tasks", "Nurture and follow-up workflows"],
      },
      {
        title: "HubSpot Ads & Reporting",
        body: "Google, Meta and LinkedIn ad accounts connected to HubSpot, lead form submissions synced, stage changes sent back as conversions, and dashboards that show cost per qualified lead by source.",
        bullets: ["Ads integration and conversion events", "Lead form sync", "Dashboards marketing and sales share"],
      },
      {
        title: "Marketing Cloud Email Design",
        body: "EDMs designed to your Salesforce Marketing Cloud templates and content blocks, from launch announcements to sales offer emails, built to read properly on a phone and across the main email clients.",
        bullets: ["Template-based EDM design", "Sales offer content", "Rendering and send tests"],
      },
      {
        title: "CloudPages & Sales Data Pages",
        body: "CloudPages built on Marketing Cloud data: landing pages and forms for campaigns, and pages that present company sales data to sales managers inside a custom application.",
        bullets: ["Campaign landing pages and forms", "Sales data pages for managers", "Access limited to the right people"],
      },
      {
        title: "Campaign & Lead Capture into Salesforce",
        body: "Website forms and ad lead forms creating leads in Salesforce with their campaign attached, through Web-to-Lead, the API or a connector, with GA4 and the ad platforms kept in step.",
        bullets: ["Web-to-Lead and API forms", "Campaign source on every lead", "Duplicate checks before creation"],
      },
      {
        title: "Custom CRM Lead Intake & Pipelines",
        body: "A CRM built around your process: lead intake from every source, pipelines and stages that match how you sell, roles for agents, managers and marketing, and a record of every change.",
        bullets: ["Lead intake from forms, ads and WhatsApp", "Pipelines and roles built to your process", "An audit trail on every record"],
      },
      {
        title: "Attribution & Ad Platform Syncs",
        body: "Campaign, ad and click IDs stored on every lead, ad spend pulled from Google Ads and Meta through their APIs, and qualified leads sent back as conversions, so cost per qualified lead is calculated rather than estimated.",
        bullets: ["UTMs and click IDs on every lead", "Spend synced from the ad platforms", "Conversions sent back"],
      },
      {
        title: "Custom Sales Reporting Dashboards",
        body: "Dashboards built for the questions management actually asks: leads and qualified leads by source, response times by agent, pipeline by project and cost per sale, on the web or in an app.",
        bullets: ["Source and campaign reports", "Agent response times", "Pipeline by project"],
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
      { label: "React & Next.js", href: "/services/custom-web-development" },
      { label: "iOS & Android apps", href: "/services/mobile-app-development" },
      { label: "CRM & tracking", href: "/services/crm-integration" },
    ],
  },
];

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
