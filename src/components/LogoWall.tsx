import { Building2, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { RevealStagger, RevealItem } from "./Reveal";

const logos = [
  { name: "[Client Logo — Off-Plan Developer]" },
  { name: "[Client Logo — Real Estate Agency]" },
  { name: "[Client Logo — Real Estate Agency]" },
  { name: "[Client Logo — SaaS / MERN Project]" },
  { name: "[Client Logo — Mobile App Launch]" },
];

export default function LogoWall() {
  return (
    <section id="companies" className="relative py-24 sm:py-32 bg-bg-soft/40">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Companies I've Worked With"
          title="Trusted Across"
          highlight="Real Estate, SaaS & Startups"
          description="Logos go here once approved by each client. Full write-ups with real numbers live on the Portfolio page."
        />

        <RevealStagger className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {logos.map((logo) => (
            <RevealItem key={logo.name}>
              <div
                role="img"
                aria-label={logo.name}
                className="flex h-24 items-center justify-center gap-2 rounded-2xl border border-border bg-surface/40 px-4 text-center grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition"
              >
                <Building2 size={18} className="shrink-0 text-muted" />
                <span className="text-xs font-medium text-muted leading-snug">{logo.name}</span>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        <div className="mt-10 text-center">
          <a
            href="/portfolio/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/90 hover:text-gold transition-colors"
          >
            View full case studies <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
