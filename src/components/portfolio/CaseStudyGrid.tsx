import { WorkCardView } from "@/components/portfolio/WorkShowcase";
import Reveal from "@/components/ui/Reveal";
import { publishedClients } from "@/data/caseStudies";
import { OG_IMAGE_URL } from "@/lib/ogImage";
import { disciplinesInWork, disciplinesFromServices } from "@/data/disciplines";
import Eyebrow from "@/components/ui/Eyebrow";

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
  /** Read from the data the image came from, so it describes the actual
   *  capture. Was `alt=""` until 2026-10-14: seven covers on /portfolio with
   *  nothing for a screen reader or an image search to go on. */
  alt: string;
  position: "top" | "center";
  /** The image's own size, so the card asks for a sharp enough source. */
  width: number;
  height: number;
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

  for (const c of publishedClients()) {
    // Tags from `services` first (the engagement as Bilal describes it, which
    // for Texdale leads with the marketing), then the ones the captures prove.
    const tags = [
      ...disciplinesFromServices(c.slug).map((d) => d.title),
      ...disciplinesInWork(c.slug).map((d) => d.title),
    ].filter((t, i, all) => all.indexOf(t) === i);
    out.push({
      href: `/portfolio/${c.slug}`,
      // The small crop where there is one: the full capture is a whole page
      // scroll to download for a 16:7 window onto its top.
      image: c.website?.cardImage?.src ?? c.website?.capture.src ?? c.ogImage ?? OG_IMAGE_URL,
      width: c.website?.cardImage?.width ?? c.website?.capture.width ?? 1600,
      height: c.website?.cardImage?.height ?? c.website?.capture.height ?? 1000,
      alt: c.website?.capture.alt ?? `${c.name} case study cover`,
      position: "top",
      wide: true,
      eyebrow: c.industry,
      name: c.name,
      summary: c.headline,
      tags,
    });

    if (c.mobileApp?.lead) {
      out.push({
        href: `/portfolio/${c.slug}/mobile-app`,
        image: c.mobileApp.lead.src,
        width: c.mobileApp.lead.width,
        height: c.mobileApp.lead.height,
        alt: c.mobileApp.lead.alt,
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
        width: 1600,
        height: 1000,
        alt: p.cardImageAlt ?? `${p.name} campaign creative`,
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
    <section className="site-container section-pad-tight">
      <Reveal>
        <Eyebrow>
          The work
        </Eyebrow>
        <h2 className="t-h2 mt-3 text-ink">
          Every project, start to finish
        </h2>
        <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-muted">
          Each one opens into what the brief was, the decisions behind it and what
          shipped, not a gallery of screens with nothing said about them.
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

        {/* Tall cards in pairs, drawn by the same component as the homepage
            (2026-11-13), so the two pages can never drift apart. The filter
            still reads `data-tags`; the tags are no longer printed under each
            card, which is what made the old grid read as a list. */}
        <ol className="mx-auto mt-12 grid max-w-[1200px] grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-24">
          {cards.map((card) => (
            <li key={card.href} data-tags={card.tags.map(token).join(" ")} className="work-item">
              <Reveal>
                <WorkCardView
                  kind="pair"
                  card={{
                    slug: card.href,
                    title: card.name,
                    href: card.href,
                    summary: card.summary,
                    image: {
                      src: card.image,
                      width: card.width,
                      height: card.height,
                      alt: card.alt,
                      // Client covers are 16:10 website heroes with the
                      // headline on the left; project covers are tall page
                      // captures, which must show their top, not their middle.
                      // A full-page capture (taller than wide) is shown from
                      // its top, as LEOS's overview card is.
                      focus:
                        card.height > card.width
                          ? "top"
                          : card.wide
                            ? "left"
                            : card.position === "top"
                              ? "top"
                              : "center",
                    },
                  }}
                />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
