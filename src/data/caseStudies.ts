// Single source of truth for portfolio case studies.
//
// Structure mirrors how the work is actually organised: a CLIENT (the developer)
// owns one or more PROJECTS (individual developments), and each project owns its
// deliverables. Client pages consolidate the "several launches for one developer"
// story; project pages carry the detail and target the development's own name.
//
// To add a project: append to that client's `projects` array, and add its slug
// to `caseStudyUrls.ts` (the build fails until you do). Routes, cards and
// structured data are generated from this file; the sitemap and the homepage
// count read that small manifest.

import type { Faq } from "./types";
import { caseStudyUrls } from "./caseStudyUrls";

export type Fact = { label: string; value: string };

export type { Faq };

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
  /** Where the full set is shown, for the discipline pages and the mega menu
   *  to link to. Defaults to the client page. Added 2026-11-17, when Texdale's
   *  app and creatives moved to sub-pages of their own. */
  href?: string;
  basePath: string;
  width: number;
  height: number;
  /** Source file extension, without the dot. Defaults to `avif`.
   *
   *  The campaign carousels are AVIF exports we control end to end. The LEOS
   *  sales application screens are designed JPEG boards Bilal exports from
   *  Photoshop, and re-encoding them to AVIF on every revision is a step that
   *  would get skipped. Reading the extension from the data is cheaper than
   *  keeping two galleries. */
  ext?: string;
  /** Service pages (slugs) this set is proof for beyond its discipline.
   *
   *  Added 2026-10-26. Texdale's range creatives are what ran on Meta, so they
   *  are proof for the Facebook and Meta ads page as well as for social media
   *  marketing, and no discipline page covers paid ads. Read by the service
   *  page proof block to pick a thumbnail. Only where the client used them. */
  alsoProves?: string[];
  /** How the tiles are laid out. Defaults to `tiles`.
   *
   *  `tiles` is the carousel case: four square crops per row, `object-cover`.
   *  That is correct for 800x800 slides and wrong for anything else.
   *
   *  `screens` is for images that already carry their own title and caption in
   *  the artwork. Cropping those to a square cuts the text off top and bottom,
   *  which is exactly what the square grid did to the sales application boards
   *  on the first pass. `screens` keeps the native ratio and drops to two
   *  columns so the baked-in type stays readable. */
  layout?: "tiles" | "screens";
  /** Desktop columns for `tiles`. Defaults to 4.
   *
   *  Added 2026-10-26 for Texdale's nine campaign creatives: a brand tile and
   *  one per product range, designed as a 3x3 set. Four columns left the ninth
   *  alone on its own row. Three keeps the set the shape it was made in. */
  columns?: 3 | 4;
  items: GalleryItem[];
};

/** One image inside a `Story`. */
export type StoryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Shown under the image. Captions are extractable text, so an uncaptioned
   *  image is invisible to search and to an assistant reading the page. */
  caption?: string;
};

/**
 * The case study narrative, as an ordered list of blocks.
 *
 * Replaces the old `gallery` + `caseStudyDepth` pair, which put every image in
 * one grid and every word in one wall underneath. A reader got the pictures or
 * the reasoning, never the picture next to the reason for it.
 *
 * Three block types, deliberately. Every extra one is another way for two case
 * studies to end up looking different:
 *
 *   full   one image, edge to edge
 *   pair   two images side by side
 *   text   a heading and its paragraphs, in a reading measure
 *
 * The intended rhythm is full, text, pair, text, full, text — a wide image to
 * open a movement, the reasoning behind it, then detail. Nothing enforces that
 * order, because a case study with four screens should not be padded to fit a
 * pattern, but a new one should start there and deviate for a reason.
 */
export type StoryBlock =
  | { type: "full"; image: StoryImage }
  | { type: "pair"; images: [StoryImage, StoryImage] }
  | { type: "text"; eyebrow?: string; heading: string; paragraphs: string[] };

/** A section of `CaseStudyShowcase`. `at` places it on the client page:
 *  "opener" under the fact strip, "scope" after the scope of work, "website"
 *  after the website captures, "creative" after the campaign creatives.
 *  Added 2026-11-12 for Homemaid; see the component for why. */
export type ShowcaseBlock = { at: "opener" | "scope" | "website" | "creative" } & (
  | { kind: "stats"; items: { value: string; label: string }[] }
  | {
      kind: "flow";
      eyebrow: string;
      heading: string;
      body?: string;
      steps: string[];
      /** Phone screens, shown in device frames beside the notes. */
      screens: Capture[];
      notes: { title: string; body: string }[];
    }
  | {
      kind: "screens";
      eyebrow: string;
      heading: string;
      body?: string;
      desktop?: Capture;
      phone?: Capture;
      points?: { title: string; body: string }[];
    }
  | {
      kind: "architecture";
      eyebrow: string;
      heading: string;
      body?: string;
      /** What talks to the system, drawn on the left. */
      clients: string[];
      hub: string;
      /** What the system talks to, drawn on the right. */
      services: string[];
      points?: { title: string; body: string }[];
    }
  | {
      kind: "timeline";
      eyebrow: string;
      heading: string;
      body?: string;
      items: { when: string; title: string; body: string }[];
    }
  | { kind: "upcoming"; eyebrow: string; heading: string; body: string }
);

export type PlaceSchema = {
  units?: number;
  locality: string;
  region: string;
  description: string;
};

export type Project = {
  slug: string;
  name: string;
  /** The small label over the h1 and on the /portfolio card. Defaults to
   *  "Development campaign" on the page and "Launch campaign" on the card,
   *  which describe the LEOS launches. Added 2026-11-17 for Texdale's
   *  sub-pages (website, branding, app design, social), which are not launches. */
  eyebrow?: string;
  /** The schema.org `genre`. Defaults to "Real estate marketing case study". */
  genre?: string;
  /** The service the booking buttons on this page offer, as a service slug
   *  (see src/data/consult.ts). Defaults to "digital-marketing". */
  service?: string;
  /** The question before "Let's talk." in the closing panel. Defaults to
   *  "Need this for your {kind}?". */
  ctaLead?: string;
  /** A booking panel straight after `story`. Same shape as the client's. */
  storyCta?: { heading: string; body: string; service: string };
  /** Overrides the generated `<title>`.
   *
   *  The template builds `"{project} — {client} Campaign Case Study"`, which is
   *  right for the four development launches and wrong for the sales
   *  application: that is an internal tool, not a campaign. One optional field
   *  beats either a wrong title on one page or a second template. */
  metaTitle?: string;
  /** What this project *is*, used where the template would otherwise say
   *  "launch". Defaults to "launch".
   *
   *  Four of the five LEOS projects are off-plan launches, so the closing CTA
   *  ("Need this for your launch?") and the FAQ heading ("About this launch")
   *  read correctly. The sales application is an internal tool, where both
   *  sentences are simply wrong. One noun beats a second template. */
  kind?: string;
  /** The card image's alt text, describing what the image shows. Falls back
   *  to "{name} campaign creative", which is wrong for anything that is not a
   *  campaign. Every published project sets it since 2026-10-14, when the
   *  /portfolio grid stopped rendering its covers with `alt=""`. */
  cardImageAlt?: string;
  /** How `cardImage` sits in the 4:3 card well. Defaults to `cover`.
   *  Use `contain` for a designed cover whose composition runs to its edges. */
  cardImageFit?: "cover" | "contain";
  /** Per-project share card. Falls back to the client's `ogImage` when absent,
   *  which is what every project used to do — one generic LEOS card for every
   *  development, so a shared link never showed the development itself.
   *  Must be a real 1200x630 asset, not a `/_next/image?...` URL: that endpoint
   *  takes query parameters some crawlers drop, and it is not a stable file. */
  ogImage?: string;
  logo?: string;
  /** The logo's own intrinsic size.
   *
   *  Required alongside `logo`. The project template used to hardcode
   *  900x1983 — Hadley Heights' dimensions — for every logo, and because
   *  `h-16 w-auto` derives the box width from the width/height *attributes*
   *  rather than from the file, the other three marks rendered into a ~29px
   *  box. Read these off the SVG's viewBox. */
  logoWidth?: number;
  logoHeight?: number;
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
    /** Top-of-page crop used by the hero preview.
     *
     *  The hero shows a 16:11 window onto the top of the page, but the full
     *  captures run 4,500 to 6,600px tall at 290-510KB. Serving one of those as
     *  the hero image means downloading an entire page scroll to paint a small
     *  crop, and that image is the page's LCP. These crops are 62-95KB, a 64-83%
     *  saving on the single image that decides the score.
     *
     *  Optional: without it the hero falls back to the full capture, which
     *  looks identical and only costs bytes. */
    heroCrop?: { src: string; width: number; height: number };
    /** Optional phone capture shown beside the desktop one. Worth showing where
     *  it exists: a client can see the same page works on both, which is the
     *  part of the job that usually goes unseen. */
    mobileCapture?: Capture;
  };
  gallery?: Gallery;
  /** The narrative template. Takes precedence over `gallery` and over this
   *  project's `caseStudyDepth` entry: a project either tells its story in
   *  blocks or in the old grid-plus-wall, never both, or the page says
   *  everything twice. */
  story?: StoryBlock[];
  place?: PlaceSchema;
  /** Campaign outcomes.
   *
   *  Only entries carrying a `value` render, so the array can hold labels
   *  waiting on a figure without any of them reaching the page. Nothing here is
   *  ever estimated or inferred: a result on a case study is a claim a client
   *  can be asked to verify, and one that cannot be checked is worth less than
   *  no number at all.
   *
   *  Hadley Heights has none yet. LEOS has released no performance data, and
   *  the FAQ on that page says so directly rather than leaving the gap silent. */
  results?: { value?: string; label: string; note?: string }[];
  /** Questions this specific launch gets asked. Rendered on the page and
   *  emitted as FAQPage, so the two can never disagree. Optional: a project
   *  with nothing worth asking shows no block and emits no schema. */
  faqs?: Faq[];
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
  | "Home Services"
  | "Manufacturing & Industrial"
  | "Media & Production"
  // Added 2026-11-25 for The Scene Popup, an Abu Dhabi pop-up market organiser.
  | "Events & Experiences";

export type Client = {
  slug: string;
  name: string;
  industry: Industry;
  /** Not finished, and not for the public yet.
   *
   *  A draft client is reachable at its own URL so Bilal can review the layout,
   *  and is kept out of the sitemap, out of the portfolio grid and out of the
   *  index with `robots: noindex`. Three things make that necessary rather than
   *  tidy: the copy is placeholder text, the screenshots have not arrived, and
   *  the companies are current or former employers whose written permission is
   *  still outstanding (roadmap 300). Any one of those alone would be a reason
   *  not to publish.
   *
   *  Remove the flag to publish. Nothing else needs changing: the sitemap, the
   *  grid and the checks all read this field. */
  draft?: boolean;
  /** The brand mark, when we have the file.
   *
   *  Optional since 2026-10-01. Several case studies exist as screenshots with
   *  no logo asset, and the page renders `ClientWordmark` instead: the name set
   *  as type at the same optical height, so adding a real logo later does not
   *  move anything on the page. Holding a case study back over a missing vector
   *  file would keep real work off the site for a decorative reason. */
  logo?: string;
  /** The logo's intrinsic size, read off the SVG's viewBox. Defaults to
   *  2000x551, the LEOS wordmark. Same reason as `Project.logoWidth`: an
   *  `h-10 w-auto` image takes its box from these attributes, so a mark with a
   *  different shape needs its own numbers. Added 2026-10-24 for Texdale.
   *
   *  A logo whose file name ends in `-white.svg` is a white mark and gets the
   *  `client-mark` silhouette filter on the light page opener. Any other logo
   *  is shown in its own colours, which is what a multicoloured mark needs. */
  logoWidth?: number;
  logoHeight?: number;
  /** The share card. Optional since 2026-10-01: a draft case study has no
   *  artwork yet, and the site-wide default is a better answer than holding the
   *  page back or inventing a path to a file that does not exist. */
  ogImage?: string;
  /** Alt text for `ogImage`. Falls back to "{name} campaign creative", which
   *  is right for LEOS and wrong for a share card that shows a website. */
  ogImageAlt?: string;
  title: string;
  description: string;
  headline: string;
  intro: string;
  /** The question before "Let's talk." in the closing panel. Defaults to
   *  "Launching a development?", which only fits a property developer. */
  ctaLead?: string;
  /** Service pages (`megaMenuGroups` slugs) this engagement covered that the
   *  captures cannot show on their own.
   *
   *  Added 2026-10-24 for Texdale. Every other link between a case study and a
   *  service is derived from the captures: a website capture proves web
   *  development. Paid campaigns leave no capture behind unless the ads are
   *  supplied, so without this field the paid half of an engagement Bilal ran
   *  end to end would link to nothing. Listed first in "Services behind this
   *  work", shown on those service pages, and turned into discipline tags on
   *  the /portfolio card. Only services Bilal has stated he delivered. */
  services?: string[];
  /** The client's own live website. Added 2026-11-06 so the case study's
   *  schema can name the company by its URL (`about.url`), which is how search
   *  engines and AI assistants tie this page to the real business rather than
   *  to a name that could belong to anyone. */
  siteUrl?: string;
  /** Questions about this engagement, answered in plain sentences.
   *
   *  Added 2026-11-06. AI assistants quote short, direct answers, and a case
   *  study that only shows images and scope cards gives them nothing to lift.
   *  Rendered on the page and emitted as FAQPage from the same array, so the
   *  markup never describes text a visitor cannot see. Only facts stated
   *  elsewhere on the page or confirmed by Bilal; never a result. */
  faqs?: Faq[];
  facts: Fact[];
  scope: { heading: string; body: string }[];
  scopeIntro: string;
  /** Long-form sections under the projects grid.
   *
   *  Added 2026-10-05. `npm run audit` put this page at 620 words against a
   *  site median of 912, on the only published case study the site has. Same
   *  `{ heading, paragraphs }` shape as the discipline pages and serviceDepth.
   *
   *  No results in here and none to be added without Bilal's own figures. A
   *  case study with invented numbers is worth less than one with none. */
  depth?: { heading: string; paragraphs: string[] }[];
  /** The design case study as slides with the reasoning between them, shown
   *  straight under the opener. When present it replaces the scrolling
   *  website capture, which the slides already show.
   *
   *  Added 2026-11-16 for Texdale, from the twelve-slide case study Bilal
   *  supplied. Same `StoryBlock` list the project pages use. */
  story?: StoryBlock[];
  /** A booking panel straight after `story`, for the service the slides show.
   *  Added 2026-11-17: the story made the page twice as long, and a visitor
   *  sold on the design had 12,000px to scroll before the next button.
   *  `service` is a service slug; it sets the button wording and pre-selects
   *  the service on /appointment (see src/data/consult.ts). */
  storyCta?: { heading: string; body: string; service: string };
  /** The service the closing panel offers a consultation for. Defaults to
   *  "digital-marketing". */
  ctaService?: string;
  /** The client page is an overview, and each part of the work has its own
   *  page under it (`projects`).
   *
   *  Added 2026-11-17 for Texdale. With the slides, the app, the creatives and
   *  the prose on one page it ran to 24,000px, and the booking button sat
   *  23,000px down. When set, the client page shows the opener, the scope, one
   *  card per sub-page, the prose and the FAQ, and leaves the website, app and
   *  social sections to the sub-pages. `projectsIntro` heads the cards. */
  subPages?: boolean;
  projectsIntro?: { eyebrow: string; heading: string; body: string };
  /** One project lifted out of the grid into its own section.
   *
   *  The sales application sat as the third card in a row headed "Development
   *  campaigns", between two off-plan launches. It is not a campaign, it is the
   *  tool the sales floor runs on, and a card in a grid of five says the
   *  opposite: that it is one launch among several.
   *
   *  `projectSlug` is removed from the grid so it cannot appear twice. */
  featured?: { projectSlug: string; eyebrow: string; heading: string; body: string };
  website?: {
    heading: string;
    body: string;
    capture: Capture;
    /** The same page captured on a phone, shown in a device frame beside the
     *  desktop capture when the client has no app screen to put there. Feeds
     *  the UI/UX and web development pages as a mobile layout. */
    mobileCapture?: Capture;
    /** A small top-of-page crop for the /portfolio card. Without it the card
     *  loads the full capture, which is a whole page scroll (300KB+) to paint
     *  a 16:7 window onto its top. */
    cardImage?: { src: string; width: number; height: number };
  };
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
      /** True when `capture` is a lifestyle mockup that already contains a
       *  phone, rather than a flat screen recording. Those must not be rendered
       *  inside `DeviceFrame` — the result is a phone inside a phone. Added
       *  2026-09-17 when Bilal supplied mockups for three of the five screens. */
      mockup?: boolean;
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
    /** Copy for this app's own page, `/portfolio/{client}/mobile-app`.
     *
     *  Moved here from the page template on 2026-10-13. The template hard-coded
     *  LEOS's FAQs, share card, stack and section intros, so a second client
     *  with an app would have published LEOS's answers under its own name.
     *  Required fields are the ones the page cannot open without; anything
     *  optional is a section the template leaves out when it is absent. */
    page: {
      /** The framework, as named in the title and schema: "React Native". */
      stack: string;
      /** Platforms, as the screens heading's subline reads: "iOS and Android". */
      platforms: string;
      eyebrow: string;
      /** The hero h1. */
      title: string;
      metaDescription: string;
      /** Shorter than `metaDescription`: a share card shows less. */
      ogDescription: string;
      /** A 1200x630 JPEG. Not AVIF: WhatsApp and Facebook's link-preview
       *  crawler fetches an AVIF og:image and then shows no picture. Falls back
       *  to the site-wide card when absent. */
      ogImage?: { src: string; alt: string };
      /** The fact strip. The template appends "Screens shown" itself, counted
       *  from `screens`, so it cannot disagree with the page. */
      facts: { label: string; value: string; note: string }[];
      /** Lines under "The problem", "Key challenges" and "The approach". */
      constraintsIntro?: string;
      challengesIntro?: string;
      scopeIntro?: string;
      /** Questions about this app specifically. The FAQ section and its
       *  FAQPage schema are omitted when absent. */
      faqs?: Faq[];
    };
  };
  /** An app shown as a design and prototype, on the client page itself.
   *
   *  Added 2026-10-26 for Texdale Field. Deliberately not `mobileApp`: that
   *  shape is for a built app (screen-by-screen captures, a platform and stack,
   *  its own `/mobile-app` page and store questions in the FAQ). Texdale's app
   *  is designed and prototyped, not released, and its platform is not
   *  decided, so a page asserting a stack and platforms would claim things that
   *  are not true. A section on the case study says what it is and no more.
   *
   *  Its images are the `app-design` kind (see `portfolioItems.ts`): shown on
   *  the UI/UX page, labelled as a design and prototype, and never counted as
   *  a shipped app on the Mobile Development, iOS, Android or React Native
   *  pages. `alsoProves` puts a board on the mobile app service page's case
   *  study card, under a heading that does not say "shipped". */
  appDesign?: Gallery & {
    /** The app's own name, used in labels on the discipline pages. */
    name: string;
    /** One honest sentence on where the app stands. Shown under the intro. */
    status: string;
    /** What the screens show it doing. Only what is visible in the mockups. */
    features: { title: string; body: string }[];
  };
  /** Identity moments: announcements, the experience centre, a teaser. Posts
   *  about the company rather than about a building. */
  brandSocial?: Gallery;
  /** The creative sets: campaign and lifestyle artwork made as a series.
   *
   *  Split out of `brandSocial` on 2026-10-11. One grid headed "Brand social
   *  creative" held an awards announcement next to a rooftop render next to a
   *  lifestyle set, which are three different jobs shown as one. */
  socialDesigns?: Gallery;
  /** Flow, screens, architecture, timeline and upcoming-work sections, placed
   *  between the template's own sections. See `ShowcaseBlock`. */
  showcase?: ShowcaseBlock[];
  projects: Project[];
  keywords: string[];
};

const hadleyHeights: Project = {
  slug: "hadley-heights",
  name: "Hadley Heights",
  // 1200x630 crop of the landing page hero, generated from the full-page
  // capture. The capture itself is 1600x5568, and social platforms crop a share
  // card to roughly 1.91:1 — pointing them at that file would have shown a thin
  // horizontal slice of a very tall image.
  ogImage: "/portfolio/leos/hadley-heights/og-hadley-heights.jpg",
  logo: "/portfolio/leos/hadley-heights/logo/hadley-heights.svg",
  logoWidth: 900,
  logoHeight: 1983,
  cardImage: "/portfolio/leos/hadley-heights/social-media/1.avif",
  cardImageAlt:
    "Hadley Heights campaign carousel slide showing the branded building signage and club house entrance in Jumeirah Village Circle",
  cardBlurb:
    "Off-plan launch for a 216-apartment development in Jumeirah Village Circle. Lead capture landing page plus a five-slide campaign carousel.",
  headline: "Hadley Heights: off-plan launch in Jumeirah Village Circle",
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
      label: "Hadley Heights, campaign landing page",
    },
    heroCrop: { src: "/portfolio/leos/hadley-heights/landing-page/hadley-heights-landing-page-hero.avif", width: 1400, height: 963 },
  },
  gallery: {
    heading: "Campaign carousel",
    body: "A five-slide carousel that front-loads the visual and holds the detail (location, scale, unit sizes, interiors) for later slides, so a scroller gets the hook and a genuinely interested buyer gets the specification. Deliberately built on a light, editorial template distinct from the darker LEOS brand system, so development campaigns read as their own product without leaving the parent identity.",
    basePath: "/portfolio/leos/hadley-heights/social-media",
    width: 800,
    height: 800,
    items: [
      {
        file: "1",
        alt: "Hadley Heights carousel slide showing the branded building signage and club house entrance, with copy describing 216 apartments and retail outlets in Jumeirah Village Circle",
        caption: "Slide 1: the development",
      },
      {
        file: "2",
        alt: "Hadley Heights carousel slide showing the tower exterior CGI alongside copy about open-plan living areas and contemporary kitchens",
        caption: "Slide 2: open-plan living",
      },
      {
        file: "3",
        alt: "Hadley Heights carousel slide listing apartment sizes, with a balcony CGI at dusk and copy noting the development was designed by British architects and interior designers",
        caption: "Slide 3: sizes and specification",
      },
      {
        file: "4",
        alt: "Hadley Heights carousel slide showing interior CGIs of the kitchen and living room",
        caption: "Slide 4: interiors",
      },
      {
        file: "5",
        alt: "Hadley Heights carousel slide showing bedroom and bathroom interior CGIs",
        caption: "Slide 5: bedroom and bathroom",
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
  // Rewritten 2026-09-14. The first set answered questions nobody searches for
  // ("what was delivered", "why is the price in the hero"). These are queries a
  // developer or marketing lead actually types before hiring, which is the only
  // reason an FAQ block earns its place on a case study.
  //
  // Every figure here is one already published on /pricing. Nothing invents a
  // timeline, a result or a contract term.
  faqs: [
    {
      question: "How much does an off-plan launch landing page cost in Dubai?",
      answer:
        "It is quoted as a fixed project price after a free call, with an agreed scope, timeline and price in writing. What moves it is how much is already decided: unit information, renders and brand assets ready to use keep it at the lower end, while writing the positioning, sourcing the creative and building a campaign around it takes it up. How pricing works is set out on the pricing page.",
    },
    {
      question: "Do you run the ad campaigns as well as building the landing page?",
      answer:
        "Yes, and on this launch that mattered. Putting the entry price above the fold deliberately loses clicks, which looks worse on a traffic report and produces a better cost per qualified lead. That is only a trade worth making when the same person owns the page and the spend pointed at it, because otherwise the two sides optimise against each other.",
    },
    {
      question: "What makes an off-plan launch page convert?",
      answer:
        "Four things on this one. The entry price sits in the hero so unqualified traffic self-selects out before a form. One primary action, Request a Callback, short enough to finish on a phone. Qualification happens on the call rather than in the form, because every extra field costs completions. And existing buyers get their own route, Check Construction Progress, so they stop polluting the new-enquiry list.",
    },
    {
      question: "Can you work with our existing brand guidelines?",
      answer:
        "Yes. The campaign creative here runs on a light, editorial template deliberately distinct from the darker parent brand system, so launches read as their own product without leaving the identity. If you have a brand book I will build to it; if you do not, that is a separate piece of work rather than something assumed into the price.",
    },
    {
      question: "Are the campaign results published for this launch?",
      answer:
        "No. Lead volume, cost per lead and conversion data belong to the client, and nothing has been released for publication, so no figures appear on this page. One number a client can verify is worth more than three that cannot be checked.",
    },
    {
      question: "Do you work with developers outside Dubai?",
      answer:
        "Yes. The structure is built around unit information and a single enquiry route, not around one market, and I work with clients in the UAE and the UK. The qualifier, the callback form and the lower-commitment brochure step apply wherever a buyer needs to self-select before speaking to a sales team.",
    },
  ],
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
  logoWidth: 1500,
  logoHeight: 1253,
  // This creative carries the original WG wordmark, so it belongs to phase one
  // rather than the Provence Edition.
  cardImage: "/portfolio/leos/social-media/3.avif",
  cardImageAlt:
    "Weybridge Gardens campaign creative showing an aerial render of the rooftop pool deck with cabanas and landscaped terraces",
  cardBlurb:
    "Launch campaign for the first Weybridge Gardens in Dubailand: studios and one-bed apartments, sold on design rather than discount.",
  headline: "Weybridge Gardens: the Dubailand launch",
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
    body: "A single conversion goal, Register Your Interest, with the button placed inside the hero so it is visible before any scrolling. The copy leads with design language (brutalist architecture, bespoke contemporary design, an urban oasis) because at the studio and one-bed end of the market the differentiator is character, not price. Scroll inside the frame to view the full page.",
    capture: {
      src: "/portfolio/leos/weybridge-gardens/landing-page/weybridge-gardens-landing-page.avif",
      width: 1600,
      height: 6644,
      alt: "Full-page view of the Weybridge Gardens landing page, showing the balcony hero with the register-your-interest call to action and the bespoke contemporary design section",
      label: "Weybridge Gardens, desktop",
    },
    heroCrop: { src: "/portfolio/leos/weybridge-gardens/landing-page/weybridge-gardens-landing-page-hero.avif", width: 1400, height: 963 },
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
  logoWidth: 1000,
  logoHeight: 1314,
  cardImage: "/portfolio/leos/weybridge-gardens-2/landing-page/weybridge-landing-page.avif",
  cardImageAlt:
    "Weybridge Gardens 2 landing page, showing the Provence Edition hero and the register-your-interest call to action",
  cardImagePosition: "top",
  cardBlurb:
    "French-inspired follow-up: 288 homes in Dubailand, from AED 600K. Desktop and mobile landing pages built for registration capture.",
  headline: "Weybridge Gardens 2: the Provence Edition launch",
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
      label: "Weybridge Gardens 2, desktop",
    },
    heroCrop: { src: "/portfolio/leos/weybridge-gardens-2/landing-page/weybridge-landing-page-hero.avif", width: 1041, height: 716 },
    mobileCapture: {
      src: "/portfolio/leos/weybridge-gardens-2/landing-page/weybridge-mobile.avif",
      width: 366,
      height: 4549,
      alt: "Full-page view of the Weybridge Gardens 2 mobile landing page, showing the cropped hero, development name and register-your-interest button above the fold",
      label: "Weybridge Gardens 2, mobile",
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
  logoWidth: 1000,
  logoHeight: 1828,
  cardImage: "/portfolio/leos/cavendish/landing-page/cavendish-web.avif",
  cardImageAlt:
    "Cavendish Square landing page, showing the Elevated Living in JVT hero and the register-your-interest call to action",
  cardImagePosition: "top",
  cardBlurb:
    "138 studios and one-bedroom homes in Jumeirah Village Triangle. Desktop and mobile landing pages built around registration capture.",
  headline: "Cavendish Square: a compact-unit launch in Jumeirah Village Triangle",
  summary:
    "Cavendish Square is 138 homes in Jumeirah Village Triangle, and the unit mix shapes everything about how it has to be sold: 114 studios and 24 one-bedroom apartments, from 428 to 1,209 sq ft. That is an investor and first-purchase audience rather than a family one, so the page leads with the address and the amenity set (rooftop garden, outdoor cinema, pool, gym) because at this size the shared space is the product.",
  facts: [
    { label: "Location", value: "Jumeirah Village Triangle, Dubai" },
    { label: "Scale", value: "138 homes" },
    { label: "Unit mix", value: "114 studios, 24 one-bedroom" },
  ],
  landingPage: {
    heading: "Landing page, desktop and mobile",
    body: "One primary conversion goal, Register Your Interest, sits in the hero with Check Construction Progress beneath it. Splitting the two matters here: buyers who have already committed have somewhere to go that does not compete with the registration form, which keeps the primary call to action clean for new traffic. The body copy answers the questions a compact-unit buyer actually asks (where it is, how many homes, what sizes, when it completes) in that order, rather than opening with lifestyle language. The mobile build is a genuine rebuild rather than a compressed desktop layout: the hero crops to hold the building and the development name at 367px, and both calls to action sit above the fold within thumb reach.",
    capture: {
      src: "/portfolio/leos/cavendish/landing-page/cavendish-web.avif",
      width: 1041,
      height: 5302,
      alt: "Full-page view of the Cavendish Square desktop landing page, showing the Elevated Living in JVT hero, register-your-interest call to action, amenity sections and the property features breakdown",
      label: "Cavendish Square, desktop",
    },
    heroCrop: { src: "/portfolio/leos/cavendish/landing-page/cavendish-web-hero.avif", width: 1041, height: 716 },
    mobileCapture: {
      src: "/portfolio/leos/cavendish/mobile-app/cavendish-mobile-app.avif",
      width: 367,
      height: 5317,
      alt: "Full-page view of the Cavendish Square mobile landing page, showing the cropped hero, development name and both calls to action above the fold",
      label: "Cavendish Square, mobile",
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

/** The one LEOS project that is not a development launch.
 *
 *  Every other project here is a tower: a landing page plus campaign creative,
 *  carrying a `place` schema and a unit count. This is the internal tool the
 *  sales team uses in the Dubai experience centre, so it has no `place`, no
 *  landing page and no campaign results. It earns its spot because it is the
 *  only piece of work on the site where the same person built the system and
 *  ran the marketing it feeds.
 *
 *  Two deliberate omissions, both settled on 2026-10-09 (roadmap 387):
 *
 *  - **No engagement type.** The copy says what was built and what changed. It
 *    does not say freelance, client or employee.
 *  - **No results.** No conversion lift, no time saved, no percentage. LEOS
 *    released no figures, and an invented one is worth less than none.
 */
const salesApp: Project = {
  slug: "sales-app",
  name: "Sales Application",
  metaTitle: "Sales Presentation Application | LEOS Developments",
  kind: "application",
  ogImage: "/portfolio/leos/sales-app/thumbnail.jpg",
  // A designed cover rather than a raw screen capture. In a grid of four cards
  // a composed board reads at a glance where a screenshot reads as noise.
  cardImage: "/portfolio/leos/sales-app/cover.jpg",
  cardImageAlt:
    "Cover for the LEOS sales presentation application, showing the showroom touch screen and a tablet running the same main menu",
  cardImageFit: "contain",
  // Doubles as the meta description, so it is measured in pixels rather than
  // characters. The first draft rendered 1,052px against Google's ~920px
  // budget and would have been cut mid-sentence in results.
  cardBlurb:
    "The sales presentation application the team uses in the Dubai experience centre: every development, live unit availability from the CRM, 3D floors.",
  headline: "A sales presentation application for the experience centre floor",
  summary:
    "A sales presentation application built around what a sales manager actually does in a room with a buyer. Exteriors, interiors and amenities for every development, live unit availability pulled from the CRM, rotatable 3D floor plates and a custom location map, all on one showroom touch screen. It was built for that screen. The team started using it on tablets and phones as well.",
  facts: [
    { label: "Built for", value: "Experience centre sales team" },
    { label: "Primary device", value: "Showroom touch screen" },
    { label: "Also used on", value: "Tablets and mobile" },
    { label: "Developments", value: "Hadley Heights, Weybridge Gardens, Cavendish Square" },
  ],
  story: [
    {
      type: "full",
      image: {
        src: "/portfolio/leos/sales-app/1-home.jpg",
        alt:
          "Main menu of the LEOS sales presentation application on a showroom touch screen, showing four tiles for Projects, Experience Centre, Show Apartment and Intro Video",
        width: 1600,
        height: 1340,
        caption: "The main menu. One tap to any development.",
      },
    },
    {
      type: "text",
      eyebrow: "The problem",
      heading: "What the sales presentation application replaced",
      paragraphs: [
        "An experience centre meeting has a shape. A buyer arrives interested in a development, not a unit. Over the next hour that narrows: which tower, then which floor, then which apartment, then what it costs and whether it is still available. The job of the room is to carry someone through that narrowing without losing them.",
        "The tooling did not follow that shape. Renders and walkthroughs lived in one place, unit availability lived in the CRM, floor plans lived in PDFs, and the location story lived in a printed brochure. A sales manager moving a buyer from interest to a specific apartment was switching between systems in front of them, and the one question that closes the conversation, \"is this one still available?\", was the one that could not be answered on the spot with confidence.",
        "Anything the buyer asked for afterwards had to be found and sent separately, which put a gap of hours or days between the meeting and the follow-up.",
      ],
    },
    {
      type: "pair",
      images: [
        {
          src: "/portfolio/leos/sales-app/2-exterior.jpg",
          alt:
            "Exteriors screen of the LEOS sales presentation application showing a dusk render of a Jumeirah Village Circle development, with a side rail for interiors, amenities, animation, walkthrough and 3D model",
          width: 1600,
          height: 1340,
          caption: "Exteriors, with the full content rail alongside",
        },
        {
          src: "/portfolio/leos/sales-app/4-interiors.jpg",
          alt:
            "Interiors screen of the LEOS sales presentation application showing a furnished living and dining room render",
          width: 1600,
          height: 1340,
          caption: "Interiors, before the building exists",
        },
      ],
    },
    {
      type: "text",
      eyebrow: "How it was built",
      heading: "Building around the narrowing, not the content",
      paragraphs: [
        "The sales presentation application is organised the way the meeting runs rather than the way the content is filed. The main menu opens on developments. A development opens on its exteriors, with interiors, amenities, animation, walkthrough and the 3D model one tap away in a rail that never moves. From there the drill down goes building, floor, unit.",
        "The 3D floor view is where the tool stops being a presentation. The model rotates, a floor selector runs down one side, and selecting a floor shows every unit on it with its current state. Tapping a unit opens the floor plan beside its specification: type, floor, balcony size, total area, availability. That availability reads from the CRM, the same system the team books against, so it is true at the moment it is shown rather than true as of the last export.",
        "The location map was drawn rather than embedded. A generic map pin answers where the building is. A buyer in a meeting is asking something narrower: how far is this from the places I already use. The custom map marks the site against Dubai Marina, Palm Jumeirah, Mall of the Emirates, Downtown and the airport, which is the comparison a buyer is actually running.",
        "Brochures and fact sheets are shareable from inside the application, so the follow-up leaves the room with the buyer instead of arriving two days later.",
      ],
    },
    {
      type: "full",
      image: {
        src: "/portfolio/leos/sales-app/3-floor.jpg",
        alt:
          "3D floor view in the LEOS sales presentation application showing a rotatable building model with a floor selector and a grid of units on the eighteenth floor",
        width: 1600,
        height: 1340,
        caption: "The 3D floor view. Tap a floor, see what is left on it.",
      },
    },
    {
      type: "pair",
      images: [
        {
          src: "/portfolio/leos/sales-app/6-floor.jpg",
          alt:
            "Custom location map in the LEOS sales presentation application showing the Hadley Heights site marked against Dubai Marina, Palm Jumeirah, Downtown Dubai and Dubai International Airport",
          width: 1600,
          height: 1340,
          caption: "A map drawn for the conversation",
        },
        {
          src: "/portfolio/leos/sales-app/5-units.jpg",
          alt:
            "Single unit screen in the LEOS sales presentation application showing a two bedroom floor plan alongside a specification panel with availability, floor, balcony size and total area",
          width: 1600,
          height: 1340,
          caption: "One unit, plan and specification together",
        },
      ],
    },
    {
      type: "text",
      eyebrow: "What changed",
      heading: "What changed, and why a marketer built it",
      paragraphs: [
        "It was built for one screen: the large touch display in the Dubai experience centre. The layout was made responsive regardless, on the assumption that nothing stays on the device it was designed for. The sales team began using it on tablets and phones outside the centre, and sending live project detail and availability to customers directly from it. A tool being used beyond its brief is the clearest signal it works that a project gets without a figure attached to it.",
        "The reason this sits in a marketing portfolio rather than a development one is that the two sides share a data source. The availability that decides what a sales manager shows in a meeting is the same availability that should decide which units a campaign promotes. When those are owned separately they are reconciled by hand, late, and usually after a campaign has already sent traffic to an apartment that sold last week. Owning both meant the campaign work and the sales floor were reading from the same place.",
        "No performance figures are claimed here. LEOS released none for publication, and a case study carrying an invented number is worth less than one carrying none.",
      ],
    },
  ],
  faqs: [
    {
      question: "Where does the unit availability come from?",
      answer:
        "The CRM. The availability state on a unit is read from the same system the sales team books against, rather than a spreadsheet exported at the start of the month. That is the difference between a presentation and a tool: a sales manager can open it in front of a buyer without checking first whether it is still true.",
    },
    {
      question: "Was this built for the showroom screen or for mobile?",
      answer:
        "The showroom screen. It was designed for a large touch display in the Dubai experience centre, which is where the meetings happen. The layout was built responsive anyway, and the team started using it on tablets and phones outside the centre, which was not the original brief.",
    },
    {
      question: "Why does a marketer build a sales tool?",
      answer:
        "Because the unit data and the campaigns are the same data. The availability that drives what a sales manager shows in a meeting is the availability that should drive which units a campaign promotes. Building both sides meant they could speak to each other instead of being reconciled by hand.",
    },
  ],
  keywords: [
    "sales presentation application",
    "real estate sales application Dubai",
    "property showroom touch screen",
    "CRM unit availability",
    "experience centre sales tool",
  ],
};

export const clients: Client[] = [
  // ------------------------------------------------------------------
  // Drafts. Not in the sitemap, not in the grid, `noindex` on the page.
  //
  // Placeholders so Bilal can see the layout while he gathers screenshots and
  // writes up what he did. Every string below is a stand-in and reads like one
  // on purpose: nothing here should be mistaken for finished copy and shipped
  // by accident. Remove `draft: true` to publish, once the screenshots, the
  // write-up and the company's written permission are all in hand (roadmap
  // 300, 301).
  //
  // No logo and no ogImage on any of them. `ClientWordmark` sets the name as
  // type, and the share card falls back to the site default.
  // ------------------------------------------------------------------
  {
    slug: "psi",
    name: "PSI",
    industry: "Real Estate & Property",
    draft: true,
    title: "PSI: DRAFT, not published",
    description: "DRAFT placeholder. Awaiting screenshots, write-up and permission.",
    headline: "DRAFT: one line on what the work achieved",
    intro:
      "DRAFT PLACEHOLDER. Two or three sentences on who PSI are, what the work was, and over what period. Replace before publishing.",
    facts: [
      { label: "Company", value: "PSI" },
      { label: "Sector", value: "TBC" },
      { label: "Role", value: "TBC" },
      { label: "Scope", value: "TBC" },
    ],
    scopeIntro: "DRAFT PLACEHOLDER. One paragraph framing the scope of the work.",
    scope: [{ heading: "DRAFT", body: "DRAFT PLACEHOLDER. What was delivered." }],
    projects: [],
    keywords: [],
  },
  {
    // Added 2026-10-05. A production house Bilal has worked at as an employee.
    // The web design and the mobile app are planned rather than delivered, so
    // this is further from publishable than the other two drafts: those are
    // waiting on screenshots of work that exists, this is waiting on the work.
    slug: "choppershoot",
    name: "Choppershoot",
    industry: "Media & Production",
    draft: true,
    title: "Choppershoot: DRAFT, not published",
    description: "DRAFT placeholder. Work not yet delivered. Awaiting the build, the write-up and permission.",
    headline: "DRAFT: one line on what the work achieved",
    intro:
      "DRAFT PLACEHOLDER. Choppershoot is a production house. The web design and mobile app are planned, not delivered. Replace with who they are, what the work was, and over what period, once it exists.",
    facts: [
      { label: "Company", value: "Choppershoot" },
      { label: "Sector", value: "Production house" },
      { label: "Role", value: "TBC" },
      { label: "Scope", value: "TBC" },
    ],
    scopeIntro: "DRAFT PLACEHOLDER. One paragraph framing the scope of the work.",
    scope: [{ heading: "DRAFT", body: "DRAFT PLACEHOLDER. What was delivered." }],
    projects: [],
    keywords: [],
  },
  {
    slug: "petsmarket",
    name: "PetsMarket",
    industry: "E-commerce & Retail",
    draft: true,
    title: "PetsMarket: DRAFT, not published",
    description: "DRAFT placeholder. Awaiting screenshots, write-up and permission.",
    headline: "DRAFT: one line on what the work achieved",
    intro:
      "DRAFT PLACEHOLDER. PetsMarket is an e-commerce business. Replace with who they are, what the work was, and over what period.",
    facts: [
      { label: "Company", value: "PetsMarket" },
      { label: "Sector", value: "E-commerce" },
      { label: "Role", value: "TBC" },
      { label: "Scope", value: "TBC" },
    ],
    scopeIntro: "DRAFT PLACEHOLDER. One paragraph framing the scope of the work.",
    scope: [{ heading: "DRAFT", body: "DRAFT PLACEHOLDER. What was delivered." }],
    projects: [],
    keywords: [],
  },
  {
    // Added 2026-10-19 (roadmap 415). A Dubai developer whose website Bilal
    // develops as a freelancer. Unlike the three drafts above, the copy here is
    // written from what the live site shows (WordPress with Elementor, the
    // DLRC and Majan community pages, construction updates, media centre,
    // channel partner and register-interest form) and the capture is real,
    // taken from https://4direction.ae on 2026-10-19. Still a draft because
    // three things are Bilal's to confirm: what he built versus maintains,
    // the dates, and the client's permission to show the work.
    slug: "4direction-developments",
    name: "4Direction Developments",
    industry: "Real Estate & Property",
    draft: true,
    title: "4Direction Developments: Property Developer Website in Dubai",
    description:
      "WordPress website development for 4Direction Developments, a Dubai property developer: project and community pages, construction updates and lead capture.",
    headline: "The website behind a Dubai developer's projects and enquiries",
    intro:
      "4Direction Developments is a property developer building residential projects in Dubailand Residence Complex and Majan, with investments across the UAE, Saudi Arabia and Russia. I develop their website as a freelancer. TBC: since when, and whether the build was from scratch.",
    facts: [
      { label: "Client", value: "4Direction Developments" },
      { label: "Sector", value: "Residential real estate" },
      { label: "Market", value: "Dubai" },
      { label: "Scope", value: "Website development" },
    ],
    scopeIntro:
      "A developer's website has two jobs: show buyers and brokers every project clearly, and turn that interest into an enquiry the sales team can follow up. The site is structured around both.",
    scope: [
      {
        heading: "Project and community pages",
        body: "A page for each project and for the DLRC and Majan communities, so buyers and brokers can compare unit types and locations without asking the sales team first.",
      },
      {
        heading: "Construction updates and media centre",
        body: "Construction progress and company news in one place, filtered by topic, so off-plan buyers can follow their project and the developer has fresh content to share.",
      },
      {
        heading: "Lead capture",
        body: "A register-your-interest form on the homepage that asks whether the visitor is a broker, investor or end user and which unit size they want, plus a separate channel partner page for agents.",
      },
      {
        heading: "WordPress and Elementor",
        body: "Built on WordPress with Elementor, so the team can add a project or post an update without a developer.",
      },
    ],
    website: {
      heading: "The website",
      body: "The homepage as it stands today. Scroll inside the frame to view the complete page.",
      capture: {
        src: "/portfolio/4direction/4direction-website.avif",
        width: 1440,
        height: 6977,
        alt: "Full-page view of the 4Direction Developments homepage: hero with apartments ready in six months, company figures, projects, media and the register-interest form",
        label: "4Direction Developments, homepage",
      },
    },
    projects: [],
    keywords: [],
  },
  {
    // Published 2026-11-06. Bilal designed and built the new site himself (his
    // repository ~/Desktop/bilal/aks-chemicals, every commit his, from "Create
    // Next App"): a Next.js static export that replaced the 2021 WordPress
    // site on akschemicals.com on 2026-11-06. The nine creatives are his set
    // (Downloads/aks-social). On 2026-11-06 he confirmed he also runs Google
    // Ads, Meta ads, SEO and AI search, and designed a mobile app for them.
    //
    // Deliberately absent: any result or figure, and any claim about the
    // photographs (stock placeholders until AKS supplies its own) or the ISO
    // edition (marked CONFIRM in the site's own content file). The mobile app
    // is named in the scope only: no screens have been supplied, so it is not
    // in `services` and no app section is shown until they are.
    slug: "aks-chemicals",
    name: "AKS Chemicals",
    industry: "Manufacturing & Industrial",
    siteUrl: "https://akschemicals.com",
    ogImage: "/portfolio/aks-chemicals/og-aks-chemicals.jpg",
    ogImageAlt: "The AKS Chemicals homepage hero: The chemistry behind the cloth, in a serif headline on a dark ink background",
    title: "AKS Chemicals: Digital Marketing for Textile Chemicals",
    description:
      "End-to-end marketing for AKS Chemicals, a Lahore textile chemicals maker: new website, SEO, AI search, social media, Google and Meta ads.",
    headline: "End-to-end digital marketing for a textile chemicals manufacturer in Pakistan",
    intro:
      "AKS Chemicals has manufactured textile chemicals in Lahore, Pakistan since 1987: pretreatment, dyeing auxiliaries, finishes, denim washing and special finishing, plus confidential toll manufacturing, for mills at home and abroad. I run their digital marketing from end to end: a new website I designed and built to replace their WordPress site, SEO and AI search optimisation, social media, Google and Meta campaigns with the creatives that run on them, and a mobile app designed in the same identity. One person, from the first design to every channel after.",
    facts: [
      { label: "Client", value: "AKS Chemicals" },
      { label: "Sector", value: "Textile chemicals" },
      { label: "Market", value: "Pakistan and export mills" },
      { label: "Role", value: "Growth marketing lead, end to end" },
      { label: "Scope", value: "Strategy, web, app, SEO, GEO, social, ads" },
    ],
    scopeIntro:
      "A chemicals manufacturer sells to technical buyers who judge a supplier on whether it understands their process. Every part of this work, from the website to the ads, is planned as one piece around that buyer, so a dyehouse manager who sees an ad, searches the company or asks an AI assistant finds the same company, saying the same thing, with one clear way to start a trial.",
    scope: [
      {
        heading: "Digital marketing strategy",
        body: "Who AKS sells to, what a mill needs to see before it sends a sample of cloth, and which channels should carry that. The plan the website, the campaigns and the social channels were built against.",
      },
      {
        heading: "Website redesign",
        body: "A new identity for the site built on the AKS logo: the brand navy taken from the mark, a warm dye-orange accent, dark ink and bone paper sections, and a serif display face that reads like a technical publication rather than a template.",
      },
      {
        heading: "Website development",
        body: "A custom Next.js build, exported as plain static files for the existing hosting. Fonts are self-hosted, the page is fully readable without JavaScript, and every range, figure and contact detail comes from one content file, so adding a sixth range updates the list, the footer and the enquiry form at once.",
      },
      {
        heading: "SEO and a clean migration",
        body: "Titles and descriptions written for what buyers search, a sitemap and robots file, HTTPS forced on one domain, and permanent redirects from every old WordPress address to the new page, so links and rankings the old site had earned are carried over rather than lost.",
      },
      {
        heading: "GEO and AI search (AIO)",
        body: "Structured data that names the company, its location, its founding year and its product ranges, and an llms.txt file that summarises AKS for AI assistants, so ChatGPT, Gemini and Google's AI Overviews describe the company accurately when a buyer asks.",
      },
      {
        heading: "Google Ads",
        body: "Search campaigns aimed at mills and buyers looking for a textile chemicals supplier, pointing at the new site, set up by the same person who built the pages they land on.",
      },
      {
        heading: "Meta ads and creatives",
        body: "Facebook and Instagram campaigns in the same identity as the website, with a set of nine creatives: one for the brand, one for each of the five product ranges, and one each for toll manufacturing, standards and the markets beyond textiles.",
      },
      {
        heading: "Social media",
        body: "AKS's social channels run in the same look and voice as the website and the ads, with posts on the ranges, the process and the company, so a buyer who checks a profile sees the company the campaign promised.",
      },
      {
        heading: "Mobile app design",
        body: "A mobile app designed in the same identity as the website and the campaigns, so the app, the site and the ads read as one company.",
      },
    ],
    services: [
      "digital-marketing",
      "fractional-head-of-marketing",
      "paid-marketing",
      "google-ads",
      "facebook-ads",
      "social-media-marketing",
      "seo",
      "web-design",
      "custom-web-development",
    ],
    website: {
      heading: "The website",
      body: "The new AKS Chemicals homepage as it is live today, on a desktop and on a phone, from The chemistry behind the cloth to the enquiry form and footer. The mobile layout is designed for a phone in a mill, not squeezed from the desktop: one column, the ranges as a tappable list, and the enquiry form within thumb reach. Scroll inside each frame to see the complete page.",
      capture: {
        src: "/portfolio/aks-chemicals/aks-chemicals-website.avif",
        width: 1600,
        height: 7912,
        alt: "Full-page view of the AKS Chemicals homepage: The chemistry behind the cloth hero, five key facts, who we are, the five product ranges, beyond textiles, toll manufacturing, standards and the Send us the cloth enquiry form",
        label: "AKS Chemicals, homepage",
      },
      // Captured from the live site at 390px wide on 2026-11-06. Scaled to
      // 16,384px tall, the AVIF height limit; the full page is 8,229 CSS px.
      mobileCapture: {
        src: "/portfolio/aks-chemicals/aks-chemicals-mobile.avif",
        width: 776,
        height: 16384,
        alt: "Full-page view of the AKS Chemicals homepage on a phone: the hero, key facts, the five product ranges as a tappable list, toll manufacturing, standards and the Send us the cloth enquiry form in a single column",
        label: "AKS Chemicals, mobile",
      },
      cardImage: { src: "/portfolio/aks-chemicals/aks-chemicals-card.avif", width: 1600, height: 1000 },
    },
    socialDesigns: {
      heading: "Meta campaign and social creatives",
      href: "/portfolio/aks-chemicals/social-media-marketing",
      body: "A set of nine square creatives built from the same identity as the website: the AKS wordmark, the navy, the dye-orange accent and the same type. One for the brand, one for each of the five ranges, and one each for toll manufacturing, standards and the markets beyond textiles, used as posts and as the Meta campaign on Facebook and Instagram.",
      basePath: "/portfolio/aks-chemicals/social",
      width: 1080,
      height: 1080,
      columns: 3,
      alsoProves: ["facebook-ads"],
      items: [
        {
          file: "aks-01-brand",
          alt: "AKS Chemicals brand creative: the white AKS Chemicals wordmark on dark ink, with the lines Manufacturer of textile chemicals, Lahore, Pakistan, established 1987",
          caption: "AKS Chemicals: brand",
        },
        {
          file: "aks-02-pretreatment",
          alt: "AKS Chemicals Pretreatment creative, range 01 of 05, listing desizing, scouring, bleaching and mercerising: clean, even, absorbent cloth before any colour goes near it",
          caption: "AKS Chemicals: Pretreatment",
        },
        {
          file: "aks-03-dyeing-auxiliaries",
          alt: "AKS Chemicals Dyeing Auxiliaries creative on navy, range 02 of 05, listing levelling, dispersing, sequestering and fixing: so the shade is right first time and holds across the batch",
          caption: "AKS Chemicals: Dyeing Auxiliaries",
        },
        {
          file: "aks-04-finishes",
          alt: "AKS Chemicals Finishes creative, range 03 of 05, listing softening, handle building, hydrophilic finishing and resin finishing: the handle, the drape, the way a buyer feels it",
          caption: "AKS Chemicals: Finishes",
        },
        {
          file: "aks-05-denim-washing",
          alt: "AKS Chemicals Denim Washing creative on dark ink, range 04 of 05, listing desizing, enzyme wash, bleaching and neutralising: an honest wash-down without wrecking the garment",
          caption: "AKS Chemicals: Denim Washing",
        },
        {
          file: "aks-06-special-finishing",
          alt: "AKS Chemicals Special Finishing creative, range 05 of 05, listing water repellents, oil repellents and flame retardants: for cloth that has to do a job",
          caption: "AKS Chemicals: Special Finishing",
        },
        {
          file: "aks-07-toll-manufacturing",
          alt: "AKS Chemicals toll manufacturing creative on navy: Your formula. Our plant. Confidential, quality driven, cost effective",
          caption: "AKS Chemicals: toll manufacturing",
        },
        {
          file: "aks-08-standards",
          alt: "AKS Chemicals standards creative on dark ink: ISO 9001 and REACH, with an ISO 9001 registration and a REACH compliance programme",
          caption: "AKS Chemicals: standards",
        },
        {
          file: "aks-09-beyond-textiles",
          alt: "AKS Chemicals beyond textiles creative: Same plant. Other markets. Tissue, wet wipes and cleaning",
          caption: "AKS Chemicals: beyond textiles",
        },
      ],
    },
    depth: [
      {
        heading: "Replacing a WordPress site without losing what it had",
        paragraphs: [
          "The old akschemicals.com ran on WordPress with a page builder and slider plugins, and most of its content dated from 2021. It worked, but it was slow to change and needed regular updates to stay secure, which is a poor fit for a manufacturer whose team has a plant to run.",
          "The new site is plain static files: nothing to patch, nothing to log in to, and fast on a phone in a mill. The risk in any rebuild is losing the search traffic the old site had earned, so every old address, from the contact page to old posts, now redirects permanently to the new one. Search engines are told where each page went instead of finding a dead end.",
        ],
      },
      {
        heading: "Selling to a mill, not a shopper",
        paragraphs: [
          "In textile chemicals a sale starts with a trial on the mill's own cloth, not with a basket. So the site leads with the process: five ranges in the order a fabric meets them, from pretreatment to special finishing, each with one plain line on what it is for.",
          "The enquiry form asks the questions a technician needs first: the company, the process and what the mill is trying to achieve, from the substrate to the machine and the target result. Send us the cloth is the heading, and it says exactly what happens next: a technician comes back with a trial recipe. A click from Google or Meta lands on a page that answers a technical buyer quickly, which is what makes paid traffic worth buying.",
        ],
      },
      {
        heading: "Built for search engines and AI assistants",
        paragraphs: [
          "A buyer looking for a supplier increasingly asks ChatGPT or Gemini as well as Google. Both answer from what they can read and trust, so the site states its facts plainly in text rather than in images: who AKS is, where it is, since when, and what each range does.",
          "Structured data repeats those facts in a form machines read without guessing, and an llms.txt file gives AI assistants a short, accurate summary of the company. The aim is simple: when someone asks which manufacturers in Pakistan supply denim washing or dyeing auxiliaries, the answer can name AKS and describe it correctly.",
        ],
      },
      {
        heading: "One person, one textile chemicals playbook",
        paragraphs: [
          "AKS is the second textile chemicals manufacturer I market from end to end, after Texdale in the UK. The buyers are the same kind of people, dyehouse and finishing managers with a process problem, and the method carries over: lead with the process, make a trial the first step, and keep the website, search, social and ads saying one thing.",
          "I work as a [freelance digital marketer in Dubai](/), so design, build, search and campaigns all sit with one person. Nothing is lost in a handover, and there is no question of whose problem it is when an enquiry goes quiet.",
          "There are no performance figures on this page. The results belong to AKS Chemicals, and none are published without their agreement.",
        ],
      },
    ],
    faqs: [
      {
        question: "What did Bilal Shafqat do for AKS Chemicals?",
        answer:
          "Their digital marketing from end to end: the strategy, a new website designed and built in Next.js to replace their WordPress site, SEO and AI search optimisation, social media, Google Ads, Meta ads with a set of nine creatives, and a mobile app designed in the same identity.",
      },
      {
        question: "Who designed and built the AKS Chemicals website?",
        answer:
          "Bilal Shafqat, a freelance digital marketer based in Dubai, did the strategy, design and Next.js build for akschemicals.com. The same person runs AKS's SEO, AI search, social media and Google and Meta campaigns.",
      },
      {
        question: "How is the site optimised for AI search?",
        answer:
          "The facts are written as plain text, repeated in structured data, and summarised in an llms.txt file for AI assistants. That gives ChatGPT, Gemini and Google's AI Overviews an accurate description of AKS to quote when a buyer asks about textile chemicals suppliers in Pakistan.",
      },
      {
        question: "Are there results or figures for this work?",
        answer:
          "Not on this page. The results belong to AKS Chemicals and are not published without their agreement. The work itself, the live website and the creatives, is shown in full.",
      },
    ],
    ctaLead: "Marketing a manufacturer to technical buyers?",
    // 2026-11-17: split like Texdale (Bilal: "do the AKS Chemicals things the
    // same way"). The 11 design slides live on /website, the identity on
    // /branding and the nine creatives on /social-media-marketing; this page is
    // the overview. No app page: no app screens have been supplied.
    subPages: true,
    projectsIntro: {
      eyebrow: "The work",
      heading: "Three parts of one engagement",
      body: "The website, the brand system and the social media and Meta ads each have their own page, with the decisions behind them. They were planned together and run by one person, so they read as one company.",
    },
    projects: [
    {
      slug: "website",
      name: "Website",
      kind: "website",
      eyebrow: "Website design and build",
      genre: "Website design case study",
      service: "custom-web-development",
      metaTitle: "AKS Chemicals Website: Manufacturer Web Design Case Study",
      cardImage: "/portfolio/aks-chemicals/case-study/aks-01-cover.avif",
      cardImageAlt: "AKS Chemicals case study cover: The chemistry behind the cloth, beside a laptop showing the new homepage",
      cardImageFit: "contain",
      cardBlurb:
        "AKS Chemicals website case study: a dated WordPress site rebuilt in Next.js for a Lahore textile chemicals maker, with five ranges in one scroll.",
      headline: "A website for a textile chemicals manufacturer: five ranges, six sections, one route to a trial",
      summary:
        "The website I designed and built for AKS Chemicals, a textile chemicals manufacturer in Lahore since 1987. The design case study from the old WordPress site to what shipped: the four phases, the colour and type, the homepage, the six sections, the range, the mobile layout and the blocks that carry the pitch.",
      facts: [
        { label: "Client", value: "AKS Chemicals" },
        { label: "Scope", value: "Rebuild, SEO, content" },
        { label: "Stack", value: "Next.js, static export" },
        { label: "Ranges", value: "5, plus toll manufacturing" },
        { label: "Live", value: "akschemicals.com" },
      ],
      story: [
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-01-cover.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals case study cover: The chemistry behind the cloth. A website for a Lahore textile chemicals manufacturer running since 1987, beside a laptop showing the new homepage",
            caption: "The chemistry behind the cloth: a brand site designed and built for AKS Chemicals, akschemicals.com.",
          },
        },
        {
          type: "text",
          eyebrow: "01 Overview",
          heading: "Website redesign for a textile chemicals manufacturer",
          paragraphs: [
            "AKS Chemicals has made textile auxiliaries in Lahore since 1987, in the heartland of Pakistan's textile industry. The chemistry was never the problem. The problem was a dated WordPress site that said almost nothing about the five ranges, the plant, or the toll manufacturing service buyers actually come for.",
            "The rebuild puts the wet process at the centre: a numbered sequence from who AKS is to what it makes, with the standards and the plant visible on the way through. A serif for authority, a monospace for precision, and photography from their own floor.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-02-overview.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals overview slide: client AKS Chemicals, sector textile chemicals B2B, location Lahore Pakistan, established 1987, scope site rebuild SEO and content, year 2026, under the headline Forty years of chemistry, trapped in an old site, above a photo of the plant",
            caption: "The brief: forty years of chemistry, trapped in an old site.",
          },
        },
        {
          type: "text",
          eyebrow: "02 Project scope",
          heading: "From a dated WordPress site in four phases",
          paragraphs: [
            "Each phase closed with something the client could use. The audit reviewed the old site, the buyers' needs and the search gaps, and produced a content map and rebuild brief. Structure set the five ranges, the toll service, compliance and the sitemap into a six-section page. Design produced the type system, the dark palette, the photography and a clickable prototype. Build and grow delivered the Next.js site, SEO, enquiry routing and content.",
            "One decision shaped the rest: dark, not clinical. Every competitor sells white laboratories; AKS sells a plant that runs. The test for success was just as plain: a mill reads the ranges, trusts the standards and sends cloth.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-03-scope.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals project scope slide: four phases on a timeline, Audit, Structure, Design, and Build and grow, each with its tasks and output, under the headline From a dated WordPress to a working shopfront",
            caption: "Four phases, each closing with something the client could use.",
          },
        },
        {
          type: "text",
          eyebrow: "03 Colour",
          heading: "A dark palette lit like a dye house",
          paragraphs: [
            "The palette is a dark plant floor lit by two sources: an indigo cast from the dye house and a rust that stands in for the dye liquor itself. Ink carries every page and a second ink lifts cards off it by one step. Bone is used for headings and body text, and a dim grey for the monospace index.",
            "The rust is kept for section numbers and nothing else, so it keeps its weight. Navy and rust wash the corners as gradients, never as blocks. Six colours in total: ink #0A0E16, ink 3 #1B2434, navy #163464, dye #C2552B, bone #EFEBE3 and dim #79828F.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-04-colour.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals colour slide: six swatches, Ink #0A0E16, Ink 3 #1B2434, Navy #163464, Dye #C2552B, Bone #EFEBE3 and Dim #79828F, with notes on ground, type, accent and light, under the headline Ink, bone, and a dye bath",
            caption: "Ink, bone and a dye bath: six colours, each with one job.",
          },
        },
        {
          type: "text",
          eyebrow: "04 Typography",
          heading: "A serif for authority, a monospace for precision",
          paragraphs: [
            "Newsreader sets the headlines, large and close, so the homepage opens like the front page of a technical journal rather than a template. Inter carries the body copy at 17px for easy reading. JetBrains Mono labels every figure, section and photograph in small spaced capitals.",
            "The serif says the company has been doing this for decades. The monospace says it measures things. Together they suit a buyer who judges a supplier on whether it understands their process.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-05-typography.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals typography slide: Newsreader for display, Inter for body and JetBrains Mono for the index, with the homepage headline The chemistry behind the cloth set in Newsreader on dark ink",
            caption: "Newsreader for headlines, Inter for reading, JetBrains Mono for the index.",
          },
        },
        {
          type: "text",
          eyebrow: "05 Homepage",
          heading: "One line, then the numbers that back it",
          paragraphs: [
            "The headline sells the idea: The chemistry behind the cloth. The strip under it proves the company: founded 1987, five ranges, ISO registered, a REACH programme and a toll manufacturing service.",
            "The navigation is five plain links, Who we are, What we do, Toll manufacturing, Compliance and Contact, and the two routes under the headline are What we do and Send us the cloth. A mill manager knows within one screen whether this is a supplier worth a trial.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-06-homepage.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals homepage design at 1440px desktop width: the navigation with Contact, the line Manufacturer of textile chemicals, Lahore, Pakistan, the headline The chemistry behind the cloth and the links What we do and Send us the cloth",
            caption: "The headline sells the idea; the strip under it proves the company.",
          },
        },
        {
          type: "text",
          eyebrow: "06 Page system",
          heading: "Six sections, read in one scroll",
          paragraphs: [
            "The homepage runs in six sections: Who we are, What we do, Beyond textiles, Toll, Standards and Contact. Each opens the same way, with a number in rust, a serif heading and then the substance, so the page never asks the reader to learn it again.",
            "One page, six sections was a deliberate limit. A technical buyer scrolls once rather than hunting through a menu, and everything they need before an enquiry is on the way down.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-07-page-system.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals page system slide: three homepage sections in browser frames, Who we are, What we do and Beyond textiles, above the full homepage sequence from 01 Who we are to 06 Contact",
            caption: "Three of the six sections: the 1987 story, the five ranges and the markets beyond textiles.",
          },
        },
        {
          type: "text",
          eyebrow: "07 The range",
          heading: "Five ranges in the order cloth meets them",
          paragraphs: [
            "The old site listed products. The new one tells a buyer where each range sits in their own process, which is the only question a mill actually has. Pretreatment for grey cloth, dyeing auxiliaries for the dye house, finishes for the stenter, denim washing for the laundry and special finishing for the finished fabric.",
            "Below the ranges sit the markets beyond textiles: chemistry for tissue manufacture, formulations for wet wipe producers and chemicals for cleaning products, made on the same plant.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-08-the-range.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals range slide: five numbered ranges, Pretreatment, Dyeing Auxiliaries, Finishes, Denim Washing and Special Finishing, each with what it does and its stage from grey cloth to finished fabric, above tissue, wet wipes and cleaning",
            caption: "Five ranges, one wet process, from grey cloth to finished fabric.",
          },
        },
        {
          type: "text",
          eyebrow: "08 Mobile",
          heading: "The same page, one column wide",
          paragraphs: [
            "On a phone the serif headline runs at full width, the proof strip folds into two columns, and the five ranges become a numbered index that can be read in a second.",
            "The menu opens to five large links in the same serif, with the works address and phone numbers at the foot, so a buyer standing at a machine can call the plant without looking for a contact page.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-09-mobile.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals mobile design at 390 by 844: three phone screens showing the homepage with its proof strip, the open navigation menu, and the What we do range index",
            caption: "Home, navigation and the range index on a phone.",
          },
        },
        {
          type: "text",
          eyebrow: "09 Components",
          heading: "Toll manufacturing, standards and the enquiry form",
          paragraphs: [
            "Three blocks carry the whole pitch. Toll manufacturing, under the line Your formula. Our plant., speaks to formulators who want their own product made confidentially. Standards gives the compliance team ISO 9001:2008 and the REACH programme up front.",
            "The enquiry form, headed Send us the cloth, asks for the substrate, the process and the result the mill needs, and says what happens next: a technician comes back with a trial recipe. Each enquiry arrives already tagged with its process.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-10-components.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals components slide: the toll manufacturing block Your formula. Our plant., the standards block with ISO 9001:2008 and REACH compliance, and the Send us the cloth enquiry form with a process dropdown",
            caption: "Toll for the formulators, standards for compliance, one form for the enquiry.",
          },
        },
        {
          type: "text",
          eyebrow: "10 Outcome",
          heading: "A plant that finally looks like itself",
          paragraphs: [
            "What shipped: the 1987 founding as the first thing the page proves, five ranges mapped to the stage of the process they serve, six sections read in one scroll, ISO 9001:2008 and REACH stated up front, and toll manufacturing given a section of its own. AKS can now send a mill one link and have it answer the questions a technical buyer asks before the first email.",
            "The site is also the base for the rest of the marketing. The [Google and Meta campaigns](/services/paid-marketing), [SEO](/services/seo) and AI search work all point at these pages, and every old WordPress address redirects to its new page, so the rankings the old site earned carry over.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-11-outcome.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals outcome slide: 1987 founded, 05 ranges, 06 sections, ISO 9001:2008 and REACH, and Toll manufacturing with its own section, above a photo of process vessels in Lahore",
            caption: "What shipped: 1987, five ranges, six sections, ISO, toll.",
          },
        },
      ],
      storyCta: {
        heading: "Is your website doing your plant justice?",
        body: "I design and build websites for manufacturers and B2B companies, where the buyer is a technician and the process is the product. One person from the first sketch to the live site, and the campaigns after it.",
        service: "custom-web-development",
      },
      ctaLead: "Building a website for a manufacturer?",
      faqs: [
        {
          question: "Why replace a working WordPress site?",
          answer:
            "The old site depended on a page builder and plugins that needed regular updates, and most of its content dated from 2021. The new site is static files with nothing to patch, loads quickly on a phone, and keeps every product range and contact detail in one place, so it stays accurate as AKS changes.",
        },
        {
          question: "Did the move to a new website lose search rankings?",
          answer:
            "It was built not to. Every old WordPress address redirects permanently to the new page, the site has a sitemap and a single HTTPS domain, and titles and descriptions were rewritten for what buyers search, so the links the old site earned are passed on.",
        },
        {
          question: "How does the AKS website turn a visit into an enquiry?",
          answer:
            "The enquiry form is headed Send us the cloth and asks for the substrate, the process and the result the mill needs. A technician replies with a trial recipe, which matches how textile chemicals are bought: trial first, bulk order after.",
        },
        {
          question: "How was the AKS Chemicals website project run?",
          answer:
            "In four phases, each ending with something the client could use: an audit (old site, buyer needs and search gaps), structure (five ranges, toll service, compliance and sitemap in six sections), design (type, a dark palette, photography and a clickable prototype) and build and grow (Next.js, SEO, enquiry routing and content).",
        },
      ],
      keywords: ["manufacturer website design", "textile chemicals website", "WordPress to Next.js migration", "B2B website case study", "AKS Chemicals"],
    },
    {
      slug: "branding",
      name: "Branding",
      kind: "brand system",
      eyebrow: "Brand system",
      genre: "Brand design case study",
      service: "graphic-design-branding",
      metaTitle: "AKS Chemicals Branding: One Identity for Web and Ads",
      cardImage: "/portfolio/aks-chemicals/case-study/aks-04-colour.avif",
      cardImageAlt: "AKS Chemicals colour palette: ink, ink 3, navy, dye, bone and dim swatches with their hex codes",
      cardImageFit: "contain",
      cardBlurb:
        "How the AKS logo became one identity: six colours with a job each and three typefaces, shared by the website and the Meta creatives.",
      headline: "One identity for a textile chemicals manufacturer, from the website to the ads",
      summary:
        "The AKS Chemicals logo, built out into a system of colour, type and layout that the website and the Meta campaign creatives share, so every channel looks like the same plant in Lahore.",
      facts: [
        { label: "Client", value: "AKS Chemicals" },
        { label: "Starting point", value: "The AKS logo" },
        { label: "Palette", value: "6 colours" },
        { label: "Type", value: "Newsreader, Inter, JetBrains Mono" },
        { label: "Used on", value: "Website, Meta ads, social" },
      ],
      story: [
        {
          type: "text",
          eyebrow: "Brand system",
          heading: "One identity across the website and the ads",
          paragraphs: [
            "The site's identity is built on the AKS logo: the brand navy taken from the mark, a warm dye-orange accent, dark ink and bone sections, and a serif display face. The work was to turn that into a system every channel could use, so the website, the social posts and the Meta campaign all look like the same company.",
            "The system sets the colours, the typefaces and the layout rules, and gives each one a single job. A buyer who sees an ad, opens the website and later checks a profile should never wonder whether it is the same supplier.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-04-colour.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals colour slide: six swatches, Ink #0A0E16, Ink 3 #1B2434, Navy #163464, Dye #C2552B, Bone #EFEBE3 and Dim #79828F, with notes on ground, type, accent and light, under the headline Ink, bone, and a dye bath",
            caption: "Ink, bone and a dye bath: six colours, each with one job.",
          },
        },
        {
          type: "text",
          eyebrow: "Colour",
          heading: "Dark, not clinical",
          paragraphs: [
            "Competitors in textile chemicals tend to sell white laboratories. AKS sells a plant that runs, so the palette is a dark plant floor lit by an indigo cast from the dye house and a rust that stands in for the dye liquor.",
            "Each colour has one job: ink carries every page, a second ink lifts cards, bone is for reading, dim grey is for the index, and the rust marks section numbers and nothing else. The palette is ink #0A0E16, ink 3 #1B2434, navy #163464, dye #C2552B, bone #EFEBE3 and dim #79828F.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-05-typography.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals typography slide: Newsreader for display, Inter for body and JetBrains Mono for the index, with the homepage headline The chemistry behind the cloth set in Newsreader on dark ink",
            caption: "Newsreader for headlines, Inter for reading, JetBrains Mono for the index.",
          },
        },
        {
          type: "text",
          eyebrow: "Typography",
          heading: "Three typefaces, each with a clear role",
          paragraphs: [
            "Newsreader sets the headlines and gives the brand the authority of a company that has done this since 1987. Inter carries the body copy for easy reading. JetBrains Mono labels figures, sections and photographs in small spaced capitals, which gives the brand the precision a technical buyer looks for.",
            "The same three faces run through the website and the social creatives, so the type alone tells a buyer whose material they are looking at.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/case-study/aks-07-page-system.avif",
            width: 3200,
            height: 2000,
            alt: "AKS Chemicals page system slide: three homepage sections in browser frames, Who we are, What we do and Beyond textiles, above the full homepage sequence from 01 Who we are to 06 Contact",
            caption: "A rust number, a serif heading, then the substance: the rule every section follows.",
          },
        },
        {
          type: "text",
          eyebrow: "Across channels",
          heading: "The same brand on social and in the Meta ads",
          paragraphs: [
            "The nine Meta campaign creatives use the same wordmark, colours and type as the website: one for the brand, one for each of the five ranges, and one each for toll manufacturing, standards and the markets beyond textiles.",
            "For a B2B manufacturer this consistency is not decoration. Technical buyers judge a supplier on precision, and a brand that looks the same everywhere reads as a company that is careful about details. See the [website](/portfolio/aks-chemicals/website) and the [social media work](/portfolio/aks-chemicals/social-media-marketing) in full.",
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: "/portfolio/aks-chemicals/social/aks-01-brand.avif",
              width: 1080,
              height: 1080,
              alt: "AKS Chemicals brand creative: the white AKS Chemicals wordmark on dark ink, with the lines Manufacturer of textile chemicals, Lahore, Pakistan, established 1987",
              caption: "The brand creative",
            },
            {
              src: "/portfolio/aks-chemicals/social/aks-03-dyeing-auxiliaries.avif",
              width: 1080,
              height: 1080,
              alt: "AKS Chemicals Dyeing Auxiliaries creative on navy, range 02 of 05, listing levelling, dispersing, sequestering and fixing",
              caption: "Range 02: Dyeing Auxiliaries",
            },
          ],
        },
        {
          type: "text",
          eyebrow: "Starting point",
          heading: "Built on the logo AKS already had, not a new one",
          paragraphs: [
            "AKS Chemicals did not need a new logo. Its customers already know the mark, and changing it would have cost recognition the company has built with mills over many years. So the work started from the existing AKS logo and asked a different question: what does the rest of the brand need to look like so that everything around the logo feels as considered as the product?",
            "The navy came straight from the mark. Everything else was chosen to sit beside it: the dark ink and bone that carry the pages, the dye colour that marks sections, and the three typefaces. Keeping the logo and building the system around it is often the better answer for an established manufacturer, because buyers trust what they recognise.",
          ],
        },
        {
          type: "text",
          eyebrow: "Rules, not a mood board",
          heading: "Written down so every channel follows the same rules",
          paragraphs: [
            "A brand system only works if someone other than the designer can apply it. So each decision is written as a rule with a reason: which colour is for reading, which is for labels, which is reserved for section numbers, which typeface sets headlines and which sets figures, and how every section opens with a rust number and a serif heading before the substance.",
            "Those rules are what the website, the nine Meta creatives, the social posts and the app design were all built from. When a new page or a new creative is needed, nobody has to guess what it should look like.",
          ],
        },
      ],
      ctaLead: "Want your brand to look the same everywhere?",
      faqs: [
        {
          question: "Did AKS Chemicals get a new logo?",
          answer:
            "No. The work started from the existing AKS logo, which customers already recognise, and built the colours, typefaces and layout rules around it. The brand navy is taken directly from the mark.",
        },
        {
          question: "What fonts and colours does the AKS Chemicals website use?",
          answer:
            "Newsreader for headlines, Inter for body copy and JetBrains Mono for labels and figures. The palette is dark ink with bone text, a navy from the logo, and a rust dye colour used only for section numbers.",
        },
        {
          question: "Why does the AKS website use a dark design?",
          answer:
            "Most textile chemicals suppliers present white, clinical laboratories. AKS sells a working plant, so the site is a dark plant floor lit by an indigo dye-house cast and a rust accent, which sets it apart and suits its own photography.",
        },
        {
          question: "How do you keep a B2B brand consistent across the website and ads?",
          answer:
            "Write the rules down once and give each part one job. For AKS each colour has a fixed role, three typefaces each have a fixed role, and the same rules are applied to the website and every Meta creative, so a buyer sees one company wherever they meet it.",
        },
      ],
      keywords: ["brand system design", "B2B brand consistency", "brand colour palette", "industrial brand identity", "AKS Chemicals"],
    },
    {
      slug: "social-media-marketing",
      name: "Social media marketing",
      kind: "social media work",
      eyebrow: "Social media and Meta ads",
      genre: "Social media marketing case study",
      service: "social-media-marketing",
      metaTitle: "AKS Chemicals Social Media: Meta Ads for a Manufacturer",
      cardImage: "/portfolio/aks-chemicals/social/aks-01-brand.avif",
      cardImageAlt: "AKS Chemicals brand creative: the white wordmark on dark ink",
      cardImageFit: "contain",
      cardBlurb:
        "AKS Chemicals' Meta ads on Facebook and Instagram: nine creatives for the brand, five ranges, toll manufacturing, standards and new markets.",
      headline: "Social media and Meta ads for a textile chemicals manufacturer",
      summary:
        "The creatives behind AKS Chemicals' social channels and Meta campaign on Facebook and Instagram: one for the brand, one for each of the five ranges, and one each for toll manufacturing, standards and the markets beyond textiles, in the same identity as the website.",
      facts: [
        { label: "Client", value: "AKS Chemicals" },
        { label: "Channels", value: "Facebook, Instagram" },
        { label: "Creatives", value: "9" },
        { label: "Set", value: "Brand, 5 ranges, 3 services" },
        { label: "Results", value: "AKS's to share" },
      ],
      story: [
        {
          type: "text",
          eyebrow: "Overview",
          heading: "Meta campaign creatives for a B2B manufacturer",
          paragraphs: [
            "AKS Chemicals' social channels and its Meta campaign on Facebook and Instagram run in the same identity as the website: the AKS wordmark, the navy, the dye-orange accent and the same type. A buyer who checks a profile after seeing an ad meets the same company the website describes.",
            "The set is nine square creatives, used as posts and as the Meta campaign: one for the brand, one for each of the five ranges, and one each for toll manufacturing, standards and the markets beyond textiles.",
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/social/aks-01-brand.avif",
            width: 1080,
            height: 1080,
            alt: "AKS Chemicals brand creative: the white AKS Chemicals wordmark on dark ink, with the lines Manufacturer of textile chemicals, Lahore, Pakistan, established 1987",
            caption: "The brand creative",
          },
        },
        {
          type: "text",
          eyebrow: "The range set",
          heading: "One creative for each of the five ranges",
          paragraphs: [
            "Each range creative carries its number out of five, the processes it covers and one plain line on what it is for, from clean, even, absorbent cloth in pretreatment to cloth that has to do a job in special finishing. That is what a technical buyer scans for: whether the range covers their process.",
            "Every creative follows the same layout, so the set works as a series in a feed and each one still stands alone as an ad.",
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: "/portfolio/aks-chemicals/social/aks-02-pretreatment.avif",
              width: 1080,
              height: 1080,
              alt: "AKS Chemicals Pretreatment creative, range 01 of 05, listing desizing, scouring, bleaching and mercerising: clean, even, absorbent cloth before any colour goes near it",
              caption: "Range 01: Pretreatment",
            },
            {
              src: "/portfolio/aks-chemicals/social/aks-03-dyeing-auxiliaries.avif",
              width: 1080,
              height: 1080,
              alt: "AKS Chemicals Dyeing Auxiliaries creative on navy, range 02 of 05, listing levelling, dispersing, sequestering and fixing: so the shade is right first time and holds across the batch",
              caption: "Range 02: Dyeing Auxiliaries",
            },
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: "/portfolio/aks-chemicals/social/aks-04-finishes.avif",
              width: 1080,
              height: 1080,
              alt: "AKS Chemicals Finishes creative, range 03 of 05, listing softening, handle building, hydrophilic finishing and resin finishing: the handle, the drape, the way a buyer feels it",
              caption: "Range 03: Finishes",
            },
            {
              src: "/portfolio/aks-chemicals/social/aks-05-denim-washing.avif",
              width: 1080,
              height: 1080,
              alt: "AKS Chemicals Denim Washing creative on dark ink, range 04 of 05, listing desizing, enzyme wash, bleaching and neutralising: an honest wash-down without wrecking the garment",
              caption: "Range 04: Denim Washing",
            },
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/social/aks-06-special-finishing.avif",
            width: 1080,
            height: 1080,
            alt: "AKS Chemicals Special Finishing creative, range 05 of 05, listing water repellents, oil repellents and flame retardants: for cloth that has to do a job",
            caption: "Range 05: Special Finishing",
          },
        },
        {
          type: "text",
          eyebrow: "Beyond the ranges",
          heading: "Toll manufacturing, standards and new markets",
          paragraphs: [
            "Three more creatives speak to buyers who are not shopping for a range. Toll manufacturing, Your formula. Our plant., is for formulators who want their product made confidentially. Standards puts ISO 9001 and REACH in front of compliance teams. Beyond textiles shows the same plant serving tissue, wet wipes and cleaning.",
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: "/portfolio/aks-chemicals/social/aks-07-toll-manufacturing.avif",
              width: 1080,
              height: 1080,
              alt: "AKS Chemicals toll manufacturing creative on navy: Your formula. Our plant. Confidential, quality driven, cost effective",
              caption: "Toll manufacturing",
            },
            {
              src: "/portfolio/aks-chemicals/social/aks-08-standards.avif",
              width: 1080,
              height: 1080,
              alt: "AKS Chemicals standards creative on dark ink: ISO 9001 and REACH, with an ISO 9001 registration and a REACH compliance programme",
              caption: "Standards",
            },
          ],
        },
        {
          type: "full",
          image: {
            src: "/portfolio/aks-chemicals/social/aks-09-beyond-textiles.avif",
            width: 1080,
            height: 1080,
            alt: "AKS Chemicals beyond textiles creative: Same plant. Other markets. Tissue, wet wipes and cleaning",
            caption: "Beyond textiles",
          },
        },
        {
          type: "text",
          eyebrow: "How it runs",
          heading: "Search, social and paid saying one thing",
          paragraphs: [
            "The [SEO](/services/seo), the social posts and the paid campaigns on Google and Meta carry one message, and every ad points at a page on the [website](/portfolio/aks-chemicals/website) that answers a technical buyer quickly.",
            "There are no performance figures here. The results belong to AKS Chemicals, and none are published without their agreement.",
          ],
        },
        {
          type: "text",
          eyebrow: "Creative decisions",
          heading: "Made for a technical buyer scrolling on a phone",
          paragraphs: [
            "The people AKS wants to reach on Facebook and Instagram are dyehouse managers, finishing technicians and buyers at mills, often scrolling on a phone between jobs. They do not stop for lifestyle photography. They stop when they see their own process named. So every range creative leads with the range name and the processes it covers, in type large enough to read at feed size, and says one plain thing about what the range is for.",
            "Each creative makes one point only. A buyer who needs pretreatment chemistry should recognise the pretreatment creative in a second, without reading the other four ranges first.",
          ],
        },
        {
          type: "text",
          eyebrow: "One campaign",
          heading: "Planned with the website, not after it",
          paragraphs: [
            "The creatives and the website were designed together, in the same identity, so the promise an ad makes is answered by the page it opens. A buyer who taps through from the toll manufacturing creative should land on a company that clearly does toll manufacturing, not on a generic homepage that makes them search for it.",
            "The square format was chosen so the same nine designs work as organic posts and as Meta ads, which keeps the profile and the campaign consistent and avoids paying twice for creative that says the same thing.",
          ],
        },
      ],
      ctaLead: "Need social media that looks like your brand?",
      faqs: [
        {
          question: "Why make one creative for each product range?",
          answer:
            "Because a technical buyer is looking for their own process. A single general advert asks them to imagine whether AKS covers it; a creative for each range answers that straight away, and lets the campaign show the right range to the right buyer.",
        },
        {
          question: "What social media creatives were made for AKS Chemicals?",
          answer:
            "Nine creatives for posts and the Meta campaign: one for the brand, one for each of the five ranges from pretreatment to special finishing, and one each for toll manufacturing, standards and the markets beyond textiles, in the same identity as the website.",
        },
        {
          question: "Which platforms does the AKS Chemicals campaign run on?",
          answer:
            "Meta: Facebook and Instagram. AKS's Google Ads, SEO and AI search work run alongside it and point at the same website.",
        },
        {
          question: "Are there results for the AKS Chemicals campaign?",
          answer:
            "None are published on this page. The results belong to AKS Chemicals, and no figures are shared without their agreement.",
        },
      ],
      keywords: ["Meta ads creatives", "social media marketing for manufacturers", "B2B social media", "Facebook and Instagram ads", "AKS Chemicals"],
    },
    ],
    keywords: [
      "textile chemicals digital marketing",
      "B2B manufacturer website design",
      "textile chemicals website",
      "WordPress to Next.js migration",
      "Google Ads and Meta ads",
      "Meta campaign creatives",
      "B2B SEO and GEO",
      "digital marketing case study",
      "AKS Chemicals",
    ],
  },
  {
    slug: "leos-developments",
    name: "LEOS Developments",
    industry: "Real Estate & Property",
    logo: "/portfolio/leos/logo/leos-white.svg",
    ogImage: "/portfolio/leos/og-leos.jpg",
    title: "LEOS Developments: Website, App & Launch Campaigns",
    description:
      "Two years with LEOS Developments: corporate website, a React Native app for iOS and Android, brand social, and off-plan launch campaigns.",
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
    featured: {
      projectSlug: "sales-app",
      eyebrow: "Built for the sales floor",
      heading: "A sales application designed and developed for LEOS",
      body: "Not an off-the-shelf tool with a logo on it. The interface, the flow and the build are all custom to how the LEOS sales team actually works: every development in one place, live unit availability read from the CRM, rotatable 3D floor plates and a location map drawn for the conversation rather than embedded from Google. It runs on the touch screen in the Dubai experience centre, and the team took it onto tablets and phones without being asked to.",
    },
    scope: [
      {
        heading: "Corporate website",
        body: "Full build of the LEOS Developments site, including the developments showcase and the Dubai experience centre section, structured so new developments could be added without a redesign.",
      },
      {
        heading: "Cross-platform mobile app",
        body: "A React Native app built for iOS and Android from one codebase, covering sign-in with a guest route, the developments list, and the same enquiry and call actions the launch pages use.",
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
        label: "LEOS Developments, corporate website",
      },
    },
    mobileApp: {
      heading: "The mobile app",
      /** Replaced 2026-09-17. The old `leos-app-5-screens.avif` composite no
       *  longer exists — Bilal supplied a set of lifestyle mockups instead, and
       *  this is the lead one. The alt text changed with it: the previous text
       *  described five screens in device frames, which is not what this image
       *  shows, and alt text that describes a different picture is worse than
       *  none. */
      lead: {
        src: "/portfolio/leos/mobile-app/leos-mobile-featured.avif",
        width: 1376,
        height: 768,
        alt: "The LEOS app open on the Hadley Heights development, shown on an iPhone resting on a brushed gold surface",
      },
      body:
        "A cross-platform app for iOS and Android, built in React Native from a single codebase. It carries the same developments as the website (Hadley Heights, Weybridge Gardens and Cavendish Square), so a buyer who first saw a launch page finds the same units, the same photography and the same enquiry routes on their phone rather than a thinner version of the site.",
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
      page: {
        stack: "React Native",
        platforms: "iOS and Android",
        eyebrow: "Case study · Property & real estate",
        title: "A cross-platform app, from one codebase.",
        // The client name is in these, so the limit has to hold for it. "LEOS
        // Developments" took an older title to 70 characters.
        metaDescription:
          "A cross-platform iOS and Android app for LEOS Developments, built in React Native from a single codebase and walked through screen by screen.",
        ogDescription:
          "A cross-platform iOS and Android app for LEOS Developments, built in React Native from a single codebase.",
        // Supplied by Bilal at exactly 1200x630, the size every platform crops
        // to. JPEG rather than AVIF: Bilal named WhatsApp specifically.
        ogImage: {
          src: "/portfolio/leos/mobile-app/og-leos-mobile.jpg",
          alt: "The LEOS Developments app sign-in screen shown on an iPhone",
        },
        facts: [
          { label: "Platforms", value: "iOS & Android", note: "From one build" },
          { label: "Framework", value: "React Native", note: "One shared codebase" },
          { label: "My role", value: "Design & build", note: "Interface through to delivery" },
        ],
        constraintsIntro:
          "Three things constrained this build before a single screen was designed:",
        challengesIntro:
          "The app had to be operable in one hand by someone who may never have seen the website. That required:",
        scopeIntro: "Design and build were the same job here, done in this order:",
        // Deliberately NOT the two mobile questions already on
        // `/portfolio/mobile-app-development` ("native or cross-platform", "App
        // Store and Play Store submission"): repeating them would put the same
        // answer on two indexable pages competing with each other.
        //
        // Every answer restates something already on this page or already
        // published in `disciplines.ts`. Deliberately NOT here: whether the app
        // is published and downloadable, and any usage or download figure. The
        // `outcomes` above sit without values for exactly that reason, and
        // `disciplines.ts` states that a published listing is "the client's to
        // announce".
        faqs: [
          {
            question: "Why one codebase instead of separate iOS and Android apps?",
            answer:
              "Economics. Two native codebases mean writing, testing and maintaining every screen twice, which for a business app of this kind buys very little a buyer would notice. React Native gives iOS and Android from one build. Where an app genuinely needs platform-specific native work I say so rather than take the project.",
          },
          {
            question: "Who designed the screens, and who built them?",
            answer:
              "The same person, which is the point. The interface was designed and then built by me, so the reasoning behind a screen and its implementation match instead of one having been handed across to the other and interpreted.",
          },
          {
            question: "Are these real screens or concepts?",
            answer:
              "Real. Every screen on this page is from the built app, shown on a phone rather than redrawn as a concept, which is why the walkthrough talks about decisions that had to survive contact with real content: long development names, missing photography, and units that change availability.",
          },
          {
            question: "Why does the app repeat what the website already does?",
            answer:
              "It does not repeat it, it continues it. The app carries the same developments, the same photography and the same enquiry routes as the launch pages, so a buyer who first saw a campaign on their laptop finds the same thing on their phone rather than a second, thinner version of it.",
          },
          {
            question: "Can you take an app like this through App Store review?",
            answer:
              "Submission is a step I can run with you, and it is worth planning early because store review is the part of a launch date nobody controls. No published listing is claimed for this app here, because that announcement belongs to the client.",
          },
        ],
      },
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
            "The first decision is whether to make anyone sign in at all. Most first visits to a property app are browsing, not buying, so a wall in front of the developments loses the people it is meant to qualify. Continue as guest sits directly under the login button, at the same weight: an account is offered, not demanded.",
          mockup: true,
          capture: {
            src: "/portfolio/leos/mobile-app/leos-login-mobile.avif",
            width: 1398,
            height: 768,
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
            "A single featured development leads, not a grid. One building with its location, unit mix and size range answers more than six thumbnails do, and Enquire Now and Call Us Now sit on the card itself rather than behind a menu, so the two actions a serious buyer wants are never more than one tap from what they are looking at.",
          // The lifestyle mockup, not the old full-length scroll capture: Bilal
          // asked on 2026-11-09 for the mockups only, and the long captures
          // read as the website rather than the app.
          mockup: true,
          capture: {
            src: "/portfolio/leos/mobile-app/leos-mobile-featured.avif",
            width: 1376,
            height: 768,
            alt: "LEOS app home screen featuring Hadley Heights with enquire and call actions, on an iPhone resting on a brushed gold surface",
            label: "Home",
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
            "Developments, investments, the LEOS Hub and news, as a slide-over rather than a tab bar, because four destinations of uneven importance do not divide well into equal tabs. Log out sits at the bottom in the accent colour, visible rather than buried in a settings screen two levels down.",
          mockup: true,
          capture: {
            src: "/portfolio/leos/mobile-app/leos-mobile-menu.avif",
            width: 1080,
            height: 1920,
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
          mockup: true,
          capture: {
            src: "/portfolio/leos/mobile-app/enquiry.avif",
            width: 1080,
            height: 1920,
            alt: "LEOS app enquiry screen headed How can we help, with full name, email, phone and message fields above a send enquiry button",
            label: "Enquire",
          },
        },
      ],
    },
    brandSocial: {
      heading: "Social media branding",
      body: "Posts about the company rather than about a building: the Arabian Property Awards win, the Dubai experience centre opening, and the teaser that ran before a development was named. These set what the LEOS account looks like between launches, which is most of the year.",
      basePath: "/portfolio/leos/social-media",
      width: 800,
      height: 800,
      items: [
        {
          file: "1",
          alt:
            "LEOS social creative announcing an Arabian Property Awards 2023-2024 win, over a residential high-rise exterior with the Dubai skyline behind it",
          caption: "Arabian Property Awards 2023\u20132024 win announcement",
        },
        {
          file: "2",
          alt:
            "LEOS experience centre interior creative captioned Excellence Through Design, showing the lounge and bar with a curved ceiling light feature",
          caption: "Dubai experience centre",
        },
        {
          file: "5",
          alt:
            "LEOS teaser creative captioned Coming Soon Stay Tuned, showing two people gardening on a planted terrace",
          caption: "Pre-launch teaser",
        },
      ],
    },
    socialDesigns: {
      heading: "Social media designs",
      body: "The creative sets, made as series rather than as single posts. A development render and a lifestyle frame are built on the same grid and the same type, so a feed holding both reads as one account rather than as a brand and its campaigns competing.",
      basePath: "/portfolio/leos/social-media",
      width: 800,
      height: 800,
      items: [
        {
          file: "3",
          alt:
            "Weybridge Gardens campaign creative showing an aerial render of the rooftop pool deck with cabanas and landscaped terraces",
          caption: "Weybridge Gardens: rooftop amenity render",
        },
        {
          file: "4",
          alt:
            "Hadley Heights campaign creative showing poolside leisure beside turquoise water",
          caption: "Hadley Heights: campaign creative",
        },
        {
          file: "6",
          alt:
            "LEOS brand creative captioned Modern Living Awaits, showing a resident in a turquoise swimming pool",
          caption: "Brand campaign: amenity lifestyle",
        },
        {
          file: "7",
          alt:
            "LEOS brand creative captioned Vibrant Spaces Are Emerging, showing a deep green interior with framed artwork, plants and lounge seating",
          caption: "Brand campaign: interior lifestyle",
        },
      ],
    },
    depth: [
      {
        heading: "Why one supplier across both halves was the point",
        paragraphs: [
          "The usual arrangement on a development launch is an agency for the campaign, a developer for the landing page and a designer somewhere between them. It works until something needs to change, at which point the agency is waiting on the developer, the developer is waiting on the designer, and a launch window that was always going to be short gets shorter.",
          "Here the same person, a [freelance digital marketer in Dubai](/), made the creative, built the page it pointed at and connected the enquiry to the CRM behind it. The practical effect is not that any single piece is better. It is that a change to the offer on a Tuesday reaches the ad, the page and the follow-up on the same day rather than across three suppliers and two weeks.",
        ],
      },
      {
        heading: "The problem every off-plan launch has",
        paragraphs: [
          "Off-plan property generates a high volume of enquiries and a low proportion of qualified ones. That is the shape of the market rather than a failure of any particular campaign, and a brief that asks for more leads usually makes it worse.",
          "So the brief on each launch was the opposite: reduce the unqualified share without reducing the qualified count. That is a harder thing to ask for, because the headline number goes down and somebody has to be comfortable with that.",
        ],
      },
      {
        heading: "What the pages were built to do about it",
        paragraphs: [
          "The entry price sits in the hero rather than being withheld until a form is submitted. That loses traffic deliberately: somebody whose budget is a third of the entry price finds out in two seconds instead of after a sales call, and both sides are better off.",
          "One primary call to action, short enough to finish one-handed on a phone, because most of the traffic arrives from a social ad on a mobile connection. A brochure download as a lower-commitment second route, for the visitor who is interested but not ready to speak to anyone. And a separate path for existing buyers, so somebody asking about a unit they already own does not land in the new-enquiry list and get called as a prospect.",
          "None of those are clever. All of them are decisions somebody has to make before the page is built, and they are the reason these pages look the way they do rather than the way a template would.",
        ],
      },
      {
        heading: "Two markets, two sets of expectations",
        paragraphs: [
          "LEOS builds in both the United Kingdom and Dubai, and the two audiences behave differently enough to matter. A UK buyer expects more detail before enquiring and will read a long page. A Dubai buyer is more likely to arrive from a social ad, on a phone, and to continue the conversation on WhatsApp rather than email.",
          "That changed the shape of the pages rather than the strategy: how much sits above the fold, how early the price appears, and whether the primary action opens a form or a chat. The corporate site had to hold both without reading as two different companies.",
        ],
      },
      {
        heading: "What this case study does not claim",
        paragraphs: [
          "There are no performance figures on this page. The numbers belong to LEOS rather than to me, and publishing a client's results without their agreement is not something I will do for the sake of a more impressive portfolio.",
          "So what is here is the reasoning and the work itself: four launches, the corporate website, the mobile app and the brand creative, over two years. If you want to talk about outcomes, that is a conversation rather than a statistic on a web page, and it is one I am happy to have.",
        ],
      },
    ],
    projects: [cavendishSquare, hadleyHeights, salesApp, weybridgeGardens, weybridgeGardens2],
    keywords: [
      "real estate marketing",
      "off-plan property marketing",
      "property developer website",
      "social media campaign creative",
      "Dubai real estate marketing",
      "LEOS Developments",
    ],
  },
  {
    // Published 2026-10-24. Bilal supplied the logo and a design export and
    // asked for it to go up. Everything below is either his own account (one
    // person, complete digital marketing from scratch: website design and
    // build, a mobile app, Google and Meta ads) or readable off the live site
    // at texdale.co.uk and the source he built. Deliberately absent until he
    // supplies them: the dates, what the app does and on which platforms, the
    // campaign detail and any result. The photographs on Texdale's site are
    // licensed stock (Burst), so nothing here describes them as Texdale's
    // premises or products.
    //
    // 2026-10-26: the app (Texdale Field) and the Meta creatives added from
    // files Bilal supplied. The app is a design and prototype, not released on
    // either store, platform not decided: `appDesign`, not `mobileApp`, and no
    // `/mobile-app` page. Some mockups still carry small placeholder text
    // ("IMAGE TO SUPPLY", "PLACEHOLDER SPECIFICATION"); Bilal chose to show them
    // as they are. The creatives are the set used for the Meta campaign, as
    // Bilal describes them. No performance figures for either.
    //
    // 2026-11-04: Bilal confirmed he also runs Texdale's SEO, GEO/AIO, social
    // media and promotion: the whole of their digital marketing. The SEO and
    // GEO detail is readable off texdale.co.uk (structured data, sitemap,
    // llms.txt, the /insights articles). Social and promotion are described
    // in general terms only, because no channel detail or result was supplied.
    slug: "texdale",
    name: "Texdale",
    industry: "Manufacturing & Industrial",
    logo: "/portfolio/texdale/logo/texdale-dark.svg",
    logoWidth: 742,
    logoHeight: 260,
    ogImage: "/portfolio/texdale/og-texdale.jpg",
    ogImageAlt: "The Texdale homepage hero: Chemistry for the wet process, above folded indigo denim",
    title: "Texdale: End-to-End Digital Marketing for a UK Manufacturer",
    description:
      "End-to-end marketing for Texdale, a UK textile chemicals maker: strategy, website, app, SEO, GEO, social media, and Google and Meta ads.",
    headline: "End-to-end digital marketing for a UK textile chemicals manufacturer",
    intro:
      "Texdale is a textile chemicals manufacturer in Stockport, England, formulating pretreatment, dyeing, finishing and denim chemistry for mills worldwide. I run their digital marketing from end to end: the strategy, a brand-consistent website I designed and developed, a mobile app designed and prototyped for their sales team, SEO and AI search optimisation, social media, promotion, and paid campaigns on Google and Meta with the creatives that ran on them. One person, from the first design to the live ads and every channel after.",
    facts: [
      { label: "Client", value: "Texdale" },
      { label: "Sector", value: "Textile chemicals" },
      { label: "Market", value: "UK and global mills" },
      { label: "Role", value: "Growth marketing lead, end to end" },
      { label: "Scope", value: "Strategy, web, app, SEO, GEO, social, ads" },
    ],
    scopeIntro:
      "This is end-to-end digital marketing, built from scratch by one person, so the strategy, the website, the app, search, social and the ads are planned as one piece of work rather than handed between suppliers. The website sits at the centre: it is where the campaigns, the search results and the social posts send people, and where an enquiry starts.",
    scope: [
      {
        heading: "Digital marketing strategy",
        body: "Who Texdale sells to, what a technical buyer needs to see before getting in touch, and which channels should carry that. The plan the website, the app and the campaigns were built against.",
      },
      {
        heading: "Google Ads",
        body: "Campaigns on Google pointing at the new website, set up by the same person who built the pages they land on.",
      },
      {
        heading: "Meta ads and creatives",
        body: "Campaigns on Meta (Facebook and Instagram) in the same brand and voice as the website, with a set of creatives made for them: one for the brand and one for each product range. An ad and the page it opens read as one company.",
      },
      {
        heading: "Brand-consistent website design",
        body: "UI/UX design built on Texdale's own identity. The navy wordmark and the four-colour bar carry into the type, the layout and the colour coding of the process stages, so the site looks like the company rather than a template.",
      },
      {
        heading: "Website development",
        body: "A custom Next.js build: eight product ranges, a catalogue of 87 products searchable by name or function, and a contact form that asks first whether the visitor wants a quote, a sample or a data sheet.",
      },
      {
        heading: "Mobile app design and prototype",
        body: "Texdale Field, an app designed and prototyped for Texdale's sales team and the mills they supply: the product ranges, a dosing calculator, drum label scanning, data sheets, and sample and reorder requests. Not yet released in the app stores.",
      },
      {
        heading: "SEO",
        body: "Search built into the site from the start: a page for each of the eight product ranges, titles and descriptions written for what technical buyers search, structured data, a sitemap, and an Insights section of technical articles from the applications team.",
      },
      {
        heading: "GEO and AI search (AIO)",
        body: "Optimised for AI assistants as well as Google: an llms.txt file that summarises the company, its ranges and its compliance position, structured data on every key page, and answers written plainly enough for ChatGPT, Gemini and Google's AI Overviews to quote.",
      },
      {
        heading: "Social media and promotion",
        body: "Texdale's social channels run in the same identity as the website and the ads, with posts on the product ranges, the process and the company, so a buyer who checks a profile sees the same company the campaigns promised. Launches go out on every channel in the same week, so search, social and paid carry one message.",
      },
    ],
    // social-media-marketing and mobile-app-development added 2026-10-26 with
    // the creatives and the app prototype, so those service pages show this
    // case study. Not the iOS, Android or React Native pages: the platform is
    // not decided.
    services: [
      "digital-marketing",
      "fractional-head-of-marketing",
      "paid-marketing",
      "google-ads",
      "facebook-ads",
      "social-media-marketing",
      "seo",
      "web-design",
      "custom-web-development",
      "mobile-app-development",
    ],
    website: {
      heading: "The website",
      body: "The Texdale homepage as it is live today, from the hero to the contact block, on desktop and on a phone. Scroll inside either frame to see the complete page.",
      capture: {
        src: "/portfolio/texdale/texdale-website.avif",
        width: 1600,
        height: 10799,
        alt: "Full-page view of the Texdale homepage: the Chemistry for the wet process hero, company facts, the three process stages, eight product ranges, the Sample in. Bulk out. method, sustainability and contact",
        label: "Texdale, homepage",
      },
      mobileCapture: {
        src: "/portfolio/texdale/texdale-website-mobile.avif",
        width: 600,
        height: 14847,
        alt: "The Texdale homepage on a phone, with the same sections stacked into one column",
        label: "Texdale, homepage on a phone",
      },
      cardImage: { src: "/portfolio/texdale/texdale-card.avif", width: 1600, height: 1000 },
    },
    appDesign: {
      name: "Texdale Field",
      href: "/portfolio/texdale/mobile-app-design",
      alsoProves: ["mobile-app-development"],
      heading: "The mobile app: Texdale Field",
      body: "Texdale Field is a mobile app designed and prototyped for Texdale's sales team and the mills they supply. It puts the range, the dosing and the paperwork in one place: scan a drum, check the dose, open the data sheet, ask for a sample or a reorder. It carries the same identity as the website and the campaigns, so the app, the site and the ads read as one company.",
      status: "Design and prototype. Not yet released on the App Store or Google Play. Some screens still show placeholder text where Texdale's own photography and specifications will go.",
      features: [
        {
          title: "Scan a drum",
          body: "Point the camera at a drum label and the app matches it to the product, with a manual code entry as the fallback.",
        },
        {
          title: "Eight ranges",
          body: "The full range by process stage, 31 products in the prototype, each with its dosing, documents and safety.",
        },
        {
          title: "Product pages",
          body: "Overview, Dosing, Docs and Safety tabs: appearance, ionic character, pH, storage and pack sizes on one screen.",
        },
        {
          title: "Dosing calculator",
          body: "Enter the fabric weight and the dose, and it gives the amount to add to the bath, with the recommended range beside it.",
        },
        {
          title: "Data sheets",
          body: "Technical and safety data sheets (TDS and SDS) in one list, filterable by type, with a Saved list for the ones used most.",
        },
        {
          title: "Samples and reorders",
          body: "Sample and Reorder on every product, and a Requests list showing where each one is. The contact screen asks the mill to send the cloth.",
        },
      ],
      basePath: "/portfolio/texdale/mobile",
      width: 1616,
      height: 1264,
      layout: "screens",
      items: [
        {
          file: "05",
          alt: "Close-up of the Texdale Field dosing calculator: a fabric weight of 200 kg and a dose of 1.25% on weight of fabric give 2.50 kg to add to the bath",
          caption: "Dosing calculator, close up",
        },
        {
          file: "04",
          alt: "Two Texdale Field app screens for Neutral cellulase from the denim washing range: the Overview tab listing appearance, ionic character, pH, solubility, storage and pack sizes, and the Dosing tab where 200 kg of fabric at 1.25% gives 2.50 kg to add to the bath, with Sample and Reorder buttons",
          caption: "Product page: overview and dosing calculator",
        },
        {
          file: "01",
          alt: "Eight Texdale Field app screens in two rows: home, the eight product ranges, a product overview, the dosing calculator, the drum label scanner, data sheets, the requests list with statuses, and the Send us the cloth contact screen",
          caption: "The eight core screens",
        },
        {
          file: "02",
          alt: "Four Texdale Field app screens fanned out: the Chemistry for the wet process home screen, the Eight ranges list, the Neutral cellulase overview and its dosing calculator",
          caption: "Home, ranges, product and dosing",
        },
        {
          file: "06",
          alt: "Three Texdale Field app screens: the Eight ranges list, the home screen with Scan a drum and The range links, and the Data sheets list with All, TDS, SDS and Saved filters",
          caption: "Ranges, home and data sheets",
        },
        {
          file: "03",
          alt: "Close-up of two Texdale Field app screens: the home screen reading Chemistry for the wet process, and the Neutral cellulase overview with a matched drum and Sample and Reorder buttons",
          caption: "Home and product overview, close up",
        },
      ],
    },
    socialDesigns: {
      heading: "Meta campaign creatives",
      href: "/portfolio/texdale/social-media-marketing",
      body: "A brand-consistent set built from the same identity as the website: the Texdale wordmark, the four-colour bar and the same type. One creative for the brand and one for each of the eight product ranges, used for the Meta campaign on Facebook and Instagram.",
      basePath: "/portfolio/texdale/social",
      width: 1080,
      height: 1080,
      columns: 3,
      alsoProves: ["facebook-ads"],
      items: [
        {
          file: "texdale-01-brand",
          alt: "Texdale brand creative: the white Texdale wordmark and four-colour bar on near-black, with the lines Textile chemicals, manufactured in the north of England, supplied to mills worldwide",
          caption: "Texdale: brand",
        },
        {
          file: "texdale-02-pretreatment",
          alt: "Texdale Pretreatment creative, range 01 of 08, listing desizing agents, scouring agents, peroxide stabilisers, wetting agents and sequestrants",
          caption: "Texdale: Pretreatment",
        },
        {
          file: "texdale-03-dyeing-auxiliaries",
          alt: "Texdale Dyeing Auxiliaries creative on blue, range 02 of 08, listing levelling agents, dispersing agents, dyebath sequestrants, cationic fixing agents and anti-creasing agents",
          caption: "Texdale: Dyeing Auxiliaries",
        },
        {
          file: "texdale-04-printing",
          alt: "Texdale Printing creative, range 03 of 08, listing synthetic thickeners, pigment binders, print fixers and anti-migrating agents",
          caption: "Texdale: Printing",
        },
        {
          file: "texdale-05-finishing",
          alt: "Texdale Finishing creative on near-black, range 04 of 08, listing softeners, silicones, hand builders and hydrophilic finishes",
          caption: "Texdale: Finishing",
        },
        {
          file: "texdale-06-softening",
          alt: "Texdale Softening creative, range 05 of 08, listing amino silicone emulsions, non-yellowing softeners and polyethylene softeners",
          caption: "Texdale: Softening",
        },
        {
          file: "texdale-07-denim-washing",
          alt: "Texdale Denim Washing creative on navy, range 06 of 08, listing neutral and acid cellulases, reducing agents, anti back-staining agents and denim fixers",
          caption: "Texdale: Denim Washing",
        },
        {
          file: "texdale-08-special-finishes",
          alt: "Texdale Special Finishes creative, range 07 of 08, listing water repellents, oil repellents, flame retardants and crosslinking resins",
          caption: "Texdale: Special Finishes",
        },
        {
          file: "texdale-09-yarn-lubricants",
          alt: "Texdale Special Yarn Lubricants creative, range 08 of 08, listing Dalerol coning oils and lick-roll lubricants, water-free with no drying stage",
          caption: "Texdale: Special Yarn Lubricants",
        },
      ],
    },
    depth: [
      {
        heading: "Marketing chemistry to people who read data sheets",
        paragraphs: [
          "Texdale's buyers are technical. They arrive with a process problem and a specification, and they judge a supplier on whether it understands the chemistry, not on how the homepage makes them feel.",
          "So the site leads with the process rather than with slogans: pretreatment, dyeing and finishing as three stages, eight product ranges with their functions listed, and a catalogue of 87 products that can be searched by name or by what a product does. That is also what makes paid traffic worth buying. A click from Google or Meta lands on a page that answers a technical question quickly, instead of a brochure.",
        ],
      },
      {
        heading: "Sample in. Bulk out.",
        paragraphs: [
          "In textile chemicals a sale rarely starts with an order. It starts with a sample tried on the mill's own cloth. Texdale's site says so in four words, and sets out the method behind it in four steps: consult, formulate, test, supply.",
          "The enquiry flow follows the same path. Request a sample is the main button in the header on every page, and the contact form asks what the visitor needs before anything else: a general enquiry, a quote, a sample, a technical data sheet or a safety data sheet. Each request arrives labelled, so the team knows what to send before they reply.",
        ],
      },
      {
        heading: "One person, from design to every channel",
        paragraphs: [
          "The usual route for a manufacturer is a designer for the look, a developer for the build and an agency for the ads, each briefed separately. Here one person does all of it: I am a [digital marketing freelancer based in Dubai](/), and I work with clients in the UAE, the UK and beyond. The design followed the brand, the build followed the design, the campaigns pointed at pages built with them in mind, and search, AI search and social all describe the same company in the same words. Nothing was lost in a handover, because there was not one.",
          "It also means one person answers for the whole thing. If an enquiry form is not being used, or an ad sends people to the wrong range, there is no question of whose problem it is.",
          "There are no performance figures on this page. The results belong to Texdale, and none are published without their agreement.",
        ],
      },
    ],
    // 2026-11-16: the twelve-slide design case study Bilal supplied, shown as
    // slides with the reasoning between them. Every fact in the text is on the
    // slides or already on this page. Slide 12 (the closing call to action) is
    // left out: its buttons are pictures and could not be clicked, so its line
    // became `ctaLead` on the real panel instead. The slides themselves are
    // Bilal's design and carry his own wording.
    siteUrl: "https://texdale.co.uk",
    faqs: [
      {
        question: "What did Bilal Shafqat do for Texdale?",
        answer:
          "Texdale's digital marketing from end to end: the strategy, a brand-consistent website designed and built in Next.js, the Texdale Field mobile app designed and prototyped for the sales team, SEO and AI search optimisation, social media, and Google and Meta campaigns with the creatives that run on them.",
      },
      {
        question: "How do you market textile chemicals to technical buyers?",
        answer:
          "Lead with the process, not slogans. The site sets out pretreatment, dyeing and finishing as three stages, eight product ranges and a catalogue of 87 products searchable by name or function, so a buyer with a process problem finds the answer quickly. The line \"Sample in. Bulk out.\" makes a trial the first step.",
      },
      {
        question: "How does the website handle enquiries?",
        answer:
          "Request a sample is the main button on every page, and the contact form first asks whether the visitor wants a general enquiry, a quote, a sample, a technical data sheet or a safety data sheet. Each request arrives labelled, so the team knows what to send before replying.",
      },
      {
        question: "How is Texdale optimised for AI search?",
        answer:
          "An llms.txt file summarises the company, its ranges and its compliance position for AI assistants, every key page carries structured data, and answers are written plainly enough for ChatGPT, Gemini and Google's AI Overviews to quote.",
      },
      // Added 2026-11-16 with the slide case study: each answer is stated on a
      // slide or in the text between them.
      {
        question: "Who designed and built the Texdale website?",
        answer:
          "Bilal Shafqat, a freelance digital marketer based in Dubai, did the strategy, UX, UI and the Next.js build for texdale.co.uk. The same person runs Texdale's SEO, AI search, social media and Google and Meta campaigns.",
      },
      {
        question: "Can a freelancer in Dubai build a website for a UK manufacturer?",
        answer:
          "Yes. Texdale is in Stockport, England, and the whole project, from strategy and design to the build and the campaigns, was run remotely by Bilal Shafqat from Dubai, with clients in the UAE, the UK and beyond.",
      },
    ],
    ctaLead: "Starting your digital marketing from scratch?",
    // 2026-11-17: the work split into four pages under this one (Bilal: the
    // page was too long for everything Texdale has). The website slides moved
    // to /website; this page is the overview with a card for each.
    subPages: true,
    projectsIntro: {
      eyebrow: "The work",
      heading: "Four parts of one engagement",
      body: "The website, the brand system, the app and the social media work each have their own page, with the design decisions behind them. They were planned together and run by one person, so they read as one company.",
    },
    projects: [
    {
      slug: "website",
      name: "Website",
      kind: "website",
      eyebrow: "Website design and build",
      genre: "Website design case study",
      service: "custom-web-development",
      metaTitle: "Texdale Website: B2B Manufacturer Web Design Case Study",
      cardImage: "/portfolio/texdale/case-study/texdale-01-cover.avif",
      cardImageAlt: "Texdale case study cover: Chemistry, made legible, beside a laptop showing the Textile chemicals for the wet process homepage",
      cardImageFit: "contain",
      cardBlurb:
        "Texdale website case study: UX, UI and a Next.js build for a UK textile chemicals maker, with 87 products, eight ranges and two taps to a sample.",
      headline: "A website for a textile chemicals manufacturer: 87 products, eight ranges, one route to a sample",
      summary:
        "The website I designed and built for Texdale, a textile chemicals manufacturer in Stockport, England. The design case study from the brief to what shipped: the four phases, the colour and type, the homepage, the catalogue structure, the mobile layout and the components that carry the depth.",
      facts: [
        { label: "Client", value: "Texdale Chemicals" },
        { label: "Scope", value: "Strategy, UX, UI, build" },
        { label: "Stack", value: "Next.js" },
        { label: "Catalogue", value: "87 products, 8 ranges" },
        { label: "Live", value: "texdale.co.uk" },
      ],
    story: [
          {
            type: "full",
            image: {
              src: "/portfolio/texdale/case-study/texdale-01-cover.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale case study cover: Chemistry, made legible. A website for a Stockport textile chemicals manufacturer, beside a laptop showing the Textile chemicals for the wet process homepage",
              caption: "Chemistry, made legible: a brand site designed and built for Texdale, texdale.co.uk.",
            },
          },
          {
            type: "text",
            eyebrow: "01 Overview",
            heading: "Website design for a textile chemicals manufacturer",
            paragraphs: [
              "Texdale makes textile auxiliaries in Reddish, Stockport, for every wet stage a mill runs: pretreatment, dyeing, finishing and denim washing. Its customers are spread across several continents, its catalogue holds 87 products in eight ranges, and the person reading the website is usually a dyehouse or finishing technician.",
              "That buyer does not need persuading that chemistry matters. They need to find the right product, trust the company behind it and ask for a sample. So the site was built to be read quickly and trusted at once: a technical grid, monospace labels and a short route from any range to a sample request. Strategy, UX, UI and the Next.js build were done by one person.",
            ],
          },
          {
            type: "full",
            image: {
              src: "/portfolio/texdale/case-study/texdale-02-overview.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale overview slide: client Texdale Chemicals, sector textile chemicals B2B, location Reddish Stockport, scope strategy UX UI and build, stack Next.js, year 2026, under the headline A manufacturer that sells on precision, not on noise",
              caption: "The brief: a manufacturer that sells on precision, not on noise.",
            },
          },
          {
            type: "text",
            eyebrow: "02 Project scope",
            heading: "A B2B website project in four phases",
            paragraphs: [
              "The work ran in four phases, and each one ended with something the client could check: a product map, a sitemap, a clickable prototype and a live site.",
              "Discovery covered a product audit and a competitor scan. Structure mapped all 87 products into eight ranges and set the navigation and sitemap. Design produced the type system, colour, components and prototype. Build and launch delivered the Next.js site with its SEO, forms and handover notes. The test for success was simple: a technician finds the right auxiliary and requests a sample in under a minute.",
            ],
          },
          {
            type: "full",
            image: {
              src: "/portfolio/texdale/case-study/texdale-03-project-scope.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale project scope slide: four phases on a timeline, Discovery, Structure, Design, and Build and launch, each with its tasks and its output, under the headline From the mill floor to the sample request",
              caption: "Four phases, each closing with something the client could test.",
            },
          },
          {
            type: "text",
            eyebrow: "03 Colour",
            heading: "A brand colour system built from the logo",
            paragraphs: [
              "Texdale's logo carries a four-colour bar under the wordmark. The site keeps that bar but gives it one job: blue, yellow and green index the stages of the wet process, pretreatment, dyeing and finishing, so a colour always means a place in the process.",
              "Everything else is ink on warm paper, with navy and slate for long copy and labels. Six colours in total: ink #0C1119, navy #263760, paper #FAF9F6, blue #0162C8, yellow #FFD802 and green #0AA753. A small palette like this keeps a technical site calm and makes the coloured parts mean something.",
            ],
          },
          {
            type: "full",
            image: {
              src: "/portfolio/texdale/case-study/texdale-04-colour-palette.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale colour palette slide: six swatches, Ink #0C1119, Navy #263760, Paper #FAF9F6, Blue #0162C8, Yellow #FFD802 and Green #0AA753, with notes on headlines, body and labels, the process index and contrast",
              caption: "Ink, paper and four process colours, each with one job.",
            },
          },
          {
            type: "text",
            eyebrow: "04 Typography",
            heading: "Typography for a technical catalogue",
            paragraphs: [
              "Three typefaces, each with a clear role. Archivo Bold sets the display headlines, large and tightly spaced, so the homepage opens with a statement a buyer cannot miss. IBM Plex Sans carries the body copy at 18px for easy reading. IBM Plex Mono labels and numbers every section, product count and range.",
              "The monospace index is what makes the site read like a technical document, which is the kind of page this buyer already trusts. All the fonts are self-hosted, so they load with the page rather than from a third party.",
            ],
          },
          {
            type: "full",
            image: {
              src: "/portfolio/texdale/case-study/texdale-05-typography.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale typography slide: Archivo for display, IBM Plex Sans for body and IBM Plex Mono for the index, with the homepage headline Textile chemicals for the wet process set in Archivo Bold",
              caption: "Archivo for headlines, IBM Plex Sans for reading, IBM Plex Mono for the index.",
            },
          },
          {
            type: "text",
            eyebrow: "05 Homepage",
            heading: "A homepage that qualifies the buyer on the first screen",
            paragraphs: [
              "Before anyone scrolls, the first screen answers four questions: who Texdale is, what it makes, how many products, and where. A strip of facts reads Texdale Chemicals, 87 products, Stockport, England, and REACH-compliant sourcing. The headline says Textile chemicals for the wet process.",
              "Two routes sit under it, The range and Talk to a technician, and Request a sample stays in the header on every page. A buyer who is in the right place knows it in seconds. One who is not leaves quickly, which is also useful.",
            ],
          },
          {
            type: "full",
            image: {
              src: "/portfolio/texdale/case-study/texdale-06-homepage-design.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale homepage design at 1440px desktop width: the navigation with Request a sample, the facts strip, the headline Textile chemicals for the wet process and the links The range and Talk to a technician",
              caption: "The first screen does the qualifying: who, what, how many and where.",
            },
          },
          {
            type: "text",
            eyebrow: "06 Page system",
            heading: "Numbered sections, so nobody gets lost",
            paragraphs: [
              "The homepage runs in seven numbered sections: Company, Process, Range, Method, Sustainability, Questions and Contact. Each carries its number in monospace, so the page can be scanned like a contents list.",
              "Process sets out the three stages of the wet process, each with its own colour. Range shows the eight ranges on one grid with product counts taken straight from the catalogue. Method explains the four steps a buyer actually goes through: consult, formulate, test and supply.",
            ],
          },
          {
            type: "full",
            image: {
              src: "/portfolio/texdale/case-study/texdale-07-page-system.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale page system slide: three homepage sections in browser frames, One supplier the whole chain, Eight ranges, and Sample in. Bulk out., above the full homepage sequence from 01 Company to 07 Contact",
              caption: "Three of the seven numbered homepage sections: Process, Range and Method.",
            },
          },
          {
            type: "text",
            eyebrow: "07 Information architecture",
            heading: "Product catalogue structure: 87 products, eight ways in",
            paragraphs: [
              "The old catalogue was a list. The new one is a structure: every product sits in a range, every range sits in the navigation, and a mega menu shows the whole catalogue in one view.",
              "The eight ranges are Pretreatment, Dyeing auxiliaries, Printing, Finishing, Softening, Denim washing, Special finishes and Yarn lubricants. The counts come from the product menu, and some products appear in more than one range, because a mill looks for a product by the job it does. For a manufacturer, this structure matters more than any single page design. It decides whether a buyer finds the product at all.",
            ],
          },
          {
            type: "full",
            image: {
              src: "/portfolio/texdale/case-study/texdale-08-information-architecture.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale information architecture slide: eight product ranges with counts, Pretreatment 15, Dyeing auxiliaries 14, Printing 6, Finishing 15, Softening 3, Denim washing 19, Special finishes 21 and Yarn lubricants 4",
              caption: "Eight ranges, each with its product count, taken from the product menu.",
            },
          },
          {
            type: "text",
            eyebrow: "08 Mobile",
            heading: "Mobile website design for a mill floor",
            paragraphs: [
              "Many of Texdale's buyers check a product on a phone, often standing next to the machine. On a phone the site becomes one column with full-width type, and the range turns into a short index with the product count beside each name.",
              "The menu opens to five large links: Company, Products, Sustainability, Insights and Contact. From any range, a sample request is never more than two taps away.",
            ],
          },
          {
            type: "full",
            image: {
              src: "/portfolio/texdale/case-study/texdale-09-mobile-design.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale mobile design at 390 by 844: three phone screens showing the homepage with indigo denim, the open navigation menu, and the Eight ranges index with product counts",
              caption: "Home, navigation and the range index on a phone.",
            },
          },
          {
            type: "text",
            eyebrow: "09 Components",
            heading: "Mega menu, FAQ accordion and enquiry form",
            paragraphs: [
              "Most of the site's depth lives in three components. The mega menu shows all 87 products across eight ranges under four headings: wet process, denim washing, special finishes and yarn lubricants. The FAQ accordion answers the questions technicians ask before they get in touch, such as what textile chemicals are, where the products are made and how Texdale handles REACH.",
              "The enquiry form asks first what the visitor needs: a quote, a sample, a technical data sheet, a safety data sheet or a general question. Each request arrives labelled, so the reply comes from the right technician with the right document.",
            ],
          },
          {
            type: "full",
            image: {
              src: "/portfolio/texdale/case-study/texdale-10-components.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale components slide: the products mega menu showing 87 products across 8 ranges, the FAQ accordion opening on What are textile chemicals?, and the enquiry form with Request a sample selected",
              caption: "The mega menu, the FAQ accordion and the enquiry form.",
            },
          },
          {
            type: "text",
            eyebrow: "10 Outcome",
            heading: "A catalogue that finally behaves like one",
            paragraphs: [
              "What shipped: 87 products published, each mapped to a range and a process stage; eight ranges in the navigation that were previously buried; seven numbered homepage sections; and a sample request two taps from any range on mobile. Texdale's technical team can now send a mill to the website, in any time zone, without sending a PDF first.",
              "The site is also the base for the rest of the marketing. The [Google and Meta campaigns](/services/paid-marketing), [SEO](/services/seo) and AI search work all point at these pages, so the ads, the search results and the website describe one company in the same words.",
            ],
          },
          {
            type: "full",
            image: {
              src: "/portfolio/texdale/case-study/texdale-11-outcome.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale outcome slide: 87 products published, 08 ranges in the navigation, 07 numbered homepage sections and 2 taps from any range to a sample request on mobile, with notes on positioning, conversion path and build",
              caption: "What shipped: 87 products, eight ranges, seven sections, two taps to a sample.",
            },
          },
        ],
      storyCta: {
        heading: "Got a catalogue nobody can read?",
        body: "I design and build websites for manufacturers and B2B companies, where the product list is the hard part. One person from the first sketch to the live site, and the campaigns after it.",
        service: "custom-web-development",
      },
      ctaLead: "Building a website for a manufacturer?",
      faqs: [
          {
            question: "How is the Texdale product catalogue organised?",
            answer:
              "87 products in eight ranges: Pretreatment, Dyeing auxiliaries, Printing, Finishing, Softening, Denim washing, Special finishes and Yarn lubricants. Every range is in the navigation, a mega menu shows the whole catalogue in one view, and some products sit in more than one range because mills search by the job a product does.",
          },
          {
            question: "What should a website for a chemical manufacturer do?",
            answer:
              "Help a technical buyer find the right product and ask for a sample quickly. For Texdale that meant a first screen that says who, what, how many and where, a catalogue structured by range and process stage, data sheets close to every product, and an enquiry form that asks first whether the visitor wants a quote, a sample, a TDS, an SDS or a general answer.",
          },
          {
            question: "How was the Texdale website project run?",
            answer:
              "In four phases, each ending with something the client could check: discovery (product audit and competitor scan), structure (87 products mapped to eight ranges, navigation and sitemap), design (type, colour, components and a clickable prototype) and build and launch (Next.js, SEO, forms and handover).",
          },
      ],
      keywords: ["B2B manufacturer website design", "textile chemicals website", "product catalogue website", "Next.js website case study", "Texdale"],
    },
    {
      slug: "branding",
      name: "Branding",
      kind: "brand system",
      eyebrow: "Brand system",
      genre: "Brand design case study",
      service: "graphic-design-branding",
      metaTitle: "Texdale Branding: One Brand System Across Every Channel",
      cardImage: "/portfolio/texdale/case-study/texdale-04-colour-palette.avif",
      cardImageAlt: "Texdale colour palette: ink, navy, paper, blue, yellow and green swatches with their hex codes",
      cardImageFit: "contain",
      cardBlurb:
        "How Texdale's wordmark became one brand system: six colours with a job each and three typefaces, shared by its website, app and Meta ads.",
      headline: "One brand system for a textile chemicals manufacturer, from the website to the ads",
      summary:
        "Texdale's wordmark and four-colour bar, built out into a system of colour, type and layout that the website, the Texdale Field app and the Meta campaign creatives all share, so every channel looks like the same careful company.",
      facts: [
        { label: "Client", value: "Texdale" },
        { label: "Starting point", value: "Texdale's wordmark and colour bar" },
        { label: "Palette", value: "6 colours" },
        { label: "Type", value: "Archivo, IBM Plex Sans, IBM Plex Mono" },
        { label: "Used on", value: "Website, app, Meta ads" },
      ],
      story: [
        {
          type: "text",
          eyebrow: "Brand system",
          heading: "One identity across the website, the app and the ads",
          paragraphs: [
            "Texdale came with its own identity: a navy wordmark with a four-colour bar under it. The work was to turn that mark into a system that every channel could use, so the website, the Texdale Field app and the Meta campaign all look like the same company.",
            "The system sets the colours, the typefaces and the layout rules, and gives each one a single job. A buyer who sees an ad, opens the website and later uses the app should never wonder whether they are dealing with the same supplier.",
          ],
        },
        {
          type: "full",
          image: {
              src: "/portfolio/texdale/case-study/texdale-04-colour-palette.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale colour palette slide: six swatches, Ink #0C1119, Navy #263760, Paper #FAF9F6, Blue #0162C8, Yellow #FFD802 and Green #0AA753, with notes on headlines, body and labels, the process index and contrast",
              caption: "Ink, paper and four process colours, each with one job.",
            },
        },
        {
          type: "text",
          eyebrow: "Colour",
          heading: "Four colours from the logo, each with one meaning",
          paragraphs: [
            "The four-colour bar under the wordmark became the process index. Blue, yellow and green mark pretreatment, dyeing and finishing wherever they appear, on the website, in the app and on the range creatives, so a colour always means a stage of the wet process.",
            "Everything else is ink on warm paper, with navy and slate for long copy and labels: ink #0C1119, navy #263760, paper #FAF9F6, blue #0162C8, yellow #FFD802 and green #0AA753. Keeping the palette this small is what lets the coloured parts carry meaning.",
          ],
        },
        {
          type: "full",
          image: {
              src: "/portfolio/texdale/case-study/texdale-05-typography.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale typography slide: Archivo for display, IBM Plex Sans for body and IBM Plex Mono for the index, with the homepage headline Textile chemicals for the wet process set in Archivo Bold",
              caption: "Archivo for headlines, IBM Plex Sans for reading, IBM Plex Mono for the index.",
            },
        },
        {
          type: "text",
          eyebrow: "Typography",
          heading: "Three typefaces, each with a clear role",
          paragraphs: [
            "Archivo Bold sets the headlines, large and tightly spaced. IBM Plex Sans carries the body copy for easy reading. IBM Plex Mono labels and numbers sections, ranges and product counts, which gives the brand the feel of a technical document, the kind of page a dyehouse technician already trusts.",
            "The same three faces run through the website, the app screens and the social creatives, so the type alone tells a buyer whose material they are looking at.",
          ],
        },
        {
          type: "full",
          image: {
              src: "/portfolio/texdale/case-study/texdale-07-page-system.avif",
              width: 3200,
              height: 2000,
              alt: "Texdale page system slide: three homepage sections in browser frames, One supplier the whole chain, Eight ranges, and Sample in. Bulk out., above the full homepage sequence from 01 Company to 07 Contact",
              caption: "The same colour index and type carry every numbered section of the site.",
            },
        },
        {
          type: "text",
          eyebrow: "Across channels",
          heading: "The same brand in the app and on social",
          paragraphs: [
            "The Texdale Field app uses the same wordmark, colours and type as the website, at a phone's scale. The Meta campaign creatives do the same: a brand creative and one for each of the eight product ranges, each carrying its range number and its process colour.",
            "For a B2B manufacturer this consistency is not decoration. Technical buyers judge a supplier on precision, and a brand that looks the same everywhere reads as a company that is careful about details. See the [website](/portfolio/texdale/website), the [app design](/portfolio/texdale/mobile-app-design) and the [social media work](/portfolio/texdale/social-media-marketing) in full.",
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: "/portfolio/texdale/social/texdale-01-brand.avif",
              width: 1080,
              height: 1080,
              alt: "Texdale brand creative: the white Texdale wordmark and four-colour bar on near-black, with the lines Textile chemicals, manufactured in the north of England, supplied to mills worldwide",
              caption: "The brand creative",
            },
            {
              src: "/portfolio/texdale/social/texdale-03-dyeing-auxiliaries.avif",
              width: 1080,
              height: 1080,
              alt: "Texdale Dyeing Auxiliaries creative on blue, range 02 of 08, listing levelling agents, dispersing agents, dyebath sequestrants, cationic fixing agents and anti-creasing agents",
              caption: "Range 02: Dyeing auxiliaries",
            },
          ],
        },
        {
          type: "full",
          image: {
              src: "/portfolio/texdale/mobile/02.avif",
              width: 1616,
              height: 1264,
              alt: "Four Texdale Field app screens fanned out: the Chemistry for the wet process home screen, the Eight ranges list, the Neutral cellulase overview and its dosing calculator",
              caption: "The app in the same identity: home, ranges, product and dosing.",
            },
        },
      ],
      ctaLead: "Want your brand to look the same everywhere?",
      faqs: [
          {
            question: "What fonts and colours does the Texdale website use?",
            answer:
              "Archivo Bold for headlines, IBM Plex Sans for body copy and IBM Plex Mono for labels and numbers, all self-hosted. The palette is ink, navy and warm paper, with blue, yellow and green from the logo used only to mark pretreatment, dyeing and finishing.",
          },
          {
            question: "How do you keep a B2B brand consistent across the website, app and ads?",
            answer:
              "Write the rules down once and give each part one job. For Texdale the colours from the logo mark the three stages of the wet process and nothing else, three typefaces each have a fixed role, and the same rules are applied to the website, the Texdale Field app and every Meta creative. A buyer then sees one company wherever they meet it.",
          },
        {
          question: "What is a brand system?",
          answer:
            "The rules that make every channel look like one company: which colours to use and what each one means, which typeface does which job, and how layouts are built. For Texdale it starts from the wordmark and four-colour bar and is applied the same way to the website, the Texdale Field app and the Meta ads.",
        },
      ],
      keywords: ["brand system design", "B2B brand consistency", "brand colour palette", "typography for a website", "Texdale"],
    },
    {
      slug: "mobile-app-design",
      name: "Mobile app design",
      kind: "app design",
      eyebrow: "Mobile app design and prototype",
      genre: "Mobile app design case study",
      service: "mobile-app-development",
      metaTitle: "Texdale Field: B2B Mobile App Design and Prototype",
      cardImage: "/portfolio/texdale/mobile/01.avif",
      cardImageAlt: "Eight Texdale Field app screens: home, ranges, product, dosing calculator, scanner, data sheets, requests and contact",
      cardImageFit: "contain",
      cardBlurb:
        "Texdale Field, a sales app designed and prototyped for a textile chemicals maker: drum scanning, dosing calculator, data sheets and samples.",
      headline: "Texdale Field: a sales app for a textile chemicals manufacturer, designed and prototyped",
      summary:
        "A mobile app designed and prototyped for Texdale's sales team and the mills they supply: scan a drum, check the dose, open the data sheet, and ask for a sample or a reorder. Not yet released on the App Store or Google Play.",
      facts: [
        { label: "Client", value: "Texdale" },
        { label: "App", value: "Texdale Field" },
        { label: "Stage", value: "Design and prototype" },
        { label: "Products in prototype", value: "31" },
        { label: "Released", value: "Not yet" },
      ],
      story: [
        {
          type: "text",
          eyebrow: "Overview",
          heading: "An app for the sales team and the mills they supply",
          paragraphs: [
            "Texdale Field is a mobile app designed and prototyped for Texdale's sales team and the mills they supply. It puts the range, the dosing and the paperwork in one place: scan a drum, check the dose, open the data sheet, ask for a sample or a reorder.",
            "It is a design and prototype. It has not been released on the App Store or Google Play, and some screens still show placeholder text where Texdale's own photography and specifications will go.",
          ],
        },
        {
          type: "full",
          image: {
              src: "/portfolio/texdale/mobile/01.avif",
              width: 1616,
              height: 1264,
              alt: "Eight Texdale Field app screens in two rows: home, the eight product ranges, a product overview, the dosing calculator, the drum label scanner, data sheets, the requests list with statuses, and the Send us the cloth contact screen",
              caption: "The eight core screens.",
            },
        },
        {
          type: "text",
          eyebrow: "Finding a product",
          heading: "Scan a drum or browse eight ranges",
          paragraphs: [
            "Point the camera at a drum label and the app matches it to the product, with manual code entry as the fallback. Or browse the full range by process stage: 31 products in the prototype across the eight ranges, each with its dosing, documents and safety.",
            "Each product page has four tabs, Overview, Dosing, Docs and Safety, with appearance, ionic character, pH, storage and pack sizes on one screen.",
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: "/portfolio/texdale/mobile/02.avif",
              width: 1616,
              height: 1264,
              alt: "Four Texdale Field app screens fanned out: the Chemistry for the wet process home screen, the Eight ranges list, the Neutral cellulase overview and its dosing calculator",
              caption: "Home, ranges, product and dosing.",
            },
            {
              src: "/portfolio/texdale/mobile/06.avif",
              width: 1616,
              height: 1264,
              alt: "Three Texdale Field app screens: the Eight ranges list, the home screen with Scan a drum and The range links, and the Data sheets list with All, TDS, SDS and Saved filters",
              caption: "Ranges, home and data sheets.",
            },
          ],
        },
        {
          type: "text",
          eyebrow: "On the mill floor",
          heading: "A dosing calculator and every data sheet",
          paragraphs: [
            "The dosing calculator takes the fabric weight and the dose and gives the amount to add to the bath, with the recommended range beside it. Technical and safety data sheets (TDS and SDS) sit in one list, filterable by type, with a Saved list for the ones used most.",
            "Sample and Reorder buttons are on every product, and a Requests list shows where each request is. The contact screen asks the mill to send the cloth, because in textile chemicals a sale starts with a trial.",
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: "/portfolio/texdale/mobile/05.avif",
              width: 1616,
              height: 1264,
              alt: "Close-up of the Texdale Field dosing calculator: a fabric weight of 200 kg and a dose of 1.25% on weight of fabric give 2.50 kg to add to the bath",
              caption: "The dosing calculator, close up.",
            },
            {
              src: "/portfolio/texdale/mobile/04.avif",
              width: 1616,
              height: 1264,
              alt: "Two Texdale Field app screens for Neutral cellulase from the denim washing range: the Overview tab listing appearance, ionic character, pH, solubility, storage and pack sizes, and the Dosing tab where 200 kg of fabric at 1.25% gives 2.50 kg to add to the bath, with Sample and Reorder buttons",
              caption: "Product page: overview and dosing.",
            },
          ],
        },
        {
          type: "text",
          eyebrow: "Design",
          heading: "The same identity as the website and the ads",
          paragraphs: [
            "The app uses the Texdale wordmark, the process colours and the same three typefaces as the [website](/portfolio/texdale/website) and the [brand system](/portfolio/texdale/branding), so the app, the site and the campaigns read as one company.",
          ],
        },
        {
          type: "full",
          image: {
              src: "/portfolio/texdale/mobile/03.avif",
              width: 1616,
              height: 1264,
              alt: "Close-up of two Texdale Field app screens: the home screen reading Chemistry for the wet process, and the Neutral cellulase overview with a matched drum and Sample and Reorder buttons",
              caption: "Home and product overview, close up.",
            },
        },
        {
          type: "text",
          eyebrow: "What the prototype is for",
          heading: "Settling the hard questions before any code is written",
          paragraphs: [
            "Building an app is expensive and changing one after it is built is more expensive. A prototype is the cheap stage, where the sales team and a few friendly mills can tap through the screens and say what is missing, what is in the wrong place and what they would never use.",
            "For Texdale Field, the prototype puts the main tasks one tap from the home screen, scanning a drum and browsing the range, and keeps everything a technician needs about a product on one page in four tabs. Whether those are the right tasks is exactly what testing the prototype is meant to confirm.",
          ],
        },
        {
          type: "text",
          eyebrow: "Next steps",
          heading: "What happens between the prototype and the app stores",
          paragraphs: [
            "Before Texdale Field is built, three decisions remain. Texdale's own product photography and specifications replace the placeholder content. The platform is chosen, whether native apps for iPhone and Android or one cross-platform build. And the app is connected to the same product data as the website, so a change to a data sheet appears in both places at once.",
            "Until then it stays a design and prototype, and this page describes it that way.",
          ],
        },
      ],
      ctaLead: "Planning an app for your sales team?",
      faqs: [
        {
          question: "Which platform will Texdale Field be built on?",
          answer:
            "That has not been decided yet. The prototype comes first, so the screens and tasks are agreed with the sales team before choosing between native iPhone and Android apps or a single cross-platform build.",
        },
          {
            question: "Is the Texdale Field app live?",
            answer:
              "Not yet. It is designed and prototyped, with a drum label scanner, a dosing calculator, data sheets and sample and reorder requests, and is not yet released on the App Store or Google Play.",
          },
          {
            question: "What does the Texdale Field app do?",
            answer:
              "It lets a salesperson or a mill technician scan a drum label to find the product, browse eight ranges, read each product's overview, dosing, documents and safety, work out the dose with a calculator, open TDS and SDS data sheets, and request a sample or a reorder.",
          },
        {
          question: "Does the app match the Texdale website?",
          answer:
            "Yes. It uses the same wordmark, the same process colours for pretreatment, dyeing and finishing, and the same three typefaces as the website and the Meta creatives, so the app, the site and the ads read as one company.",
        },
        {
          question: "Why design and prototype an app before building it?",
          answer:
            "A prototype lets the sales team and the mills try the screens before any code is written, so changes are cheap. For Texdale Field it settles which tasks matter on a mill floor, such as scanning a drum, checking a dose and finding a data sheet, before the platform and the build are decided.",
        },
      ],
      keywords: ["mobile app design case study", "B2B sales app", "app prototype", "dosing calculator app", "Texdale Field"],
    },
    {
      slug: "social-media-marketing",
      name: "Social media marketing",
      kind: "social media work",
      eyebrow: "Social media and Meta ads",
      genre: "Social media marketing case study",
      service: "social-media-marketing",
      metaTitle: "Texdale Social Media: Meta Ads Creatives for a Manufacturer",
      cardImage: "/portfolio/texdale/social/texdale-01-brand.avif",
      cardImageAlt: "Texdale brand creative: the white wordmark and four-colour bar on near-black",
      cardImageFit: "contain",
      cardBlurb:
        "Texdale's Meta ads on Facebook and Instagram: a brand creative and one for each of eight product ranges, in the same identity as the website.",
      headline: "Social media and Meta ads for a textile chemicals manufacturer",
      summary:
        "The creatives behind Texdale's Meta campaign on Facebook and Instagram: one for the brand and one for each of the eight product ranges, in the same identity as the website and the app, so an ad and the page it opens read as one company.",
      facts: [
        { label: "Client", value: "Texdale" },
        { label: "Channels", value: "Facebook, Instagram" },
        { label: "Creatives", value: "9" },
        { label: "Set", value: "Brand plus 8 ranges" },
        { label: "Results", value: "Texdale's to share" },
      ],
      story: [
        {
          type: "text",
          eyebrow: "Overview",
          heading: "Meta campaign creatives for a B2B manufacturer",
          paragraphs: [
            "Texdale's social channels and its Meta campaign on Facebook and Instagram run in the same identity as the website: the Texdale wordmark, the four-colour bar and the same type. A buyer who checks a profile after seeing an ad meets the same company the website describes.",
            "The creative set is one brand creative and one for each of the eight product ranges, made for the Meta campaign.",
          ],
        },
        {
          type: "full",
          image: {
              src: "/portfolio/texdale/social/texdale-01-brand.avif",
              width: 1080,
              height: 1080,
              alt: "Texdale brand creative: the white Texdale wordmark and four-colour bar on near-black, with the lines Textile chemicals, manufactured in the north of England, supplied to mills worldwide",
              caption: "The brand creative",
            },
        },
        {
          type: "text",
          eyebrow: "The range set",
          heading: "One creative for each of the eight ranges",
          paragraphs: [
            "Each range creative carries its number out of eight, its process colour and the products it covers, from desizing agents in pretreatment to coning oils in yarn lubricants. That is what a technical buyer scans for: whether the range covers their process.",
            "Because every creative follows the same layout, the set works as a series in a feed and each one still stands alone as an ad.",
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: "/portfolio/texdale/social/texdale-02-pretreatment.avif",
              width: 1080,
              height: 1080,
              alt: "Texdale Pretreatment creative, range 01 of 08, listing desizing agents, scouring agents, peroxide stabilisers, wetting agents and sequestrants",
              caption: "Range 01: Pretreatment",
            },
            {
              src: "/portfolio/texdale/social/texdale-03-dyeing-auxiliaries.avif",
              width: 1080,
              height: 1080,
              alt: "Texdale Dyeing Auxiliaries creative on blue, range 02 of 08, listing levelling agents, dispersing agents, dyebath sequestrants, cationic fixing agents and anti-creasing agents",
              caption: "Range 02: Dyeing auxiliaries",
            },
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: "/portfolio/texdale/social/texdale-04-printing.avif",
              width: 1080,
              height: 1080,
              alt: "Texdale Printing creative, range 03 of 08, listing synthetic thickeners, pigment binders, print fixers and anti-migrating agents",
              caption: "Range 03: Printing",
            },
            {
              src: "/portfolio/texdale/social/texdale-05-finishing.avif",
              width: 1080,
              height: 1080,
              alt: "Texdale Finishing creative on near-black, range 04 of 08, listing softeners, silicones, hand builders and hydrophilic finishes",
              caption: "Range 04: Finishing",
            },
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: "/portfolio/texdale/social/texdale-06-softening.avif",
              width: 1080,
              height: 1080,
              alt: "Texdale Softening creative, range 05 of 08, listing amino silicone emulsions, non-yellowing softeners and polyethylene softeners",
              caption: "Range 05: Softening",
            },
            {
              src: "/portfolio/texdale/social/texdale-07-denim-washing.avif",
              width: 1080,
              height: 1080,
              alt: "Texdale Denim Washing creative on navy, range 06 of 08, listing neutral and acid cellulases, reducing agents, anti back-staining agents and denim fixers",
              caption: "Range 06: Denim washing",
            },
          ],
        },
        {
          type: "pair",
          images: [
            {
              src: "/portfolio/texdale/social/texdale-08-special-finishes.avif",
              width: 1080,
              height: 1080,
              alt: "Texdale Special Finishes creative, range 07 of 08, listing water repellents, oil repellents, flame retardants and crosslinking resins",
              caption: "Range 07: Special finishes",
            },
            {
              src: "/portfolio/texdale/social/texdale-09-yarn-lubricants.avif",
              width: 1080,
              height: 1080,
              alt: "Texdale Special Yarn Lubricants creative, range 08 of 08, listing Dalerol coning oils and lick-roll lubricants, water-free with no drying stage",
              caption: "Range 08: Yarn lubricants",
            },
          ],
        },
        {
          type: "text",
          eyebrow: "How it runs",
          heading: "Search, social and paid saying one thing",
          paragraphs: [
            "Launches go out on every channel in the same week, so the [SEO](/services/seo), the social posts and the paid campaigns carry one message, and every ad points at a page on the [website](/portfolio/texdale/website) built for it.",
            "There are no performance figures here. The results belong to Texdale, and none are published without their agreement.",
          ],
        },
        {
          type: "text",
          eyebrow: "Creative decisions",
          heading: "Designed for a technical buyer's feed",
          paragraphs: [
            "Texdale's buyers are technicians and buyers in dyehouses and finishing plants. On Facebook and Instagram they scroll past lifestyle imagery but stop when they recognise their own process. So each creative leads with the range name, its number out of eight and the products it covers, written large enough to read on a phone at feed size.",
            "The process colours on the creatives are the same ones the website uses to colour code each stage of the wet process. A buyer who taps from the pretreatment creative sees the same colour on the page it opens, which tells them at a glance they are in the right place.",
          ],
        },
        {
          type: "text",
          eyebrow: "Why a set, not one advert",
          heading: "Eight ranges, eight reasons to stop scrolling",
          paragraphs: [
            "A single advert for a company with eight product ranges has to be general, and general adverts are easy to ignore. A set of nine lets the campaign show the denim washing creative to people interested in denim and the printing creative to printers, while the brand creative introduces the company to everyone else.",
            "The same square designs serve as organic posts on Texdale's profiles and as Meta ads, so the profile a buyer checks after seeing an ad looks exactly like the campaign that brought them there.",
          ],
        },
      ],
      ctaLead: "Need social media that looks like your brand?",
      faqs: [
        {
          question: "Why do the Texdale creatives use different colours for each range?",
          answer:
            "Each colour matches the process stage it belongs to on the Texdale website, so the colour coding on the ads and on the site is the same. A buyer who taps an ad lands on a page in the same colour, which makes the connection between the two obvious.",
        },
          {
            question: "What social media creatives were made for Texdale?",
            answer:
              "Nine creatives for the Meta campaign: one for the brand and one for each of the eight product ranges, from pretreatment to yarn lubricants. Each carries its range number, its process colour and the products it covers, in the same identity as the website.",
          },
          {
            question: "Which platforms did the Texdale campaign run on?",
            answer:
              "Meta: Facebook and Instagram. Texdale's Google Ads, SEO and AI search work run alongside it and point at the same website.",
          },
        {
          question: "Are there results for the Texdale campaign?",
          answer:
            "None are published on this page. The results belong to Texdale, and no figures are shared without their agreement.",
        },
        {
          question: "Can social media work for a B2B manufacturer?",
          answer:
            "Yes, if it is built for the people who actually buy. Texdale's buyers are dyehouse and finishing technicians, so the creatives lead with the product ranges and what each one covers rather than lifestyle imagery, and every ad points at a page that answers a technical question. The aim is to be recognised and trusted when a buyer is ready, not to go viral.",
        },
      ],
      keywords: ["Meta ads creatives", "social media marketing for manufacturers", "B2B social media", "Facebook and Instagram ads", "Texdale"],
    },
    ],
    keywords: [
      "digital marketing case study",
      "B2B manufacturer website design",
      "textile chemicals website",
      "Google Ads and Meta ads",
      "Next.js website development",
      "mobile app design",
      "Meta campaign creatives",
      "B2B SEO and GEO",
      "growth marketing case study",
      "Texdale",
    ],
  },
  {
    // Published 2026-10-26. Bilal said he can show the work, and the source is
    // his own repository (~/Desktop/bilal/nextgen, every commit his, first
    // commit "Create Next App"): he designed and built the site from scratch.
    // Everything below is readable off that source or the live site at
    // nextgenhr.ae. Deliberately absent until he supplies them: the dates, any
    // result, and any claim about the logo itself (the repo shows him adding
    // the SVG files and building the intro, not designing the mark). The Google
    // Ads and Meta Pixel IDs in the source are still placeholders, so no
    // campaign is claimed; the /hire page is described as ready for paid
    // traffic, nothing more.
    //
    // 2026-10-29: web-design and custom-web-development added to `services`,
    // so the case study shows on those service pages. He designed and built
    // the site, in Next.js; the SEO page already listed it.
    //
    // 2026-11-04: Bilal confirmed Google Ads and Meta Ads are live, and that
    // he runs their social media and GEO/AIO. The four creatives are his
    // launch set (nextgen-mockups/social/posts), used as posts and as Meta
    // ads, in Meta's Employment special ad category. Still no results.
    slug: "nextgen-hr",
    name: "NextGen HR",
    industry: "Professional Services",
    logo: "/portfolio/nextgen-hr/logo/nextgen-hr-logo.svg",
    logoWidth: 295,
    logoHeight: 49,
    ogImage: "/portfolio/nextgen-hr/og-nextgen-hr.jpg",
    ogImageAlt: "The NextGen HR homepage hero: People first. Hiring done right, over the Dubai skyline at night",
    title: "NextGen HR: Recruitment Website and Marketing in Dubai",
    description:
      "Website and marketing for NextGen HR, a Dubai recruitment agency: design, Next.js build, SEO, GEO, social media, and Google and Meta ads.",
    headline: "A recruitment agency in Dubai, from the first design to the live ads",
    intro:
      "NextGen HR Consultancy is a licensed recruitment agency and HR consultancy in Meydan, Dubai, helping employers across the UAE hire permanent and fixed-term staff. I run their digital marketing from end to end: the website design, a custom Next.js build, SEO and AI search optimisation, social media, and Google and Meta campaigns that send employers to a landing page built for them.",
    facts: [
      { label: "Client", value: "NextGen HR Consultancy" },
      { label: "Sector", value: "Recruitment and HR consultancy" },
      { label: "Market", value: "Dubai and the wider UAE" },
      { label: "Role", value: "Growth marketing lead, end to end" },
      { label: "Scope", value: "Web, SEO, GEO, social, Google and Meta ads" },
    ],
    scopeIntro:
      "A recruitment agency's website serves two audiences at once: employers with a role to fill, and people looking for their next job. The site is built for both, with a clear route for each from the first screen, and structured so each service, sector and emirate can be found on its own.",
    scope: [
      {
        heading: "Website design",
        body: "UI/UX design in the brand's copper and dark blue, with square corners throughout and a header that slides in on scroll. The site opens with a short logo animation: one circle splits into the two-circle NextGen symbol and the name slides in beside it. Visitors who prefer reduced motion skip it.",
      },
      {
        heading: "Website development",
        body: "A custom Next.js build in plain JavaScript with Tailwind CSS, made of small reusable components. All of the site's words live in one data file, so changing a line of copy does not mean hunting through the code.",
      },
      {
        heading: "SEO structure and blog",
        body: "A page for each of five services, five sectors and three emirates (Dubai, Abu Dhabi and Sharjah), plus about, FAQ and contact, and a blog launched with five articles on what employers and job seekers ask, from agency fees to Emiratisation targets. Structured data, a sitemap, and verification with Google Search Console and Bing Webmaster Tools.",
      },
      {
        heading: "GEO and AI search (AIO)",
        body: "An llms.txt file that tells AI assistants who NextGen is, where it is licensed and what it does, plus structured data and FAQ answers written plainly enough for ChatGPT, Gemini and Google's AI Overviews to quote.",
      },
      {
        heading: "Enquiries",
        body: "A contact form that delivers each hiring brief to the company mailbox and shows a reference code if sending fails, an enquiry pop-up, a WhatsApp button, and a separate landing page with its own thank-you page, where the paid campaigns send employers.",
      },
      {
        heading: "Consent-based tracking",
        body: "Google Analytics 4 loads only after a visitor accepts cookies, with lead events recorded when an enquiry is sent. Privacy, cookie and terms pages match the tools that are actually switched on.",
      },
      {
        heading: "Google Ads",
        body: "Search campaigns aimed at UAE employers looking for a recruitment agency or HR support, landing on the hiring page rather than the homepage.",
      },
      {
        heading: "Meta ads and creatives",
        body: "Facebook and Instagram campaigns aimed at employers, run in Meta's Employment category so they meet its rules, with a launch set of four creatives in the brand's copper and dark blue.",
      },
      {
        heading: "Social media management",
        body: "NextGen's Facebook, Instagram and LinkedIn profiles, from the covers and profile images to the posts, in the same voice as the website, so an employer who checks a profile sees the same company the ad promised.",
      },
    ],
    services: [
      "digital-marketing",
      "fractional-head-of-marketing",
      "paid-marketing",
      "google-ads",
      "facebook-ads",
      "social-media-marketing",
      "seo",
      "web-design",
      "custom-web-development",
    ],
    website: {
      heading: "The website",
      body: "The NextGen HR homepage as it is live today, from the hero to the footer, on desktop and on a phone. Scroll inside either frame to see the complete page.",
      capture: {
        src: "/portfolio/nextgen-hr/nextgen-hr-website.avif",
        width: 1440,
        height: 10650,
        alt: "Full-page view of the NextGen HR homepage: the People first. Hiring done right hero over the Dubai skyline, about, five services, why companies hire with NextGen, how hiring works, sectors, emirates, job seekers, FAQ, blog and contact",
        label: "NextGen HR, homepage",
      },
      mobileCapture: {
        src: "/portfolio/nextgen-hr/nextgen-hr-website-mobile.avif",
        width: 450,
        height: 16357,
        alt: "The NextGen HR homepage on a phone, with the same sections stacked into one column",
        label: "NextGen HR, homepage on a phone",
      },
      cardImage: { src: "/portfolio/nextgen-hr/nextgen-hr-card.avif", width: 1440, height: 900 },
    },
    socialDesigns: {
      heading: "Launch creatives for Meta and social",
      body: "Four creatives in the brand's copper and dark blue, used as the first posts on Facebook and Instagram and as the Meta ads aimed at employers: an introduction, how hiring works, the HR consultancy, and why employers choose NextGen.",
      basePath: "/portfolio/nextgen-hr/social",
      width: 1080,
      height: 1350,
      layout: "screens",
      alsoProves: ["facebook-ads"],
      items: [
        {
          file: "nextgen-hr-01-hire-in-the-uae",
          alt: "NextGen HR creative over the Dubai skyline at night: Hire the right people in the UAE, a licensed recruitment agency and HR consultancy in Dubai, with a Send your brief button",
          caption: "NextGen HR: introduction",
        },
        {
          file: "nextgen-hr-02-how-we-recruit",
          alt: "NextGen HR creative: Not a pile of CVs. A shortlist that fits, with four steps from sharing a brief to hiring directly on your own contract",
          caption: "NextGen HR: how we recruit",
        },
        {
          file: "nextgen-hr-03-hr-consultancy",
          alt: "NextGen HR creative: Growing faster than your HR? listing HR set-up, policies and handbooks, team structure, appraisals and salary benchmarking",
          caption: "NextGen HR: HR consultancy",
        },
        {
          file: "nextgen-hr-04-why-nextgen",
          alt: "NextGen HR creative: Licensed. Direct. Fair to candidates. Licensed by Meydan Free Zone, 18+ years of experience, direct hiring, candidates never pay a fee",
          caption: "NextGen HR: why NextGen",
        },
      ],
    },
    depth: [
      {
        heading: "Two audiences, one homepage",
        paragraphs: [
          "Most visitors to a recruitment agency are one of two people: an employer with a role to fill, or someone looking for work. They want different things, and a homepage that speaks to both in the same breath serves neither.",
          "So the hero gives each its own route. Send your hiring brief takes an employer to the contact form; Looking for a job? takes a job seeker to a section of their own, which says plainly that candidates never pay a fee. The heading search engines read says exactly what NextGen is and where: a recruitment agency and HR consultancy in Dubai, UAE.",
        ],
      },
      {
        heading: "One page per search",
        paragraphs: [
          "People do not search for a recruitment agency in general. They search for executive search, or Emiratisation hiring, or a recruitment agency in Abu Dhabi. A single services page cannot rank for all of those, because search engines rank pages, not paragraphs.",
          "That is why the site has a page for each service, each sector and each emirate, all generated from the same data, plus a blog that answers the questions people ask before they get in touch. Each page is a separate way in, and each one ends with the same next step.",
        ],
      },
      {
        heading: "Live before every detail arrived",
        paragraphs: [
          "A new company rarely has every detail ready on launch day. Office hours, a licence number and tracking IDs often arrive later. Rather than hold the site back, any detail still waiting on the client stays hidden until it is filled in, and each tracking tool stays switched off until its ID is added.",
          "The site went live with what was true on the day, and nothing on it reads as unfinished. Once the tracking was in, the Google and Meta campaigns started, so every paid enquiry is counted from the first click. For a Dubai business, that is the advantage of [freelance digital marketing in Dubai](/) over an agency: the person who built the site also runs the ads.",
          "There are no performance figures on this page. The results belong to NextGen HR, and none are published without their agreement.",
        ],
      },
    ],
    siteUrl: "https://nextgenhr.ae",
    faqs: [
      {
        question: "What did Bilal Shafqat do for NextGen HR?",
        answer:
          "NextGen HR's digital marketing from end to end: the website design, a custom Next.js build, SEO and AI search optimisation, a blog, consent-based tracking, social media on Facebook, Instagram and LinkedIn, and Google and Meta campaigns that send employers to a landing page built for them.",
      },
      {
        question: "How do you build a recruitment agency website that ranks in Dubai?",
        answer:
          "Give each search its own page. NextGen has a page for each of five services, five sectors and three emirates, plus a blog answering what employers and job seekers ask, all with structured data and a sitemap, and verified in Google Search Console and Bing Webmaster Tools.",
      },
      {
        question: "How does the site serve employers and job seekers at once?",
        answer:
          "The hero gives each its own route: Send your hiring brief takes employers to the contact form, and Looking for a job? takes candidates to a section of their own, which says plainly that candidates never pay a fee.",
      },
      {
        question: "How do the paid campaigns work for a recruitment agency?",
        answer:
          "Google search campaigns reach UAE employers looking for a recruitment agency or HR support, and Meta campaigns run in Meta's Employment category so they meet its rules. Both land on a dedicated hiring page with its own thank-you page, so every paid enquiry is counted.",
      },
      {
        question: "How is NextGen HR optimised for AI search?",
        answer:
          "An llms.txt file tells AI assistants who NextGen is, where it is licensed and what it does, and structured data and FAQ answers are written plainly enough for ChatGPT, Gemini and Google's AI Overviews to quote.",
      },
    ],
    ctaLead: "Need marketing that brings in enquiries, from the website to the ads?",
    projects: [],
    keywords: [
      "recruitment agency website design",
      "HR consultancy website",
      "website design Dubai",
      "Next.js website development",
      "SEO for a recruitment agency",
      "recruitment agency marketing Dubai",
      "Google Ads and Meta ads",
      "growth marketing case study",
      "NextGen HR",
    ],
  },
  {
    // Added 2026-11-12. Bilal designed and built the platform from scratch: his
    // repository ~/Desktop/bilal/harvey/home-maid, 86 commits, all his, from 27
    // Oct to 10 Nov 2026. Every claim below is checked against that code or the
    // live site. The nine creatives were designed on 2026-11-12 in the client's
    // identity, using the client's own team photography.
    //
    // Published 2026-11-12, after Bilal confirmed the client is happy to be
    // named. Deliberately absent: prices (Bilal keeps prices off his site), the trade licence number,
    // the site's rating and testimonials (entered through the admin, source not
    // shown), any campaign figure or result, and the logo design (supplied by
    // the client). The app is described as upcoming: the API is built for it,
    // the app is not.
    slug: "homemaid",
    name: "Homemaid",
    industry: "Home Services",
    siteUrl: "https://homemaid.ae",
    logo: "/portfolio/homemaid/logo/home-maid-blue.svg",
    logoWidth: 1784,
    logoHeight: 250,
    ogImage: "/portfolio/homemaid/og-homemaid.jpg",
    ogImageAlt: "The Homemaid homepage hero: Your Home, Our Commitment, above the HomeMaid team beside their van",
    title: "Homemaid: Booking Platform and Marketing in Dubai",
    description:
      "A bilingual booking platform for Homemaid, a Dubai home services company: UX, UI, build, automation, and Google and Meta campaigns.",
    headline: "A bilingual booking platform, automation and launch campaigns for a Dubai home services company",
    intro:
      "Homemaid cleans and maintains apartments and villas across Dubai: general and deep cleaning, furniture cleaning, handyman work and painting. I designed and built their platform from a blank page: the booking and payments flow, customer accounts, a full Arabic version built right to left, an admin system to run the day, and automation that takes payments and briefs the team overnight. Then the Google and Meta campaigns with the creatives that run on them. One person, from the first screen to the live ads.",
    facts: [
      { label: "Client", value: "Homemaid" },
      { label: "Sector", value: "Home services" },
      { label: "Market", value: "Dubai, UAE" },
      { label: "Role", value: "Product, build and growth, end to end" },
      { label: "Languages", value: "English and Arabic" },
    ],
    scopeIntro:
      "A home services business is won or lost on how quickly someone can go from \"I need a cleaner\" to a confirmed booking. Every part of this work, from the first screen to the ads, is built around that moment, so a customer who sees an ad, lands on their area's page or opens the site in Arabic can book and pay in under a minute.",
    scope: [
      {
        heading: "UX and the booking flow",
        body: "One question per step: service, home size, hours and team, materials, area, date and time, then payment. The area can be detected from the phone, the total including VAT stays on screen throughout, and painting is chosen by picture: apartment, villa or a single room.",
      },
      {
        heading: "UI design",
        body: "A UI system built on Homemaid's navy and neon brand, with Outfit for headings and Inter for text: service cards, the step indicator, the booking summary and buttons, used across the site, the admin panel and the emails.",
      },
      {
        heading: "Arabic version, right to left",
        body: "Every page, the booking flow, the account area and the emails in Arabic, with the layout properly mirrored, IBM Plex Sans Arabic for type, and separate Arabic titles and descriptions for search engines.",
      },
      {
        heading: "Booking and payments platform",
        body: "A Next.js platform with MongoDB and Stripe. Cards are saved securely and Apple Pay is supported. Bookings within about six days are held on the card and charged after the service; cancellation fees follow the policy automatically, and every receipt includes VAT.",
      },
      {
        heading: "Customer accounts and subscriptions",
        body: "Accounts with saved addresses and cards, booking history, promo codes, and cleaning subscriptions offered at up to 40% off.",
      },
      {
        heading: "Admin system",
        body: "An admin panel to run bookings, customers, subscriptions, promo codes, closed dates and the site's wording in both languages, with an activity log on every booking.",
      },
      {
        heading: "Automation",
        body: "Scheduled jobs close finished bookings and take due payments at 2am Dubai time, and a 7am summary tells the team today's jobs, pending confirmations and payment issues. Booking, confirmation, cancellation and receipt emails send themselves, and a failed card gets a secure payment link, followed up up to three times.",
      },
      {
        heading: "Local SEO",
        body: "Ten Dubai area pages, LocalBusiness and FAQ structured data, a sitemap, and English and Arabic metadata, so the site can be found by service and by area.",
      },
      {
        heading: "Google Ads and Meta campaigns",
        body: "Search campaigns by service and area, each landing on the matching page, and Meta campaigns on Facebook and Instagram with a set of nine creatives in the client's identity.",
      },
      {
        heading: "Mobile app, upcoming",
        body: "An iOS and Android app is next. The platform's API is built to serve it, so accounts, saved cards, bookings and subscriptions carry over from day one.",
      },
    ],
    services: [
      "digital-marketing",
      "fractional-head-of-marketing",
      "paid-marketing",
      "google-ads",
      "facebook-ads",
      "ui-ux-design",
      "web-design",
      "custom-web-development",
      "marketing-automation",
    ],
    website: {
      heading: "The website",
      body: "The Homemaid homepage as it is live today, on a desktop and on a phone: the quick booker, the services, how it works, the cleaning subscription and the booking prompt. The phone layout is designed for booking with one thumb, with the next step always in reach. Scroll inside each frame to see the complete page.",
      capture: {
        src: "/portfolio/homemaid/homemaid-website.avif",
        width: 1600,
        height: 5842,
        alt: "Full-page view of the Homemaid homepage: the Your Home, Our Commitment hero with the quick booker, the eight services, why Homemaid, how it works, the cleaning subscription, reviews and the booking prompt",
        label: "Homemaid, homepage",
      },
      // Captured from the live site at 390px wide on 2026-11-12, in two halves
      // (Chrome cannot paint a screenshot taller than 16,384px) and scaled to
      // 16,384px tall, the AVIF limit.
      mobileCapture: {
        src: "/portfolio/homemaid/homemaid-mobile.avif",
        width: 558,
        height: 16384,
        alt: "Full-page view of the Homemaid homepage on a phone: the hero, the quick booker, each service as a card with its own book button, how it works and the cleaning subscription in a single column",
        label: "Homemaid, mobile",
      },
      cardImage: { src: "/portfolio/homemaid/homemaid-card.avif", width: 1600, height: 1000 },
    },
    socialDesigns: {
      heading: "Meta campaign creatives",
      body: "A set of nine square creatives in Homemaid's identity, mixing three kinds in turn: a brand tile, a photograph of the team at work, and a plain text tile. One for each of the five services, one for the cleaning subscription, one for the ten areas, the brand, and one in Arabic, for the Meta campaign on Facebook and Instagram.",
      basePath: "/portfolio/homemaid/social",
      width: 1080,
      height: 1080,
      columns: 3,
      alsoProves: ["facebook-ads"],
      items: [
        {
          file: "homemaid-01-brand",
          alt: "Homemaid brand creative: the neon homemaid logo on navy, with the lines Home cleaning and home services, apartments and villas across Dubai, book online in under a minute",
          caption: "Homemaid: brand",
        },
        {
          file: "homemaid-02-general-cleaning",
          alt: "Homemaid General Cleaning creative, service 01 of 05: a Homemaid cleaner wiping a table in a Dubai apartment, with the line book by the hour, with or without cleaning materials",
          caption: "Homemaid: General Cleaning",
        },
        {
          file: "homemaid-03-deep-cleaning",
          alt: "Homemaid Deep Cleaning creative, service 02 of 05, listing kitchen and appliances, bathrooms, windows and glass, and corners, edges and build-up",
          caption: "Homemaid: Deep Cleaning",
        },
        {
          file: "homemaid-04-subscription",
          alt: "Homemaid cleaning subscription creative on neon green: save up to 40%, set your cleaning once and your home stays clean",
          caption: "Homemaid: subscription",
        },
        {
          file: "homemaid-05-furniture-cleaning",
          alt: "Homemaid Furniture Cleaning creative, service 03 of 05: a Homemaid technician cleaning a sofa, with the line sofas, recliners and headboards, cleaned in your home",
          caption: "Homemaid: Furniture Cleaning",
        },
        {
          file: "homemaid-06-handyman",
          alt: "Homemaid Handyman creative, service 04 of 05, listing shelves and hanging, lights and ceiling fans, taps and drains, and appliances: priced per job, parts agreed on site",
          caption: "Homemaid: Handyman",
        },
        {
          file: "homemaid-07-arabic",
          alt: "Homemaid Arabic creative on navy: book in under a minute, and see the full price before you confirm, in Arabic",
          caption: "Homemaid: Arabic",
        },
        {
          file: "homemaid-08-home-painting",
          alt: "Homemaid Home Painting creative, service 05 of 05: a Homemaid painter rolling a wall, with the line from one feature wall to a whole villa",
          caption: "Homemaid: Home Painting",
        },
        {
          file: "homemaid-09-areas",
          alt: "Homemaid areas creative: 10 areas across Dubai, listing Dubai Marina, JLT, Business Bay, Downtown, JVC, Palm Jumeirah, Dubai Hills Estate, Arabian Ranches, DAMAC Hills and Al Barsha",
          caption: "Homemaid: areas",
        },
      ],
    },
    depth: [
      {
        heading: "Booked and paid in under a minute",
        paragraphs: [
          "Booking a clean in Dubai often still means messages back and forth, a price that changes, and cash on the day. Homemaid's flow asks one question per screen and keeps the full total, VAT included, in view the whole way, so the price a customer sees on the first step is the price they confirm on the last.",
          "Every service page and every area page opens the same flow with what the visitor came for already chosen, so an ad for deep cleaning in Dubai Marina lands one tap from a booking rather than on a homepage.",
        ],
      },
      {
        heading: "A full Arabic site, not a translation on top",
        paragraphs: [
          "Arabic-speaking customers book, pay and receive every email in Arabic. The layout mirrors from right to left, Arabic text is set in its own typeface, and the language switches in place on any page.",
          "Search engines get separate Arabic titles and descriptions for each page, so the Arabic site can be found in its own right rather than as a copy of the English one.",
        ],
      },
      {
        heading: "Payments that protect both sides",
        paragraphs: [
          "For bookings in the next few days the amount is held on the customer's card and charged after the service, so people pay for work they have seen and the business knows the money is there before the team travels.",
          "If a card is declined, the booking is not lost: the customer gets a secure payment link by email, followed up up to three times, and the team sees it in the morning summary.",
        ],
      },
      {
        heading: "A business that runs itself overnight",
        paragraphs: [
          "Scheduled jobs close finished bookings and take payments at 2am, and at 7am the team gets one email with the day's jobs, anything waiting for confirmation and any payment problem. The admin panel holds bookings, customers, subscriptions, promo codes and the site's wording in both languages, so nothing runs on spreadsheets.",
          // Link added 2026-11-13 (daily keyword push): the most-searched
          // version of the main keyword, from the strongest UAE case study.
          "Every part of this, from the first screen to the campaigns, was planned and built by one person. I work as a [digital marketing freelancer in Dubai](/), so the client speaks to the person doing the work, with no agency layer in between.",
          "There are no performance figures on this page. The results belong to Homemaid, and none are published without their agreement.",
        ],
      },
    ],
    faqs: [
      {
        question: "What did Bilal Shafqat build for Homemaid?",
        answer:
          "Their platform from scratch: the UX and UI, a booking and payments system in English and Arabic, customer accounts and subscriptions, an admin panel, overnight automation for payments and team summaries, local SEO for ten Dubai areas, and the Google and Meta campaigns with nine creatives.",
      },
      {
        question: "How does a customer book a clean?",
        answer:
          "In one short flow: choose the service, the home size, hours and materials, the area and a time, then pay by card or Apple Pay. The total including VAT is shown throughout, and the area can be detected from the phone.",
      },
      {
        question: "Is the Homemaid website available in Arabic?",
        answer:
          "Yes. The whole site, including booking, payment, the account area and emails, is available in Arabic with a right-to-left layout and its own Arabic metadata for search engines.",
      },
      {
        question: "When is the customer charged?",
        answer:
          "For bookings in the next few days, the amount is held on the card and charged after the service. Bookings further ahead are charged at booking, and cancellation fees follow the published policy automatically.",
      },
      {
        question: "Is there a Homemaid mobile app?",
        answer:
          "It is upcoming. The platform's API was built to serve an iOS and Android app, so accounts, saved cards, bookings and subscriptions will carry over to it.",
      },
      {
        question: "Are there results or figures for this work?",
        answer:
          "Not on this page. The results belong to Homemaid and are not published without their agreement. The live website and the creatives are shown in full.",
      },
    ],
    ctaLead: "Need a booking platform and the campaigns to fill it?",
    // The Version 1 sections from the approved canvas (2026-11-12). Screens
    // captured from the live site after its mobile button fix went out.
    showcase: [
      {
        at: "opener",
        kind: "stats",
        items: [
          { value: "5", label: "bookable services, with 3 more on the way" },
          { value: "10", label: "Dubai areas, each with its own page" },
          { value: "2", label: "languages, with a full Arabic site built right to left" },
          { value: "2", label: "scheduled jobs that close the day and brief the team" },
        ],
      },
      {
        at: "scope",
        kind: "flow",
        eyebrow: "UX strategy",
        heading: "A booking flow built around how people actually book a clean",
        body: "One question per step, the total updating as you go, and nothing asked twice. The area is detected from the phone, and the full price including VAT shows before you confirm.",
        steps: ["Service", "Home size", "Hours and team", "Materials", "Area", "Date and time", "Pay by card or Apple Pay"],
        screens: [
          {
            src: "/portfolio/homemaid/screens/book-mobile.avif",
            width: 780,
            height: 1688,
            alt: "Step one of the Homemaid booking flow on a phone: Which service do you need, with each service as a card and the running total at the bottom",
            label: "Step 1: the service",
          },
          {
            src: "/portfolio/homemaid/screens/painting-mobile.avif",
            width: 780,
            height: 1688,
            alt: "The Homemaid home painting page on a phone: Home Painting in Dubai, with Book online and See Services and Prices stacked full width",
            label: "A service page",
          },
        ],
        notes: [
          {
            title: "Quick booker on the homepage",
            body: "Service, area and home size in one row, so a returning customer skips straight to the times.",
          },
          {
            title: "Painting chosen by picture",
            body: "Apartment, villa and single-room tabs, because people think of painting as a room they can see, not a line in a price list.",
          },
          {
            title: "A total that never hides",
            body: "The price including VAT stays on screen through every step, with one button to move on, under the thumb.",
          },
        ],
      },
      {
        at: "scope",
        kind: "screens",
        eyebrow: "UI design",
        heading: "A UI system on the client's navy and neon brand",
        body: "Service cards, the step indicator, the booking summary and the buttons, designed once and used across the site, the admin panel and the emails. Every button grows with its label, so nothing is squeezed on a small phone. The logo is the client's own.",
        desktop: {
          src: "/portfolio/homemaid/screens/area-desktop.avif",
          width: 1600,
          height: 1000,
          alt: "The Homemaid Dubai Marina area page on a desktop: home cleaning in Dubai Marina with the services available there",
          label: "Area page, Dubai Marina",
        },
        points: [
          { title: "Navy and neon", body: "Neon for buttons and highlights only, never text on white, so every label stays readable." },
          { title: "Outfit and Inter", body: "Outfit for headings, Inter for text and forms, sized for reading on a phone." },
          { title: "One component set", body: "The same cards, steps and buttons on the site, in the admin panel and in every email." },
          { title: "Built for thumbs", body: "Buttons at least 48px tall, stacked full width on phones, with the next step always in reach." },
        ],
      },
      {
        at: "scope",
        kind: "screens",
        eyebrow: "Arabic version",
        heading: "A full Arabic site, built right to left, not translated on top",
        body: "Every page, the booking flow, the account area and the emails exist in Arabic. The layout mirrors properly, Arabic is set in its own typeface, and search engines get Arabic titles and descriptions for every page.",
        desktop: {
          src: "/portfolio/homemaid/screens/ar-desktop.avif",
          width: 1600,
          height: 1000,
          alt: "The Arabic Homemaid homepage on a desktop, laid out right to left, with the booking buttons and the team photograph",
          label: "Arabic homepage",
        },
        phone: {
          src: "/portfolio/homemaid/screens/ar-mobile.avif",
          width: 780,
          height: 1688,
          alt: "The Arabic Homemaid homepage on a phone, right to left, with the two booking buttons stacked full width",
          label: "The same page on a phone",
        },
        points: [
          { title: "Mirrored layout", body: "Navigation, steps and arrows flip right to left." },
          { title: "Arabic booking", body: "The whole flow and payment in Arabic, start to finish." },
          { title: "One switch", body: "The language changes in place, on any page." },
          { title: "Arabic SEO", body: "Separate Arabic titles and descriptions for search engines." },
        ],
      },
      {
        at: "website",
        kind: "architecture",
        eyebrow: "Backend and payments",
        heading: "One system behind the website, the admin panel and the app",
        clients: ["Website, English and Arabic", "Admin panel", "Mobile app, upcoming"],
        hub: "REST API on Next.js",
        services: ["MongoDB", "Stripe, cards and Apple Pay", "Transactional email"],
        points: [
          { title: "Payments", body: "Cards saved securely, held for near bookings and charged after the service, with VAT on every receipt." },
          { title: "Cancellation rules", body: "Free up to 6 hours before, half the fee from 2 to 6 hours, the full fee under 2 hours, applied automatically." },
          { title: "Accounts", body: "Saved addresses and cards, booking history, promo codes and subscriptions at up to 40% off." },
          { title: "Admin", body: "Bookings, customers, subscriptions, closed dates and the site's wording in both languages." },
        ],
      },
      {
        at: "website",
        kind: "timeline",
        eyebrow: "Automation",
        heading: "The business runs itself between 2am and 7am",
        items: [
          { when: "On booking", title: "Emails out", body: "Booking received and confirmed for the customer, an alert to the team on cancellations." },
          { when: "02:00 Dubai", title: "The day closes", body: "Finished bookings are marked complete and due payments are taken." },
          { when: "If a card fails", title: "A payment link", body: "Sent by email and followed up up to three times, so the booking is not lost." },
          { when: "07:00 Dubai", title: "Morning summary", body: "One email with today's jobs, anything pending and any payment problem." },
          { when: "Every booking", title: "An activity log", body: "Every payment and email recorded, with a one-click resend." },
        ],
      },
      {
        at: "creative",
        kind: "upcoming",
        eyebrow: "Mobile app",
        heading: "Book again in two taps",
        body: "The iOS and Android app is next. It runs on the same API as the website, so accounts, saved cards, bookings and subscriptions carry over from day one.",
      },
    ],
    projects: [],
    keywords: [
      "booking platform Dubai",
      "home services website Dubai",
      "cleaning company website",
      "Arabic RTL website",
      "Stripe booking and payments",
      "marketing automation",
      "Google Ads and Meta ads",
      "Meta campaign creatives",
      "digital marketing case study Dubai",
      "Homemaid",
    ],
  },
  {
    // Published 2026-11-25, after the client agreed to be named with results.
    // Figures are Meta's campaign insights as of 25 Nov 2026, while the
    // campaign was still open (it closes 27 Nov). Applications are counted on
    // the client's own website and are not claimed here. Deliberately absent:
    // the vendor list and any vendor's name.
    slug: "the-scene-popup",
    name: "The Scene Popup",
    industry: "Events & Experiences",
    siteUrl: "https://www.thescenepopup.com",
    ogImage: "/portfolio/the-scene-popup/og-the-scene-popup.jpg",
    ogImageAlt:
      "The Desert in Bloom banner: The Scene 02, 29 to 31 January 2027, Marriott Hotel Al Forsan, Abu Dhabi, now accepting vendors",
    title: "The Scene Popup: WhatsApp Marketing Campaign in the UAE",
    description:
      "A bilingual WhatsApp campaign inviting 723 vendors to an Abu Dhabi pop-up event: 82% delivered, 46% read and 106 taps to apply, for AED 79.62.",
    headline: "One WhatsApp message to 723 vendors: 46% read it and 106 tapped through to apply",
    intro:
      "The Scene Popup runs pop-up markets in the UAE, and its second event, Desert in Bloom, takes place at the Marriott Hotel Al Forsan in Abu Dhabi from 29 to 31 January 2027. They needed vendors to apply for booths. I ran the WhatsApp campaign end to end: cleaning their list of vendor numbers, writing the Arabic and English message, designing the banner, getting the template approved by Meta, sending it from their verified business number and reporting the results.",
    facts: [
      { label: "Client", value: "The Scene Popup" },
      { label: "Sector", value: "Events and pop-up markets" },
      { label: "Market", value: "Abu Dhabi, UAE" },
      { label: "Channel", value: "WhatsApp Business Platform" },
      { label: "Languages", value: "Arabic and English" },
      { label: "Role", value: "WhatsApp campaign, end to end" },
    ],
    scopeIntro:
      "A vendor invite only works if it arrives, gets opened and makes applying one tap away. Every part of this campaign was built around those three steps, on the client's own verified number, so replies came straight back to their inbox.",
    scope: [
      {
        heading: "List preparation",
        body: "722 vendor numbers supplied in a spreadsheet, cleaned into one international format with duplicates and broken numbers removed, and uploaded as a custom audience. Nothing was bought or scraped: every number came from the client.",
      },
      {
        heading: "Bilingual message",
        body: "One message in Arabic and English, with the dates, venue, categories and booth prices in the first screen, a bold call to apply, and links that stay clickable. The English lines carry direction marks so they read left to right inside an Arabic message.",
      },
      {
        heading: "Banner design",
        body: "A Desert in Bloom banner in the event's look, sized for the WhatsApp message header, with the dates, venue and \"Now accepting vendors\" readable on a phone.",
      },
      {
        heading: "Template approval",
        body: "Submitted as a marketing template in WhatsApp Manager and approved by Meta, within the platform's limits on emojis and buttons.",
      },
      {
        heading: "Sending and budget",
        body: "Sent from The Scene Popup's verified business number through Meta Business Suite, with a budget cap of AED 170 and a maximum of AED 0.23 per message, over four days.",
      },
      {
        heading: "Replies and reporting",
        body: "Guidance for the client's team on reading and answering replies in the WhatsApp inbox, and a branded report with delivery, reads, clicks, replies and cost.",
      },
    ],
    services: ["whatsapp-marketing", "digital-marketing", "graphic-design-branding"],
    depth: [
      {
        heading: "Why WhatsApp for a vendor invite",
        paragraphs: [
          "The client already had the numbers of hundreds of small businesses who sell at markets like theirs, and those owners live on WhatsApp. An email would have sat unopened and a post would have reached followers, not vendors. A WhatsApp message from a verified business number lands in the same place their customers message them.",
          "It also brings the conversation back. Vendors who had a question replied to the message itself, and those replies arrived in the client's own inbox the same afternoon.",
        ],
      },
      {
        heading: "What the numbers say",
        paragraphs: [
          "By 25 November, 591 of the 723 numbers had received the invite. 271 opened it, 106 tapped \"Apply for a space\", 11 more tapped the website link in the text, and 34 wrote back. The spend was AED 79.62, which is AED 0.13 per message delivered and AED 0.77 per tap on the button.",
          "The button did ten times the work of the link in the text, which is the lesson for the next send: make the button the one thing to do. The weakest step was opening the message, so the next version leads with the price and the dates in the first two lines.",
          "These are Meta's figures while the campaign was still open. Completed applications are counted on the client's website, so this page does not claim a number of applications.",
        ],
      },
      {
        heading: "One person, from list to report",
        paragraphs: [
          "The list, the copy in two languages, the banner, the approval, the send and the report were all done by one person, in the client's own Meta account, so the number, the template and the audience stay theirs for the next event. I work as a [freelance digital marketer in Dubai](/freelance-digital-marketer-vs-agency-dubai), and this is the kind of fast, measurable campaign that model suits.",
        ],
      },
    ],
    faqs: [
      {
        question: "What did Bilal Shafqat do for The Scene Popup?",
        answer:
          "Ran their WhatsApp vendor invite for Desert in Bloom end to end: cleaned the list of 722 vendor numbers, wrote the Arabic and English message, designed the banner, got the template approved by Meta, sent it from their verified business number and reported the results.",
      },
      {
        question: "What were the results of the WhatsApp campaign?",
        answer:
          "By 25 November 2026, 591 of 723 numbers had received the message (82%), 271 read it (46%), 106 tapped Apply for a space (18%) and 34 replied, for AED 79.62.",
      },
      {
        question: "How much did the WhatsApp campaign cost to send?",
        answer:
          "AED 79.62 in Meta message fees by 25 November, against a cap of AED 170: AED 0.13 per message delivered and AED 0.77 per tap on the apply button. My fee for running the campaign is separate.",
      },
      {
        question: "Why was the message in Arabic and English?",
        answer:
          "The vendors are a mix of Arabic and English speakers across the UAE, so one message carried both, with the English lines marked to read left to right inside the Arabic layout.",
      },
      {
        question: "Did every number receive the message?",
        answer:
          "No. 132 did not, which is normal for a list collected over time: some numbers are not on WhatsApp, some people have turned off business marketing messages, WhatsApp limits how many marketing messages one person receives, and Meta held 6 numbers back for its own testing.",
      },
    ],
    ctaLead: "Need a WhatsApp campaign people actually open?",
    ctaService: "whatsapp-marketing",
    showcase: [
      {
        at: "opener",
        kind: "stats",
        items: [
          { value: "591", label: "vendors reached, 82% of the list" },
          { value: "46%", label: "read the message" },
          { value: "106", label: "taps on Apply for a space" },
          { value: "AED 79.62", label: "spent on messages, AED 0.77 per tap" },
        ],
      },
      {
        at: "scope",
        kind: "flow",
        eyebrow: "Campaign build",
        heading: "From a spreadsheet of numbers to a message in 723 inboxes",
        body: "Every step ran in the client's own Meta account, on their verified business number, so the audience and the template are theirs for the next event.",
        steps: ["Clean the list", "Write in Arabic and English", "Design the banner", "Meta approval", "Upload the audience", "Send with a budget cap", "Read the replies", "Report"],
        screens: [
          {
            src: "/portfolio/the-scene-popup/whatsapp-message.avif",
            // From Meta's template preview, with the one line that preview
            // repeated by mistake (the venue) shown once, as vendors received it.
            width: 608,
            height: 1532,
            alt: "The approved Desert in Bloom WhatsApp message: the banner, the invitation in Arabic and English, the dates, venue and hours, the categories, booths from AED 3,500 to 5,000, Apply now, the website, Instagram and WhatsApp links, and the Apply for a space button",
            label: "The approved message",
          },
        ],
        notes: [
          {
            title: "Key facts first",
            body: "Dates, venue, categories and booth prices high in the message, because WhatsApp folds long messages behind Read more.",
          },
          {
            title: "Two languages, one message",
            body: "Arabic and English together, with direction marks so each line reads the right way on every phone.",
          },
          {
            title: "One clear button",
            body: "Apply for a space opens the application page. It drew 106 taps against 11 for the link in the text.",
          },
        ],
      },
      {
        at: "scope",
        kind: "screens",
        eyebrow: "Results",
        heading: "Meta's own figures, as of 25 November 2026",
        body: "Screens from the campaign's insights in Meta Business Suite. Meta's dashboard shows one more delivered than sent; every figure is shown exactly as Meta reports it.",
        desktop: {
          src: "/portfolio/the-scene-popup/campaign-results.avif",
          width: 1128,
          height: 236,
          alt: "Meta campaign insights for Desert in Bloom: AED 79.62 spent, AED 0.13 per message delivered, AED 0.77 per button click, 590 sent, 591 delivered, 271 read and 34 unique replies",
          label: "Campaign insights",
        },
        points: [
          { title: "Delivered", body: "591 of 723 numbers, 82%." },
          { title: "Read", body: "271, 46% of those delivered." },
          { title: "Taps to apply", body: "106 on the button, 18% of those delivered, plus 11 on the website link." },
          { title: "Replies", body: "34 vendors wrote back on WhatsApp." },
        ],
      },
      {
        at: "scope",
        kind: "timeline",
        eyebrow: "Timeline",
        heading: "Approved one day, replies the next afternoon",
        items: [
          { when: "23 Nov", title: "Approved and set up", body: "Template approved by Meta, audience of 723 uploaded, budget and dates set." },
          { when: "24 Nov, 10:00", title: "Sent", body: "The invite starts going out from the client's verified number." },
          { when: "24 Nov, afternoon", title: "First replies", body: "Vendors, an events company and a content creator write back in the inbox." },
          { when: "25 Nov", title: "Results", body: "591 delivered, 271 read, 106 taps to apply, 34 replies, AED 79.62 spent." },
          { when: "27 Nov", title: "Campaign closes", body: "Open until 02:26 Dubai time." },
        ],
      },
    ],
    projects: [],
    keywords: [
      "WhatsApp marketing UAE",
      "WhatsApp campaign case study",
      "WhatsApp Business Platform",
      "bulk WhatsApp messages Dubai",
      "event marketing Abu Dhabi",
      "vendor recruitment campaign",
      "Arabic and English WhatsApp message",
      "The Scene Popup",
      "Desert in Bloom",
    ],
  },
];

/** The clients that are ready to be seen. Everything that lists, links to or
 *  enumerates case studies reads this rather than `clients`, so a draft cannot
 *  leak into the grid or the sitemap by somebody forgetting to filter. */
export function publishedClients(): Client[] {
  return clients.filter((c) => !c.draft);
}

/** Drafts are previewable with `next dev` only. In a production build they
 *  are neither generated nor served (audit batch 1, 2026-10-24): `noindex`
 *  kept them out of Google, but the four draft URLs still answered 200 to
 *  anyone who guessed them, with placeholder copy about employers whose
 *  permission is outstanding. */
export const SHOW_DRAFTS = process.env.NODE_ENV === "development";

/** The clients the case-study routes may render: every one under `next dev`,
 *  published ones only in a production build. */
export function routableClients(): Client[] {
  return SHOW_DRAFTS ? clients : publishedClients();
}

export function getClient(slug: string): Client | undefined {
  return clients.find((c) => c.slug === slug);
}

export function getProject(clientSlug: string, projectSlug: string) {
  const client = getClient(clientSlug);
  const project = client?.projects.find((p) => p.slug === projectSlug);
  return project && client ? { client, project } : undefined;
}

/** Every case-study URL lives in `caseStudyUrls.ts`, a small module the
 *  homepage can import without pulling this file into the browser bundle.
 *  Re-exported here so server code can keep importing it from either place. */
export { caseStudyUrls };

// The manifest and this data must agree. Computed from the data exactly as the
// sitemap used to be, and compared when this module loads, so a client
// published, a project added or a slug renamed here without updating
// `caseStudyUrls.ts` fails the build instead of shipping a stale sitemap.
{
  const fromData = publishedClients().flatMap((c) => [
    `/portfolio/${c.slug}`,
    ...(c.mobileApp ? [`/portfolio/${c.slug}/mobile-app`] : []),
    ...c.projects.map((p) => `/portfolio/${c.slug}/${p.slug}`),
  ]);
  const fromManifest = caseStudyUrls();
  if (fromData.join("\n") !== fromManifest.join("\n")) {
    throw new Error(
      `caseStudyUrls.ts is out of step with caseStudies.ts.\n` +
        `Data:     ${fromData.join(", ")}\nManifest: ${fromManifest.join(", ")}`,
    );
  }
}
