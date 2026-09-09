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
import CaseStudies from "@/components/CaseStudies";
import WorkByType from "@/components/WorkByType";
import LogoWall from "@/components/LogoWall";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Portfolio — Web, App, UI/UX & Social Media Work | Bilal Shafqat",
  description:
    "Browse the portfolio by discipline: web design and development, UI/UX, React Native mobile apps, and social media creative for Dubai property developers, with full case studies.",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-28">
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

        <WorkByType />

        <CaseStudies />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
