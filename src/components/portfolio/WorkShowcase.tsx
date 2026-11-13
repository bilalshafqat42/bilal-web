import Link from "next/link";
import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import type { WorkCard, WorkImage } from "@/data/workCards";

/**
 * The portfolio section, reusable on any page: a heading, project cards in an
 * editorial rhythm, and one link onward.
 *
 * Added 2026-11-12, replacing the homepage PortfolioGrid, from the wireframe
 * Bilal approved on the "Portfolio Redesign Wireframes" canvas. The grid it
 * replaces mixed three, two and four across, cropped every card differently
 * and hung tag pills under each one, so it read as a list of screenshots. This
 * follows the pattern of the studio portfolio he pointed to (brande.ae): tall
 * vertical cards in pairs, one shape every time, a name and a quiet link
 * under each, and nothing else. A wide card is still available through
 * `pattern`, but off by default since 2026-11-13.
 *
 * Desktop (lg and up): a 1200px column. Portrait cards are 5:6 at about
 * 576 x 691, wide cards 15:8 at 1200 x 640, 48px apart across and 96px between
 * rows. Below lg every card is the same 5:6 portrait, one per row, because a
 * 15:8 image on a phone is a thin strip.
 *
 * Corners are square on purpose. The rest of the site rounds its cards; the
 * work is the one place that should look like a printed page.
 */

type Row = { kind: "pair" | "wide"; cards: WorkCard[] };

/** Splits the cards into rows following `pattern`, cycling it. A pair with
 *  one card left keeps that card tall, alone in the left column, the way the
 *  reference portfolio ends its list, rather than stretching it wide. */
function rowsOf(cards: WorkCard[], pattern: Row["kind"][]): Row[] {
  const rows: Row[] = [];
  let i = 0;
  let p = 0;
  while (i < cards.length) {
    const kind = pattern[p % pattern.length];
    const take = kind === "pair" ? 2 : 1;
    rows.push({ kind, cards: cards.slice(i, i + take) });
    i += take;
    p += 1;
  }
  return rows;
}

const PORTRAIT = 5 / 6;
const WIDE = 15 / 8;

/** `sizes` for an image painted with `object-cover` in a frame. When the image
 *  is wider than the frame it is painted wider than the frame, so the browser
 *  is asked for a source that wide, or the crop comes out soft. */
function sizesFor(img: WorkImage, kind: Row["kind"]): string {
  const ratio = img.width / img.height;
  const scale = (frame: number) => Math.max(1, ratio / frame);
  const mobile = Math.ceil(100 * scale(PORTRAIT));
  const desktop = kind === "wide" ? Math.ceil(1200 * scale(WIDE)) : Math.ceil(576 * scale(PORTRAIT));
  return `(max-width: 1023px) ${mobile}vw, ${desktop}px`;
}

const POSITION: Record<NonNullable<WorkImage["focus"]>, string> = {
  left: "object-left",
  center: "object-center",
  top: "object-top",
};

export function WorkCardView({ card, kind }: { card: WorkCard; kind: Row["kind"] }) {
  const img = (kind === "wide" ? card.wide : card.portrait) ?? card.image;
  return (
    <Link href={card.href} className="group block">
      <div
        className={`relative overflow-hidden bg-surface/40 aspect-[5/6] ${
          kind === "wide" ? "lg:aspect-[15/8]" : ""
        }`}
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizesFor(img, kind)}
          className={`object-cover ${POSITION[img.focus ?? "center"]} transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
        />
      </div>
      {kind === "wide" ? (
        <div className="mt-5 grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-12">
          <h3 className="text-lg font-semibold text-ink transition-colors group-hover:text-gold">{card.title}</h3>
          <div>
            <p className="text-sm text-muted leading-relaxed">{card.summary}</p>
            <p className="mt-2.5 font-mono text-[0.7rem] tracking-[0.16em] text-muted transition-colors group-hover:text-gold">
              VIEW CASE STUDY <span aria-hidden="true">→</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-semibold text-ink transition-colors group-hover:text-gold">{card.title}</h3>
          <p className="shrink-0 font-mono text-[0.7rem] tracking-[0.16em] text-muted transition-colors group-hover:text-gold">
            VIEW CASE STUDY <span aria-hidden="true">→</span>
          </p>
        </div>
      )}
    </Link>
  );
}

export default function WorkShowcase({
  cards,
  eyebrow,
  heading,
  id,
  cta,
  // Every card tall, in pairs (Bilal, 2026-11-13: "all tall, no wide card").
  // Pass ["pair", "wide"] to bring the wide feature card back on a page.
  pattern = ["pair"],
}: {
  cards: WorkCard[];
  eyebrow: string;
  heading: string;
  /** The section's anchor. */
  id?: string;
  /** The link under the cards, and repeated beside the heading on desktop. */
  cta?: { href: string; label: string };
  /** The row rhythm, cycled. Defaults to tall pairs only. */
  pattern?: Row["kind"][];
}) {
  const rows = rowsOf(cards, pattern);
  return (
    <section id={id} className="relative section-pad scroll-mt-28">
      <div className="site-container">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-3xl">
                <Eyebrow>{eyebrow}</Eyebrow>
                <h2 className="t-h2 mt-4 text-ink">{heading}</h2>
              </div>
              {cta ? (
                <Link
                  href={cta.href}
                  className="hidden min-h-11 items-center gap-2.5 border border-white/20 px-5 font-mono text-[0.7rem] tracking-[0.16em] text-ink transition-colors hover:border-gold hover:text-gold lg:inline-flex"
                >
                  ALL WORK <span aria-hidden="true">→</span>
                </Link>
              ) : null}
            </div>
          </Reveal>

          <div className="mt-12 flex flex-col gap-14 lg:mt-16 lg:gap-24">
            {rows.map((row) =>
              row.kind === "pair" ? (
                <div key={row.cards[0].slug} className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-12">
                  {row.cards.map((card) => (
                    <Reveal key={card.slug}>
                      <WorkCardView card={card} kind="pair" />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <Reveal key={row.cards[0].slug}>
                  <WorkCardView card={row.cards[0]} kind="wide" />
                </Reveal>
              )
            )}
          </div>

          {cta ? (
            <div className="mt-16 flex justify-center lg:mt-20">
              <Link
                href={cta.href}
                className="inline-flex min-h-13 w-full items-center justify-center gap-2.5 border border-white/20 px-7 font-mono text-[0.7rem] tracking-[0.16em] text-ink transition-colors hover:border-gold hover:text-gold sm:w-auto"
              >
                {cta.label.toUpperCase()} <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
