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
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SITE_URL, breadcrumbNode, graph, ref, ID } from "@/lib/schema";
import { disciplinesWithPages } from "@/data/disciplines";

export const metadata: Metadata = {
  title: "Portfolio — Off-Plan Launches & App Work | Bilal Shafqat",
  // The old description said "browse by discipline", which described the page
  // this one replaced — the discipline browser is now a footnote below the work,
  // not the page's purpose.
  description:
    "Four off-plan property launches, a corporate website and a cross-platform app for one Dubai and UK developer. Each opens into the decisions behind it.",
  alternates: {
    canonical: "/portfolio",
  },
};


/**
 * `LogoWall` was removed from this page on 2026-09-17. Its headline reads
 * "Trusted Across UK & UAE Real Estate" and there is one client behind it, so a
 * plural claim sat above a single logo — which draws attention to the gap rather
 * than covering it. None of the seven portfolio pages reviewed that day shows a
 * logo wall with one logo. The component is untouched and goes back the moment
 * there is a third client.
 *
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
        {/* Argument-first, per the journey comparison. The old H1 was "Case
            studies across marketing, design & development" — a category label
            any agency could write. Six of the seven reference sites read on
            2026-09-17 open with exactly that kind of label; the two that do not
            are the two worth copying.

            The keyword is still here. A claim and a search term are not in
            conflict: "off-plan launches", "Dubai" and "campaign" all survive. */}
        <section className="site-container pb-10">
          <Reveal>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
              Selected work
            </span>
            <h1 className="mt-4 max-w-[20ch] text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
              Four off-plan launches where{" "}
              <span className="text-gradient">one person owned the page and the spend</span>
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted">
              Plus a corporate website and a cross-platform app for the same Dubai and
              UK developer. Every project below opens into the brief, the decisions
              behind it and what shipped.
            </p>
          </Reveal>
        </section>

        {/* The GEO block. AI answers quote specific, checkable reasoning — this
            is the most quotable paragraph on the page, and it is lifted from the
            Hadley Heights case study rather than written for the index. */}
        <section className="site-container pb-14">
          <Reveal>
            <div className="max-w-[68ch] border-l-2 border-gold/60 pl-6">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                One decision, as an example
              </p>
              <p className="mt-3 text-lg leading-relaxed text-ink">
                The entry price sits in the hero — from AED 1 million on Hadley
                Heights — so someone outside the bracket leaves before filling in a
                form.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted">
                It costs clicks, and it looks worse on a traffic report. It produces a
                better cost per qualified lead, which is the number that matters. That
                is only a trade worth making when the same person owns the page and the
                spend pointed at it.
              </p>
            </div>
          </Reveal>
        </section>

        {/* One grid of real case studies, replacing two sections that both
            claimed to be the portfolio: `WorkByType`, 26 loose captures sliced
            by artefact type, and `CaseStudies`, five hard-coded entries with no
            images and no links to any of the six case studies that exist. */}
        <CaseStudyGrid />

        {/* Browse by discipline, moved below the work on 2026-09-17.
            Above it, it competed with the grid's own filters and asked a visitor
            to choose a route before anything had given them a reason to care.

            It used to be described as the hub the Portfolio mega menu pointed
            into; that menu was removed with the nav trim, so this and the footer
            are now the routes to the discipline pages. It still holds all nine
            disciplines with the same honest routing — the four without a case
            study link to their service page rather than to a URL that does not
            exist. Counts are derived, never written. */}
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

        <Contact />
      </main>
      <Footer />
    </>
  );
}
