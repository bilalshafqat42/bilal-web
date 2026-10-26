import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import {
  proofForService,
  disciplinesInWork,
  servicesInWork,
  disciplineItems,
  caseStudiesForService,
  proofImagesFor,
  type Discipline,
} from "@/data/disciplines";
import type { Item } from "@/lib/portfolioItems";
import Eyebrow from "@/components/ui/Eyebrow";

/**
 * The proof loop, as two blocks.
 *
 * A service page should name the work that proves it; a piece of work should
 * name the service that produced it and where the money conversation starts.
 * Before this, all eight service pages carried the same two portfolio links and
 * all six case studies linked to no service at all, so both halves of that loop
 * were open.
 *
 * Both blocks render nothing when there is nothing true to say. A service with
 * no published work shows no proof block rather than a link to an empty shelf,
 * which is the same rule the mega menu follows.
 */

/** Literal class strings, not an interpolated `lg:grid-cols-${n}` — Tailwind
 *  scans source text, so a computed class name is never generated. */
const DESKTOP_COLS: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

function DisciplineCards({ items }: { items: Discipline[] }) {
  // Column count follows the number of cards rather than being fixed at three,
  // which left four disciplines as a row of three and one stranded underneath.
  // A service page with two disciplines gets two columns, not two cards and a
  // hole.
  // Floored at two: a lone card in a one-column grid stretches the full width
  // of the container, which reads as a banner rather than as one of a set.
  const cols = DESKTOP_COLS[Math.min(Math.max(items.length, 2), 4)] ?? "lg:grid-cols-4";
  return (
    <div className={`mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 ${cols}`}>
      {items.map((d) => (
        <Link
          key={d.slug}
          href={`/portfolio/${d.slug}`}
          className="card-hover group r-card surface-1 p-6"
        >
          <Eyebrow size="sm" tone="muted">
            {disciplineItems(d).length} pieces
          </Eyebrow>
          <span className="mt-2.5 flex items-center justify-between gap-3 text-base font-semibold text-ink">
            {d.title}
            <ArrowRight size={16} className="shrink-0 text-muted transition-colors group-hover:text-gold" />
          </span>
          <span className="mt-2 block text-sm leading-relaxed text-muted">{d.blurb}</span>
        </Link>
      ))}
    </div>
  );
}

/** The pictures on a service page's case study card. One landscape board
 *  (an app mockup) on its own; square creative three across. Lazy-loaded by
 *  default: the proof block sits well below the fold on every service page.
 *  `alt=""` because they sit inside the card's link: their long descriptions
 *  would become the link's name. The "Shown:" line says what they are. */
function ProofThumbs({ items, side }: { items: Item[]; side: boolean }) {
  const first = items[0];
  if (first.width > first.height * 1.1) {
    return (
      <Image
        src={first.src}
        alt=""
        width={first.width}
        height={first.height}
        sizes={side ? "(min-width: 1280px) 460px, (min-width: 640px) 38vw, 88vw" : "(min-width: 640px) 45vw, 88vw"}
        className="h-auto w-full r-chip"
      />
    );
  }
  return (
    <span className="grid grid-cols-3 gap-2">
      {items.slice(0, 3).map((it) => (
        <Image
          key={it.key}
          src={it.src}
          alt=""
          width={it.width}
          height={it.height}
          sizes={side ? "(min-width: 1280px) 150px, (min-width: 640px) 12vw, 29vw" : "(min-width: 640px) 15vw, 29vw"}
          className="aspect-square h-auto w-full r-chip object-cover"
        />
      ))}
    </span>
  );
}

/** On a service category page: the work that proves this service. */
export function ServiceProof({ serviceSlug }: { serviceSlug: string }) {
  const proof = proofForService(serviceSlug);
  // Case studies that name this service in `Client.services`: services like
  // paid marketing, whose work leaves no capture to build a discipline page
  // from, still point at the engagement they were part of.
  const cases = caseStudiesForService(serviceSlug);
  if (proof.length === 0 && cases.length === 0) return null;

  return (
    <section className="site-container section-pad-tight">
      <Reveal>
        <div className="border-b border-border pb-5">
          <Eyebrow>
            The proof
          </Eyebrow>
          <h2 className="t-h3 mt-3 max-w-2xl text-ink">
            Shipped work behind this service
          </h2>
        </div>
        {proof.length ? <DisciplineCards items={proof} /> : null}
        {cases.length ? (
          <ul className={`mt-8 grid grid-cols-1 gap-4 ${cases.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {cases.map((c) => {
              const thumbs = proofImagesFor(c.slug, serviceSlug);
              // A lone card spans the container, so the picture sits beside
              // the text rather than above it at 1,200px wide.
              const side = thumbs.length > 0 && cases.length === 1;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/portfolio/${c.slug}`}
                    className={`card-hover group block h-full r-card surface-1 p-6 ${
                      side ? "sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:items-center sm:gap-8" : ""
                    }`}
                  >
                    {thumbs.length ? <ProofThumbs items={thumbs} side={side} /> : null}
                    <span className={`block ${thumbs.length ? (side ? "mt-5 sm:mt-0" : "mt-5") : ""}`}>
                      <Eyebrow size="sm" tone="muted">
                        Case study
                      </Eyebrow>
                      <span className="mt-2.5 flex items-center justify-between gap-3 text-base font-semibold text-ink">
                        {c.name}
                        <ArrowRight size={16} className="shrink-0 text-muted transition-colors group-hover:text-gold" />
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-muted">{c.headline}</span>
                      {thumbs.length ? (
                        // What the pictures are, in words: a crawler and a
                        // screen reader get the same proof the image gives.
                        <span className="mt-2 block text-xs leading-relaxed text-faint">
                          Shown: {thumbs[0].group ?? thumbs[0].label}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </Reveal>
    </section>
  );
}

/**
 * On a case study: what went into it, and where cost is discussed.
 *
 * `projectSlug` narrows it to one development; leaving it out covers the whole
 * client engagement. Either way the list comes from that engagement's own
 * captures, so it cannot claim a discipline the page does not show.
 */
export function WorkProof({
  clientSlug,
  projectSlug,
}: {
  clientSlug: string;
  projectSlug?: string;
}) {
  const used = disciplinesInWork(clientSlug, projectSlug);
  const services = servicesInWork(clientSlug, projectSlug);
  if (used.length === 0) return null;

  return (
    <section className="site-container section-pad-tight">
      <Reveal>
        <div className="border-b border-border pb-5">
          <Eyebrow>
            What went into this
          </Eyebrow>
          <h2 className="t-h3 mt-3 max-w-2xl text-ink">
            The disciplines this work is made of
          </h2>
        </div>

        <DisciplineCards items={used} />

        {/* The services behind the work.
            ----------------------------------------------------------------
            Added 2026-10-09. The cards above link to other portfolio pages —
            "more work like this" — and the row below links to pricing, process
            and about. Neither offered the one thing a convinced reader wants
            next: the page that sells what they just looked at.

            Measured before this: service pages carried 2 to 4 links into the
            portfolio, and `/portfolio/leos-developments` and every project
            under it carried **zero** back. The most persuasive pages on the
            site, and they dead-ended commercially. */}
        {services.length ? (
          <div className="mt-8 border-t border-border pt-6">
            <Eyebrow size="sm" tone="muted">Services behind this work</Eyebrow>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {services.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="tap-target r-chip border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-gold/40 hover:text-ink"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {/* The commercial exit. A case study is usually the page organic search
            delivers someone to, and until now it was a dead end: no route to
            what the service is or what it costs. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-6">
          <Link
            href="/pricing"
            className="tap-target inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
          >
            How work like this is priced <ArrowRight size={15} />
          </Link>
          <Link href="/process" className="tap-target text-sm text-muted transition-colors hover:text-ink">
            How a project runs, start to finish
          </Link>
          <Link href="/about" className="tap-target text-sm text-muted transition-colors hover:text-ink">
            Who you would be working with
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
