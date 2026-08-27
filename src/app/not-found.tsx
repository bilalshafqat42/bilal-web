import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { pillars } from "@/data/pillars";

export const metadata: Metadata = {
  title: "Page not found — Bilal Shafqat",
  // Keep 404s out of the index; the status code already says so, but this
  // removes any ambiguity for crawlers that soft-index error pages.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-3xl px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
              404
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight text-ink">
              That page isn&apos;t here any more
            </h1>
            {/* Most traffic here arrives from search results for the old
                WordPress blog, so say what happened rather than pretend the
                link was simply mistyped. */}
            <p className="mt-6 text-lg text-muted leading-relaxed">
              This site used to host a blog of development and design tutorials.
              Those articles have been retired while the site focuses on client
              work. If you arrived from a search result, that&apos;s why.
            </p>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              If you&apos;re here about a project, everything you need is below.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/contact"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
              >
                Start a conversation <ArrowRight size={16} />
              </a>
              <a
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
              >
                See recent work
              </a>
            </div>
          </div>
        </section>

        <section className="relative mt-16">
          <div className="mx-auto max-w-3xl px-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Or jump to a service
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pillars.map((pillar) => (
                <a
                  key={pillar.slug}
                  href={`/services/${pillar.slug}`}
                  className="card-hover rounded-2xl border border-border glass px-5 py-4 text-sm font-medium text-ink"
                >
                  {pillar.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
