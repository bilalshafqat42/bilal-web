import { CheckCircle2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import DashboardGraphic from "./DashboardGraphic";

const cases = [
  {
    title: "Lead Generation for Off-Plan Properties",
    tags: {
      Market: "UAE Real Estate",
      Audience: "Property investors & end-users",
      Channels: "Paid Social (Meta), Landing Pages, CRM-ready forms",
    },
    goal:
      "Generate high-intent leads for off-plan real estate projects while maintaining lead quality and cost efficiency.",
    role:
      "Digital Marketing Manager / Growth Execution — owned campaign structure, landing page strategy, messaging alignment, and technical setup for lead capture.",
    bullets: [
      "Built conversion-focused landing pages aligned with ad messaging",
      "Structured paid social campaigns targeting UAE & international investors",
      "Optimized creatives, headlines, and CTAs for property-focused audiences",
      "Implemented mobile-first UX for high-volume ad traffic",
      "Integrated lead forms with CRM-ready workflows",
    ],
    outcome:
      "Delivered a scalable paid ads and landing page system capable of generating consistent, high-intent real estate leads.",
  },
  {
    title: "Real Estate Project Launch Campaign",
    tags: {
      Market: "UAE Real Estate",
      Audience: "Investors & buyers",
      Channels: "Paid Ads, Campaign Landing Pages",
    },
    goal: "Support the launch of a new real estate project through digital marketing and lead generation.",
    role: "Growth strategy, funnel design, and execution across ads and landing pages.",
    bullets: [
      "Designed project-specific landing pages for launch campaigns",
      "Aligned ad creatives with value propositions (location, ROI, lifestyle)",
      "Optimized page speed and UX for campaign traffic",
      "Set up tracking foundations for performance analysis",
    ],
    outcome: "Enabled successful project launch marketing with a clear funnel from ads to qualified leads.",
  },
  {
    title: "Continuous Lead Generation for Real Estate Agencies",
    tags: {
      Market: "UAE Real Estate",
      Audience: "Buyers & sellers",
      Channels: "Paid Social, Funnel Optimization",
    },
    goal: "Create a repeatable digital marketing system for ongoing lead generation.",
    role: "Marketing execution and optimization across ads, UX, and lead flows.",
    bullets: [
      "Tested multiple landing page variants for conversion improvement",
      "Refined audience targeting and messaging",
      "Improved lead quality through form structure and intent signals",
      "Supported agents with campaign-ready landing pages",
    ],
    outcome: "Established a sustainable digital funnel supporting continuous real estate lead generation.",
  },
];

export default function CaseStudies() {
  return (
    <section id="case-studies" className="relative py-24 sm:py-32 bg-bg-soft/40">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Proof Of Work"
          title="Real Estate Growth &"
          highlight="Paid Advertising (UAE)"
          description="Focused case studies highlighting paid advertising, lead generation, and growth execution for the UAE real estate market."
        />

        <div className="mt-16 flex flex-col gap-16">
          {cases.map((c, i) => (
            <Reveal key={c.title} delay={0.05}>
              <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 items-center">
                <div className={`${i % 2 === 1 ? "lg:order-2" : ""} h-72 sm:h-80`}>
                  <DashboardGraphic variant={i} />
                </div>

                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="rounded-2xl border border-border glass p-7 sm:p-9">
                    <h3 className="text-xl sm:text-2xl font-semibold text-ink">{c.title}</h3>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {Object.entries(c.tags).map(([label, value]) => (
                        <span
                          key={label}
                          className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs text-muted"
                        >
                          <span className="text-ink font-medium">{label}:</span> {value}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 grid sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                          Business Goal
                        </p>
                        <p className="mt-2 text-sm text-muted leading-relaxed">{c.goal}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                          My Role
                        </p>
                        <p className="mt-2 text-sm text-muted leading-relaxed">{c.role}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                        Strategy &amp; Execution
                      </p>
                      <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                        {c.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-sm text-muted">
                            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 rounded-xl border border-gold/20 bg-gold/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                        Outcome
                      </p>
                      <p className="mt-1.5 text-sm text-ink/90 leading-relaxed">{c.outcome}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
