import type { Faq } from "./pillars";
import { itemsOfKind, type Item, type ItemKind } from "@/lib/portfolioItems";

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
      metaTitle: "UI/UX Design Portfolio — App & Mobile Interfaces | Bilal Shafqat",
      metaDescription:
        "Shipped interface design for property developers in Dubai: React Native app screens and mobile web layouts, each with the decision behind it explained.",
      lens: "This page is the interface cut. It gathers the app screens and the mobile web layouts in one place because they answer the same question — what does a buyer do on a small screen — and it is the only page where they sit together with the design reasoning attached.",
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
        "Every website and landing page here is live work for a Dubai property developer: one corporate site and a set of off-plan launch pages, each built to carry high-resolution renders without the load time that usually comes with them. Follow any capture through to the case study for the stack, the structure and what the page was measured on.",
      metaTitle: "Web Development Portfolio — Dubai Property Websites | Bilal Shafqat",
      metaDescription:
        "Web development portfolio: a corporate website and four off-plan launch landing pages for a Dubai developer, built for speed, mobile and a single enquiry action.",
      lens: "This page carries both the design and the build, because they are the same seven captures looked at two ways: how each page is composed, and how it was implemented. Splitting that into two pages would mean two pages showing identical images, which is worth avoiding.",
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
        "React Native for iOS and Android, carrying the same developments as the client's website so a buyer who first saw a launch page finds the same units, the same photography and the same enquiry routes on their phone. Every screen below is from the shipped build, and each one links to the decision behind it.",
      metaTitle: "Mobile App Development Portfolio — React Native | Bilal Shafqat",
      metaDescription:
        "Mobile app development portfolio: a cross-platform React Native property app for iOS and Android, built from one codebase, with each screen decision explained.",
      lens: "These screens also appear on the UI/UX Design page, where the subject is the interface decision. Here it is the app as a delivered product: one codebase, two platforms, and the same inventory as the website it sits alongside.",
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
        "Brand and campaign creative for a Dubai property developer, designed as a run rather than as individual posts, so a feed reads as one brand across a launch instead of as a series of unrelated announcements. Each piece is captioned with what it was for.",
      metaTitle: "Social Media Marketing Portfolio — Real Estate Creative | Bilal Shafqat",
      metaDescription:
        "Social media marketing portfolio: brand and off-plan campaign creative for a Dubai property developer, designed as consistent sets across each launch.",
      lens: "This is the only page for the social work, and it is the full set rather than a selection. A portfolio of creative is more useful complete, because consistency across a run is the thing a client is actually buying.",
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
    serviceHref: "/services/digital-marketing#email-marketing",
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

/** Menu sub-links: the real destinations behind a discipline, deduplicated by
 *  URL. Several captures share one case study page (a launch has a desktop and
 *  a mobile capture; a social set has twelve pieces on one page), so listing
 *  every artefact would put the same link in the menu twelve times.
 *
 *  Capped at four. A mega menu that scrolls has stopped being a menu.
 */
export function disciplinePieces(d: Discipline): { label: string; href: string }[] {
  const source = d.countFrom ? getDiscipline(d.countFrom) : d;
  if (!source) return [];
  const seen = new Map<string, string>();
  for (const it of disciplineItems(source)) {
    const href = it.href;
    if (!seen.has(href)) seen.set(href, it.label);
  }
  return [...seen].slice(0, 4).map(([href, label]) => ({ href, label }));
}
