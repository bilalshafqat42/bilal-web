import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CtaButton from "@/components/CtaButton";
import { processSteps } from "@/data/process";

/**
 * The four delivery stages, as a timeline.
 *
 * Rebuilt 2026-09-29 to the design Bilal sent. The version before it was four
 * bordered cells in a row under a centred heading — accurate, and it answered
 * none of the questions a buyer actually has at this point on the page. This
 * one answers three:
 *
 *   **How long does each stage take?**   the timing pill
 *   **What do I actually receive?**      the "you get" line
 *   **What will you need from me?**      the bar at the bottom
 *
 * That last one is the part worth keeping. Every freelancer describes their
 * process; almost none state the client's own time cost up front, and it is the
 * thing a busy buyer is quietly worried about.
 *
 * ---------------------------------------------------------------------------
 * **The stage durations are verified against the site's own published copy**,
 * not estimated — see the note on `timing` in `process.ts`. They shipped
 * bracketed, which on a live page reads as an unfinished template rather than
 * as caution.
 * ---------------------------------------------------------------------------
 *
 * Still a server component reading the same `processSteps` as `/process`, so
 * the two cannot drift. It ignores `bullets`, `proofHref` and `proofLabel`.
 */

export default function ProcessCompact() {
  return (
    <section id="process" className="relative py-24 sm:py-32">
      <div className="site-container">
        {/* Heading left, the escape hatch right. The old version centred the
            heading and buried "See the full process" below the cards, where it
            read as an afterthought rather than an offer. */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
              <span aria-hidden="true" className="h-px w-6 bg-gold/60" />
              How I Work
            </span>
            <h2 className="t-h2 mt-5 text-ink">From brief to shipped, in four stages</h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              Same path on every project, whether it is a campaign, a website or an app.
              You always know which stage we are in, what is landing next and what I need
              from you.
            </p>
          </div>

          <Link
            href="/process"
            className="group inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-gold/40 lg:self-auto"
          >
            See the full process
            <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <li key={s.step} className="flex flex-col">
              {/* The rail. Drawn per item rather than as one line behind the
                  row, because a single absolutely positioned line cannot know
                  where the columns wrap — at `sm` this is two rows and at
                  `grid-cols-1` it is four, and a full-width rule would cut
                  across the gaps. Each item draws its own dot and the segment
                  to its right; the last has no segment.

                  `aria-hidden`: it is the same sequence the numbers below
                  already state, and announcing it twice is noise. */}
              <div aria-hidden="true" className="mb-6 flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    i === 0 ? "bg-gold" : "bg-muted/40"
                  }`}
                />
                {i < processSteps.length - 1 ? (
                  <span className="hidden h-px flex-1 bg-border lg:block" />
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-gold">{s.step}</span>
                {s.timing ? (
                  <span className="rounded-md border border-border bg-surface/60 px-2.5 py-1 text-xs text-muted">
                    {s.timing.verified ? s.timing.label : `[${s.timing.label}]`}
                  </span>
                ) : null}
              </div>

              <h3 className="t-h4 mt-4 text-ink">{s.title}</h3>
              <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted/70">
                {s.subtitle}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">{s.description}</p>

              {s.deliverable ? (
                /* `mt-auto` so every "you get" line sits on the same baseline
                   however many lines the description above it runs to. Without
                   it the four deliverables stagger and the row stops reading as
                   a comparison. */
                <div className="mt-auto pt-8">
                  <hr className="border-t border-border" />
                  <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted/70">
                    You get
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/90">{s.deliverable}</p>
                </div>
              ) : null}
            </li>
          ))}
        </ol>

        {/* The client's own time cost, stated before they have to ask. */}
        <div className="mt-16 flex flex-col gap-6 rounded-2xl border border-border panel p-7 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          {/* **No hour counts here, deliberately.** This shipped as "about [3]
              hours in week one" and "[30] minutes a month" — both invented, both
              live, both read as commitments. Nobody had timed either.

              The point of the bar survives without them: what a buyer is
              actually worried about is being dragged into standing calls, and
              "one feedback round per stage, no daily check-ins" answers that
              without a number that could turn out to be wrong on the first
              project. Put real figures back the moment two projects have been
              timed. */}
          <div>
            <p className="font-semibold text-ink">
              What I need from you: a kickoff session, then one round of feedback per stage
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              No daily check-ins, no standing calls, and no chasing you for sign-off you
              did not agree to give.
            </p>
          </div>
          <CtaButton href="/appointment">Book a free consultation</CtaButton>
        </div>
      </div>
    </section>
  );
}
