import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import {
  proofForService,
  disciplinesInWork,
  disciplineItems,
  type Discipline,
} from "@/data/disciplines";

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

function DisciplineCards({ items }: { items: Discipline[] }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((d) => (
        <Link
          key={d.slug}
          href={`/portfolio/${d.slug}`}
          className="card-hover group rounded-2xl border border-border panel p-6"
        >
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted/70">
            {disciplineItems(d).length} pieces
          </span>
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

/** On a service category page: the work that proves this service. */
export function ServiceProof({ serviceSlug }: { serviceSlug: string }) {
  const proof = proofForService(serviceSlug);
  if (proof.length === 0) return null;

  return (
    <section className="site-container py-16 sm:py-20">
      <Reveal>
        <div className="border-b border-border pb-5">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
            The proof
          </span>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Shipped work behind this service
          </h2>
        </div>
        <DisciplineCards items={proof} />
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
  if (used.length === 0) return null;

  return (
    <section className="site-container py-16 sm:py-20">
      <Reveal>
        <div className="border-b border-border pb-5">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
            What went into this
          </span>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            The disciplines this work is made of
          </h2>
        </div>

        <DisciplineCards items={used} />

        {/* The commercial exit. A case study is usually the page organic search
            delivers someone to, and until now it was a dead end: no route to
            what the service is or what it costs. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-6">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
          >
            How work like this is priced <ArrowRight size={15} />
          </Link>
          <Link href="/process" className="text-sm text-muted transition-colors hover:text-ink">
            How a project runs, start to finish
          </Link>
          <Link href="/about" className="text-sm text-muted transition-colors hover:text-ink">
            Who you would be working with
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
