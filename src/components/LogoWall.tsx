import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { RevealStagger, RevealItem } from "./Reveal";

// A logo with `src` renders as a real, clickable mark linking to its case study.
// Entries without one stay as text placeholders until that client's logo and
// written permission are in hand.
// `id` is the React key, not `name`: two entries could legitimately share a
// display label, and keying on the label caused a duplicate-key warning.
//
// `href` is set only once a client has a real case study to link to. A logo with
// no href still renders as a real mark — it just isn't clickable yet.
//
// `heightClass` tunes optical weight per logo: a stacked lockup (Tomorrow World)
// needs more height than a wide wordmark (LEOS) to read as the same size.
type Logo = {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
  heightClass: string;
  href?: string;
};

const logos: Logo[] = [
  {
    id: "leos",
    name: "LEOS Developments",
    src: "/portfolio/leos/logo/leos-logo.svg",
    width: 2000,
    height: 551,
    heightClass: "max-h-8",
    href: "/portfolio/leos-developments",
  },
  {
    id: "tomorrow-world",
    name: "Tomorrow World Real Estate",
    src: "/portfolio/tomorrow/logo/tomorrow-world-logo.svg",
    width: 2004,
    height: 1220,
    heightClass: "max-h-14",
  },
  {
    id: "refine",
    name: "Refine",
    src: "/portfolio/refine/logo/refine-dubai-logo.svg",
    width: 2000,
    height: 648,
    heightClass: "max-h-10",
  },
];

export default function LogoWall() {
  return (
    <section id="companies" className="relative py-24 sm:py-32 bg-bg-soft/40">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Companies I've Worked With"
          title="Trusted Across"
          highlight="UK & UAE Real Estate"
          description="Property developers in the UK and UAE, across corporate websites, off-plan launch campaigns, and the brand work around them."
        />

        <RevealStagger className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {logos.map((logo) => {
            const tile =
              "flex h-28 items-center justify-center rounded-2xl border border-border bg-surface/40 px-6 transition";
            const mark = (
              <Image
                src={logo.src}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                className={`${logo.heightClass} w-auto max-w-full object-contain`}
              />
            );
            return (
              <RevealItem key={logo.id}>
                {logo.href ? (
                  <a
                    href={logo.href}
                    aria-label={`${logo.name} case study`}
                    className={`${tile} opacity-70 grayscale hover:opacity-100 hover:grayscale-0 hover:border-gold/35`}
                  >
                    {mark}
                  </a>
                ) : (
                  <div className={`${tile} opacity-60 grayscale hover:opacity-90 hover:grayscale-0`}>
                    {mark}
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
