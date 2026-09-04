import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { processSteps } from "@/data/process";

/**
 * The four delivery stages as a single compact row.
 *
 * This is the homepage version. The full treatment — pinned scroll, per-step
 * imagery, the bullet detail — moved to `/process`, because it was one of three
 * homepage sections that between them restated the same offer, and it was by
 * far the tallest.
 *
 * Server component. It reads the same `processSteps` as the full version, so
 * the two can never drift; it just ignores `image`, `alt` and `bullets`.
 *
 * No GSAP here, deliberately. The full version needs it for the pinned scroll;
 * a four-across row does not, and importing it would pull GSAP and
 * ScrollTrigger onto the homepage for no visual gain.
 */
export default function ProcessCompact() {
  return (
    <section id="process" className="relative py-24 sm:py-32">
      <div className="site-container">
        <SectionHeading
          eyebrow="How I Work"
          title="A Structured Path From"
          highlight="Brief To Shipped Work"
          description="Four stages, every project. The detail behind each one, and the work it produced, is on the process page."
        />

        <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s) => (
            <li key={s.step} className="bg-bg p-7">
              <span className="font-mono text-xs text-gold">{s.step}</span>
              <p className="mt-4 font-semibold leading-snug text-ink">{s.title}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted/70">{s.subtitle}</p>
              <p className="mt-3 text-base leading-relaxed text-muted">{s.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Link
            href="/process"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
          >
            See the full process <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
