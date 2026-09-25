import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Minus, Plus } from "lucide-react";
import Reveal from "@/components/Reveal";
import FaqSection from "@/components/FaqSection";
import CtaButton from "@/components/CtaButton";
import Engagement from "@/components/Engagement";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, faqNode, breadcrumbNode } from "@/lib/schema";
import { OG_IMAGES } from "@/lib/ogImage";


export const metadata: Metadata = {
  title: "Pricing & How Projects Are Costed — Bilal Shafqat",
  description:
    "How freelance marketing, development and design is priced in Dubai: the engagement models, what moves cost, and a figure without a sales call.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing & How Projects Are Costed — Bilal Shafqat",
    description:
      "The four engagement models, what pushes cost up or down, and how to get a real figure quickly.",
    type: "website",
    url: "/pricing",
    images: OG_IMAGES,
  },
};


// The genuinely useful part of a pricing page for anyone who cannot yet be quoted:
// what actually moves the number, in both directions.
const drivers = {
  up: [
    "Custom functionality rather than an established pattern — integrations, calculators, bespoke dashboards",
    "Multiple languages, or a design that must work across very different markets",
    "Compressed timelines that require reordering other work",
    "Content that has to be created from scratch rather than supplied",
    "Ongoing campaign management, which is time-based rather than deliverable-based",
  ],
  down: [
    "A clear brief and a single decision-maker — most cost overruns are revision cycles, not build time",
    "Existing brand assets, copy and photography ready to use",
    "Building on what you already have where it is sound, rather than starting over",
    "Phasing the work so the highest-value piece ships first and pays for the next",
    "Realistic timelines, which avoid the premium that urgency carries",
  ],
};

export default function PricingPage() {

  const faqs = [
    {
      question: "Why aren't prices listed on this page?",
      answer:
        "Because a number without a scope is misleading. A landing page can be a two-day job or a three-week one depending on integrations, content and how many stakeholders review it. Rather than publish a figure that turns out to be wrong for you, this page explains what drives the cost so you can judge roughly where your project sits, and you get a real number after one short conversation.",
    },
    {
      question: "How quickly can I get an actual figure?",
      answer:
        "Usually within a business day of describing the project. If the scope is clear, the quote is fixed. If it isn't yet, you'll get a range plus what would narrow it.",
    },
    {
      question: "Do you charge hourly or by project?",
      answer:
        "By project wherever the scope can be defined, because that puts the risk of estimating on me rather than you. Retainers are priced monthly. Hourly is used only for advisory work where the output genuinely is time.",
    },
    {
      question: "What currency do you work in?",
      answer:
        "AED for UAE clients. For clients outside the UAE, pricing can be quoted in your currency — mention it in your first message and it will be quoted that way from the start.",
    },
    {
      question: "Is the first conversation free?",
      answer:
        "Yes, and there's no obligation. It often ends with a recommendation to do less than you were planning.",
    },
  ];


  // One graph, nodes keyed by @id. Both FAQ sets below are rendered visibly on
  // this page — verified, not assumed.
  const pageUrl = `${SITE_URL}/pricing`;
  const nodes = [
    breadcrumbNode(pageUrl, [{ name: "Home", item: SITE_URL }, { name: "Pricing", item: `${SITE_URL}/pricing` }]),
    faqNode(pageUrl, faqs.map((f) => ({ question: f.question, answer: f.answer }))),
  ];

  return (
    <>
      <JsonLd nodes={nodes} />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-3xl px-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
              <Link href="/" className="hover:text-ink transition-colors">Home</Link>
              <ChevronRight size={13} />
              <span className="text-ink">Pricing</span>
            </nav>
            <h1 className="t-h1 mt-8 text-ink">
              How projects are priced
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              No packages, no tiers you have to squeeze into. Four ways of working,
              priced against the actual scope. This page explains what moves the
              number so you can judge roughly where your project sits before we
              speak.
            </p>
          </div>
        </section>

        {/* The engagement models, once.
 *
 * This page used to define its own four — Project-Based, Monthly Retainer,
 * Ongoing Partner, Consulting & Advisory — render them here without prices,
 * and then render `<Engagement variant="detailed" />` below the FAQ, which is
 * the same four *with* the prices. Measured: every model name appeared twice
 * inside <main> (roadmap 213.15).
 *
 * The duplicate is gone and the real block moved up into its slot. The prices
 * are the reason someone opens a page called "How projects are priced"; they
 * were the last thing on it.
 */}
        <Engagement variant="detailed" />


        <section className="relative mt-20 sm:mt-24">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">Cost drivers</span>
              <h2 className="t-h2 mt-4 text-ink">
                What moves the price
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">
                Two projects with the same title can differ several times over in
                cost. These are the factors that decide which one yours is.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-border panel p-7">
                  <h3 className="t-h5 flex items-center gap-2 text-ink">
                    <Plus size={17} className="text-gold" /> Pushes cost up
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {drivers.up.map((d) => (
                      <li key={d} className="text-sm text-muted leading-relaxed">{d}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="h-full rounded-2xl border border-border panel p-7">
                  <h3 className="t-h5 flex items-center gap-2 text-ink">
                    <Minus size={17} className="text-cyan" /> Brings cost down
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {drivers.down.map((d) => (
                      <li key={d} className="text-sm text-muted leading-relaxed">{d}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <FaqSection eyebrow="Questions" title="Pricing questions" faqs={faqs} className="mt-20 sm:mt-24" />

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
                  <h2 className="t-h2 mt-4 text-ink">
                    Describe the project, <span className="text-gradient">get a real number.</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">
                    Usually within a business day. No pitch deck, no discovery
                    process you have to sit through first.
                  </p>
                  <CtaButton href="/appointment" className="mt-9">Get a quote</CtaButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
