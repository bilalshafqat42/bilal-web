import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { pillars, accentClasses } from "@/data/pillars";

export const metadata: Metadata = {
  title: "Services — Paid Marketing, Web & App Development, Design & CRM Automation | Bilal Shafqat",
  description:
    "Four services, one senior partner: paid marketing & lead generation, website & app development, design & conversion, and CRM & marketing automation. Based in Dubai, UAE, serving clients across the UAE and worldwide.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
              Services
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              Four pillars, one senior partner
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed">
              Paid marketing, website and app development, design and conversion,
              and the CRM and automation that connects them, delivered
              personally from strategy to launch, without handoffs between
              departments.
            </p>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {pillars.map((pillar) => {
                const accent = accentClasses[pillar.accent];
                return (
                  <a
                    key={pillar.slug}
                    href={`/services/${pillar.slug}`}
                    className="card-hover group relative flex flex-col rounded-2xl border border-border glass p-8 overflow-hidden"
                  >
                    <div className={`absolute -top-12 -right-12 h-48 w-48 rounded-full blur-3xl ${accent.glow}`} />

                    <div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.bg} border border-border ${accent.icon}`}
                    >
                      <pillar.icon size={26} />
                    </div>

                    <h2 className="relative mt-6 text-2xl font-semibold leading-tight text-ink">
                      {pillar.label}
                    </h2>
                    <p className="relative mt-3 text-sm text-muted leading-relaxed">{pillar.shortDescription}</p>

                    <ul className="relative mt-5 flex flex-wrap gap-2">
                      {pillar.capabilities.map((c) => (
                        <li
                          key={c}
                          className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>

                    <span
                      className={`relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${accent.icon} group-hover:opacity-80`}
                    >
                      See what's included <ArrowRight size={15} />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Contact />
      <Footer />
    </>
  );
}
