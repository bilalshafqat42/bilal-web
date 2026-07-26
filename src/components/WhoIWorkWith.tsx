import { Building2, Home, Network, Users, ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal, { RevealStagger, RevealItem } from "./Reveal";

const audiences = [
  {
    icon: Building2,
    title: "Startups & Founders",
    description:
      "Early-stage and scaling startups needing paid marketing, a website, or an MVP application without hiring a full team.",
    bullets: ["Paid ads, funnels & landing pages", "Web & mobile MVP development", "Brand visuals & messaging"],
    note: "Founders who need strategy and execution without hiring multiple specialists.",
  },
  {
    icon: Home,
    title: "Real Estate Developers & Agencies (UAE)",
    description: "Specialized marketing and web support for off-plan and ready property sales in competitive markets.",
    bullets: ["Campaign-specific landing pages & funnels", "Paid ads targeting investors & buyers", "CRM-ready lead capture & qualification"],
    note: "Teams focused on high-intent leads and cost efficiency.",
  },
  {
    icon: Users,
    title: "In-House Teams & Growing Companies",
    description: "I work as an extension of internal teams to support marketing, design, or development capacity.",
    bullets: ["Paid marketing & funnel optimization", "Web, mobile & custom app development", "Design & social content support"],
    note: "Companies needing hands-on expertise without full-time overhead.",
  },
  {
    icon: Network,
    title: "Agencies & Consulting Partners",
    description: "White-label or collaborative support for agencies that need reliable delivery on marketing, design, or dev.",
    bullets: ["Paid ads & landing page execution", "Web, mobile & MERN development support", "Design & social content production"],
    note: "Agencies that value clarity, quality, and dependable delivery.",
  },
];

export default function WhoIWorkWith() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Who I Work With"
          title="Growth Partnerships Tailored To"
          highlight="Teams & Brands"
          description="I work with companies at different stages of growth, adapting my role based on business needs, internal structure, and growth goals."
        />

        <RevealStagger className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {audiences.map((a) => (
            <RevealItem key={a.title}>
              <div className="card-hover h-full rounded-2xl border border-border glass p-7 flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-violet/20 border border-border text-gold">
                  <a.icon size={22} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-ink leading-snug">{a.title}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">{a.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {a.bullets.map((b) => (
                    <li key={b} className="text-xs text-muted flex gap-2">
                      <span className="text-gold">—</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs italic text-muted/80 flex-1">{a.note}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal className="mt-14 text-center">
          <div>
            <p className="text-muted">Let&apos;s discuss your goals and find the right engagement model.</p>
            <a
              href="#contact"
              className="mt-5 btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-shadow"
            >
              Get a Quote <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
