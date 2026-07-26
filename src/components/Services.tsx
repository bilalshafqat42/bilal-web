import {
  Megaphone,
  TrendingUp,
  Globe,
  Code2,
  Smartphone,
  Palette,
  Share2,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { RevealStagger, RevealItem } from "./Reveal";

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

const accentClasses: Record<Pillar["accent"], { icon: string; bg: string; dot: string }> = {
  gold: { icon: "text-gold", bg: "from-gold/20 to-gold-2/10", dot: "bg-gold" },
  violet: { icon: "text-violet", bg: "from-violet/20 to-violet/5", dot: "bg-violet" },
  cyan: { icon: "text-cyan", bg: "from-cyan/20 to-cyan/5", dot: "bg-cyan" },
};

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="What I Do"
          title="Seven Services, One Point Of"
          highlight="Contact"
          description="From the first ad click to the shipped product — strategy, design, and development handled under one roof."
        />

        <div className="mt-16 flex flex-col gap-14">
          {pillars.map((pillar) => {
            const accent = accentClasses[pillar.accent];
            return (
              <div key={pillar.label}>
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/80">
                    {pillar.label}
                  </h3>
                </div>

                <RevealStagger
                  className={`mt-6 grid grid-cols-1 sm:grid-cols-2 ${
                    pillar.services.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
                  } gap-5`}
                >
                  {pillar.services.map((service) => (
                    <RevealItem key={service.title}>
                      <div className="card-hover group h-full rounded-2xl border border-border glass p-7 flex flex-col">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent.bg} border border-border ${accent.icon}`}
                        >
                          <service.icon size={22} />
                        </div>
                        <h4 className="mt-6 text-lg font-semibold text-ink">{service.title}</h4>
                        <p className="mt-3 text-sm text-muted leading-relaxed">{service.description}</p>
                        <ul className="mt-4 space-y-1.5">
                          {service.bullets.map((b) => (
                            <li key={b} className="text-xs text-muted flex gap-2">
                              <span className={accent.icon}>—</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                        <a
                          href="#case-studies"
                          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/90 group-hover:text-gold transition-colors"
                        >
                          View Work <ArrowUpRight size={15} />
                        </a>
                      </div>
                    </RevealItem>
                  ))}
                </RevealStagger>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
