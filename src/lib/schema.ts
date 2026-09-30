/**
 * One source for every JSON-LD node on the site.
 *
 * Before this, `Person`, `Offer`, `Service` and `PostalAddress` were emitted
 * from the root layout on all 23 routes, and six page templates inlined their
 * own copies of Person and Organization. Nothing carried an `@id`, so search
 * engines saw a couple of dozen unlinked duplicates of the same entity rather
 * than one entity described from several angles.
 *
 * Everything here is keyed to a stable `@id`. Pages reference nodes by `@id`
 * instead of restating them, which is what turns the separate blocks into a
 * single connected graph.
 *
 * Two rules this file exists to enforce:
 *
 *   Never emit `Review`, `AggregateRating` or `ratingValue`. There are no
 *   verified reviews, and fabricated review markup is a manual-action risk.
 *
 *   Never emit a figure, date, award or credential that is not visible on the
 *   page. `priceRange` is the live example — see `businessNode`.
 */

export const SITE_URL = "https://bilalshafqat.com";

/** Stable node identities. Referenced with `ref()` rather than repeated. */
export const ID = {
  person: `${SITE_URL}/#person`,
  business: `${SITE_URL}/#business`,
  website: `${SITE_URL}/#website`,
} as const;

/** A pointer to a node defined elsewhere in the graph.
 *
 *  Carries `@type` as well as `@id`. A bare `{"@id": ...}` is valid and Google
 *  consolidates on it, but on a page where the target node is not also defined
 *  the reference has no type, and validators flag it as an untyped node. Naming
 *  the type costs one field and removes the warning without restating the
 *  entity — the point of the @id was never to avoid saying what it is. */
export const ref = (id: string, type: "Person" | "ProfessionalService" | "WebSite") => ({
  "@id": id,
  "@type": type,
});

/** Real profiles, supplied by Bilal. Nothing here is inferred from a username
 *  pattern — an unverified `sameAs` pointing at someone else's account is worse
 *  than omitting it. */
const SAME_AS = [
  "https://www.linkedin.com/in/bilalshafqat42",
  "https://www.behance.net/bilalshafqat",
  "https://dribbble.com/bilalshafqat",
  "https://www.instagram.com/imbilalshafqat/",
  "https://www.facebook.com/imBilalshafqat",
  "https://x.com/bilalshafqat42",
  // @bilal-4d, not @bilalshafqat42. The old handle in this list was a **404**:
  // the Person node told Google "this is my channel" and pointed at a dead
  // page, on the entity signal the site most needs (roadmap 276). Confirmed by
  // Bilal from the channel's own About panel, which names him and links back
  // here — not guessed from the username pattern, which is exactly how the
  // wrong one got in.
  "https://www.youtube.com/@bilal-4d",
  "https://www.tiktok.com/@imbilalshafqat",
  "https://www.pinterest.com/bilalshafqat42/",
];

const KNOWS_ABOUT = [
  "Paid Marketing & Lead Generation",
  "Website & App Development",
  "Design, Content & Conversion Optimization",
  "CRM & Marketing Automation",
  "Google Ads & Performance Max",
  "Meta, LinkedIn & TikTok Advertising",
  "HubSpot, Zoho & Salesforce CRM Setup",
  "Conversion Rate Optimization (CRO)",
];

const ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: "Dubai",
  addressCountry: "AE",
} as const;

export function personNode() {
  return {
    "@type": "Person",
    "@id": ID.person,
    name: "Bilal Shafqat",
    jobTitle: "Digital Marketing, Design & Development Specialist",
    description:
      "Freelance digital marketing, design and development specialist in Dubai, working across paid marketing, web and app development, design and CRM automation as a single point of contact.",
    url: SITE_URL,
    image: `${SITE_URL}/images/bilal-shafqat-coat.avif`,
    email: "bilalshafqat42@gmail.com",
    address: ADDRESS,
    sameAs: SAME_AS,
    knowsAbout: KNOWS_ABOUT,
    worksFor: ref(ID.business, "ProfessionalService"),
  };
}

export function businessNode() {
  return {
    "@type": "ProfessionalService",
    "@id": ID.business,
    name: "Bilal Shafqat",
    url: SITE_URL,
    image: `${SITE_URL}/images/bilal-shafqat-coat.avif`,
    email: "bilalshafqat42@gmail.com",
    address: ADDRESS,
    // AE and GB only. These are the two markets with delivered work behind
    // them; the roadmap's US and Canada ambition has no shipped project yet,
    // and areaServed is a claim, not a wish.
    areaServed: [
      { "@type": "Country", name: "AE" },
      { "@type": "Country", name: "GB" },
    ],
    founder: ref(ID.person, "Person"),
    knowsAbout: KNOWS_ABOUT,
    // Added 2026-09-05, when /pricing began showing figures. The condition for
    // this property was always that the page actually publishes numbers, and it
    // now publishes three: advisory from 3,500, a retainer from 16,000 a month,
    // project work from 31,500.
    //
    // The range spans only those three. It deliberately excludes the eight
    // per-service build prices, which are still unpublished because they are
    // priced by hours *required* rather than hours included — a guess until two
    // jobs have been timed. Widening this to cover them would put a number in
    // the markup that appears nowhere on the site.
    priceRange: "AED 3500 - 31500",
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE_URL,
    name: "Bilal Shafqat",
    publisher: ref(ID.business, "ProfessionalService"),
    inLanguage: "en",
  };
}

/** A single service category. Every field comes from the page's own copy —
 *  nothing is generated. */
export function serviceNode(opts: {
  name: string;
  description: string;
  serviceType: string;
  url: string;
}) {
  return {
    "@type": "Service",
    "@id": `${opts.url}#service`,
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    provider: ref(ID.business, "ProfessionalService"),
    areaServed: [
      { "@type": "Country", name: "AE" },
      { "@type": "Country", name: "GB" },
    ],
  };
}

/** Only ever called with the questions and answers the page actually renders.
 *  A `FAQPage` describing text a visitor cannot see is exactly the kind of
 *  mismatch that earns a manual action. */
export function faqNode(url: string, qa: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: qa.map((x) => ({
      "@type": "Question",
      name: x.question,
      acceptedAnswer: { "@type": "Answer", text: x.answer },
    })),
  };
}

/** A recovered WordPress article (roadmap 275).
 *
 *  `datePublished` is the original byline date and `dateModified` the day the
 *  post was brought back, which are genuinely different events — claiming the
 *  piece was written this year would misdate a year-old article to both readers
 *  and crawlers.
 *
 *  No `image`: the article artwork did not survive the migration, and pointing
 *  `image` at the site-wide OG card would describe a picture the article does
 *  not contain. Google treats it as optional for `Article`; a wrong value is
 *  worse than a missing one.
 */
export function articleNode(opts: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  keywords: string[];
  wordCount: number;
}) {
  return {
    "@type": "Article",
    "@id": `${opts.url}#article`,
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    keywords: opts.keywords,
    wordCount: opts.wordCount,
    inLanguage: "en",
    author: ref(ID.person, "Person"),
    publisher: ref(ID.business, "ProfessionalService"),
    isPartOf: ref(ID.website, "WebSite"),
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
  };
}

export function breadcrumbNode(url: string, trail: { name: string; item: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: t.item,
    })),
  };
}

/** Wraps nodes in a single `@graph`, which is what lets one block describe
 *  several linked entities instead of several blocks each describing one. */
export function graph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
