import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { faqGroups, allFaqs } from "@/data/faqs";
import CtaButton from "@/components/CtaButton";

const SITE_URL = "https://bilalshafqat.com";

export const metadata: Metadata = {
  title: "FAQ — Working With a Freelance Marketer & Developer",
  description:
    "Straight answers on hiring a freelancer versus an agency, working across timezones from Dubai, how projects start, and how results are measured.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — Working With a Freelance Marketer & Developer",
    description:
      "Straight answers on freelancer versus agency, timezones, how projects start, and how results are measured.",
    type: "website",
    url: "/faq",
  },
};

export default function FaqPage() {
  // One FAQPage covering every question, so search engines and AI assistants can
  // read the whole set rather than whichever group happens to be first.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${SITE_URL}/faq`,
    mainEntity: allFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-3xl px-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
              <Link href="/" className="hover:text-ink transition-colors">Home</Link>
              <ChevronRight size={13} />
              <span className="text-ink">FAQ</span>
            </nav>
            <h1 className="mt-8 text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.06] tracking-tight text-ink">
              Questions people actually ask
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              Honest answers about how this works, including the parts that
              usually go unsaid. If your question isn&apos;t here, ask me directly
              and I&apos;ll add it.
            </p>

            <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2">
              {faqGroups.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="rounded-full border border-border bg-surface/60 px-4 py-2 text-xs font-medium text-muted hover:text-ink hover:border-gold/35 transition-colors"
                >
                  {g.title}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {faqGroups.map((group) => (
          <section key={group.id} id={group.id} className="relative mt-16 scroll-mt-28 sm:mt-20">
            <div className="mx-auto max-w-3xl px-6">
              <Reveal>
                <h2 className="text-2xl sm:text-3xl font-semibold leading-tight text-ink">
                  {group.title}
                </h2>
              </Reveal>
              <div className="mt-7 space-y-4">
                {group.items.map((f) => (
                  <Reveal key={f.question}>
                    {/* <details> rather than JS state: it works without hydration,
                        is keyboard accessible by default, and Ctrl+F finds the
                        answer text even while collapsed. */}
                    <details className="group rounded-2xl border border-border panel p-6 open:border-gold/25">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink marker:hidden">
                        {f.question}
                        <ChevronRight
                          size={17}
                          className="mt-0.5 shrink-0 text-gold transition-transform group-open:rotate-90"
                        />
                      </summary>
                      <p className="mt-3 text-sm text-muted leading-relaxed">{f.answer}</p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="relative mt-20 sm:mt-24">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-ink">
                    Still deciding? <span className="text-gradient">Just ask.</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">
                    A first conversation costs nothing and often ends with me
                    telling you a smaller piece of work would do the job.
                  </p>
                  <CtaButton href="/contact" className="mt-9">Book a free consultation</CtaButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
