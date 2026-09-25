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

/** A tag becomes a CSS-safe token so `[data-tags~="..."]` can match it.
 *
 *  **Paired with a hand-written block of `:has()` rules in `globals.css`.** The
 *  chips below are derived from the data, but the rules that actually hide cards
 *  are not — a new discipline with a portfolio page would get a chip that
 *  filters nothing until its token is added there too. */
const token = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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

  // Filters are derived from the tags the cards actually carry, and ordered by
  // how many pieces sit behind each one. A hard-coded list would eventually
  // offer a filter that matches nothing.
  const counts = new Map<string, number>();
  for (const c of cards) for (const t of c.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  const filters = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <section className="site-container py-16 sm:py-20">
      <Reveal>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
          The work
        </span>
        <h2 className="t-h2 mt-3 text-ink">
          Every project, start to finish
        </h2>
        <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-muted">
          Each one opens into what the brief was, the decisions behind it and what
          shipped — not a gallery of screens with nothing said about them.
        </p>
      </Reveal>

      {/* Filtering is done with radio inputs and `:has()`, not JavaScript.
          Three reasons: every card stays in the HTML whichever filter is
          selected, so Google and AI crawlers always see all of them; radios are
          keyboard operable and announced correctly with no ARIA to get wrong;
          and this component stays a server component costing no client JS. */}
      <div className="work-filter mt-10">
        <fieldset className="border-0 p-0">
          <legend className="sr-only">Filter work by discipline</legend>
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-5">
            <input
              type="radio"
              name="work-filter"
              id="work-filter-all"
              defaultChecked
              className="peer/all sr-only"
            />
            <label htmlFor="work-filter-all" className="work-chip">
              All work
              <span className="work-chip-count">{cards.length}</span>
            </label>

            {filters.map(([tag, n]) => (
              <span key={tag} className="contents">
                <input
                  type="radio"
                  name="work-filter"
                  id={`work-filter-${token(tag)}`}
                  className="sr-only"
                />
                <label htmlFor={`work-filter-${token(tag)}`} className="work-chip">
                  {tag}
                  <span className="work-chip-count">{n}</span>
                </label>
              </span>
            ))}
          </div>
        </fieldset>

        <ol className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {cards.map((card) => (
            <li
              key={card.href}
              data-tags={card.tags.map(token).join(" ")}
              className={`work-item ${card.wide ? "lg:col-span-2" : ""}`}
            >
              <Reveal>
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
                    {/* An `h3`, not a `span`. This page exists to show six case
                        studies and exposed no headings at all between the
                        section `h2` and the discipline list, so a screen reader
                        user could not navigate the work by heading (roadmap
                        213.33). A heading is allowed to sit inside a link, and
                        nothing changes visually. */}
                    <h3 className="t-h4 mt-2.5 flex items-start justify-between gap-3 text-ink">
                      {card.name}
                      <ArrowUpRight
                        size={18}
                        className="mt-1 shrink-0 text-muted transition-colors group-hover:text-gold"
                      />
                    </h3>
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
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
