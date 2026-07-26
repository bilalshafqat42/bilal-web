import { UserRound, FileText, Send, Clock, ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal, { RevealStagger, RevealItem } from "./Reveal";

const models = [
  {
    icon: UserRound,
    title: "Full-Time / In-House",
    description: "For companies looking to bring growth leadership and execution capabilities in-house.",
    idealFor: ["Ownership of growth & performance marketing", "Alignment between strategy, UX, technology, and execution", "A hands-on leader who can collaborate across teams"],
    contribute: ["Growth strategy & performance ownership", "Paid ads, funnels, and conversion optimization", "UX, landing pages, automation & analytics"],
    bestFor: "Best for companies building long-term, scalable growth.",
  },
  {
    icon: FileText,
    title: "Contract / Fractional Growth Manager",
    description: "Senior growth support without the commitment of a full-time hire.",
    idealFor: ["Immediate growth expertise", "Strategic direction + hands-on execution", "Short- to mid-term leadership for growth initiatives"],
    contribute: ["Growth audits & roadmaps", "Funnel strategy, paid ads & UX optimization", "Tracking, reporting & performance improvements"],
    bestFor: "Best for scaling teams or fast-moving projects.",
  },
  {
    icon: Send,
    title: "Consulting & Strategy",
    description: "High-level guidance focused on clarity, direction, and measurable outcomes.",
    idealFor: ["A clear growth strategy or funnel redesign", "Expert input on performance or UX challenges", "Independent insights without execution dependency"],
    contribute: ["Growth & funnel strategy development", "UX, conversion & performance reviews", "Analytics, tracking & optimization plans"],
    bestFor: "Best for leadership teams needing clarity and direction.",
  },
  {
    icon: Clock,
    title: "Freelance / Project-Based",
    description: "Hands-on execution for defined deliverables and outcomes.",
    idealFor: ["Landing pages, funnels, or paid ad campaigns", "UX or conversion-focused improvements", "Technical or automation support for marketing"],
    contribute: ["Campaign-specific landing pages & funnels", "Paid ads setup & optimization", "UX, CRO & performance improvements"],
    bestFor: "Best for focused projects with clear goals and timelines.",
  },
];

export default function Engagement() {
  return (
    <section id="engagement" className="relative py-24 sm:py-32 bg-bg-soft/40">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Let's Work Together"
          title="Flexible Engagement Models,"
          highlight="Built To Match Your Stage"
          description="I adapt my role to whatever creates the most impact — leading growth initiatives, supporting execution, or building scalable systems alongside your team."
        />

        <RevealStagger className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {models.map((m) => (
            <RevealItem key={m.title}>
              <div className="card-hover h-full rounded-2xl border border-border glass p-7 flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-violet/20 border border-border text-gold">
                  <m.icon size={22} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-ink leading-snug">{m.title}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">{m.description}</p>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold">
                  Ideal when you need
                </p>
                <ul className="mt-2 space-y-1.5">
                  {m.idealFor.map((b) => (
                    <li key={b} className="text-xs text-muted flex gap-2">
                      <span className="text-gold">—</span>
                      {b}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold">
                  How I contribute
                </p>
                <ul className="mt-2 space-y-1.5 flex-1">
                  {m.contribute.map((b) => (
                    <li key={b} className="text-xs text-muted flex gap-2">
                      <span className="text-gold">—</span>
                      {b}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-xs italic text-muted/80">{m.bestFor}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal className="mt-14 text-center">
          <div>
            <p className="text-muted">Let&apos;s discuss your goals and define the right approach.</p>
            <a
              href="#contact"
              className="mt-5 btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-shadow"
            >
              Let&apos;s Talk <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
