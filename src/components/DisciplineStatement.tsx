"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import RotatingDiscipline from "@/components/RotatingDiscipline";

/**
 * The breadth statement that opens the homepage, in tentwenty's shape.
 *
 * A sentence that never changes, one word at the end that does, sitting **on** a
 * solid colour block rather than being coloured text, with a link underneath and
 * a lot of air around it. Bilal sent four screenshots of the reference.
 *
 * It opens the page, above the hero, and the hero below it is untouched — same
 * headline, same paragraph, same original typing effect. The stem here is lifted
 * from the hero's own paragraph so the two agree without repeating "One senior
 * partner", which is the hero's first line.
 *
 * Deliberately sparse, as the reference is. The temptation is to add cards
 * under it, which would turn it back into the list it exists to avoid;
 * `CapabilityLedger` sits directly below and is where the detail belongs.
 *
 * A client component, which it did not used to be. The pause control and the
 * rotation have to share state, and the alternative was threading a render prop
 * through a server boundary for one button. The band is a statement, a sentence
 * and two controls, so shipping it as client costs almost nothing.
 */
export default function DisciplineStatement() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-label="What I do"
      // Equal 90px top and bottom, as specified.
      //
      // It was asymmetric and visibly so: `pt-36` / `pb-28` computed to 144px
      // above and 112px below, which Bilal measured off the element inspector.
      // A single `py` value rather than a pt/pb pair so the two cannot drift
      // apart again the next time one of them is tuned.
      className="opener-light relative py-[90px]"
    >
      <div className="site-container">
        <div // 60 / 10 / 30 at desktop, as specified: the statement takes 60%, a 10%
            // gap, then the paragraph and its CTA in the remaining 30%. Percentages
            // rather than fr units because those three numbers are the instruction —
            // fr would redistribute space as the content changed and quietly stop
            // being 60/10/30.
            //
            // `gap-y-0` at lg or the row gap from the stacked mobile layout would
            // still apply and push the columns apart vertically.
            className="grid gap-10 lg:grid-cols-[60%_30%] lg:items-end lg:gap-x-[10%] lg:gap-y-0">
          {/* A `<p>`, not a heading.
           *
           * The hero owns the page's only `<h1>` and `h1-check` enforces that on
           * all 30 routes. An `h2` here would sit *before* that `h1` in the
           * document and invert the outline for anyone navigating by heading.
           * This is a display statement rather than a section title, so a
           * paragraph is the honest element, and the `<section>` carries an
           * `aria-label` so the landmark is still named. */}
          <p // No `max-w` at desktop. A character cap undercut the 60% track — at
            // 1920 it held the text to ~820px inside a 1104px column, so the
            // measured split came out 44.6/25.4/30 instead of 60/10/30. The
            // column now sets the measure and the explicit `<br />` below still
            // puts the gold block on its own line.
            className="t-display max-w-[17ch] sm:max-w-none">
            Fifteen years of experience in{" "}
            <br />
            <RotatingDiscipline paused={paused} />
          </p>

          <div className="lg:pb-4">
            {/* Deliberately small. The size gap against the statement is the
                hierarchy; matching them would give the band two headlines. One
                paragraph only, at Bilal's instruction — the discipline list that
                used to sit above it is what the rotating block already says,
                frame by frame. */}
            <p className="max-w-[34ch] text-sm leading-relaxed text-[#55555e]">
              <strong className="font-semibold text-[#14140f]">
                One point of contact for all of it.
              </strong>{" "}
              No account managers, no handoffs, and no week spent translating between three
              suppliers.
            </p>

            <hr className="mt-6 border-t border-black/10" />

            <div className="mt-6 flex items-center justify-between gap-4">
              <Link
                href="/services"
                className="group inline-flex items-center gap-3 text-base font-medium text-[#14140f] transition-opacity hover:opacity-60"
              >
                <ArrowRight
                  size={18}
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                />
                What I can do for you
              </Link>

              {/* Not optional polish.
               *
               * The rotation loops continuously by instruction, and WCAG 2.2.2
               * (Pause, Stop, Hide) is **Level A**: motion that starts
               * automatically and runs past five seconds needs a mechanism to
               * stop it. This is that mechanism. Delete it and the first screen
               * of the site that plans to sell WCAG 2.2 audits (Phase 3 item 13)
               * becomes a Level A failure.
               *
               * Sized and coloured as a caption-level control so it does not
               * compete with the link beside it. `prefers-reduced-motion` stops
               * the animation independently; this is for everyone else. */}
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                aria-pressed={paused}
                aria-label={paused ? "Resume the rotating text" : "Pause the rotating text"}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8a8a92] transition-colors hover:bg-black/5 hover:text-[#14140f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14140f]"
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
