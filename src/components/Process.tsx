import { Compass, PenTool, Rocket, TrendingUp } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { RevealStagger, RevealItem } from "./Reveal";

const steps = [
  {
    icon: Compass,
    step: "01",
    title: "Understand the Brief",
    description:
      "I start by understanding the business, audience, and goals before proposing a marketing, design, or development approach.",
    bullets: [
      "Business goals & success metrics",
      "Target audience & user needs",
      "Market positioning & competitors",
      "Existing tools, data, and constraints",
    ],
  },
  {
    icon: PenTool,
    step: "02",
    title: "Plan & Design",
    description:
      "Based on the brief, I plan the campaign, application, or design system and map out how each piece fits together.",
    bullets: [
      "Campaign or funnel strategy",
      "UX wireframes & UI design",
      "Technical architecture (for apps)",
      "Content & creative direction",
    ],
  },
  {
    icon: Rocket,
    step: "03",
    title: "Build & Launch",
    description:
      "Execution is hands-on — building, testing, and shipping the campaign, website, or application.",
    bullets: [
      "Paid campaign setup & launch",
      "Development, QA & deployment",
      "Design production & asset delivery",
      "Tracking & analytics setup",
    ],
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Optimize & Scale",
    description:
      "Once live, I focus on measuring performance and improving it — whether that's ad spend, conversion rate, or app usage.",
    bullets: [
      "Performance monitoring & reporting",
      "Ongoing testing and iteration",
      "Automation & workflow improvements",
      "Handover or ongoing support",
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
          highlight="Brief To Shipped Work"
          description="Whether it's a paid campaign, a website, or a custom application, every project follows the same clear process — from brief to launch to optimization."
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
