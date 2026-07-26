import { Megaphone, PenTool, MonitorSmartphone, Layers, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { RevealStagger, RevealItem } from "./Reveal";

const services = [
  {
    icon: Megaphone,
    title: "Performance Marketing & Growth",
    description:
      "Data-driven paid media, funnel strategy, and growth management aligned with real business KPIs — not vanity metrics.",
    cta: "View Growth Work",
  },
  {
    icon: PenTool,
    title: "UX, UI & Conversion Design",
    description:
      "Experiences engineered to convert. From research and wireframes to interface design focused on clarity and results.",
    cta: "View UX Work",
  },
  {
    icon: MonitorSmartphone,
    title: "Web & Mobile Development",
    description:
      "High-performance websites and applications built to support marketing goals, scalability, and long-term growth.",
    cta: "View Developments",
  },
  {
    icon: Layers,
    title: "CMS & Automation Solutions",
    description:
      "Custom CMS builds and automation workflows that simplify content management and remove manual, repetitive work.",
    cta: "View Solutions",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="What I Do"
          title="How I Help Brands"
          highlight="Grow"
          description="Strategic services designed to drive growth, performance, and scalability — end to end, under one roof."
        />

        <RevealStagger className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service) => (
            <RevealItem key={service.title}>
              <div className="card-hover group h-full rounded-2xl border border-border glass p-7 flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-violet/20 border border-border text-gold">
                  <service.icon size={22} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-ink">{service.title}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed flex-1">
                  {service.description}
                </p>
                <a
                  href="#case-studies"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/90 group-hover:text-gold transition-colors"
                >
                  {service.cta} <ArrowUpRight size={15} />
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
