import Link from "next/link";
import Image from "next/image";
import { RevealStagger, RevealItem } from "./Reveal";

/**
 * The client logo set, extracted from `LogoWall` so it can appear in more than
 * one place without its markup being duplicated.
 *
 * Two variants, because the same logos do two different jobs:
 *
 *   "wall"  the original 3-up tiled grid with the reveal stagger. This is what
 *           `LogoWall` renders, and it is byte-for-byte the previous output —
 *           the extraction is not allowed to change how that section looks.
 *   "row"   a denser untiled strip for sitting above a CTA, where the logos are
 *           supporting evidence rather than the subject of the section. It sets
 *           no horizontal alignment of its own — pass `justify-center` or
 *           `justify-start` from the call site, since a centred section and a
 *           left-aligned page column want different answers.
 *
 * Server component. It renders `Reveal*`, which is client, but that is a client
 * island inside a server tree rather than a client boundary here.
 *
 * A logo with `src` renders as a real, clickable mark linking to its case study.
 * Entries without an `href` still render as a real mark, just not clickable —
 * `href` is set only once a client has a case study to link to.
 *
 * `id` is the React key, not `name`: two entries could legitimately share a
 * display label, and keying on the label caused a duplicate-key warning.
 *
 * `heightClass` tunes optical weight per logo: a stacked lockup (Tomorrow World)
 * needs more height than a wide wordmark (LEOS) to read as the same size.
 */
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

/** Both marks are stacked and cross-faded rather than swapping `src`, so the
 *  hover state never flashes while the second file loads. */
function Mark({ logo, imgClass }: { logo: Logo; imgClass: string }) {
  if (!logo.srcHover) {
    return (
      <Image
        src={logo.src}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        className={imgClass}
      />
    );
  }
  return (
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
  );
}

type Props = {
  variant?: "wall" | "row";
  /** Layout-only classes from the call site, e.g. `mt-14`. */
  className?: string;
};

export default function ClientLogoRow({ variant = "wall", className = "" }: Props) {
  if (variant === "row") {
    return (
      <ul className={`flex flex-wrap items-center gap-x-10 gap-y-6 ${className}`}>
        {logos.map((logo) => {
          const imgClass = `${logo.heightClass} w-auto max-w-full object-contain`;
          const inner = <Mark logo={logo} imgClass={imgClass} />;
          return (
            <li key={logo.id} className="flex items-center">
              {logo.href ? (
                <Link
                  href={logo.href}
                  aria-label={`${logo.name} case study`}
                  className="group opacity-70 transition-opacity hover:opacity-100"
                >
                  {inner}
                </Link>
              ) : (
                <span className="group opacity-50 grayscale transition hover:opacity-80 hover:grayscale-0">
                  {inner}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <RevealStagger className={`grid grid-cols-2 gap-4 sm:grid-cols-3 ${className}`}>
      {logos.map((logo) => {
        const tile =
          "flex h-28 items-center justify-center rounded-2xl border border-border bg-surface/40 px-6 transition";
        const imgClass = `${logo.heightClass} w-auto max-w-full object-contain`;
        const mark = <Mark logo={logo} imgClass={imgClass} />;
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
  );
}
