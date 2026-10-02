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

/**
 * `JSON.stringify` for a `<script type="application/ld+json">` body.
 *
 * The HTML parser ends a `<script>` at the first `</script`, whether or not it
 * sits inside a JSON string. Escaping `<` as its `\u003c` form is the same
 * character to a JSON parser and invisible to the HTML one, which closes that
 * off for good.
 *
 * Lives here rather than in `JsonLd.tsx` because `JsonLd` is not the only
 * caller: twelve page templates render their own `<script>` tag with their own
 * `JSON.stringify`, so hardening only the component would have left most of the
 * site's structured data unescaped while looking fixed.
 *
 * The risk is not theoretical in the way it first appears. The note this
 * replaced said the graph is built from typed objects and never from user
 * input — true of the code, not quite true of the data. `blogPosts.json` is a
 * scrape of a WordPress site and two recovered articles carry the literal
 * `</script>` in their body. Nothing puts an article body into the graph today,
 * so nothing was broken; but "safe because of which fields we happen to pass"
 * is a property one refactor removes, silently.
 *
 * Deliberately only `<`. The escape usually bundled with this one covers U+2028
 * and U+2029, which are valid in JSON and illegal in JavaScript source and so
 * break a consumer that evaluates rather than parses. JSON-LD consumers parse,
 * and there is not one of either character anywhere in the site's data —
 * checked, not assumed. A guard against nothing, written in escape sequences
 * that are easy to get wrong, is worse than no guard.
 */
export const jsonLdSafe = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

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
  // @bilalshafqat42, as of 2026-10-01 — and this line has now been wrong in both
  // directions, which is the reason the `/channel/UC…` URL below exists:
  //
  //   until 2026-10-01  @bilalshafqat42  a 404, inferred from the LinkedIn and X
  //                                      handles and never opened
  //   2026-10-01        @bilal-4d        the real channel at the time
  //   2026-10-01        @bilalshafqat42  Bilal renamed the channel, so the handle
  //                                      he wanted is now genuinely his
  //
  // Confirmed against the channel ID, not the handle: both forms resolve today
  // and both canonicalise to UCqvEvXi8KbZ4OLp-osVtOMw with its 64 subscribers,
  // which proves he renamed the 58-video channel rather than moving to the empty
  // one. `@bilal-4d` answers for 14 more days under YouTube's previous-handle
  // hold and then stops, so it is not a safe link to keep.
  //
  // The original note on this line, kept because the lesson still holds:
  // the Person node told Google "this is my channel" and pointed at a dead
  // page, on the entity signal the site most needs (roadmap 276). Confirmed by
  // Bilal from the channel's own About panel, which names him and links back
  // here — not guessed from the username pattern, which is exactly how the
  // wrong one got in.
  // Both YouTube URLs, deliberately.
  //
  // The `/channel/UC...` form is the permanent identifier: it is minted when
  // the channel is created and never changes, whatever the handle does. The
  // `@handle` form is the one a human recognises and the one that breaks.
  //
  // Bilal is planning to move the handle to `@bilalshafqat` (roadmap 296). When
  // he does, the line below goes stale and the line above still resolves, so
  // the Person entity keeps a working link to the channel through the rename
  // rather than pointing at a 404 again — which is exactly what happened in
  // roadmap 289. Verified live on 2026-10-01; channel ID read from his own
  // YouTube Studio screen, not derived from anything.
  "https://www.youtube.com/channel/UCqvEvXi8KbZ4OLp-osVtOMw",
  "https://www.youtube.com/@bilalshafqat42",
  "https://www.tiktok.com/@imbilalshafqat",
  "https://www.pinterest.com/bilalshafqat42/",
];

/** What the Person and the business are described as knowing.
 *
 *  Expanded 2026-10-01. Bilal has no UAE trade licence, so a verified Google
 *  Business Profile with a confirmed address is not available to him. That
 *  removes the local pack, which is the usual route to ranking for anything
 *  with "Dubai" in it, and it means the entity signal has to come from this
 *  site instead: a well-described Person, consistently linked to real profiles,
 *  is the version of this that does not require a licence.
 *
 *  Every entry must correspond to work the site actually shows. This list is a
 *  claim about competence, and the same rule governs it as governs `priceRange`
 *  and `areaServed`: it describes what is delivered, not what is wanted. Each
 *  line below maps to a service page or to shipped work in the portfolio. */
const KNOWS_ABOUT = [
  // The four pillars, as the services pages name them.
  "Paid Marketing & Lead Generation",
  "Website & App Development",
  "Design, Content & Conversion Optimization",
  "CRM & Marketing Automation",
  // Platforms, named specifically. "Digital marketing" as a bare term says
  // nothing a search engine can use; the platform names are what a brief
  // actually contains.
  "Google Ads & Performance Max",
  "Meta, LinkedIn & TikTok Advertising",
  "Snapchat Advertising",
  "HubSpot, Zoho & Salesforce CRM Setup",
  "Conversion Rate Optimization (CRO)",
  // Disciplines with their own service pages.
  "Search Engine Optimisation",
  "Email Marketing & Automation",
  "Social Media Marketing",
  "UI/UX & Product Design",
  "Graphic Design & Branding",
  "Server-Side Tracking & Conversions API",
  // Build stack, from the /about page's stated stack.
  "React & Next.js Development",
  "React Native Mobile App Development",
  "WordPress Development",
  // Sectors with delivered work behind them, which is what makes them
  // legitimate here rather than aspirational.
  "Real Estate & Property Marketing",
  "E-commerce Marketing",
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
    // `hasOccupation` states the role and where it is performed, which
    // `jobTitle` alone does not. Without a verified Business Profile this is
    // the only structured statement on the site that ties the person to Dubai
    // as a place of work rather than merely as a postal address.
    //
    // No `estimatedSalary`, no `experienceRequirements` and no date range: all
    // three would be figures not visible on any page, which this file forbids.
    hasOccupation: {
      "@type": "Occupation",
      name: "Freelance Digital Marketer, Designer & Developer",
      occupationLocation: { "@type": "City", name: "Dubai" },
      skills: KNOWS_ABOUT.join(", "),
    },
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
