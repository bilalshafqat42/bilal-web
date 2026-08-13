import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { pillars, accentClasses, getPillarBySlug, slugify } from "@/data/pillars";

const SITE_URL = "https://bilalshafqat.com";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return pillars.map((pillar) => ({ slug: pillar.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPillarBySlug(slug);
  if (!pillar) return {};

  return {
    title: `${pillar.label} — Bilal Shafqat`,
    description: pillar.shortDescription,
    alternates: {
      canonical: `/services/${pillar.slug}`,
    },
  };
}

export default async function PillarPage({ params }: PageProps) {
  const { slug } = await params;
  const pillar = getPillarBySlug(slug);
  if (!pillar) notFound();

  const accent = accentClasses[pillar.accent];
  const otherPillars = pillars.filter((p) => p.slug !== pillar.slug);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pillar.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: pillar.label,
    description: pillar.shortDescription,
    url: `${SITE_URL}/services/${pillar.slug}`,
    provider: { "@type": "Person", name: "Bilal Shafqat" },
    areaServed: ["United Arab Emirates", "Worldwide"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Nav />
      <main className="flex-1 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-4xl px-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <li>
              <a href="/" className="hover:text-ink transition-colors">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/services/" className="hover:text-ink transition-colors">
                Services
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink/80">{pillar.label}</li>
          </ol>
        </nav>

        <section className="relative overflow-hidden mt-8">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.bg} border border-border ${accent.icon}`}
            >
              <pillar.icon size={26} />
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              {pillar.label}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed">{pillar.heroDescription}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/#contact"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
              >
                Book a free consultation <ArrowRight size={16} />
              </a>
              <a
                href="/portfolio/"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
              >
                View my work
              </a>
            </div>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-4xl px-6 space-y-10">
            {pillar.sections.map((section) => (
              <div
                key={section.title}
                id={slugify(section.title)}
                className="rounded-2xl border border-border glass p-8 scroll-mt-28"
              >
                <h2 className="text-2xl sm:text-[2rem] font-semibold leading-tight text-ink">{section.title}</h2>
                <p className="mt-3 text-base text-muted leading-relaxed">{section.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {section.bullets.map((b) => (
                    <li
                      key={b}
                      className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs text-muted"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl sm:text-[2rem] font-semibold leading-tight text-ink">Frequently asked questions</h2>
            <div className="mt-6 space-y-6">
              {pillar.faqs.map((faq) => (
                <div key={faq.question} className="border-b border-border pb-6">
                  <h3 className="text-lg font-semibold text-ink">{faq.question}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-lg font-semibold text-ink/80">Explore the other pillars</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {otherPillars.map((p) => {
                const otherAccent = accentClasses[p.accent];
                return (
                  <a
                    key={p.slug}
                    href={`/services/${p.slug}/`}
                    className="card-hover flex items-center gap-3 rounded-xl border border-border glass p-4"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${otherAccent.bg} border border-border ${otherAccent.icon}`}
                    >
                      <p.icon size={18} />
                    </div>
                    <span className="text-sm font-medium text-ink">{p.label}</span>
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
