// Single source of truth for portfolio case studies.
//
// Structure mirrors how the work is actually organised: a CLIENT (the developer)
// owns one or more PROJECTS (individual developments), and each project owns its
// deliverables. Client pages consolidate the "several launches for one developer"
// story; project pages carry the detail and target the development's own name.
//
// To add a project: append to that client's `projects` array. Routes, sitemap
// entries, cards, and structured data are all generated from this file.

export type Fact = { label: string; value: string };

export type Capture = {
  src: string;
  width: number;
  height: number;
  alt: string;
  label: string;
};

export type GalleryItem = { file: string; alt: string; caption: string };

export type Gallery = {
  heading: string;
  body: string;
  basePath: string;
  width: number;
  height: number;
  items: GalleryItem[];
};

export type PlaceSchema = {
  units?: number;
  locality: string;
  region: string;
  description: string;
};

export type Project = {
  slug: string;
  name: string;
  logo?: string;
  cardImage: string;
  /** Page captures are tall strips, so a centre crop shows a meaningless middle
   *  slice. "top" keeps the hero, which is the part worth showing. */
  cardImagePosition?: "top" | "center";
  cardBlurb: string;
  headline: string;
  summary: string;
  facts: Fact[];
  landingPage?: {
    heading: string;
    body: string;
    capture: Capture;
    /** Optional phone capture shown beside the desktop one. Worth showing where
     *  it exists: a client can see the same page works on both, which is the
     *  part of the job that usually goes unseen. */
    mobileCapture?: Capture;
  };
  gallery?: Gallery;
  place?: PlaceSchema;
  keywords: string[];
};

export type Client = {
  slug: string;
  name: string;
  logo: string;
  ogImage: string;
  title: string;
  description: string;
  headline: string;
  intro: string;
  facts: Fact[];
  scope: { heading: string; body: string }[];
  scopeIntro: string;
  website?: { heading: string; body: string; capture: Capture };
  brandSocial?: Gallery;
  projects: Project[];
  keywords: string[];
};

const hadleyHeights: Project = {
  slug: "hadley-heights",
  name: "Hadley Heights",
  logo: "/portfolio/leos/hadley-heights/logo/hadley-heights.svg",
  cardImage: "/portfolio/leos/hadley-heights/social-media/1.avif",
  cardBlurb:
    "Off-plan launch for a 216-apartment development in Jumeirah Village Circle. Lead capture landing page plus a five-slide campaign carousel.",
  headline: "Hadley Heights — off-plan launch in Jumeirah Village Circle",
  summary:
    "A 216-apartment residential development in JVC, designed and developed in the UK by British architects and interior designers. The campaign needed to convert interest into qualified, contactable investor leads rather than simply build awareness, so the landing page and the creative were built as one system.",
  facts: [
    { label: "Location", value: "Jumeirah Village Circle, Dubai" },
    { label: "Scale", value: "216 apartments and retail outlets" },
    { label: "Unit mix", value: "1 and 2 bedroom apartments" },
    { label: "Entry price", value: "From AED 1 million" },
  ],
  landingPage: {
    heading: "Lead capture landing page",
    body: "Built around three conversion decisions: the price qualifier (from AED 1 million) sits in the hero so unqualified traffic self-selects out before filling a form; a callback form is visible above the fold with a UAE-formatted phone field; and a free brochure download acts as a second, lower-commitment entry point further down the page for visitors not ready to speak to a broker.",
    capture: {
      src: "/portfolio/leos/hadley-heights/landing-page/hadley-heights-landing-page.avif",
      width: 1600,
      height: 5568,
      alt: "Full-page view of the Hadley Heights lead capture landing page, showing the hero with a request-a-callback form and a free brochure registration section",
      label: "Hadley Heights — campaign landing page",
    },
  },
  gallery: {
    heading: "Campaign carousel",
    body: "A five-slide carousel that front-loads the visual and holds the detail — location, scale, unit sizes, interiors — for later slides, so a scroller gets the hook and a genuinely interested buyer gets the specification. Deliberately built on a light, editorial template distinct from the darker LEOS brand system, so development campaigns read as their own product without leaving the parent identity.",
    basePath: "/portfolio/leos/hadley-heights/social-media",
    width: 800,
    height: 800,
    items: [
      {
        file: "1",
        alt: "Hadley Heights carousel slide showing the branded building signage and club house entrance, with copy describing 216 apartments and retail outlets in Jumeirah Village Circle",
        caption: "Slide 1 — the development",
      },
      {
        file: "2",
        alt: "Hadley Heights carousel slide showing the tower exterior CGI alongside copy about open-plan living areas and contemporary kitchens",
        caption: "Slide 2 — open-plan living",
      },
      {
        file: "3",
        alt: "Hadley Heights carousel slide listing apartment sizes, with a balcony CGI at dusk and copy noting the development was designed by British architects and interior designers",
        caption: "Slide 3 — sizes and specification",
      },
      {
        file: "4",
        alt: "Hadley Heights carousel slide showing interior CGIs of the kitchen and living room",
        caption: "Slide 4 — interiors",
      },
      {
        file: "5",
        alt: "Hadley Heights carousel slide showing bedroom and bathroom interior CGIs",
        caption: "Slide 5 — bedroom and bathroom",
      },
    ],
  },
  place: {
    units: 216,
    locality: "Jumeirah Village Circle",
    region: "Dubai",
    description:
      "Residential development by LEOS Developments in Jumeirah Village Circle, Dubai, comprising 216 apartments and retail outlets.",
  },
  keywords: [
    "Hadley Heights",
    "Jumeirah Village Circle",
    "off-plan launch campaign",
    "real estate lead generation landing page",
    "Dubai off-plan marketing",
  ],
};

const weybridgeGardens: Project = {
  slug: "weybridge-gardens",
  name: "Weybridge Gardens",
  logo: "/portfolio/leos/weybridge-gardens/logo/weybridge-logo.svg",
  // This creative carries the original WG wordmark, so it belongs to phase one
  // rather than the Provence Edition.
  cardImage: "/portfolio/leos/social-media/3.avif",
  cardBlurb:
    "Launch campaign for the first Weybridge Gardens in Dubailand — studios and one-bed apartments, sold on design rather than discount.",
  headline: "Weybridge Gardens — the Dubailand launch",
  summary:
    "The first Weybridge Gardens: a UK-designed residential community in Dubailand built around brutalist architecture softened by contemporary interiors. A studio and one-bed product competes on a crowded price shelf, so the page leads on design credibility rather than square footage.",
  facts: [
    { label: "Location", value: "Dubailand, Dubai" },
    { label: "Unit mix", value: "Studios & 1 bed apartments" },
    { label: "Design", value: "UK-designed, brutalist" },
    { label: "Goal", value: "Register your interest" },
  ],
  landingPage: {
    heading: "Landing page",
    body: "A single conversion goal, Register Your Interest, with the button placed inside the hero so it is visible before any scrolling. The copy leads with design language — brutalist architecture, bespoke contemporary design, an urban oasis — because at the studio and one-bed end of the market the differentiator is character, not price. Scroll inside the frame to view the full page.",
    capture: {
      src: "/portfolio/leos/weybridge-gardens/landing-page/weybridge-gardens-landing-page.avif",
      width: 1600,
      height: 6644,
      alt: "Full-page view of the Weybridge Gardens landing page, showing the balcony hero with the register-your-interest call to action and the bespoke contemporary design section",
      label: "Weybridge Gardens — desktop",
    },
  },
  place: {
    locality: "Dubailand",
    region: "Dubai",
    description:
      "Residential development by LEOS Developments in Dubailand, Dubai, offering studio and one bedroom apartments.",
  },
  keywords: [
    "Weybridge Gardens",
    "Dubailand",
    "off-plan launch campaign",
    "studio apartments Dubai",
    "real estate landing page Dubai",
  ],
};

const weybridgeGardens2: Project = {
  slug: "weybridge-gardens-2",
  name: "Weybridge Gardens 2",
  logo: "/portfolio/leos/weybridge-gardens-2/logo/weybridge-gardens-2-logo.svg",
  cardImage: "/portfolio/leos/weybridge-gardens-2/landing-page/weybridge-landing-page.avif",
  cardImagePosition: "top",
  cardBlurb:
    "French-inspired follow-up: 288 homes in Dubailand, from AED 600K. Desktop and mobile landing pages built for registration capture.",
  headline: "Weybridge Gardens 2 — the Provence Edition launch",
  summary:
    "The second phase took the same Dubailand location in a completely different direction: Provence, French-inspired living, 288 homes from AED 600,000. A themed launch only works if the theme survives contact with the conversion path, so the page had to carry it while still turning interest into registered, contactable buyers.",
  facts: [
    { label: "Location", value: "Dubailand, Dubai" },
    { label: "Scale", value: "288 homes" },
    { label: "Unit mix", value: "Studios, 1, 2 & 3 bedroom" },
    { label: "Entry price", value: "From AED 600,000" },
  ],
  landingPage: {
    heading: "Landing page, desktop and mobile",
    body: "Built around a single conversion goal, Register Your Interest, with the price qualifier (from AED 600K) placed high so unqualified traffic filters itself out early. A secondary Check Construction Progress route gives existing buyers somewhere to go without competing with the primary call to action. The mobile build is not a squeezed desktop layout: the hero crops to keep the tower and the development name legible at 366px, and the registration button sits within thumb reach rather than below the fold.",
    capture: {
      src: "/portfolio/leos/weybridge-gardens-2/landing-page/weybridge-landing-page.avif",
      width: 1041,
      height: 4534,
      alt: "Full-page view of the Weybridge Gardens 2 desktop landing page, showing the Provence Edition hero, the register-your-interest call to action and the pricing section",
      label: "Weybridge Gardens 2 — desktop",
    },
    mobileCapture: {
      src: "/portfolio/leos/weybridge-gardens-2/landing-page/weybridge-mobile.avif",
      width: 366,
      height: 4549,
      alt: "Full-page view of the Weybridge Gardens 2 mobile landing page, showing the cropped hero, development name and register-your-interest button above the fold",
      label: "Weybridge Gardens 2 — mobile",
    },
  },
  place: {
    units: 288,
    locality: "Dubailand",
    region: "Dubai",
    description:
      "Residential development by LEOS Developments in Dubailand, Dubai, comprising 288 studio, one, two and three bedroom homes, themed as the Provence Edition.",
  },
  keywords: [
    "Weybridge Gardens 2",
    "Provence Edition",
    "Dubailand",
    "off-plan launch campaign",
    "real estate landing page Dubai",
  ],
};

export const clients: Client[] = [
  {
    slug: "leos-developments",
    name: "LEOS Developments",
    logo: "/portfolio/leos/logo/leos-white.svg",
    ogImage: "/portfolio/leos/og-leos.jpg",
    title: "LEOS Developments Case Study — Website & Launch Campaigns",
    description:
      "Two-year engagement with LEOS Developments: corporate website build, brand social creative, and off-plan launch campaigns including Hadley Heights in Jumeirah Village Circle, Dubai.",
    headline: "Corporate website and launch campaigns for a UK and Dubai developer",
    intro:
      "LEOS Developments is a residential developer headquartered in Weybridge, Surrey, with offices in London and an experience centre in Dubai. Over two years I handled the corporate website and the campaign work behind their developments.",
    facts: [
      { label: "Client", value: "LEOS Developments" },
      { label: "Sector", value: "Residential real estate" },
      { label: "Markets", value: "United Kingdom & Dubai" },
      { label: "Scope", value: "Website, social, campaigns" },
    ],
    scopeIntro:
      "A two-year engagement covering both the development side and the campaign side, which is unusual for a single supplier: the same person built the website that campaigns pointed at, and made the creative that drove traffic to it.",
    scope: [
      {
        heading: "Corporate website",
        body: "Full build of the LEOS Developments site, including the developments showcase and the Dubai experience centre section, structured so new developments could be added without a redesign.",
      },
      {
        heading: "Brand social creative",
        body: "Campaign and brand assets for paid and organic social, including the Arabian Property Awards 2023–2024 win announcement and pre-launch teaser content.",
      },
      {
        heading: "Off-plan launch campaigns",
        body: "Development-specific work: lead capture landing pages plus the paid and organic carousel creative that drove traffic to them.",
      },
    ],
    website: {
      heading: "The corporate website",
      body: "The full site, including the developments showcase and the Dubai experience centre section. Scroll inside the frame to view the complete page.",
      capture: {
        src: "/portfolio/leos/landing-page/leos-landing-page.avif",
        width: 1928,
        height: 6555,
        alt: "Full-page view of the LEOS Developments corporate website",
        label: "LEOS Developments — corporate website",
      },
    },
    brandSocial: {
      heading: "Brand social creative",
      body: "Brand-level assets built to run across paid and organic social, kept consistent with the identity used on the website.",
      basePath: "/portfolio/leos/social-media",
      width: 800,
      height: 800,
      items: [
        {
          file: "1",
          alt: "LEOS social creative announcing an Arabian Property Awards 2023-2024 win, over a residential high-rise exterior with the Dubai skyline behind it",
          caption: "Arabian Property Awards 2023\u20132024 win announcement",
        },
        {
          file: "2",
          alt: "LEOS experience centre interior creative captioned Excellence Through Design, showing the lounge and bar with a curved ceiling light feature",
          caption: "Dubai experience centre",
        },
        {
          file: "3",
          alt: "Weybridge Gardens campaign creative showing an aerial render of the rooftop pool deck with cabanas and landscaped terraces",
          caption: "Weybridge Gardens \u2014 rooftop amenity render",
        },
        {
          file: "4",
          alt: "Hadley Heights campaign creative showing poolside leisure beside turquoise water",
          caption: "Hadley Heights \u2014 campaign creative",
        },
        {
          file: "5",
          alt: "LEOS teaser creative captioned Coming Soon Stay Tuned, showing two people gardening on a planted terrace",
          caption: "Pre-launch teaser",
        },
        {
          file: "6",
          alt: "LEOS brand creative captioned Modern Living Awaits, showing a resident in a turquoise swimming pool",
          caption: "Brand campaign \u2014 amenity lifestyle",
        },
        {
          file: "7",
          alt: "LEOS brand creative captioned Vibrant Spaces Are Emerging, showing a deep green interior with framed artwork, plants and lounge seating",
          caption: "Brand campaign \u2014 interior lifestyle",
        },
      ],
    },
    projects: [hadleyHeights, weybridgeGardens, weybridgeGardens2],
    keywords: [
      "real estate marketing",
      "off-plan property marketing",
      "property developer website",
      "social media campaign creative",
      "Dubai real estate marketing",
      "LEOS Developments",
    ],
  },
];

export function getClient(slug: string): Client | undefined {
  return clients.find((c) => c.slug === slug);
}

export function getProject(clientSlug: string, projectSlug: string) {
  const client = getClient(clientSlug);
  const project = client?.projects.find((p) => p.slug === projectSlug);
  return project && client ? { client, project } : undefined;
}

/** Every case-study URL, for the sitemap. */
export function caseStudyUrls(): string[] {
  return clients.flatMap((c) => [
    `/portfolio/${c.slug}`,
    ...c.projects.map((p) => `/portfolio/${c.slug}/${p.slug}`),
  ]);
}
