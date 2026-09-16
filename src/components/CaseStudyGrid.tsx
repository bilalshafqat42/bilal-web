import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { clients } from "@/data/caseStudies";
import { disciplinesInWork } from "@/data/disciplines";

/**
 * Every case study on the site, as one grid of cards.
 *
 * Replaces two sections that both lived on /portfolio and both claimed to be
 * the portfolio:
 *
 *   `WorkByType` — 26 loose captures in three grids, sliced by artefact type.
 *   It showed the same images the discipline pages show, on the one page where
 *   a visitor is trying to work out what you have *done*, not what format it
 *   came in.
 *
 *   `CaseStudies` — five hard-coded entries with **no images, no links and no
 *   relationship to the six real case studies in `caseStudies.ts`**. A section
 *   headed "Case Studies" that a visitor could not click into, illustrated with
 *   abstract dashboard graphics instead of the work.
 *
 * One card per case study, each linking to the real page. The image sits inside
 * a padded panel rather than bleeding to the card edge, so a run of very
 * different captures — a wide desktop site, a tall phone screen, a square
 * social post — still reads as a set instead of a collage.
 *
 * Tags are derived by `disciplinesInWork`, from the captures each piece
 * actually contains, so a card cannot claim a discipline the work does not
 * show.
 */

type Card = {
  href: string;
  image: string;
  position: "top" | "center";
  /** Full width on desktop. Used for the client overview, which is the entry
   *  point to everything under it. */
  wide?: boolean;
  eyebrow: string;
  name: string;
  summary: string;
  tags: string[];
};

function buildCards(): Card[] {
  const out: Card[] = [];

  for (const c of clients) {
    out.push({
      href: `/portfolio/${c.slug}`,
      image: c.website?.capture.src ?? c.ogImage,
      position: "top",
      wide: true,
      eyebrow: c.industry,
      name: c.name,
      summary: c.headline,
      tags: disciplinesInWork(c.slug).map((d) => d.title),
    });

    if (c.mobileApp?.lead) {
      out.push({
        href: `/portfolio/${c.slug}/mobile-app`,
        image: c.mobileApp.lead.src,
        position: "center",
        eyebrow: "Mobile app",
        name: `${c.name} app`,
        summary: c.mobileApp.heading,
        tags: ["Mobile Development", "UI / UX Design"],
      });
    }

    for (const p of c.projects) {
      out.push({
        href: `/portfolio/${c.slug}/${p.slug}`,
        image: p.cardImage,
        position: p.cardImagePosition ?? "top",
        eyebrow: "Launch campaign",
        name: p.name,
        summary: p.summary,
        tags: disciplinesInWork(c.slug, p.slug).map((d) => d.title),
      });
    }
  }

  return out;
}

export default function CaseStudyGrid() {
  const cards = buildCards();
  if (!cards.length) return null;

  return (
    <section className="site-container py-16 sm:py-20">
      <Reveal>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
          The work
        </span>
        <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Every project, start to finish
        </h2>
        <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-muted">
          Each one opens into what the brief was, the decisions behind it and what
          shipped — not a gallery of screens with nothing said about them.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {cards.map((card) => (
          <Reveal key={card.href} className={card.wide ? "lg:col-span-2" : undefined}>
            <Link
              href={card.href}
              className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-border panel"
            >
              {/* Padded well rather than a bleed image. Captures on this site
                  range from 2403x1231 to a 1206x5807 phone screen; letting each
                  one define its own card edge is what made the old page read as
                  a pile of unrelated objects. */}
              <div className="bg-bg-soft/60 p-4 sm:p-6">
                <div
                  className={`relative overflow-hidden rounded-xl border border-border/60 ${
                    card.wide ? "aspect-[16/7]" : "aspect-[16/10]"
                  }`}
                >
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes={card.wide ? "(min-width:1024px) 1100px, 100vw" : "(min-width:1024px) 540px, 100vw"}
                    className={`object-cover transition-transform duration-500 group-hover:scale-[1.02] ${
                      card.position === "top" ? "object-top" : "object-center"
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col px-5 pb-6 pt-1 sm:px-7 sm:pb-7">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted/70">
                  {card.eyebrow}
                </span>
                <span className="mt-2.5 flex items-start justify-between gap-3 text-lg font-semibold leading-snug text-ink sm:text-xl">
                  {card.name}
                  <ArrowUpRight
                    size={18}
                    className="mt-1 shrink-0 text-muted transition-colors group-hover:text-gold"
                  />
                </span>
                <span className="mt-2.5 block max-w-[58ch] text-sm leading-relaxed text-muted">
                  {card.summary}
                </span>

                {card.tags.length ? (
                  <span className="mt-5 flex flex-wrap gap-2">
                    {card.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border px-3 py-1 text-[0.7rem] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                ) : null}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
