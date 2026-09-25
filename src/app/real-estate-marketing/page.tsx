import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import CtaButton from "@/components/CtaButton";
import FaqSection from "@/components/FaqSection";
import Contact from "@/components/Contact";
import { clients } from "@/data/caseStudies";
import { SITE_URL, breadcrumbNode, faqNode, graph, ref, ID } from "@/lib/schema";

/**
 * The off-plan property vertical page.
 *
 * A standalone route rather than a ninth entry in `megaMenuGroups`, for two
 * reasons. Every other service page is a *discipline* — paid marketing, UI/UX,
 * development — and this is an *industry*, so it cuts across several of them.
 * And a category's `items` must each match a section title on its pillar page
 * by exact string, which a vertical has no sensible way to satisfy.
 *
 * `/real-estate-marketing`, not `/services/real-estate-marketing`: this is the
 * URL the roadmap specified for it (Phase 3, item 10), and the shorter path is
 * the better target for the phrase.
 *
 * Every specific on this page is lifted from work already published in
 * `caseStudies.ts` — the price qualifier in the hero, the callback form with a
 * UAE-formatted phone field, the brochure as a second lower-commitment entry
 * point, the separate route for existing buyers, the five-slide carousel
 * ordering, the light editorial template. Nothing here is a general claim about
 * property marketing; it is all a description of four launches that shipped.
 *
 * **No campaign results appear on this page.** Lead counts, cost per lead and
 * conversion figures for Hadley Heights are still outstanding from Bilal and
 * need LEOS's permission to publish. The page argues from decisions and shipped
 * work, which is what there is honest evidence for.
 */

const leos = clients.find((c) => c.slug === "leos-developments");
const launches = leos?.projects ?? [];

export const metadata: Metadata = {
  // 58 characters. The earlier version ran to 63 and Google would have cut it.
  title: "Off-Plan Real Estate Marketing, Dubai & UK — Bilal Shafqat",
  description:
    "Off-plan launch marketing for property developers in Dubai and the UK: landing pages, campaign creative and lead capture built as one system by one person.",
  alternates: { canonical: "/real-estate-marketing" },
};

/** What a launch is actually made of. Each item is something delivered across
 *  the four published launches, not a service list written from scratch. */
const parts = [
  {
    title: "The launch page",
    body:
      "A page for the development itself, separate from the developer's corporate site, with one conversion goal rather than a menu of them. It carries the renders at full quality without the load time that usually comes with them.",
  },
  {
    title: "Campaign creative",
    body:
      "Carousels and single-image sets built as a run rather than as individual posts, so a feed reads as one launch. Built on a template distinct from the parent brand system, so each development reads as its own product without leaving the identity behind.",
  },
  {
    title: "Lead capture and routing",
    body:
      "A callback form with a UAE-formatted phone field, a brochure download as a lower-commitment second route, and forms structured so the enquiry arrives somewhere a broker can act on rather than in an inbox.",
  },
  {
    title: "The campaign behind it",
    body:
      "Paid social pointed at the page, with the creative and the page written together. When the same person owns both, the page can be allowed to lose clicks on purpose in exchange for better leads — a trade nobody makes when the two sides are bought separately.",
  },
];

/** The decisions worth arguing about. Every one is described on a live case
 *  study; this page states the reasoning and links to where it shipped. */
const decisions = [
  {
    n: "01",
    title: "Put the price where it filters",
    body:
      "The entry price sits in the hero — from AED 1 million on Hadley Heights, from AED 600K on Weybridge Gardens 2 — so someone outside the bracket leaves before filling in a form. It costs clicks and it looks worse on a traffic report. It produces a better cost per qualified lead, which is the number that matters.",
    href: "/portfolio/leos-developments/hadley-heights",
    label: "See it on Hadley Heights",
  },
  {
    n: "02",
    title: "One action, and one route for everyone else",
    body:
      "A single primary call to action, short enough to finish on a phone. Qualification happens on the call rather than in the form, because every extra field costs completions. Existing buyers get their own route — Check Construction Progress — so they stop arriving in the new-enquiry list and distorting it.",
    href: "/portfolio/leos-developments/weybridge-gardens-2",
    label: "See it on Weybridge Gardens 2",
  },
  {
    n: "03",
    title: "Lead with what the buyer is actually choosing on",
    body:
      "At the studio and one-bedroom end the differentiator is character, not price, so the copy leads with the design language. On a larger unit it leads with location and scale. The same template with the same copy across a portfolio is how launches start looking interchangeable.",
    href: "/portfolio/leos-developments/cavendish-square",
    label: "See it on Cavendish Square",
  },
  {
    n: "04",
    title: "Front-load the visual, hold the detail",
    body:
      "A five-slide carousel opens on the render and keeps location, scale, unit sizes and interiors for later slides. A scroller gets the hook; someone genuinely interested gets the specification. Ordering it the other way loses both.",
    href: "/portfolio/leos-developments",
    label: "See the full engagement",
  },
];

/**
 * Questions specific to this vertical.
 *
 * Deliberately not the six on the Hadley Heights page — cost, whether the ads
 * come with the page, what makes a launch page convert, working to existing
 * brand guidelines, published results, and developers outside Dubai are all
 * answered there. Repeating them would put the same answer on two indexable
 * pages competing with each other.
 *
 * Each answer below restates something already published: the separate
 * editorial template and the parent brand system, the Check Construction
 * Progress route, the client record's own markets and scope, and the four
 * launches in `caseStudies.ts`.
 */
const faqs = [
  {
    question: "Why does each launch need its own page instead of a section on the corporate site?",
    answer:
      "Because they are answering different questions. A corporate site has to carry the developer's whole story and every development at once. A launch page has one job — turn campaign traffic into a contactable buyer for one building — and the moment it also has to serve navigation, the other developments and an About section, it stops doing that job well.",
  },
  {
    question: "What happens to people who have already bought?",
    answer:
      "They get their own route off the page. On Weybridge Gardens 2 that is Check Construction Progress, sitting separately from the primary action. Existing owners will come to a launch page looking for updates whether you plan for it or not, and without somewhere to go they end up in the new-enquiry list, where they make the campaign look better than it is and waste a broker's morning.",
  },
  {
    question: "How many launches have you actually run?",
    answer:
      "Four, for one developer, over about two years: Hadley Heights, Cavendish Square, Weybridge Gardens and Weybridge Gardens 2. Alongside those, the corporate website, the mobile app and the brand social work for the same client. Every one is published on this site with the decisions behind it, rather than described in a list.",
  },
  {
    question: "Do you work on UK developments as well as Dubai ones?",
    answer:
      "Yes. LEOS Developments is headquartered in Weybridge, Surrey with offices in London and an experience centre in Dubai, so the work already ran across both markets. The buyer for a Dubai off-plan unit is frequently not in Dubai, which is a large part of why the campaign and the page have to be built together.",
  },
];

const pageUrl = `${SITE_URL}/real-estate-marketing`;

const schema = graph([
  {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Real estate marketing for off-plan property launches",
    description:
      "Landing pages, campaign creative and lead capture for off-plan residential launches, built as one system.",
    serviceType: "Real estate marketing",
    provider: ref(ID.business, "ProfessionalService"),
    areaServed: [
      { "@type": "Country", name: "AE" },
      { "@type": "Country", name: "GB" },
    ],
  },
  breadcrumbNode(pageUrl, [
    { name: "Home", item: SITE_URL },
    { name: "Real estate marketing", item: pageUrl },
  ]),
  faqNode(pageUrl, faqs),
]);

export default function RealEstateMarketingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="site-container relative">
            <Reveal>
              <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                Off-plan property
              </span>
              <h1 className="t-h1 mt-4 text-ink">
                Real estate marketing for{" "}
                <span className="text-gradient">off-plan launches</span>
              </h1>
              <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted">
                Four launches for one developer across Dubai and the UK: the page, the
                campaign creative and the lead capture built together by one person,
                because a launch page and the spend pointed at it optimise against each
                other when they are bought separately.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CtaButton href="/appointment">Book a free consultation</CtaButton>
                <Link
                  href="/portfolio/leos-developments"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
                >
                  See the work <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="site-container pt-20 sm:pt-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
              The parts
            </span>
            <h2 className="t-h2 mt-4 text-ink">
              What an off-plan launch actually needs
            </h2>
            <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-muted">
              Usually bought as four separate things from four separate suppliers, which
              is where most of the leakage happens.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {parts.map((p) => (
              <Reveal key={p.title}>
                <div className="h-full rounded-2xl border border-border panel p-6 sm:p-7">
                  <h3 className="t-h5 text-ink">{p.title}</h3>
                  <p className="mt-2.5 text-base leading-relaxed text-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="site-container pt-20 sm:pt-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
              What decides it
            </span>
            <h2 className="t-h2 mt-4 text-ink">
              Four decisions that separate a launch page from a brochure
            </h2>
          </Reveal>
          <div className="mt-12 space-y-12">
            {decisions.map((d) => (
              <Reveal key={d.n}>
                <article className="grid grid-cols-1 gap-x-10 gap-y-4 border-t border-border pt-8 lg:grid-cols-[auto_minmax(0,1fr)]">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] tabular-nums text-gold lg:w-16">
                    {d.n}
                  </span>
                  <div>
                    <h3 className="t-h4 text-ink">
                      {d.title}
                    </h3>
                    <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-muted">
                      {d.body}
                    </p>
                    <Link
                      href={d.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
                    >
                      {d.label} <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {launches.length ? (
          <section className="site-container pt-20 sm:pt-24">
            <Reveal>
              <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                The launches
              </span>
              <h2 className="t-h2 mt-4 text-ink">
                Every one of them, written up
              </h2>
              <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-muted">
                Each opens into the brief, the decisions behind the page and what
                shipped.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {launches.map((p) => (
                <Reveal key={p.slug}>
                  <Link
                    href={`/portfolio/leos-developments/${p.slug}`}
                    className="card-hover group flex h-full flex-col rounded-2xl border border-border panel p-6"
                  >
                    <span className="text-lg font-semibold text-ink">{p.name}</span>
                    <span className="mt-2 block max-w-[54ch] text-sm leading-relaxed text-muted">
                      {p.summary}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                      Read the case study
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        <FaqSection
          eyebrow="Common questions"
          title="About launch work"
          faqs={faqs}
          className="pt-20 sm:pt-24"
        />

        <Contact />
      </main>
    </>
  );
}
