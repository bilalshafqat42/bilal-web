import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import FaqSection from "@/components/FaqSection";
import { faqGroups, allFaqs } from "@/data/faqs";
import CtaButton from "@/components/CtaButton";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, faqNode, breadcrumbNode } from "@/lib/schema";


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


  // One graph, nodes keyed by @id. Both FAQ sets below are rendered visibly on
  // this page — verified, not assumed.
  const pageUrl = `${SITE_URL}/faq`;
  const nodes = [
    breadcrumbNode(pageUrl, [{ name: "Home", item: SITE_URL }, { name: "FAQ", item: `${SITE_URL}/faq` }]),
    faqNode(pageUrl, allFaqs.map((f) => ({ question: f.question, answer: f.answer }))),
  ];

  return (
    <>
      <JsonLd nodes={nodes} />
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
            <h1 className="mt-8 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
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

        {/* One FaqSection per group, so the group name stays beside its own
            questions as you read them.

            This replaces collapsed `<details>` accordions. They were chosen
            because they work without hydration and Ctrl+F finds their text, but
            they also hid 16 answers behind 16 clicks on the one page whose whole
            purpose is answering questions, and they were the last FAQ layout on
            the site that did not match the others. The answers are now simply
            there to read. */}
        {faqGroups.map((group, i) => (
          <FaqSection
            key={group.id}
            id={group.id}
            eyebrow={`${String(i + 1).padStart(2, "0")} / ${String(faqGroups.length).padStart(2, "0")}`}
            title={group.title}
            faqs={group.items}
            className="scroll-mt-28 pt-16 sm:pt-20"
          />
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
                  <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">Next step</span>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
                    Still deciding? <span className="text-gradient">Just ask.</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">
                    A first conversation costs nothing and often ends with me
                    telling you a smaller piece of work would do the job.
                  </p>
                  <CtaButton href="/appointment" className="mt-9">Book a free consultation</CtaButton>
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
