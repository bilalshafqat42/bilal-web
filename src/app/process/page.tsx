import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Nav from "@/components/Nav";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SITE_URL, breadcrumbNode, graph, ref, ID } from "@/lib/schema";
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

        <Contact />
      </main>
      <Footer />
    </>
  );
}
