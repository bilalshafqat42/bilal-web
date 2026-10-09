import type { Faq } from "./pillars";
import { megaMenuGroups } from "./pillars";
import {
  allItems,
  itemsOfKind,
  type Item,
  type ItemKind,
} from "@/lib/portfolioItems";

/**
 * The nine disciplines as Bilal named them, grouped into the three themed
 * columns the Portfolio mega menu renders.
 *
 * The important decision in this file is that a discipline does NOT
 * automatically get a portfolio page. There are three distinct kinds of
 * artefact in `caseStudies.ts` — web captures, app screens, social creative —
 * and nine pages carved out of three evidence sets means either empty pages or
 * the same pictures shown five times. Both are the exact patterns that damage
 * the search and AI-citation performance this structure exists to improve.
 *
 * So each discipline declares `kinds`. A discipline with `kinds` gets a real
 * `/portfolio/{slug}` page filtered to those artefacts. A discipline without
 * `kinds` has no case study yet and routes to its service page instead, which
 * is a real page with real content. Nothing empty is ever created or indexed.
 *
 * To publish one of the service-routed disciplines later: add the assets to
 * `caseStudies.ts`, give the discipline a `kinds` list, and create the matching
 * route folder. `scripts/discipline-check.mjs` fails the build if a discipline
 * gains work without gaining a route, so this cannot silently drift.
 */
export type DisciplineGroupName = "Design" | "Web & Apps" | "Marketing";

export type Discipline = {
  slug: string;
  /** Menu label. Bilal's wording, kept as he wrote it. */
  title: string;
  group: DisciplineGroupName;
  /** One line under the title in the menu. */
  blurb: string;
  /** Artefact kinds this discipline's portfolio page shows. Absent means there
   *  is no case study for it yet and the menu routes to `serviceHref`. */
  kinds?: ItemKind[];
  /** Where the menu points when there is no portfolio page. Also the "what this
   *  service is" link on the discipline page itself. */
  serviceHref: string;
  /** Overrides `serviceHref` for a discipline whose evidence is genuinely the
   *  same artefacts as a sibling's. Web design and web development are one set
   *  of captures looked at two ways, not two sets, so "Web Designing" points
   *  into a section of the web development page rather than duplicating it.
   *  The menu still shows the real count, taken from `countFrom`. */
  aliasHref?: string;
  /** Discipline slug whose item count this one reports in the menu. */
  countFrom?: string;
  /** Page copy. Only meaningful for disciplines that have a page. */
  page?: {
    headline: string;
    intro: string;
    metaTitle: string;
    metaDescription: string;
    /** How this page differs from the neighbouring ones that draw on some of
     *  the same captures. Rendered on the page, because a reader who arrives
     *  from a sibling deserves to know why they are seeing a familiar image. */
    lens: string;
    /** Long-form sections under the grid.
     *
     *  Added 2026-10-05. `npm run audit` measured these four pages at 348 to
     *  369 words against a site median of 912, which made the proof layer the
     *  thinnest content on the site: a visitor reads these immediately before
     *  deciding whether to make contact, and they were a quarter the depth of
     *  the pages arguing the case.
     *
     *  Same `{ heading, paragraphs }` shape as `DepthBlock` in serviceDepth, so
     *  there is one idea and one renderer rather than two. */
    depth?: { heading: string; paragraphs: string[] }[];
    faqs: Faq[];
  };
};

export const disciplines: Discipline[] = [
  // ── Design ────────────────────────────────────────────────────────────────
  {
    slug: "ui-ux-design",
    title: "UI / UX Design",
    group: "Design",
    blurb: "Interface and flow decisions, across web and app",
    kinds: ["app-screen", "site-mobile"],
    serviceHref: "/services/ui-ux-design",
    page: {
      headline: "Interface design, judged on the decision behind each screen",
      intro:
        "Every screen here is shipped work, not a concept. What is worth looking at is not the surface but the decision underneath it: whether to force a sign-in, whether actions belong on the card or behind a menu, how many fields an enquiry form can carry before it starts costing completions. Each piece links through to the reasoning.",
      metaTitle: "UI/UX Design Portfolio — App & Mobile | Bilal Shafqat",
      metaDescription:
        "Shipped React Native app screens and mobile web layouts. Every screen is live work, not a concept, and each links through to the decision behind it.",
      lens: "This page is the interface cut. It gathers the app screens and the mobile web layouts in one place because they answer the same question — what does a buyer do on a small screen — and it is the only page where they sit together with the design reasoning attached.",
      depth: [
        {
          heading: "The decisions that do not show in a screenshot",
          paragraphs: [
            "A portfolio of app screens is easy to misread. What you are looking at is the surface, and the surface is the cheap part. The expensive decisions are the ones that produced it: whether a buyer should be forced to create an account before they can browse, whether the primary action sits on the card or behind a menu, how many fields an enquiry form can carry before the completion rate starts falling.",
            "Those decisions are what the client paid for. On the property work they came down to one question asked repeatedly: is this step helping a serious buyer get to a conversation, or is it helping us collect data we will never use? Most of the screens here are shorter than their first draft for that reason.",
          ],
        },
        {
          heading: "Designed for the state where things go wrong",
          paragraphs: [
            "The screens that get designed are the ones where everything works. The screens that decide whether an app feels finished are the other ones: an empty list before the first entry, a slow connection, a permission the user declined, a session that expired while the phone was in a pocket, a name sixty characters long.",
            "When those are not specified, the developer decides them under deadline pressure, and they become the parts people complain about. On this work they were specified, which is the main practical advantage of the same person designing and building: there is no handover at which the awkward states can be left out.",
          ],
        },
        {
          heading: "Interface work for a property buyer specifically",
          paragraphs: [
            "Off-plan property has a particular problem. The audience is wide, the product is expensive, and most of the traffic arriving from a campaign will never buy. An interface that makes it easy for everyone to enquire produces a long list and a frustrated sales team.",
            "So the design does the qualifying. The entry price appears early rather than being withheld until a form is submitted. One primary action, short enough to finish one-handed on a phone. A brochure download as a lower-commitment second route for someone who is interested but not ready. A separate path for existing buyers, so somebody asking about a unit they already own does not land in the new-enquiry list.",
            "None of that is visible in a screenshot. All of it is why these particular screens look the way they do.",
          ],
        },
      ],
      faqs: [
        {
          question: "Do you design as well as build?",
          answer:
            "Yes, and on the projects here I did both. The app screens and the mobile layouts on this page were designed and then built by me, which is why the reasoning and the implementation match rather than one having been handed over to the other.",
        },
        {
          question: "Do you work in Figma?",
          answer:
            "Yes. For a solo engagement I usually keep the design phase short and move into a real, clickable build early, because a working page in a browser answers questions a static frame cannot. If your team needs Figma files as a deliverable, say so at the start and I will scope it in.",
        },
      ],
    },
  },
  {
    slug: "web-design",
    title: "Web Designing",
    group: "Design",
    blurb: "Layout, hierarchy and the path to an enquiry",
    // No page of its own, deliberately. The evidence for web design and for web
    // development is the same seven captures — one set of pages looked at two
    // ways. Two pages carrying identical images would be a near-duplicate, so
    // this label lands on the design section of the development page instead.
    serviceHref: "/services/ui-ux-design#web-design",
    aliasHref: "/portfolio/web-development#design",
    countFrom: "web-development",
  },

  // ── Web & Apps ────────────────────────────────────────────────────────────
  {
    slug: "web-development",
    title: "Web Development",
    group: "Web & Apps",
    blurb: "Corporate sites and off-plan launch pages, built and live",
    kinds: ["site-desktop", "site-mobile"],
    serviceHref: "/services/website-app-development#website-design-development",
    page: {
      headline: "Websites and launch pages, designed and built to convert",
      intro:
        "Corporate websites and campaign landing pages, grouped below by what each one is rather than by who it was for. The published set is property — a corporate site and four off-plan launches, all built to carry high-resolution renders without the load time that usually comes with them — and the same build applies to any sector where a page has to load fast and produce an enquiry. Follow any capture through to the case study for the stack and the structure.",
      metaTitle: "Web Design & Development Portfolio | Bilal Shafqat",
      metaDescription:
        "Corporate websites and campaign landing pages built for speed, mobile and one clear enquiry action. The published set is property: a site and four launches.",
      lens: "This page carries both the design and the build, because they are the same seven captures looked at two ways: how each page is composed, and how it was implemented. Splitting that into two pages would mean two pages showing identical images, which is worth avoiding.",
      depth: [
        {
          heading: "Built around the campaign pointing at it",
          paragraphs: [
            "Most of these sites exist to receive paid traffic. That changes what matters. A brochure site can afford a slow hero image and a form that asks nine questions. A page receiving paid clicks cannot, because every second of load time and every unnecessary field is being paid for per visitor.",
            "So the build starts from the campaign rather than from the design: what the ad promised, what the visitor expects to see first, and what the single next action is. The tracking goes in before the traffic does, which means the reporting is cost per enquiry from the first day rather than cost per click with a guess attached.",
          ],
        },
        {
          heading: "Speed is decided before any code is written",
          paragraphs: [
            "Most slow sites are slow because of what was designed into them: a full-screen video header, a carousel of uncompressed photographs, four webfonts and a stack of third-party scripts loading on every page. No amount of optimisation afterwards fully undoes those choices.",
            "That is the argument for the same person doing both. The decision to use one typeface rather than four is a design decision with a performance consequence, and it is cheap to make at the start and expensive to reverse at the end.",
          ],
        },
        {
          heading: "What happens after launch, which is most of the cost",
          paragraphs: [
            "A website is not finished at launch, it is launched. Browsers update, dependencies need security patches, a payment provider changes an endpoint, somebody uploads a twelve-megabyte photograph and the homepage takes nine seconds. A site nobody maintains degrades quietly and the business usually finds out from a customer.",
            "On this work maintenance was part of the arrangement rather than an afterthought, and the accounts stayed in the client's name throughout. That second part matters more than it sounds: a surprising number of businesses discover at the end of a relationship that their domain or hosting sits inside somebody else's structure.",
          ],
        },
        {
          heading: "The stack, and why it is not the interesting part",
          paragraphs: [
            "React, Next.js and Node on the custom builds, WordPress where the client needed to edit pages without calling anyone. The choice matters far less than people pretend, as long as whoever builds it is genuinely fluent in what they picked.",
            "The question worth asking is not which framework but who runs the site afterwards. A custom build needs a developer for every change. A WordPress site lets a marketing person add a page on a Tuesday afternoon. That is a business decision rather than a technical one, and it should belong to the client.",
          ],
        },
      ],
      faqs: [
        {
          question: "What do you build websites with?",
          answer:
            "The work on this page is custom-built rather than assembled from a page builder, which is what makes the load times on render-heavy property pages possible. I will happily work in WordPress or Webflow where that is genuinely the better fit for your team's ability to edit the site afterwards.",
        },
        {
          question: "Can you take over an existing website?",
          answer:
            "Usually yes. Send me the URL and where it currently sits, and I will tell you honestly whether it is worth improving or worth rebuilding, and roughly what each would cost.",
        },
      ],
    },
  },
  {
    slug: "mobile-app-development",
    title: "Mobile Development",
    group: "Web & Apps",
    blurb: "Cross-platform iOS and Android from one codebase",
    kinds: ["app-screen"],
    serviceHref: "/services/website-app-development#mobile-app-development",
    page: {
      headline: "A cross-platform property app, from a single codebase",
      intro:
        "Cross-platform apps in React Native, one codebase serving both stores. The app below carries the same inventory as the client's website, so someone who first saw a landing page finds the same items, the same photography and the same enquiry routes on their phone — the pattern applies to any catalogue a business already publishes on the web. Every screen is from the shipped build, and each links to the decision behind it.",
      metaTitle: "Mobile App Portfolio — React Native | Bilal Shafqat",
      metaDescription:
        "Mobile app development portfolio: cross-platform React Native apps for iOS and Android from a single codebase, with each screen decision explained.",
      lens: "These screens also appear on the UI/UX Design page, where the subject is the interface decision. Here it is the app as a delivered product: one codebase, two platforms, and the same inventory as the website it sits alongside.",
      depth: [
        {
          heading: "One codebase, two stores, and why that was the right call",
          paragraphs: [
            "These apps are React Native, which means iOS and Android were built once rather than twice. The saving is real and it is not the fifty per cent people expect: there is still platform-specific work, separate testing on both, two store submissions and two sets of compliance. What it removes is the budget pressure that normally causes Android to be treated as the version that gets done second and tested least.",
            "In this region that matters more than it would elsewhere. Android is the majority platform across much of the UAE audience, and an app that was clearly built for iOS and ported afterwards is obvious to the people using it.",
          ],
        },
        {
          heading: "A mistake in an app is more expensive than one on a website",
          paragraphs: [
            "A broken page on a website is fixed and live in minutes. A broken app has to be rebuilt, submitted, reviewed by Apple or Google, approved, and then actually installed by users, some of whom will not update for months.",
            "That single difference changes how the work is done. More testing before release, on real devices rather than only a simulator, including older phones and weak connections. A staged rollout rather than everyone at once. And a way to force an update when a version turns out to be unsafe, which has to be built before it is needed rather than after.",
          ],
        },
        {
          heading: "The parts of an app project nobody quotes for",
          paragraphs: [
            "Store submission is consistently underestimated. Apple and Google both review every submission against rules that change, and both can reject you for reasons unrelated to whether the app works: a missing privacy declaration, an account deletion route, a permission prompt that asks at the wrong moment, screenshots at the wrong sizes.",
            "Then there is the back-end, which is where most of an app's real cost sits and which is invisible in any screenshot. Where the data lives, who may see what, what happens when an integration goes down at two in the morning. On this work the app and the back-end were built together, which is the arrangement that avoids the most common gap in an app project team.",
          ],
        },
      ],
      faqs: [
        {
          question: "Do you build native or cross-platform?",
          answer:
            "Cross-platform in React Native, as on this project. For most business apps one codebase serving both stores is the right economics for a single developer. If your app genuinely needs platform-specific native work, I will say so rather than take the project.",
        },
        {
          question: "Do you handle App Store and Play Store submission?",
          answer:
            "Submission is a step I can run with you, and it is worth planning for early because store review is the part of a launch date nobody controls. I have not claimed a published listing for the app on this page, because that is the client's to announce.",
        },
      ],
    },
  },
  {
    slug: "custom-application-development",
    title: "Custom App Development for Performance Marketing",
    group: "Web & Apps",
    blurb: "Calculators, qualifiers and tools that feed the pipeline",
    serviceHref: "/services/website-app-development#custom-marketing-tools-calculators",
  },

  // ── Marketing ─────────────────────────────────────────────────────────────
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    group: "Marketing",
    blurb: "Brand and campaign creative, built as a set",
    kinds: ["social"],
    serviceHref: "/services/social-media-marketing",
    page: {
      headline: "Social creative built as a set, not as one-off posts",
      intro:
        "Brand creative and campaign creative, split below because they are different jobs: one holds a feed together between campaigns, the other sells a specific launch. Both are designed as a run rather than as individual posts, so a feed reads as one brand instead of as a series of unrelated announcements. The published set is property; the approach is the same for any business running campaigns off a single brand.",
      metaTitle: "Social Media Portfolio — Brand & Campaign | Bilal Shafqat",
      metaDescription:
        "Brand and campaign creative designed as runs rather than one-off posts, so a feed reads as one brand instead of unrelated announcements.",
      lens: "This is the only page for the social work, and it is the full set rather than a selection. A portfolio of creative is more useful complete, because consistency across a run is the thing a client is actually buying.",
      depth: [
        {
          heading: "A full set rather than a selection, deliberately",
          paragraphs: [
            "Most social portfolios show the best six pieces. This one shows the run, because consistency across a series is the thing a client is actually buying and a curated selection hides exactly the quality it claims to demonstrate.",
            "What to look for is whether the twentieth piece still looks like it came from the same brand as the first. That is the part that gets hard, and it is the part that fails when creative is produced by whoever is available that week.",
          ],
        },
        {
          heading: "Organic and paid designed as one thing",
          paragraphs: [
            "The same creative direction runs across the organic grid and the paid campaigns here, because the same person was doing both. When those are split between a social agency and a media buyer, the ad and the post stop looking like they came from one company, and the audience notices before anyone internally does.",
            "There is a practical benefit beyond the aesthetics. A piece of organic creative that performs can be put behind budget the same week rather than waiting for a quarterly review, and a paid creative that fails can be pulled before the spend accumulates.",
          ],
        },
        {
          heading: "Built for where the audience actually is",
          paragraphs: [
            "Most of this ran against a UAE audience, which has its own shape. Instagram carries the discovery, and Reels are the one organic distribution still genuinely reaching beyond followers. LinkedIn behaves differently and converts differently for anything selling to a business. WhatsApp is where a conversation actually continues, which means the job of a post is often to start something that finishes in a different app entirely.",
            "The measure is therefore not follower count. It is how many people moved from a post to a conversation, which is why the profile link, the direct message routing and the page behind it matter more than the grid does.",
          ],
        },
        {
          heading: "What this work does not prove",
          paragraphs: [
            "There are no performance figures on this page. The numbers worth quoting belong to clients rather than to me, and a portfolio with invented percentages on it is worth less than one with none.",
            "So judge this on the craft and the consistency, which are visible, and ask about the results in a conversation, where they can be discussed properly and in context.",
          ],
        },
      ],
      faqs: [
        {
          question: "Do you write the copy as well as design the creative?",
          answer:
            "Yes for the on-image copy and the captions, working from your unit information and launch dates. Where a piece needs a regulated detail such as a permit number or a price disclaimer, I will ask you to confirm it rather than write it myself.",
        },
        {
          question: "Can you run the paid promotion behind these?",
          answer:
            "Yes, that is a separate service and it is what I would usually recommend alongside a launch set. Paid campaign performance data belongs to the client, so you will not find campaign figures on this page.",
        },
      ],
    },
  },
  {
    slug: "paid-marketing",
    title: "Paid Marketing",
    group: "Marketing",
    blurb: "Google, Meta, TikTok and Snapchat, measured on cost per lead",
    serviceHref: "/services/paid-marketing",
  },
  {
    slug: "email-marketing",
    title: "Email Marketing",
    group: "Marketing",
    blurb: "Sequences and broadcasts that reach the inbox",
    // Was an anchor inside /services/digital-marketing until the page existed
    // (roadmap 206). Now a destination of its own.
    serviceHref: "/services/email-marketing",
  },
  {
    slug: "crm-integration",
    title: "CRM Integration",
    group: "Marketing",
    blurb: "HubSpot, Zoho and Salesforce wired to the source of the lead",
    serviceHref: "/services/crm-marketing-automation",
  },
];

export const disciplineGroupOrder: DisciplineGroupName[] = [
  "Design",
  "Web & Apps",
  "Marketing",
];

/** Menu columns. Derived, so adding a discipline above puts it in the menu. */
export const disciplineGroups = disciplineGroupOrder.map((name) => ({
  name,
  disciplines: disciplines.filter((d) => d.group === name),
}));

export function getDiscipline(slug: string): Discipline | undefined {
  return disciplines.find((d) => d.slug === slug);
}

/** The artefacts a discipline shows. Empty for a service-routed discipline. */
export function disciplineItems(d: Discipline): Item[] {
  return d.kinds ? itemsOfKind(...d.kinds) : [];
}

/** True when this discipline has both work and page copy, and so has a route.
 *  Both are required: work with no copy would publish an untitled page. */
export function hasPortfolioPage(d: Discipline): boolean {
  return Boolean(d.kinds && d.page && disciplineItems(d).length > 0);
}

/** Where the menu and any cross-link should point for this discipline. */
export function disciplineHref(d: Discipline): string {
  if (hasPortfolioPage(d)) return `/portfolio/${d.slug}`;
  return d.aliasHref ?? d.serviceHref;
}

/** The count shown beside a menu label. Zero means "no case study yet", which
 *  is what suppresses the badge — an aliased discipline reports its sibling's
 *  real count rather than a nought it does not deserve. */
export function disciplineCount(d: Discipline): number {
  if (d.countFrom) {
    const target = getDiscipline(d.countFrom);
    return target ? disciplineItems(target).length : 0;
  }
  return disciplineItems(d).length;
}

export function disciplinesWithPages(): Discipline[] {
  return disciplines.filter(hasPortfolioPage);
}

/**
 * The proof loop.
 *
 * Two functions, both inverted out of `serviceHref` and the item data rather
 * than from a hand-kept mapping table, because a mapping table is a second
 * source of truth and it goes stale the first time a discipline moves.
 *
 * The problem they solve, measured on 2026-09-14: all eight service pages
 * linked to `/portfolio` and `/portfolio/leos-developments` and nothing else —
 * the same two links on every one — while all six case study pages linked to no
 * service at all. So a visitor reading about UI/UX design was sent to a generic
 * hub instead of to the UI/UX work, and a visitor who arrived on a case study
 * from search had no route to what the service is or what it costs.
 */

/** Discipline pages that prove a given service category. */
export function proofForService(serviceSlug: string): Discipline[] {
  return disciplines.filter(
    (d) =>
      hasPortfolioPage(d) &&
      (d.serviceHref === `/services/${serviceSlug}` ||
        d.serviceHref.startsWith(`/services/${serviceSlug}#`))
  );
}

/** Disciplines a given engagement actually contributed to, derived from that
 *  client's or project's own captures. Passing `projectSlug` narrows it to one
 *  development; omitting it covers the whole client. */
/**
 * The service pages behind a piece of work, deduplicated.
 *
 * **The gap this closes, measured on 2026-10-09.** Service pages carry 2 to 4
 * links into the portfolio. The portfolio carried **zero** links back:
 * `/portfolio/leos-developments` and every project page under it linked to no
 * service at all. A case study is usually the page organic search delivers
 * someone to, and the most persuasive one on the site — it has the
 * photographs. It sent that interest nowhere commercial.
 *
 * Same shape as the article gap closed on 2026-10-07 (roadmap 366): traffic
 * flowing one way and stopping.
 *
 * **No `hasPortfolioPage` filter here**, unlike `disciplinesInWork`. That
 * function feeds the cards, which must link to a portfolio page that exists. A
 * service link does not need one: a discipline with no gallery of its own still
 * sells a service, and excluding it would drop the commercial link for the
 * exact work that has least other evidence.
 *
 * Deduplicated on the path before the `#`, because several disciplines point at
 * anchors on one service page — web-design and ui-ux-design both resolve to
 * `/services/ui-ux-design`. Three links to one page reads as padding.
 */
export function servicesInWork(
  clientSlug: string,
  projectSlug?: string
): { href: string; title: string }[] {
  const mine = allItems().filter(
    (i) => i.clientSlug === clientSlug && (!projectSlug || i.projectSlug === projectSlug)
  );
  const kinds = new Set(mine.map((i) => i.kind));
  const seen = new Set<string>();
  const out: { href: string; title: string }[] = [];
  for (const d of disciplines) {
    if (!d.kinds?.some((k) => kinds.has(k))) continue;
    const base = d.serviceHref.split("#")[0];
    if (seen.has(base)) continue;
    seen.add(base);
    // The **service page's** own title, not the discipline's.
    //
    // Caught by looking at the rendered page: the discipline cards directly
    // above this row are labelled "Web Development" and "Social Media
    // Marketing", and using `d.title` printed the same two words again
    // underneath, pointing somewhere else. Two rows reading identically and
    // going to different places is worse than one row.
    //
    // Read from `megaMenuGroups`, which is what the nav, the footer and
    // /services already call these pages, so the chip says what the
    // destination is called. Falls back to the discipline title if a
    // `serviceHref` ever points somewhere that is not a service page.
    const group = megaMenuGroups.find((g) => base === `/services/${g.slug}`);
    out.push({ href: d.serviceHref, title: group?.title ?? d.title });
  }
  return out;
}

export function disciplinesInWork(clientSlug: string, projectSlug?: string): Discipline[] {
  const mine = allItems().filter(
    (i) => i.clientSlug === clientSlug && (!projectSlug || i.projectSlug === projectSlug)
  );
  const kinds = new Set(mine.map((i) => i.kind));
  return disciplines.filter(
    (d) => hasPortfolioPage(d) && d.kinds!.some((k) => kinds.has(k))
  );
}
