"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The rotating discipline, typed into a gold block.
 *
 * The pattern is tentwenty's: a sentence that never changes, and one word at
 * the end that does, sitting *on* a solid colour rather than being coloured
 * text. Theirs rotates client names — g42, aldar, astrazeneca — which is a
 * client list disguised as a headline.
 *
 * That is not the version to copy yet. There is one published case study
 * (roadmap 213.12), so rotating client names here would mean LEOS, Tomorrow
 * World and Refine, two of which have nothing behind them and one of which is
 * Bilal's employer. **When three real case studies exist, swap `PHRASES` for
 * client names and this component is already the right shape.**
 *
 * What rotates instead is the discipline, because the breadth *is* the
 * argument: the sentence says one person, the rotation says how many jobs that
 * one person covers.
 *
 * **It loops continuously, on Bilal's instruction** — it ran once and rested
 * before. That is why the pause control in `DisciplineStatement` exists rather
 * than being optional polish: WCAG 2.2.2 (Pause, Stop, Hide) is Level A and
 * requires a mechanism to stop any motion that starts automatically and runs
 * past five seconds. An endless loop with a control satisfies it; an endless
 * loop without one does not, and Phase 3 item 13 plans to sell WCAG 2.2 audits.
 * `prefers-reduced-motion` skips the animation entirely and rests on `FINAL`.
 *
 * The typing is measured in JavaScript rather than CSS `steps()`, so the copy
 * can change freely and the timing follows. The old hero effect hard-coded
 * character counts in `globals.css` with a warning to update them by hand.
 */

/** Every phrase has to read as a complete sentence after the stem, **"Fifteen
 *  years of experience in ..."**.
 *
 *  Two things that look like style and are not:
 *
 *  1. **The preposition is `in`, not `across`.** "Across" means *spanning
 *     several things*, so it needs a plural or collective object. It is right in
 *     "experience across marketing, design and development" and wrong in
 *     "experience across UI/UX design", which is one field. The stem said
 *     "across" until 2026-09-24 and was wrong in five of seven frames.
 *
 *  2. **These are fields, not deliverables.** "Experience in web development" is
 *     idiomatic; "experience in web apps" is not, because a preposition of field
 *     wants a discipline after it. That is why "web apps" and "mobile apps"
 *     became "web development" and "app development", and why "marketing tools"
 *     came out entirely — it is a thing built, not a field worked in.
 *
 *  `FINAL` is the resting frame — what the server renders, what reduced motion
 *  shows, and what a paused visitor is most likely to be looking at. It is
 *  "all of it." rather than a service name because a single frame of any other
 *  reads as a specialist claim. */
const PHRASES = [
  "paid ads",
  "UI/UX design",
  "web development",
  "app development",
  "CRM automation",
  "all of it.",
] as const;

const FINAL = PHRASES[PHRASES.length - 1];

/** One phrase occupies ~3s end to end, as asked. Typing and erasing are fixed
 *  per character, so the hold absorbs the difference and a short phrase does
 *  not flash past while a long one drags. */
const CYCLE_MS = 3000;
const TYPE_MS = 45;
const ERASE_MS = 22;
const MIN_HOLD_MS = 700;

export default function RotatingDiscipline({ paused = false }: { paused?: boolean }) {
  // Starts on the resting phrase so the first paint already reads correctly and
  // a visitor with JavaScript off sees the sentence the page is making.
  const [text, setText] = useState<string>(FINAL);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let phrase = 0;
    let chars = 0;
    let erasing = false;

    const holdFor = (word: string) =>
      Math.max(CYCLE_MS - word.length * (TYPE_MS + ERASE_MS), MIN_HOLD_MS);

    const tick = () => {
      if (cancelled) return;
      const target = PHRASES[phrase];

      if (!erasing) {
        chars += 1;
        setText(target.slice(0, chars));
        if (chars < target.length) {
          timer.current = setTimeout(tick, TYPE_MS);
        } else {
          erasing = true;
          timer.current = setTimeout(tick, holdFor(target));
        }
        return;
      }

      chars -= 1;
      setText(target.slice(0, chars));
      if (chars > 0) {
        timer.current = setTimeout(tick, ERASE_MS);
      } else {
        erasing = false;
        // Wraps rather than stopping. The loop is continuous by instruction.
        phrase = (phrase + 1) % PHRASES.length;
        timer.current = setTimeout(tick, TYPE_MS);
      }
    };

    // Kicked off on a timer rather than synchronously, which keeps this out of
    // `react-hooks/set-state-in-effect` — the rule this project fixed properly
    // rather than suppressed in Phase 0 item 3 — and holds the finished state
    // for a beat on arrival instead of blanking during hydration.
    timer.current = setTimeout(() => {
      setText("");
      timer.current = setTimeout(tick, TYPE_MS);
    }, 600);

    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [paused]);

  // One text node, deliberately.
  //
  // An earlier version stacked an invisible copy of the longest phrase to
  // reserve width, plus an `sr-only` copy for the accessible name. Both are text
  // in the DOM, and `aria-hidden` hides text from a screen reader but not from a
  // crawler — the rendered heading came out as "…forCRM automationall of it.all
  // of it." Checked in the built HTML, not assumed.
  //
  // No reservation is needed: the block sits alone on its own line, so growing
  // and shrinking moves nothing else. The width change *is* the effect.
  return (
    // Its own line-height and padding, in `em`, and both matter.
    //
    // The parent sets `leading-[1.04]` for tight display type between lines. At
    // that value the line box is *shorter than the font's content area* — a sans
    // face needs roughly 1.2em for ascender plus descender — so half-leading
    // goes negative and descenders hang outside the box. Visible as the `p` of
    // "paid ads" touching the bottom edge of the gold while "CRM automation",
    // which has no descender, sat comfortably centred. Bilal spotted it.
    //
    // `leading-[1.25]` contains the full content area, so the block is the same
    // height for every phrase and no glyph ever escapes it. The two caps-only
    // phrases then carry a little more space under the baseline, which is correct:
    // a highlight box should be one consistent height, not jump per word.
    //
    // Padding in `em` rather than `px` so it scales with the font — the same
    // block renders at 2.4rem on a phone and 4.6rem at desktop, and a fixed 4px
    // is proportionally very different at each.
    <span className="inline-block w-fit whitespace-nowrap rounded-lg bg-gold px-[0.18em] py-[0.04em] leading-[1.25] text-[#14140f]">
      {text || " "}
      <span aria-hidden="true" className={paused ? "hidden" : "type-caret-block"} />
    </span>
  );
}
