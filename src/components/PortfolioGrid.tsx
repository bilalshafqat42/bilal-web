import Link from "next/link";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import CtaButton from "@/components/CtaButton";

/**
 * "What I Actually Build" — the homepage work grid.
 *
 * Rebuilt 2026-09-25 to the reference Bilal sent: **the image is the card.**
 * No border, no panel, no overlaid label, no arrow button, no scrim, and no
 * paragraph of sell underneath. A picture, the project name, and a row of
 * discipline tags. The work is supposed to carry it; the chrome around the old
 * cards was doing the talking instead.
 *
 * ---------------------------------------------------------------------------
 * **One animation, on purpose.** Bilal asked for exactly one: the thumbnail
 * grows a little under the cursor, and the title responds. That is the whole
 * behaviour.
 *
 * What was removed to get there:
 *
 *   - A fixed-position "VIEW WORK" disc that followed the cursor across the
 *     whole section in `mix-blend-difference`. It made the section a client
 *     component for two state updates per mouse move.
 *   - `Reveal` wrappers, which faded each card in on scroll. Scroll-triggered
 *     entrance on a grid means the work is invisible until you reach it, and
 *     invisible in a screenshot or a print.
 *
 * With both gone there is no state and no effect left, so this is a **server
 * component again** — it was `"use client"` purely for that cursor. The whole
 * section now ships as HTML with no JavaScript behind it.
 * ---------------------------------------------------------------------------
 *
 * **On the content.** Bilal offered placeholders "for the time being". These
 * are all real, published projects with real routes instead, because a
 * placeholder on a portfolio is a claim about work that does not exist, and
 * the repo already had nine genuine pieces sitting in `caseStudies`. They are
 * all LEOS, which is honest — it is the one client with published work — but it
 * does mean the homepage reads as a single-client portfolio. Worth revisiting
 * the moment a second client's work can be shown; see roadmap 213.12.
 */

type Card = {
  /** The project name. Short — it is set at heading size and sits alone. */
  title: string;
  /** Two or three disciplines. These are what the tag pills render. */
  tags: string[];
  href: string;
  image: string;
  alt: string;
  /** Where the crop is anchored. Defaults to the top.
   *
   *  Full-page website captures are many times taller than the frame, so the
   *  top is the hero and anywhere else is a slice of mid-page. Square social
   *  creatives are the opposite: a 1:1 in a 16:9 frame loses 44% of its height
   *  whatever you do, and taking that off the top decapitates the artwork —
   *  "HADLEY HEIGHTS" was being cut through the middle of the word. */
  focus?: "top" | "center";
};

/** The row rhythm Bilal specified: three across, then two, then four.
 *
 *  Desktop only. Below `lg` this is ignored entirely and the grid is one or two
 *  columns, because a four-up row at tablet width gives each piece about 170px
 *  and a portfolio you cannot see is not a portfolio.
 *
 *  Expressed as a pattern rather than a span baked into each card, so the rows
 *  stay right when a card is added or removed: `rowsOf` below slices the list
 *  by this and derives each cell's span from the row it landed in. A hard-coded
 *  `col-span-4` on card three would silently break the day a fourth card goes
 *  in front of it. */
const ROW_PATTERN = [3, 2, 4] as const;

const cards: Card[] = [
  // Row one, three across.
  {
    title: "LEOS Developments",
    tags: ["UI Design", "Web Development"],
    href: "/portfolio/leos-developments",
    image: "/portfolio/leos/landing-page/leos-thumb.avif",
    alt: "LEOS Developments corporate website, showing the developer's project listing interface",
  },
  {
    title: "Hadley Heights",
    tags: ["Web Development", "Conversion"],
    href: "/portfolio/leos-developments/hadley-heights",
    image: "/portfolio/leos/hadley-heights/landing-page/hadley-heights-thumb.avif",
    alt: "Hadley Heights launch landing page, with the price qualifier and request-a-callback form in the hero",
  },
  {
    title: "LEOS Mobile App",
    tags: ["App Development", "UI Design"],
    href: "/portfolio/leos-developments/mobile-app",
    image: "/portfolio/leos/mobile-app/leos-mobile-featured.avif",
    alt: "The LEOS cross-platform mobile app open on the Hadley Heights development, shown on an iPhone",
  },

  // Row two, two across. The widest cells in the grid, so the two projects with
  // the most to look at sit here.
  {
    title: "Cavendish Square",
    tags: ["Web Development", "UI Design", "Mobile"],
    href: "/portfolio/leos-developments/cavendish-square",
    image: "/portfolio/leos/cavendish/landing-page/cavendish-thumb.avif",
    alt: "Cavendish Square landing page, showing the hero with register-your-interest and check-construction-progress routes",
  },
  {
    title: "LEOS Campaign Creative",
    tags: ["Social Media", "Brand Creative"],
    href: "/portfolio/leos-developments",
    image: "/portfolio/leos/social-media/1.avif",
    alt: "Award-winner campaign creative for LEOS Developments set over a residential high-rise",
    focus: "center",
  },

  // Row three, four across. The narrowest cells, so pieces that read at a
  // glance rather than ones that need studying.
  {
    title: "Weybridge Gardens",
    tags: ["Web Development"],
    href: "/portfolio/leos-developments/weybridge-gardens",
    image: "/portfolio/leos/weybridge-gardens/landing-page/weybridge-gardens-thumb.avif",
    alt: "Weybridge Gardens landing page, showing the balcony hero and register-your-interest call to action",
  },
  {
    title: "Weybridge Gardens 2",
    tags: ["Web Development"],
    href: "/portfolio/leos-developments/weybridge-gardens-2",
    image: "/portfolio/leos/weybridge-gardens-2/landing-page/weybridge-gardens-2-thumb.avif",
    alt: "Weybridge Gardens 2 landing page, showing the Provence Edition hero and pricing section",
  },
  {
    title: "Hadley Heights Social",
    tags: ["Social Media"],
    href: "/portfolio/leos-developments/hadley-heights",
    image: "/portfolio/leos/hadley-heights/social-media/1.avif",
    alt: "Hadley Heights social campaign creative",
    focus: "center",
  },
  {
    // Was the Cavendish mobile capture, which is 367x5317 — a full phone
    // scroll. In a landscape frame the top slice of that is the status bar and
    // a strip of sky, which is what it rendered as. This asset is 1398x768,
    // near enough 16:9 that the frame crops almost nothing.
    title: "LEOS App Screens",
    tags: ["App Development", "UI Design"],
    href: "/portfolio/leos-developments/mobile-app",
    image: "/portfolio/leos/mobile-app/leos-login-mobile.avif",
    alt: "Sign-in and account screens from the LEOS cross-platform mobile app",
  },
];

/** Slices the list into rows following `ROW_PATTERN`, cycling it if there are
 *  more cards than the pattern accounts for. A short final row simply renders
 *  short rather than stretching to fill, which keeps every cell in the grid on
 *  the same set of widths. */
function rowsOf<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  let i = 0;
  let p = 0;
  while (i < items.length) {
    const take = ROW_PATTERN[p % ROW_PATTERN.length];
    rows.push(items.slice(i, i + take));
    i += take;
    p += 1;
  }
  return rows;
}

/** Row length to column span, against a 12-column grid.
 *
 *  12 is the grid width because it divides by 3, 2 and 4 with nothing left
 *  over, which is the only reason those three row counts can share one grid.
 *
 *  Written out rather than computed as `12 / n`: Tailwind scans the source for
 *  whole class names, so a template literal like `lg:col-span-${n}` generates
 *  no CSS at all and every cell would silently fall back to one column. */
const SPAN: Record<number, string> = {
  2: "lg:col-span-6",
  3: "lg:col-span-4",
  4: "lg:col-span-3",
};

export default function PortfolioGrid() {
  const rows = rowsOf(cards);

  return (
    <section id="work-carousel" className="relative py-20 sm:py-24">
      <div className="site-container">
        <SectionHeading
          eyebrow="Selected Work"
          title="What I Actually"
          highlight="Build"
          description="Every piece here is work that shipped, not a concept."
        />

        {/* One grid, not one per row.
        
            Rows as separate grids would each solve their own column widths, and
            the gaps between rows would stop matching the gaps within them. A
            single 12-column grid with spans that sum to 12 per row gives the
            3/2/4 rhythm and one consistent gutter everywhere. */}
        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16">
          {rows.flatMap((row) =>
            row.map((card) => (
              <Link
                key={card.href + card.title}
                href={card.href}
                className={`group block ${SPAN[row.length] ?? "lg:col-span-4"}`}
              >
                {/* The frame is what clips the zoom. The image scales inside a
                    box that does not, so the growth reads as the picture
                    pushing against its edges rather than the whole tile
                    swelling and shoving its neighbours.
                    
                    **16:9, and the thumbnails are cut to match it.**
                    
                    The first attempt pointed these at the existing landing page
                    hero crops and let CSS do the cropping. That cannot work,
                    measured: those crops are 1.45:1 and each one turns white at
                    70-80% of its own height, where the page's next section
                    begins. `cover` in a 1.78 frame shows the top 82% of the
                    source, so a white stripe sat along the bottom of four
                    thumbnails. No frame ratio fixes it — hiding the stripe on
                    the worst of them needs a 2.07:1 window, which is a
                    letterbox, not a thumbnail.
                    
                    So the thumbnails are their own assets, cut from the
                    full-page captures at each page's **real** hero height —
                    detected by scanning down for the row where the capture
                    turns light, rather than assumed, because the four heroes
                    run from 1.78:1 to 2.05:1 and no single guess fits them.
                    Each is then fitted to 16:9, which trims the sides of the
                    wider ones and keeps every pixel dark. 42-69KB each.
                    
                    Pointing these at the full captures instead would also have
                    removed the stripe, and cost far more: those files run to
                    1600x6644, so the browser would fetch an entire page scroll
                    to paint a 316px thumbnail. */}
                <div className="relative aspect-video overflow-hidden rounded-xl bg-surface/40">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    // Three different cell widths at desktop, and `sizes` can
                    // only describe one. The widest is taken — the two-up row
                    // at roughly half the viewport — because guessing low makes
                    // the browser fetch a source too small for those cells and
                    // upscale it, which is visible. Guessing high only costs
                    // bytes on the narrow cells.
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 48vw"
                    className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
                      card.focus === "center" ? "object-center" : "object-top"
                    }`}
                  />
                </div>

                {/* `t-h4` rather than a size of its own: the project name is a
                    heading and the scale already has a step for it. */}
                <h3 className="t-h4 mt-5 text-ink transition-colors group-hover:text-gold">
                  {card.title}
                </h3>

                {/* A list, because it is one — a screen reader announces "list,
                    2 items" rather than running the disciplines together into
                    one string. */}
                <ul className="mt-3 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors group-hover:border-gold/30"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </Link>
            ))
          )}
        </div>

        <div className="mt-20 text-center">
          <CtaButton href="/portfolio">View the full portfolio</CtaButton>
          <p className="mt-4 text-base text-muted">
            Design, development and marketing work, by client and by project.
          </p>
        </div>
      </div>
    </section>
  );
}
