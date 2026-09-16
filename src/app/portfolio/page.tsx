import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import {
  disciplineGroups,
  disciplineHref,
  disciplineCount,
  hasPortfolioPage,
} from "@/data/disciplines";
import Nav from "@/components/Nav";
import CaseStudyGrid from "@/components/CaseStudyGrid";
import LogoWall from "@/components/LogoWall";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SITE_URL, breadcrumbNode, graph, ref, ID } from "@/lib/schema";
import { disciplinesWithPages } from "@/data/disciplines";

export const metadata: Metadata = {
  title: "Portfolio — Web, App, UI/UX & Social Work | Bilal Shafqat",
  description:
    "Browse by discipline: web design and development, UI/UX, React Native apps and social media creative, with full case studies.",
  alternates: {
    canonical: "/portfolio",
  },
};


/**
 * Structured data. This page had none until 2026-09-16, which meant Google had
 * no typed description of it at all.
 */
const pageUrl = `${SITE_URL}/portfolio`;

const schema = graph([
  {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#page`,
    url: pageUrl,
    name: "Portfolio",
    description:
      "Work browsable by discipline and by client: websites, launch pages, React Native apps and social campaign creative.",
    inLanguage: "en",
    isPartOf: ref(ID.website, "WebSite"),
    about: ref(ID.business, "ProfessionalService"),
    author: ref(ID.person, "Person"),
    // Only the disciplines that actually have a page. A discipline routed to a
    // service page has no portfolio URL to list, and listing one that 404s is
    // worse than listing nothing.
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: disciplinesWithPages().length,
      itemListElement: disciplinesWithPages().map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: d.title,
        url: `${SITE_URL}/portfolio/${d.slug}`,
      })),
    },
  },
  breadcrumbNode(pageUrl, [
    { name: "Home", item: SITE_URL },
    { name: "Portfolio", item: pageUrl },
  ]),
]);

export default function PortfolioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Nav />
      <main className="flex-1 pt-28">
        {/* A real hero with the page's h1 in it. Until 2026-09-16 this page had
            no hero at all: it opened on a featured-work link card, and its only
            h1 sat halfway down inside the old `CaseStudies` section. Removing
            that section took the h1 with it, which is exactly the failure
            `SectionHeading`'s own comment warns about. */}
        <section className="site-container pb-12">
          <Reveal>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
              Portfolio
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
              Case studies across{" "}
              <span className="text-gradient">marketing, design &amp; development</span>
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted">
              Real projects, each one opening into the brief behind it, the decisions
              that shaped it and what actually shipped.
            </p>
          </Reveal>
        </section>

        <section className="site-container">
          <Link
            href="/portfolio/leos-developments"
            className="card-hover group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border panel px-7 py-6"
          >
            <span>
              <span className="text-xs font-medium uppercase tracking-wide text-gold">
                Featured case study
              </span>
              <span className="mt-1.5 block text-xl font-semibold text-ink">
                LEOS Developments — website, brand social &amp; the Hadley Heights launch
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
              View case study →
            </span>
          </Link>
        </section>
        {/* Browse by discipline. This is the hub the Portfolio mega menu points
            into, so it has to hold the same nine disciplines and the same
            honest routing — the four without a case study link to their service
            page rather than to a URL that does not exist. Counts are derived,
            never written. */}
        <section className="site-container pt-16 sm:pt-20">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
              <div>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                  Browse by discipline
                </span>
                <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
                  Start with what you need built
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted/75 sm:text-right">
                Counts are the pieces actually shown on each page. A discipline
                marked <span className="text-muted">Service</span> has no case
                study published yet.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
              {disciplineGroups.map((group) => (
                <div key={group.name}>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted/60">
                    {group.name}
                  </span>
                  <ul className="mt-4 space-y-3">
                    {group.disciplines.map((d) => {
                      const count = disciplineCount(d);
                      const live = hasPortfolioPage(d) || Boolean(d.aliasHref);
                      return (
                        <li key={d.slug}>
                          <Link
                            href={disciplineHref(d)}
                            className="card-hover group flex items-start justify-between gap-4 rounded-2xl border border-border panel px-5 py-4"
                          >
                            <span>
                              <span className="block text-sm font-semibold text-ink transition-colors group-hover:text-gold">
                                {d.title}
                              </span>
                              <span className="mt-1 block text-xs leading-relaxed text-muted">
                                {d.blurb}
                              </span>
                            </span>
                            <span className="mt-0.5 flex shrink-0 items-center gap-2">
                              {live && count > 0 ? (
                                <span className="rounded-full border border-gold/25 bg-gold/[0.07] px-2 py-0.5 font-mono text-[0.6rem] text-gold/90">
                                  {count}
                                </span>
                              ) : (
                                <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted/45">
                                  Service
                                </span>
                              )}
                              <ArrowRight
                                size={15}
                                className="text-muted transition-colors group-hover:text-gold"
                              />
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Moved here from the homepage: this is the page the trust claim
            belongs on, and it now introduces the case studies rather than
            repeating the homepage. */}
        <LogoWall />

        {/* One grid of real case studies, replacing two sections that both
            claimed to be the portfolio: `WorkByType`, 26 loose captures sliced
            by artefact type, and `CaseStudies`, five hard-coded entries with no
            images and no links to any of the six case studies that exist. */}
        <CaseStudyGrid />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
