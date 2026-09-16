import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Nav from "@/components/Nav";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { SITE_URL, breadcrumbNode, faqNode, graph, ref, ID } from "@/lib/schema";
import { processSteps } from "@/data/process";

export const metadata: Metadata = {
  title: "My Process — From Brief To Shipped Work | Bilal Shafqat",
  description:
    "Four stages from brief to shipped work: discovery, planning and design, build and launch, then measurement and iteration.",
  alternates: { canonical: "/process" },
};

/**
 * The full delivery process.
 *
 * Exists because the image-rich, pinned version of this section was the tallest
 * thing on the homepage, and the homepage was making the same argument three
 * times over. The homepage now carries `ProcessCompact` — the same four stages,
 * one row, no imagery — and links here.
 *
 * A server shell with a client island inside it: `Process` is already a client
 * component, and no `"use client"` is added at page level.
 *
 * Someone who has just read how the work runs is asking how to buy it next, so
 * that question is answered here — but by a short pointer to `/pricing`, not by
 * a third copy of the engagement models.
 */

/**
 * Structured data. This page had none until 2026-09-16, which meant Google had
 * no typed description of it at all.
 */
/**
 * Questions about the process specifically.
 *
 * Deliberately NOT the process questions already answered on `/faq` — "how does
 * a project usually start", "what do you need from me to get started" and "how
 * do you measure whether marketing is working" all live there. Repeating them
 * would put the same answer on two indexable pages competing with each other,
 * which is the problem item 23 records for the engagement models.
 *
 * Every answer below restates something already published on this site rather
 * than adding a new claim:
 *   1. `faqs.ts` — "Can you work with our existing agency or in-house team" and
 *      `disciplines.ts` — "Can you take over an existing website".
 *   2. This page's own intro line, and the stage bullets, which already name
 *      campaign, development and design work inside the same four stages.
 *   3. `faqs.ts` — "Who actually does the work".
 *   4. Stage 04's own bullet, "Handover or ongoing support".
 *   5. `disciplines.ts` — "roughly what each would cost" early in a
 *      conversation, plus the "What moves the price" section on /pricing.
 *
 * Deliberately NOT here, because they need Bilal and guessing them would be
 * inventing a service promise: how long each stage runs, what the client
 * receives at the end of one, and whether a project can stop between stages.
 */
const faqs = [
  {
    question: "Does every project go through all four stages?",
    answer:
      "No. A common arrangement is picking up one stage where a team already covers the others, such as the build when the strategy is settled, or the measurement work when everything else is running. If you already have a website, send me the URL and I will tell you honestly whether it is worth improving or rebuilding before either of us assumes a full project.",
  },
  {
    question: "Is the process the same for a campaign as it is for a website?",
    answer:
      "The four stages are the same. What happens inside them is not. Stage three means campaign setup and launch for paid work, development and deployment for a build, and design production for creative — which is why each stage lists all three rather than pretending one description covers everything.",
  },
  {
    question: "Who runs each stage?",
    answer:
      "I do, all four of them. Strategy, campaign management, design and development come from the same person, so nothing is lost handing a brief from one stage to the next. Nothing is subcontracted without telling you first.",
  },
  {
    question: "What happens after stage four?",
    answer:
      "Either a handover, or ongoing support if the work keeps running. Campaigns and applications both need someone watching them after launch, so measurement and iteration is a stage rather than a final report. Which of the two fits is a question of engagement model, and those are set out on the pricing page.",
  },
  {
    question: "At what point do I find out what it costs?",
    answer:
      "Early, and in the first conversation rather than after a discovery phase you have paid for. You get a rough figure once I understand the scope, and an honest view of what is worth doing — which often includes telling you a smaller piece of work would solve the problem. What actually moves the number is set out on the pricing page.",
  },
];

const pageUrl = `${SITE_URL}/process`;

const schema = graph([
  {
    "@type": "WebPage",
    "@id": `${pageUrl}#page`,
    url: pageUrl,
    name: "How a project runs",
    description:
      "The four stages of a project: brief and discovery, planning and design, build and launch, then measurement and iteration.",
    inLanguage: "en",
    isPartOf: ref(ID.website, "WebSite"),
    about: ref(ID.business, "ProfessionalService"),
  },
  // `HowTo` rather than `WebPage` alone: this page describes an ordered
  // procedure, and the steps come from the same data the page renders so the
  // markup cannot describe a stage a visitor cannot read.
  {
    "@type": "HowTo",
    "@id": `${pageUrl}#howto`,
    name: "How a project runs, brief to shipped work",
    description:
      "Four stages, from the first conversation through to measurement after launch.",
    step: processSteps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  },
  breadcrumbNode(pageUrl, [
    { name: "Home", item: SITE_URL },
    { name: "Process", item: pageUrl },
  ]),
  // Built from the same array the page renders, so the markup cannot describe
  // an answer a visitor cannot read.
  faqNode(pageUrl, faqs),
]);

export default function ProcessPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Nav />
      <main className="flex-1">
        <Process />

        {/* Deliberately a pointer, not the models themselves. Engagement models
            live on the homepage and on /pricing; rendering the full block here
            too would have put three copies of the same content on the site,
            two of them indexable, competing with each other. */}
        <section className="relative py-24 sm:py-32 bg-bg-soft/40">
          <div className="site-container">
            <SectionHeading
              eyebrow="Pricing & Engagement"
              title="How engagements"
              highlight="actually work"
              description="Most projects run one of a few ways: a fixed-scope build, a monthly retainer, or embedded support alongside your team."
              align="left"
            />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              Which one fits depends on whether you need a defined deliverable or ongoing output,
              and how much of the work your own team already covers. The full breakdown of each
              model, and what drives cost, is on the pricing page.
            </p>
            <Link
              href="/pricing#engagement"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
            >
              See engagement models and pricing <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <section className="relative py-24 sm:py-32">
          <div className="site-container">
            <Reveal>
              <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                Questions
              </span>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
                About how the work runs
              </h2>
            </Reveal>
            <div className="mt-10 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
              {faqs.map((f) => (
                <Reveal key={f.question}>
                  <div className="h-full rounded-2xl border border-border panel p-6">
                    <h3 className="font-semibold leading-snug text-ink">{f.question}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">{f.answer}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
