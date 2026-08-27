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
  cardBlurb: string;
  headline: string;
  summary: string;
  facts: Fact[];
  landingPage?: { heading: string; body: string; capture: Capture };
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
    projects: [hadleyHeights],
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
