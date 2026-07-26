import { Compass, PenTool, Rocket, TrendingUp } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { RevealStagger, RevealItem } from "./Reveal";

const steps = [
  {
    icon: Compass,
    step: "01",
    title: "Understand the Business & Market",
    description:
      "I start by deeply understanding the business, audience, and market dynamics before proposing solutions.",
    bullets: [
      "Business goals & KPIs",
      "Target audience & buyer intent",
      "Market positioning & competitors",
      "Existing data, tools, and constraints",
    ],
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design the Growth Strategy",
    description:
      "Based on insights, I design a clear growth roadmap aligned with both marketing and business objectives.",
    bullets: [
      "Funnel & channel strategy",
      "Messaging & value proposition",
      "UX, conversion & landing page planning",
      "Tracking & measurement setup",
    ],
  },
  {
    icon: Rocket,
    step: "03",
    title: "Execute, Test & Optimize",
    description:
      "Execution is hands-on and performance-driven, with continuous testing and iteration.",
    bullets: [
      "Paid advertising & campaign execution",
      "Conversion-focused landing pages & UX",
      "Performance monitoring & analysis",
      "Ongoing testing and optimization",
    ],
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Scale & Systemize Growth",
    description:
      "Once performance is validated, I focus on building scalable and repeatable growth systems.",
    bullets: [
      "Automation & CRM-ready workflows",
      "Process documentation & handover",
      "Performance scaling & efficiency improvements",
      "Long-term growth sustainability",
    ],
  },
];

export default function Process() {
  return (
    <section id="process" className="relative py-24 sm:py-32 bg-bg-soft/40">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="How I Work"
          title="A Structured Path From"
          highlight="Strategy To Execution"
          description="I believe sustainable growth comes from clarity, alignment, and continuous optimization — with marketing tied directly to business goals and real-world execution."
        />

        <RevealStagger className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <RevealItem key={step.step}>
              <div className="card-hover h-full rounded-2xl border border-border glass p-7 relative">
                <span className="absolute top-6 right-7 font-display text-3xl font-semibold text-ink/10">
                  {step.step}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-violet/20 border border-border text-gold">
                  <step.icon size={22} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-ink leading-snug">{step.title}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">{step.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {step.bullets.map((b) => (
                    <li key={b} className="text-xs text-muted flex gap-2">
                      <span className="text-gold">—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
