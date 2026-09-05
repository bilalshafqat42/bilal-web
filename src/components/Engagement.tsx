"use client";

import { useState } from "react";
import { Package, RefreshCw, Users2, Send, ChevronDown, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Reveal, { RevealStagger, RevealItem } from "./Reveal";
import CtaButton from "@/components/CtaButton";

type Model = {
  icon: LucideIcon;
  title: string;
  /** A published "from" figure, or omitted where there isn't one yet.
   *
   *  Only the three models priced by *hours included* carry a number, because
   *  that scope is a decision rather than an estimate: a retainer is 30 hours
   *  because that is what it is sold as, and an advisory session is four. Those
   *  cannot turn out to be wrong mid-project.
   *
   *  "Ongoing Partner" has no figure because none was supplied, and the per-
   *  service build prices are held back for the opposite reason to the three
   *  below: they are priced by hours *required*, which is a guess about how long
   *  a job takes until two projects have been timed. */
  price?: string;
  description: string;
  idealFor: string[];
  contribute: string[];
  bestFor: string;
};

const models: Model[] = [
  {
    icon: Package,
    title: "Project-Based",
    price: "from AED 31,500",
    description: "A defined deliverable with a clear scope, timeline, and price.",
    idealFor: ["A website, app, or ad campaign with a clear brief", "Graphic design or social content for a launch", "A one-off build with no ongoing commitment"],
    contribute: ["Fixed-scope proposal and timeline", "Design, development, or campaign delivery", "Handover with documentation or training"],
    bestFor: "Best for focused projects with clear goals and timelines.",
  },
  {
    icon: RefreshCw,
    title: "Monthly Retainer",
    price: "from AED 16,000 / month, minimum 3 months",
    description: "Ongoing marketing, design, or development support on a recurring basis.",
    idealFor: ["Continuous paid ad management", "Regular social content & posting", "Ongoing feature development or site updates"],
    contribute: ["Monthly deliverables & reporting", "Priority turnaround on requests", "A single point of contact across disciplines"],
    bestFor: "Best for businesses needing consistent, ongoing output.",
  },
  {
    icon: Users2,
    title: "Ongoing Partner / Dedicated Support",
    description: "Embedded support alongside your team for larger or longer-running initiatives.",
    idealFor: ["Multi-channel campaigns running in parallel", "A product roadmap with continuous development", "Teams that need extra hands without a full hire"],
    contribute: ["Cross-functional marketing, design & dev support", "Direct collaboration with your internal team", "Flexible capacity as needs change"],
    bestFor: "Best for scaling teams or fast-moving projects.",
  },
  {
    icon: Send,
    title: "Consulting & Advisory",
    price: "from AED 3,500 per session",
    description: "High-level review and guidance focused on clarity and measurable outcomes.",
    idealFor: ["A marketing, UX, or technical review", "Expert input before a bigger investment", "Independent insight without execution dependency"],
    contribute: ["Marketing, UX & technical performance review", "A prioritized action plan", "Optional support to implement recommendations"],
    bestFor: "Best for leadership teams needing clarity and direction.",
  },
];

function EngagementCard({ model, defaultExpanded = false }: { model: Model; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="card-hover h-full rounded-2xl border border-border panel p-7 flex flex-col">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-violet/20 border border-border text-gold">
        <model.icon size={22} />
      </div>
      <h3 className="mt-6 text-lg sm:text-xl font-semibold text-ink leading-snug">{model.title}</h3>
      {model.price ? (
        <p className="mt-2 text-sm font-semibold text-gold">{model.price}</p>
      ) : null}
      <p className="mt-3 text-base text-muted leading-relaxed">{model.description}</p>
      <p className="mt-4 text-sm italic text-muted/80">{model.bestFor}</p>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mt-5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold hover:text-gold-2 transition-colors"
      >
        {expanded ? "Hide details" : "See details"}
        <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                Ideal when you need
              </p>
              <ul className="mt-2 space-y-1.5">
                {model.idealFor.map((b) => (
                  <li key={b} className="text-sm text-muted flex gap-2">
                    <span className="text-gold">—</span>
                    {b}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold">
                How I contribute
              </p>
              <ul className="mt-2 space-y-1.5">
                {model.contribute.map((b) => (
                  <li key={b} className="text-sm text-muted flex gap-2">
                    <span className="text-gold">—</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * Engagement models — how to buy.
 *
 * Two variants of one component rather than two components, since the models
 * themselves are identical and only the framing differs:
 *
 *   "homepage"  the offer, with the audience line and a CTA. This replaced the
 *               separate "Growth Partnerships" section, whose full version now
 *               lives on `/about`; the audience is a single line here instead
 *               of its own homepage section.
 *   "detailed"  for `/pricing` and linked from each service page as "How
 *               engagements work". Cards start expanded, since a visitor who
 *               followed a link named that has already asked the question the
 *               collapsed state hides. No CTA: those pages carry their own, and
 *               a second one competes with it.
 */
export default function Engagement({ variant = "homepage" }: { variant?: "homepage" | "detailed" }) {
  const detailed = variant === "detailed";

  return (
    <section id="engagement" className="relative py-24 sm:py-32 bg-bg-soft/40">
      <div className="site-container">
        <SectionHeading
          eyebrow={detailed ? "How Engagements Work" : "Pricing & Engagement"}
          title="Flexible Engagement Models,"
          highlight="Built To Match Your Project"
          description="Work with me however fits best — a single project, a monthly retainer, embedded support, or independent advisory."
        />

        {/* Replaces the former "Growth Partnerships" homepage section with one
            line. The full version is on /about under "Who I work with". */}
        {detailed ? null : (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
            Working with founders, UAE real estate developers, in-house teams and agencies.
          </p>
        )}

        <RevealStagger className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {models.map((m) => (
            <RevealItem key={m.title}>
              <EngagementCard model={m} defaultExpanded={detailed} />
            </RevealItem>
          ))}
        </RevealStagger>

        {detailed ? null : (
          <Reveal className="mt-14 text-center">
            <div>
              <p className="mx-auto max-w-xl text-muted">Let&apos;s discuss your goals and define the right approach.</p>
              <CtaButton href="/appointment" className="mt-5">Book a free consultation</CtaButton>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
