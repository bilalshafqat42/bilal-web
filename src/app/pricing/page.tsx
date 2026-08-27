import type { Metadata } from "next";
import { ArrowRight, ChevronRight, Minus, Plus } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const SITE_URL = "https://bilalshafqat.com";

export const metadata: Metadata = {
  title: "Pricing & How Projects Are Costed — Bilal Shafqat",
  description:
    "How freelance marketing, development and design work is priced in Dubai: the four engagement models, what pushes cost up or down, and how to get a figure without a sales call.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing & How Projects Are Costed — Bilal Shafqat",
    description:
      "The four engagement models, what pushes cost up or down, and how to get a real figure quickly.",
    type: "website",
    url: "/pricing",
  },
};

const models = [
  {
    title: "Project-Based",
    body: "A defined deliverable with a fixed scope, timeline and price agreed before anything starts. Best when you know what you want built — a landing page, a brand identity, a CRM setup.",
    bestFor: "One clear outcome with a defined end.",
  },
  {
    title: "Monthly Retainer",
    body: "A recurring block of work each month across marketing, design or development. Best when the work is continuous rather than a single deliverable, such as running campaigns or maintaining a site.",
    bestFor: "Ongoing work with no natural finish line.",
  },
  {
    title: "Ongoing Partner",
    body: "Embedded support alongside your existing team for larger or longer-running initiatives, where you need someone who knows the context rather than briefing a new supplier each time.",
    bestFor: "Longer programmes and in-house teams with a gap.",
  },
  {
    title: "Consulting & Advisory",
    body: "A review and a recommendation, without me doing the implementation. Useful when you have a team who can execute but want an independent read on strategy, tracking or spend.",
    bestFor: "You have the people; you want the direction checked.",
  },
];

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
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE_URL}/pricing` },
    ],
  };

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-3xl px-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
              <a href="/" className="hover:text-ink transition-colors">Home</a>
              <ChevronRight size={13} />
              <span className="text-ink">Pricing</span>
            </nav>
            <h1 className="mt-8 text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.06] tracking-tight text-ink">
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

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-ink">
                Four ways of working
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {models.map((m) => (
                <Reveal key={m.title}>
                  <div className="flex h-full flex-col rounded-2xl border border-border glass p-7">
                    <h3 className="text-xl font-semibold text-ink">{m.title}</h3>
                    <p className="mt-3 flex-1 text-sm text-muted leading-relaxed">{m.body}</p>
                    <p className="mt-5 border-t border-border pt-4 text-xs text-gold">
                      {m.bestFor}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-20 sm:mt-24">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-ink">
                What moves the price
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">
                Two projects with the same title can differ several times over in
                cost. These are the factors that decide which one yours is.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-border glass p-7">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
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
                <div className="h-full rounded-2xl border border-border glass p-7">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
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

        <section className="relative mt-20 sm:mt-24">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-ink">
                Pricing questions
              </h2>
            </Reveal>
            <div className="mt-8 space-y-4">
              {faqs.map((f) => (
                <Reveal key={f.question}>
                  <details className="group rounded-2xl border border-border glass p-6 open:border-gold/25">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink marker:hidden">
                      {f.question}
                      <ChevronRight size={17} className="mt-0.5 shrink-0 text-gold transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-muted leading-relaxed">{f.answer}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

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
                    Describe the project, <span className="text-gradient">get a real number.</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">
                    Usually within a business day. No pitch deck, no discovery
                    process you have to sit through first.
                  </p>
                  <a href="/contact" className="btn-primary mt-9 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold">
                    Get a quote <ArrowRight size={16} />
                  </a>
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
