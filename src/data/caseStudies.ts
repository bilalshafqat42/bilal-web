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

/** Sectors, as a closed list rather than free text: the menu and the industry
 *  rail group on exact equality, and "Real Estate" vs "Real estate" would show
 *  as two sectors. Add a value here when a client in a new sector lands. */
export type Industry =
  | "Real Estate & Property"
  | "Automotive"
  | "E-commerce & Retail"
  | "Hospitality"
  | "Technology & SaaS"
  | "Professional Services"
  | "Media & Production";

export type Client = {
  slug: string;
  name: string;
  industry: Industry;
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
  /** Phone screens, rendered in phone frames rather than a square gallery grid.
   *  Deliberately not a `Gallery`: GalleryGrid forces `aspect-square
   *  object-cover`, which would crop a 1206x5807 screen capture into a square
   *  and destroy it. CaptureFrame's phone variant caps height at 70vh and
   *  scrolls inside the frame instead.
   *
   *  Sits between the website and the social work so the client page reads in
   *  the order the deliverables were asked for: website, mobile app, social. */
  mobileApp?: {
    heading: string;
    body: string;
    /** Pre-rendered composite that leads the section: all screens at once, in
     *  device frames, on a transparent background.
     *
     *  It does a different job from the interactive frames below it. This is the
     *  impression — breadth, polish, one glance. Those are the explanation, one
     *  screen at a time with the reasoning attached. It is also the only place
     *  the Enquire screen appears, since no standalone capture of it exists.
     *
     *  Note it is iOS-only, so it cannot carry the cross-platform claim; the
     *  frames below are what show Android. */
    lead?: { src: string; width: number; height: number; alt: string };
    /** Ordered as the journey actually runs, because the screen selector reads
     *  in this order and a user journey told out of sequence is just a list.
     *
     *  `headline` is the decision stated as a claim; `journey` is the reasoning
     *  behind it; `tag` is the one-line takeaway. Splitting them lets the page
     *  lead with the claim rather than burying it in a paragraph. */
    screens: {
      key: string;
      label: string;
      headline: string;
      journey: string;
      tag: string;
      /** Three spec rows shown beside the copy. Every value is readable off the
       *  capture itself — a spec panel is only worth having if a reader could
       *  check it against the screen next to it. */
      glance: { label: string; value: string }[];
      capture: Capture;
    }[];
    /** The constraints the design had to satisfy. Reasoning, not measurements —
     *  nothing here is a figure, because none was supplied. */
    constraints?: { pull: string; points: { title: string; body: string }[] };
    /** What was delivered, grouped by phase. Only items evidenced by the
     *  captures or stated directly by Bilal. Deliberately shorter than a
     *  typical agency scope list: padding it with plausible-sounding work
     *  nobody can point at is how a case study stops being credible. */
    scope?: { heading: string; items: string[] }[];
    /** Outcomes. Only entries with a `value` render — see the note in the
     *  component. */
    outcomes?: { value?: string; label: string; note?: string }[];
  };
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

const cavendishSquare: Project = {
  slug: "cavendish-square",
  name: "Cavendish Square",
  logo: "/portfolio/leos/cavendish/logo/cavendish-logo.svg",
  cardImage: "/portfolio/leos/cavendish/landing-page/cavendish-web.avif",
  cardImagePosition: "top",
  cardBlurb:
    "138 studios and one-bedroom homes in Jumeirah Village Triangle. Desktop and mobile landing pages built around registration capture.",
  headline: "Cavendish Square — a compact-unit launch in Jumeirah Village Triangle",
  summary:
    "Cavendish Square is 138 homes in Jumeirah Village Triangle, and the unit mix shapes everything about how it has to be sold: 114 studios and 24 one-bedroom apartments, from 428 to 1,209 sq ft. That is an investor and first-purchase audience rather than a family one, so the page leads with the address and the amenity set — rooftop garden, outdoor cinema, pool, gym — because at this size the shared space is the product. Estimated completion Q4 2025.",
  facts: [
    { label: "Location", value: "Jumeirah Village Triangle, Dubai" },
    { label: "Scale", value: "138 homes" },
    { label: "Unit mix", value: "114 studios, 24 one-bedroom" },
    { label: "Completion", value: "Estimated Q4 2025" },
  ],
  landingPage: {
    heading: "Landing page, desktop and mobile",
    body: "One primary conversion goal, Register Your Interest, sits in the hero with Check Construction Progress beneath it. Splitting the two matters here: buyers who have already committed have somewhere to go that does not compete with the registration form, which keeps the primary call to action clean for new traffic. The body copy answers the questions a compact-unit buyer actually asks — where it is, how many homes, what sizes, when it completes — in that order, rather than opening with lifestyle language. The mobile build is a genuine rebuild rather than a compressed desktop layout: the hero crops to hold the building and the development name at 367px, and both calls to action sit above the fold within thumb reach.",
    capture: {
      src: "/portfolio/leos/cavendish/landing-page/cavendish-web.avif",
      width: 1041,
      height: 5302,
      alt: "Full-page view of the Cavendish Square desktop landing page, showing the Elevated Living in JVT hero, register-your-interest call to action, amenity sections and the property features breakdown",
      label: "Cavendish Square — desktop",
    },
    mobileCapture: {
      src: "/portfolio/leos/cavendish/mobile-app/cavendish-mobile-app.avif",
      width: 367,
      height: 5317,
      alt: "Full-page view of the Cavendish Square mobile landing page, showing the cropped hero, development name and both calls to action above the fold",
      label: "Cavendish Square — mobile",
    },
  },
  place: {
    units: 138,
    locality: "Jumeirah Village Triangle",
    region: "Dubai",
    description:
      "Residential development by LEOS Developments in Jumeirah Village Triangle, Dubai, comprising 138 homes across 114 studios and 24 one-bedroom apartments, ranging from 428 to 1,209 sq ft.",
  },
  keywords: [
    "Cavendish Square",
    "Jumeirah Village Triangle",
    "JVT off-plan",
    "studio apartments Dubai",
    "real estate landing page Dubai",
  ],
};

export const clients: Client[] = [
  {
    slug: "leos-developments",
    name: "LEOS Developments",
    industry: "Real Estate & Property",
    logo: "/portfolio/leos/logo/leos-white.svg",
    ogImage: "/portfolio/leos/og-leos.jpg",
    title: "LEOS Developments Case Study — Website, Mobile App & Launch Campaigns",
    description:
      "Two-year engagement with LEOS Developments: corporate website build, a React Native app for iOS and Android, brand social creative, and off-plan launch campaigns including Hadley Heights in Jumeirah Village Circle, Dubai.",
    headline: "Corporate website and launch campaigns for a UK and Dubai developer",
    intro:
      "LEOS Developments is a residential developer headquartered in Weybridge, Surrey, with offices in London and an experience centre in Dubai. Over two years I handled the corporate website and the campaign work behind their developments.",
    facts: [
      { label: "Client", value: "LEOS Developments" },
      { label: "Sector", value: "Residential real estate" },
      { label: "Markets", value: "United Kingdom & Dubai" },
      { label: "Scope", value: "Website, app, social, campaigns" },
    ],
    scopeIntro:
      "A two-year engagement covering both the development side and the campaign side, which is unusual for a single supplier: the same person built the website that campaigns pointed at, and made the creative that drove traffic to it.",
    scope: [
      {
        heading: "Corporate website",
        body: "Full build of the LEOS Developments site, including the developments showcase and the Dubai experience centre section, structured so new developments could be added without a redesign.",
      },
      {
        heading: "Cross-platform mobile app",
        body: "A React Native app shipped to both iOS and Android from one codebase, covering sign-in with a guest route, the developments list, and the same enquiry and call actions the launch pages use.",
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
    mobileApp: {
      heading: "The mobile app",
      lead: {
        src: "/portfolio/leos/mobile-app/leos-app-5-screens.avif",
        width: 2403,
        height: 1231,
        alt: "Five screens of the LEOS app shown in iPhone frames: the menu, sign-in, the Hadley Heights home screen, the developments list, and the enquiry form",
      },
      body:
        "A cross-platform app for iOS and Android, built in React Native from a single codebase. It carries the same developments as the website — Hadley Heights, Weybridge Gardens and Cavendish Square — so a buyer who first saw a launch page finds the same units, the same photography and the same enquiry routes on their phone rather than a thinner version of the site.",
      constraints: {
        pull:
          "The website already sold well. The app had to carry that restraint into something people operate rather than read.",
        points: [
          {
            title: "The buyer is often not in the country",
            body: "Off-plan is frequently bought at a distance, so the app has to stand in for a site visit: the renders, the unit mix and the size range have to be legible on a phone, and the route to a human has to be one tap from whatever the buyer is looking at.",
          },
          {
            title: "Two platforms, one small team",
            body: "Separate native builds would have meant two codebases, two release cycles and two sets of bugs for the same screens. React Native keeps one component tree and one place to fix anything, which is what makes a two-platform app viable without a two-platform team.",
          },
          {
            title: "Nothing may contradict the website",
            body: "The same three developments, the same photography and the same enquiry destination. A buyer moving between the site and the app should never see two different answers to the same question, because the moment they do, both stop being trustworthy.",
          },
        ],
      },
      scope: [
        {
          heading: "Design",
          items: [
            "Interface design for the screens shown here",
            "Platform-appropriate navigation: slide-over rather than a tab bar",
            "Sign-in that offers an account without requiring one",
          ],
        },
        {
          heading: "Build",
          items: [
            "React Native, one codebase for iOS and Android",
            "Shared components across every screen",
            "Development data matched to the website, so the two cannot drift",
          ],
        },
        {
          heading: "Enquiry path",
          items: [
            "Four-field enquiry form, reachable from every development card",
            "Enquire and call actions on the content rather than behind a menu",
          ],
        },
      ],
      outcomes: [
        {
          value: "1",
          label: "Codebase for both platforms",
          note: "One component tree to build, fix and maintain, rather than two.",
        },
        { label: "Enquiries per month from the app" },
        { label: "Time to first response" },
      ],
      screens: [
        {
          key: "sign-in",
          glance: [
            { label: "Pattern", value: "Guest-first" },
            { label: "Required fields", value: "Two" },
            { label: "Guest route", value: "Same weight as login" },
          ],
          headline: "An account is offered, not demanded.",
          tag: "Guest browsing by default",
          label: "Sign in",
          journey:
            "The first decision is whether to make anyone sign in at all. Most first visits to a property app are browsing, not buying, so a wall in front of the developments loses the people it is meant to qualify. Continue as guest sits directly under the login button, at the same weight — an account is offered, not demanded.",
          capture: {
            src: "/portfolio/leos/mobile-app/leos-login.avif",
            width: 1206,
            height: 2622,
            alt: "LEOS app sign-in screen with email and password fields and a continue-as-guest option",
            label: "Sign in",
          },
        },
        {
          key: "home",
          glance: [
            { label: "Above the fold", value: "One development" },
            { label: "In-card actions", value: "Enquire, Call" },
            { label: "Media", value: "Full-bleed render" },
          ],
          headline: "One development leads, not a grid.",
          tag: "Actions sit with the content",
          label: "Home",
          journey:
            "A single featured development leads, not a grid. One building with its location, unit mix and size range answers more than six thumbnails do, and Enquire Now and Call Us Now sit on the card itself rather than behind a menu — the two actions a serious buyer wants are never more than one tap from what they are looking at.",
          capture: {
            src: "/portfolio/leos/mobile-app/home-screen.avif",
            width: 1206,
            height: 3547,
            alt: "LEOS app home screen featuring Hadley Heights in Jumeirah Village Circle with enquire and call actions",
            label: "Home",
          },
        },
        {
          key: "developments",
          glance: [
            { label: "Cards", value: "Three developments" },
            { label: "On each card", value: "Name, strapline, link" },
            { label: "Order", value: "Matches the launch pages" },
          ],
          headline: "The full portfolio, one card per building.",
          tag: "Price on the card, not behind a tap",
          label: "Developments",
          journey:
            "The full portfolio, one card per development, each carrying its own entry price. Price on the card rather than behind a tap is deliberate: it filters early, which costs some browsing and produces better enquiries. The same three developments the launch pages cover, so nothing contradicts the website.",
          capture: {
            src: "/portfolio/leos/mobile-app/projects.avif",
            width: 1206,
            height: 5807,
            alt: "LEOS app developments list showing Hadley Heights, Weybridge Gardens and Cavendish Square",
            label: "Developments",
          },
        },
        {
          key: "menu",
          glance: [
            { label: "Destinations", value: "Five" },
            { label: "Pattern", value: "Slide-over drawer" },
            { label: "Log out", value: "Top level, in accent" },
          ],
          headline: "A slide-over, not a tab bar.",
          tag: "Weighted, not evenly split",
          label: "Menu",
          journey:
            "Developments, investments, the LEOS Hub and news, as a slide-over rather than a tab bar — five destinations of uneven importance do not divide well into equal tabs. Log out sits at the bottom in the accent colour, visible rather than buried in a settings screen two levels down.",
          capture: {
            src: "/portfolio/leos/mobile-app/leos-menu.avif",
            width: 1206,
            height: 2622,
            alt: "LEOS app slide-over menu with developments, investments, LEOS Hub, news and about",
            label: "Menu",
          },
        },
        {
          key: "enquire",
          glance: [
            { label: "Fields", value: "Four" },
            { label: "Consent", value: "UAE PDPL wording" },
            { label: "Submit", value: "Send enquiry" },
          ],
          label: "Enquire",
          headline: "Four fields, and nothing else.",
          tag: "Reachable from every card",
          journey:
            "Name, email, phone and a message. Every extra field on a property enquiry costs completions, and the ones that matter for a first conversation are how to reach someone and roughly what they want. Qualification happens on the call, not in the form. It is reachable from every development card, so nobody has to navigate back to a contact page to act on what they are looking at.",
          capture: {
            src: "/portfolio/leos/mobile-app/contact.avif",
            width: 1206,
            height: 2622,
            alt: "LEOS app enquiry screen headed How can we help, with full name, email, phone and message fields above a send enquiry button",
            label: "Enquire",
          },
        },
      ],
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
    projects: [cavendishSquare, hadleyHeights, weybridgeGardens, weybridgeGardens2],
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
    ...(c.mobileApp ? [`/portfolio/${c.slug}/mobile-app`] : []),
    ...c.projects.map((p) => `/portfolio/${c.slug}/${p.slug}`),
  ]);
}

/** Sectors that actually have work behind them, in the order they appear in the
 *  data. Derived rather than listed, so a sector cannot show in the menu before
 *  a client in it exists — and appears the moment one does. */
export function industriesWithWork(): { industry: Industry; clients: Client[] }[] {
  const byIndustry = new Map<Industry, Client[]>();
  for (const c of clients) {
    const list = byIndustry.get(c.industry) ?? [];
    list.push(c);
    byIndustry.set(c.industry, list);
  }
  return [...byIndustry].map(([industry, cs]) => ({ industry, clients: cs }));
}
