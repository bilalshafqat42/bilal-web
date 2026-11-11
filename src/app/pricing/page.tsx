import type { Metadata } from "next";
import Link from "next/link";
import PageOpener from "@/components/layout/PageOpener";
import { Minus, Plus } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import FaqSection from "@/components/ui/FaqSection";
import CtaButton from "@/components/ui/CtaButton";
import Engagement from "@/components/sections/Engagement";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, faqNode, breadcrumbNode } from "@/lib/schema";
import { OG_IMAGES } from "@/lib/ogImage";
import Eyebrow from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Digital Marketing Pricing in Dubai: How I Quote",
  description:
    "Digital marketing pricing in Dubai: how I quote work, what moves the cost up or down, and how to get a fixed price in writing within a business day.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Digital Marketing Pricing in Dubai: How I Quote",
    description:
      "The four engagement models, what pushes cost up or down, and how to get a real figure quickly.",
    type: "website",
    url: "/pricing",
    images: OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketing Pricing in Dubai: How I Quote",
    description:
      "The four engagement models, what pushes cost up or down, and how to get a real figure quickly.",
    images: OG_IMAGES.map((i) => i.url),
  },
};

// The genuinely useful part of a pricing page for anyone who cannot yet be quoted:
// what actually moves the number, in both directions.
const drivers = {
  up: [
    "Custom functionality rather than an established pattern: integrations, calculators, bespoke dashboards",
    "Multiple languages, or a design that must work across very different markets",
    "Compressed timelines that require reordering other work",
    "Content that has to be created from scratch rather than supplied",
    "Ongoing campaign management, which is time-based rather than deliverable-based",
  ],
  down: [
    "A clear brief and a single decision-maker, because most cost overruns are revision cycles rather than build time",
    "Existing brand assets, copy and photography ready to use",
    "Building on what you already have where it is sound, rather than starting over",
    "Phasing the work so the highest-value piece ships first and pays for the next",
    "Realistic timelines, which avoid the premium that urgency carries",
  ],
};

export default function PricingPage() {

  const faqs = [
    {
      question: "Why is there no price list?",
      answer:
        "Because a number without a scope is misleading. A landing page can be a two-day job or a three-week one depending on integrations, content and how many stakeholders review it. This page explains what moves the cost, and you get a fixed number after one short conversation, sized to your budget.",
    },
    {
      question: "How quickly can I get an actual figure?",
      answer:
        "Usually within a business day of describing the project. If the scope is clear, the quote is fixed. If it isn't yet, you'll get a range plus what would narrow it.",
    },
    {
      question: "Do you charge hourly or by project?",
      answer:
        "By project wherever the scope can be defined, because that puts the risk of estimating on me rather than you. Retainers are priced monthly. Advisory sessions are a fixed fee agreed in advance. Nothing is billed by the hour.",
    },
    {
      question: "What currency do you work in?",
      answer:
        "AED for UAE clients. For clients outside the UAE, pricing can be quoted in your currency. Mention it in your first message and it will be quoted that way from the start.",
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
        <PageOpener
          crumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
          title="Digital marketing pricing in Dubai, and how I quote"
          standfirst={
            <>
              <p>
                No price list, because two businesses asking for the same thing rarely
                need the same work. Instead, a free 30-minute call, then a fixed price
                in writing, sized to your goals and your budget, before any work
                starts. No packages and no tiers you have to squeeze into.
              </p>
              <p>
                I work as a{" "}
                <Link href="/" className="text-ink underline decoration-gold/40 underline-offset-[6px] hover:text-gold">
                  digital marketing freelancer in Dubai
                </Link>
                , so you deal with the person who quotes and does the work.
                Below: the four ways of working compared, what pushes the number up or
                down, and how to get a real figure for your own project, usually within
                one business day.
              </p>
            </>
          }
        />

        {/* The engagement models, once.
 *
 * This page used to define its own four — Project-Based, Monthly Retainer,
 * Ongoing Partner, Consulting & Advisory — render them here without prices,
 * and then render `<Engagement variant="detailed" />` below the FAQ, which is
 * the same four *with* the prices. Measured: every model name appeared twice
 * inside <main> (roadmap 213.15).
 *
 * The duplicate is gone and the real block moved up into its slot. Figures
 * were removed on 2026-11-11; the models now say how each is priced.
 */}
        <Engagement variant="detailed" />

        <section className="relative section">
          <div className="site-container">
            <Reveal>
              <Eyebrow>Cost drivers</Eyebrow>
              <h2 className="t-h2 mt-4 text-ink">
                What moves digital marketing cost in Dubai
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">
                Two projects with the same title can differ several times over in
                cost. These are the factors that decide which one yours is.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Reveal>
                <div className="h-full r-card surface-1 p-7">
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
                <div className="h-full r-card surface-1 p-7">
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

        <section className="relative section">
          <div className="site-container">
            <div className="max-w-3xl">
              <Reveal>
                {/* Retitled again 2026-11-11: the old heading repeated
                    "freelance digital marketer ... in Dubai", which belongs to
                    the homepage. This page now targets "digital marketing
                    pricing in Dubai", the query it actually gets shown for. */}
                <h2 className="t-h2 text-ink">
                  Freelancer, agency or in-house: how the costs compare
                </h2>
                <p className="mt-6 text-base leading-relaxed text-muted">
                  The market splits four ways and the prices are not comparable,
                  because you are not buying the same thing. A low-cost freelancer on
                  a marketplace sells hours. An experienced freelancer sells a
                  finished outcome and carries the estimating risk. An agency sells
                  capacity and continuity, and the office and account layer are in
                  the quote whether or not your project needs them. An in-house hire
                  costs a salary plus visa, insurance, end of service and the months
                  it takes to recruit.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  So a figure on its own tells you very little. What tells you
                  something is what is excluded. Ad spend is almost never included in
                  any of them, and a quote that does not mention it is not complete.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Pricing a website or a developer specifically? Two guides go
                  further than this page:{" "}
                  <Link href="/how-much-does-a-website-cost-in-dubai" className="text-ink underline decoration-gold/40 underline-offset-[6px] hover:text-gold">
                    how much a website costs in Dubai
                  </Link>
                  , and{" "}
                  <Link href="/cost-to-hire-a-web-developer-in-dubai" className="text-ink underline decoration-gold/40 underline-offset-[6px] hover:text-gold">
                    what it costs to hire a web developer in Dubai
                  </Link>
                  .
                </p>
              </Reveal>

              <Reveal>
                <h2 className="t-h2 mt-14 text-ink">Working with your budget</h2>
                <p className="mt-6 text-base leading-relaxed text-muted">
                  Tell me your budget on the first call, even if it feels small. It
                  is the fastest way to a useful answer. A tight budget usually means
                  doing one thing well, such as one campaign or one landing page with
                  proper tracking, rather than five things badly.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  If what you have in mind does not fit the budget, I will say so on
                  the call and suggest the smaller version that still moves your
                  number. You leave with a clear plan and a price range either way, a
                  fixed price in writing follows, and there is no obligation and no
                  follow-up sequence.
                </p>
              </Reveal>

              <Reveal>
                <h2 className="t-h2 mt-14 text-ink">What you get that is not on the invoice</h2>
                <p className="mt-6 text-base leading-relaxed text-muted">
                  You brief the person who does the work. There is no account manager
                  translating what you said, no junior assigned to your project after
                  a senior person pitched it, and no week spent waiting while three
                  suppliers establish whose turn it is.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Accounts stay in your name throughout: the domain, the hosting, the
                  ad accounts, the analytics. That sounds like a detail until the
                  engagement ends. A surprising number of businesses here discover a
                  year in that they cannot move their own website because somebody
                  else owns it.
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  And an honest no. If a fast mobile site does the job an app would
                  do, or the problem is the tracking rather than the site, I will say
                  so and quote for the smaller thing. That costs me a project and
                  buys the only thing worth having in a market this size.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <FaqSection eyebrow="Questions" title="Pricing questions" faqs={faqs} className="section" />

        <section className="relative section">
          <div className="site-container">
            <Reveal>
              <div className="relative overflow-hidden r-panel surface-3 px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <Eyebrow>Next step</Eyebrow>
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
