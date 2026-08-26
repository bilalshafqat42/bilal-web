import Image from "next/image";
import { Building2, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { RevealStagger, RevealItem } from "./Reveal";

// A logo with `src` renders as a real, clickable mark linking to its case study.
// Entries without one stay as text placeholders until that client's logo and
// written permission are in hand.
type Logo = { name: string; src?: string; href?: string };

const logos: Logo[] = [
  {
    name: "LEOS Developments",
    src: "/portfolio/leos/logo/leos-logo.svg",
    href: "/portfolio/leos-developments",
  },
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
          {logos.map((logo) => {
            const tile =
              "flex h-24 items-center justify-center gap-2 rounded-2xl border border-border bg-surface/40 px-4 text-center transition";
            return (
              <RevealItem key={logo.name}>
                {logo.src && logo.href ? (
                  <a
                    href={logo.href}
                    aria-label={`${logo.name} case study`}
                    className={`${tile} group opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:border-gold/35`}
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={2000}
                      height={551}
                      className="max-h-9 w-auto object-contain"
                    />
                  </a>
                ) : (
                  <div
                    role="img"
                    aria-label={logo.name}
                    className={`${tile} grayscale opacity-70 hover:opacity-100 hover:grayscale-0`}
                  >
                    <Building2 size={18} className="shrink-0 text-muted" />
                    <span className="text-xs font-medium text-muted leading-snug">{logo.name}</span>
                  </div>
                )}
              </RevealItem>
            );
          })}
        </RevealStagger>

        <div className="mt-10 text-center">
          <a
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/90 hover:text-gold transition-colors"
          >
            View full case studies <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
