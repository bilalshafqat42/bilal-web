import Link from "next/link";
import type { Metadata } from "next";
import { pillars } from "@/data/pillars";
import CtaButton from "@/components/CtaButton";
import SecondaryButton from "@/components/SecondaryButton";
import Eyebrow from "@/components/Eyebrow";

export const metadata: Metadata = {
  title: "Page not found — Bilal Shafqat",
  // Keep 404s out of the index; the status code already says so, but this
  // removes any ambiguity for crawlers that soft-index error pages.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <section className="page-opener relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="site-container relative">
            <Eyebrow>404</Eyebrow>
            <h1 className="t-h1 mt-5 text-ink">
              That page isn&apos;t here any more
            </h1>
            {/* Most traffic here still arrives from search results for the old
                WordPress blog, so say what happened rather than pretend the link
                was simply mistyped.
                
                Rewritten 2026-09-30: this used to read "those articles have been
                retired", which was true for a month and is now false — all 52
                are back at their original URLs (roadmap 282). A 404 telling
                someone the thing they searched for no longer exists, on a site
                where it does, sends them straight back to the results page. */}
            <p className="mt-6 text-lg text-muted leading-relaxed">
              The articles that used to live here are back, but this particular
              address isn&apos;t one of them. If you arrived from a search result,
              the writing is all still on the site.
            </p>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              If you&apos;re here about a project, everything you need is below.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <CtaButton href="/appointment">Start a conversation</CtaButton>
              {/* The likeliest thing a visitor landing on a dead blog URL
                  actually wants, so it sits beside the commercial CTA rather
                  than in the footer. */}
              <SecondaryButton href="/blog">Read the articles</SecondaryButton>
              <SecondaryButton href="/portfolio">See recent work</SecondaryButton>
            </div>
          </div>
        </section>

        <section className="relative mt-16">
          <div className="site-container">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Or jump to a service
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pillars.map((pillar) => (
                <Link
                  key={pillar.slug}
                  // `ledgerHref` where the pillar has one, as /about does.
                  // `design-content-conversion` was retired and 308s to the
                  // services hub, so the raw slug sent a visitor who had
                  // already hit a 404 straight through a redirect (213.19).
                  href={pillar.ledgerHref ?? `/services/${pillar.slug}`}
                  className="card-hover r-card surface-1 px-5 py-4 text-sm font-medium text-ink"
                >
                  {pillar.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
