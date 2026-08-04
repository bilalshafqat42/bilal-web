"use client";

import { useState } from "react";
import {
  Megaphone,
  TrendingUp,
  Globe,
  Code2,
  Smartphone,
  Palette,
  Share2,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
};

type Pillar = {
  label: string;
  accent: "gold" | "violet" | "cyan";
  services: Service[];
};

const pillars: Pillar[] = [
  {
    label: "Marketing & Growth",
    accent: "gold",
    services: [
      {
        icon: Megaphone,
        title: "Paid Marketing (Google & Social)",
        description:
          "Google Ads and paid social campaigns built around real business KPIs, not vanity metrics.",
        bullets: ["Search, Display & Shopping Ads", "Meta, Instagram & TikTok Ads", "Audience targeting & A/B testing"],
      },
      {
        icon: TrendingUp,
        title: "Performance Marketing",
        description:
          "Funnel strategy, conversion tracking, and ongoing optimization to lower cost-per-lead over time.",
        bullets: ["Funnel & landing page strategy", "Conversion tracking & analytics", "Budget pacing & ROAS optimization"],
      },
    ],
  },
  {
    label: "Product & Engineering",
    accent: "violet",
    services: [
      {
        icon: Globe,
        title: "Web Design & Development",
        description:
          "High-performance, conversion-ready websites designed and built to support your marketing goals.",
        bullets: ["UX/UI design & responsive builds", "SEO-ready page structure", "CMS integration"],
      },
      {
        icon: Code2,
        title: "MERN Stack Development",
        description:
          "Custom web applications and marketing tools built on MongoDB, Express, React, and Node.js.",
        bullets: ["Custom marketing applications", "Dashboards, CRMs & internal tools", "APIs & third-party integrations"],
      },
      {
        icon: Smartphone,
        title: "Mobile App Development",
        description:
          "Cross-platform mobile apps that extend your product or campaigns onto iOS and Android.",
        bullets: ["React Native app builds", "App store setup & submission", "Push notifications & analytics"],
      },
    ],
  },
  {
    label: "Brand & Content",
    accent: "cyan",
    services: [
      {
        icon: Palette,
        title: "Graphic Design",
        description:
          "Brand and campaign visuals designed to be consistent, on-brief, and ready for every channel.",
        bullets: ["Social media creatives", "Ad & landing page visuals", "Brand collateral"],
      },
      {
        icon: Share2,
        title: "Social Media Management",
        description:
          "Content planning, design, and posting that keeps your channels active and on-brand.",
        bullets: ["Content calendars & posting", "Caption & creative direction", "Engagement & reporting"],
      },
    ],
  },
];

const accentClasses: Record<Pillar["accent"], { icon: string; bg: string; dot: string; glow: string }> = {
  gold: { icon: "text-gold", bg: "from-gold/25 to-gold-2/10", dot: "bg-gold", glow: "bg-gold/25" },
  violet: { icon: "text-violet", bg: "from-violet/25 to-violet/10", dot: "bg-violet", glow: "bg-violet/25" },
  cyan: { icon: "text-cyan", bg: "from-cyan/25 to-cyan/10", dot: "bg-cyan", glow: "bg-cyan/25" },
};

type FlatService = Service & { accent: Pillar["accent"]; pillarLabel: string; number: string };

const flatServices: FlatService[] = pillars.flatMap((pillar) =>
  pillar.services.map((service) => ({ ...service, accent: pillar.accent, pillarLabel: pillar.label }))
).map((service, i) => ({ ...service, number: String(i + 1).padStart(2, "0") }));

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = flatServices[activeIndex];
  const accent = accentClasses[active.accent];

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="What I Do"
          title="Seven Services, One Point Of"
          highlight="Contact"
          description="From the first ad click to the shipped product — strategy, design, and development handled under one roof. Hover or tap a service to preview it."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
          <div className="order-1 lg:sticky lg:top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.title}
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

                <p className={`relative mt-6 text-xs font-semibold uppercase tracking-wide ${accent.icon}`}>
                  {active.pillarLabel}
                </p>
                <h3 className="relative mt-2 text-xl sm:text-2xl font-semibold text-ink">{active.title}</h3>
                <p className="relative mt-3 text-sm text-muted leading-relaxed">{active.description}</p>

                <ul className="relative mt-5 flex flex-wrap gap-2">
                  {active.bullets.map((b) => (
                    <li
                      key={b}
                      className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="order-2 flex flex-col">
            {pillars.map((pillar) => (
              <div key={pillar.label} className="mb-2 mt-8 first:mt-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`h-2 w-2 rounded-full ${accentClasses[pillar.accent].dot}`} />
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-ink/60">{pillar.label}</h4>
                </div>

                {pillar.services.map((service) => {
                  const flatIndex = flatServices.findIndex((s) => s.title === service.title);
                  const isActive = flatIndex === activeIndex;
                  return (
                    <button
                      key={service.title}
                      type="button"
                      onMouseEnter={() => setActiveIndex(flatIndex)}
                      onClick={() => setActiveIndex(flatIndex)}
                      className="w-full flex items-center gap-5 border-b border-border py-5 text-left transition-colors"
                    >
                      <span
                        className={`text-sm font-medium tabular-nums transition-colors ${
                          isActive ? accentClasses[pillar.accent].icon : "text-muted/50"
                        }`}
                      >
                        {flatServices[flatIndex].number}
                      </span>
                      <span
                        className={`text-lg sm:text-xl font-medium transition-colors ${
                          isActive ? "text-ink" : "text-muted"
                        }`}
                      >
                        {service.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}

            <Reveal className="mt-8">
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
