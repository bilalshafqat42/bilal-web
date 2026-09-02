import Link from "next/link";
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
  /** Optional second mark shown on hover. When set, this replaces the generic
   *  grayscale-to-colour treatment: an explicit art-directed swap beats a CSS
   *  filter, because the brand controls exactly what each state looks like. */
  srcHover?: string;
  width: number;
  height: number;
  heightClass: string;
  href?: string;
};

const logos: Logo[] = [
  {
    id: "leos",
    name: "LEOS Developments",
    src: "/portfolio/leos/logo/leos-white.svg",
    srcHover: "/portfolio/leos/logo/leos-dark.svg",
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
      <div className="site-container">
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
            const imgClass = `${logo.heightClass} w-auto max-w-full object-contain`;
            const mark = logo.srcHover ? (
              // Both marks are stacked and cross-faded rather than swapping src,
              // so the hover state never flashes while the second file loads.
              <span className="relative inline-flex items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className={`${imgClass} transition-opacity duration-300 group-hover:opacity-0`}
                />
                <Image
                  src={logo.srcHover}
                  alt=""
                  aria-hidden="true"
                  width={logo.width}
                  height={logo.height}
                  className={`${imgClass} absolute inset-0 m-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
              </span>
            ) : (
              <Image
                src={logo.src}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                className={imgClass}
              />
            );
            return (
              <RevealItem key={logo.id}>
                {logo.href ? (
                  <Link
                    href={logo.href}
                    aria-label={`${logo.name} case study`}
                    className={`${tile} group hover:border-gold/35 ${
                      logo.srcHover
                        ? "opacity-90 hover:opacity-100"
                        : "opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
                    }`}
                  >
                    {mark}
                  </Link>
                ) : (
                  <div className={`${tile} group opacity-60 grayscale hover:opacity-90 hover:grayscale-0`}>
                    {mark}
                  </div>
                )}
              </RevealItem>
            );
          })}
        </RevealStagger>

        <div className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/90 hover:text-gold transition-colors"
          >
            View full case studies <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
