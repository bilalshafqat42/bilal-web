"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { pillars, accentClasses } from "@/data/pillars";

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = pillars[activeIndex];
  const accent = accentClasses[active.accent];

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="site-container">
        <SectionHeading
          eyebrow="What I Do"
          title="Four Pillars, One Point Of"
          highlight="Contact"
          description="From your first ad click to a shipped product and the systems that keep it converting, handled under one roof. Hover or tap a pillar to preview it."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
          <div className="order-1 lg:sticky lg:top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-2xl border border-border glass p-8 overflow-hidden min-h-[340px]"
              >
                <div className={`absolute -top-12 -right-12 h-48 w-48 rounded-full blur-3xl ${accent.glow}`} />

                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.bg} border border-border ${accent.icon}`}
                >
                  <active.icon size={26} />
                </div>

                <h3 className="relative mt-6 text-2xl sm:text-[2rem] font-semibold leading-tight text-ink">
                  {active.label}
                </h3>
                <p className="relative mt-3 text-base text-muted leading-relaxed">{active.shortDescription}</p>

                <ul className="relative mt-5 flex flex-wrap gap-2">
                  {active.capabilities.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted"
                    >
                      {c}
                    </li>
                  ))}
                </ul>

                <a
                  href={`/services/${active.slug}`}
                  className={`relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${accent.icon} hover:opacity-80`}
                >
                  Learn more about this pillar <ArrowRight size={15} />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="order-2 flex flex-col">
            {pillars.map((pillar, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={pillar.label}
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  className="w-full flex items-center gap-5 border-b border-border py-6 text-left transition-colors"
                >
                  <span
                    className={`text-sm font-medium tabular-nums transition-colors ${
                      isActive ? accentClasses[pillar.accent].icon : "text-muted/50"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-lg sm:text-xl font-medium transition-colors ${
                      isActive ? "text-ink" : "text-muted"
                    }`}
                  >
                    {pillar.label}
                  </span>
                </button>
              );
            })}

            <Reveal className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/90 hover:text-gold transition-colors"
              >
                Explore all services in detail →
              </a>
              <a
                href="/portfolio"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/90 hover:text-gold transition-colors"
              >
                See work across these services →
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
