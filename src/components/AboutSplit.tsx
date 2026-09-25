"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import CtaButton from "@/components/CtaButton";

/**
 * "About me", arriving over the pinned hero as you scroll.
 *
 * At rest it is the layout Bilal specified: 25% heading in black on white, 15%
 * empty and white, 60% body in white on black.
 *
 * ---------------------------------------------------------------------------
 * **The entrance, in the order he described it.** You are on the hero; you
 * scroll; the hero stays where it is, behind; the white field wipes in from the
 * left and its heading appears, with the right of the screen still showing the
 * hero through the gap; you keep scrolling and the dark column rises from the
 * bottom; then its text arrives, one piece at a time.
 *
 * **It is scrubbed, not played.** An earlier version fired a timeline once when
 * the band came into view, which meant the whole thing happened at its own
 * speed regardless of the scroll and was over before you had finished the
 * gesture. Here the scroll position *is* the playhead: stop moving and the
 * animation stops with you, scroll back and it runs backwards.
 *
 * **What makes the hero stay visible is that this section has no background of
 * its own.** Only the two panels are painted, so everything they have not
 * covered yet is the pinned hero showing through. Give this section a ground
 * and the effect disappears: the hero would be hidden the moment the section
 * arrived and the columns would animate over a blank field.
 *
 * **The scroll length comes from the section being twice the window tall with a
 * sticky stage inside it, not from GSAP's `pin`.** Same reasoning as the hero
 * in `HomeParallax`: `pin` takes the element out of flow and everything below
 * jumps up by its height at the moment the pin engages. A sticky child inside a
 * tall parent stays in flow, so there is no jump, and the extra height is the
 * scroll distance the animation is scrubbed across.
 *
 * `lg:` and `no-preference` only. Below that the section is its natural height,
 * the stage is not sticky, the panels are where they belong, and the band reads
 * as three stacked blocks.
 * ---------------------------------------------------------------------------
 *
 * **Why the columns do not share classes.** `text-ink` and `text-muted` are
 * tuned for the dark ground and are close to invisible on white, so the left
 * column names its colours outright: `#14140f` for the heading and `#9a7b18`
 * for the eyebrow. The site gold drops to roughly 1.8:1 on white and fails
 * WCAG 1.4.3 at eyebrow size; the darker gold holds the same hue at about
 * 4.7:1.
 *
 * **The copy is a rewrite, not a copy-paste.** The /about page makes the same
 * argument at length. Repeating its paragraphs verbatim would put two URLs on
 * the site competing for the same words.
 */

const FACTS = [
  { value: "15", label: "Years across marketing, design and development" },
  { value: "1", label: "Point of contact, from the brief to the launch" },
  { value: "UK + UAE", label: "Clients, working on Dubai hours" },
] as const;

export default function AboutSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const darkPanelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const white = whiteRef.current;
    const dark = darkRef.current;
    const darkPanel = darkPanelRef.current;
    const head = headRef.current;
    if (!section || !stage || !white || !dark || !darkPanel || !head) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      // The same two modules `HomeParallax` already pulls on this route, so this
      // costs one cached chunk rather than a second copy — and still nothing at
      // all on the other 29 routes.
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const headText = head.querySelectorAll("[data-reveal]");
          const darkText = dark.querySelectorAll("[data-reveal]");

          // Positions on a 0-to-1 playhead, so the numbers below read as
          // fractions of the scroll rather than seconds. Each step finishes
          // before the next begins, which is the "one by one" that was asked
          // for — an overlap here would make two things move at once.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              // The stage is sticky for one extra window of scrolling, and the
              // whole animation is scrubbed across exactly that.
              end: "bottom bottom",
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
          });

          // **The text is hidden up front with a `set`, then tweened *to* its
          // resting state.** Neither `from` nor `fromTo` works here: placed
          // later in a scrubbed timeline, neither applies its start values
          // until the playhead reaches it, so the text sat fully visible and
          // then snapped to invisible the moment its turn came. Measured both
          // ways — heading opacity 1.00 at every scroll position before its own
          // step, then 0.24 once inside it. A `set` at build time is not
          // ambiguous about when it applies.
          //
          // The panels keep `from`, because they start at position 0 where
          // there is no such ambiguity.
          gsap.set([...headText, ...darkText], { y: 28, autoAlpha: 0 });
          // Two sets of timings, because the two groups are different sizes:
          // the heading is two elements and the body is six, and one stagger
          // value for both would make the body's last line land well after the
          // band has started to lift. Measured at 0.67 opacity while the lift
          // was already 21px in, before these were split.
          //
          // **The stagger is what has to be budgeted, not the start.** A group
          // finishes at `start + stagger * (n - 1) + duration`, so the six-item
          // body group was still running at 0.89 even though it began at 0.65 —
          // past the lift at 0.85, which put the CTA row fading in while the
          // band was already leaving. Measured: CTA at 0.33 opacity with the
          // stage 92px up. The body stagger and duration are tuned so the last
          // element lands at 0.79, clear of the lift at 0.86.
          const showHead = { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.09 };
          const showBody = { y: 0, autoAlpha: 1, stagger: 0.02, duration: 0.07 };

          // Positions on a 0-to-1 playhead, so these numbers read as fractions
          // of the scroll rather than seconds. Each step finishes before the
          // next begins: that is the "one by one" that was asked for, and an
          // overlap would put two things in motion at once.
          //
          // **The beat between the last word and the lift was too long.** It
          // ran 0.71 to 0.88, which across the old 1260px range was 214px of
          // scrolling with nothing responding — about a quarter of a screen
          // where the page appears to have stopped listening. Shortened to
          // 0.76–0.85, and the section itself shortened from 240svh to 210svh,
          // which takes the beat to roughly 90px. Still a pause, no longer a
          // gap.
          // **The first tween starts at 0.06, not 0, and that is a fix.** The
          // stage is `sticky`, so for the last few pixels before it pins it is
          // still travelling up the window. Starting the wipe at 0 meant the
          // panel moved right while the stage was still moving up, and the two
          // together read as a diagonal from the bottom left — which is exactly
          // what Bilal reported. A sixteenth of the range is roughly 80px of
          // scroll, by which point the stage is certainly still.
          tl.from(white, { xPercent: -100, duration: 0.18 }, 0.06)
            .to(headText, showHead, 0.27)
            .from(darkPanel, { yPercent: 100, duration: 0.16 }, 0.43)
            .to(darkText, showBody, 0.62)
            // The lift. The whole band travels straight up and off, uncovering
            // the section behind it — which is already in place rather than
            // arriving, because `page.tsx` pulls it up one window under this
            // one. It rises at scroll speed while the band leaves at several
            // times that, which is the parallax: the thing behind reads as
            // having been there the whole time.
            .to(stage, { yPercent: -100, duration: 0.14, ease: "power2.in" }, 0.86);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
            // Back to the resting state, so a resize to mobile or a switch to
            // reduced motion mid-scroll cannot strand a panel off-screen.
            gsap.set([stage, white, darkPanel, headText, darkText], { clearProps: "all" });
          };
        }
      );

      cleanup = () => mm.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-split-heading"
      // 210svh at desktop: one window for the stage to be looked at, 110svh for
      // the animation to be scrubbed across. It was 240svh, which left a long
      // stretch near the end where nothing was moving; see the timing note in
      // the effect above. **`motion-safe:`, so
      // reduced motion does not get 900px of empty scrolling for an animation
      // that never runs** — measured at 1800px before this, with nothing moving
      // through any of it. No background — see the note above; the hero shows
      // through whatever the panels have not covered.
      className="relative motion-safe:lg:min-h-[210svh]"
    >
      {/* The stage. Sticky, so it holds still at the top of the window while
          the section's second window of height scrolls past underneath it.
          `overflow-hidden` contains the panels while they are outside it. */}
      <div
        ref={stageRef}
        className="relative overflow-hidden lg:flex lg:min-h-svh lg:items-center motion-safe:lg:sticky motion-safe:lg:top-0"
      >
        {/* The white field: columns one and two together, 40% of the screen.
            One element rather than two painted cells, because it is one move —
            animating two would show a seam between them while they travelled. */}
        <div
          ref={whiteRef}
          aria-hidden="true"
          className="absolute inset-0 bg-white lg:right-auto lg:w-[40%]"
        />

        {/* The dark field: column three, 60% of the screen, painted as a
            full-height panel rather than as the cell's own background.
            
            That split is what lets the content be vertically centred. The cell
            no longer has to stretch to the full height to paint its ground, so
            it can be its natural height and sit in the middle of the stage —
            and because it is the taller of the two columns, it is what the
            grid row measures and therefore what the heading opposite lines up
            against.
            
            `lg:` only. Below that the columns stack, there is no 60% band to
            paint, and the cell keeps its own `bg-bg`. */}
        <div
          ref={darkPanelRef}
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden bg-bg lg:block lg:w-[60%]"
        />

        {/* Percentages rather than fr units because those three numbers are the
            instruction. `fr` would redistribute space as the copy changed and
            quietly stop being 25/15/60. */}
        {/* `lg:items-start`, and it is the whole of the alignment fix.
        
            Both columns begin on the grid row's top edge, so the heading and
            the paragraph opposite start on the same line — with the invisible
            eyebrow stand-in in the dark column accounting for the eyebrow above
            the heading. The row itself is centred in the stage by the flex
            above, so the block as a whole sits in the middle of the screen
            while its two columns still agree on where the top is.
            
            Stretching them instead, then centring each one's contents, cannot
            do this: the columns hold very different amounts of copy, so two
            independent centrings put their tops in two different places. */}
        <div className="relative grid w-full grid-cols-1 lg:grid-cols-[25%_15%_60%] lg:items-start">
          {/* 1. The heading, black on the white field. */}
          <div
            ref={headRef}
            className="flex flex-col px-6 py-16 sm:py-20 lg:py-28 lg:pl-10 lg:pr-0"
          >
            <span
              data-reveal
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[#9a7b18]"
            >
              About me
            </span>

            {/* No `max-w`. The column is 25% of the screen and that is the
                measure; a character cap on top of it would undercut the track
                and stop the split being 25/15/60. */}
            <h2 id="about-split-heading" data-reveal className="t-h2 mt-4 text-[#14140f]">
              Fifteen years in one person, working out of Dubai
            </h2>
          </div>

          {/* 2. Empty, and deliberately so. It is the air between the statement
              and the detail, and it is also the part of the white field you
              watch arrive. `hidden lg:block` because on a phone the columns
              stack and an empty one would be dead scroll. */}
          <div aria-hidden="true" className="hidden lg:block" />

          {/* 3. The body, white on black. Its ground is the absolute panel
              above at desktop; the `bg-bg` here is for the stacked mobile
              layout, where there is no panel. */}
          <div
            ref={darkRef}
            className="flex flex-col bg-bg px-6 py-16 sm:py-20 lg:bg-transparent lg:py-28 lg:pl-16 lg:pr-10"
          >
            {/* An empty stand-in for the eyebrow opposite, so the paragraph
                below starts on the same line as the heading rather than the
                same line as the eyebrow.
                
                It carries the eyebrow's own classes and a non-breaking space,
                which is what makes it exact: the offset is whatever that line
                actually measures at this breakpoint and font size, not a number
                copied from the inspector that stops being right the next time
                the eyebrow is touched. A `&nbsp;` rather than a copy of the
                words, because duplicated text is duplicated for a crawler even
                when it is invisible and `aria-hidden` — the same trap that
                polluted the `<h1>` in item 213.
                
                `lg:` only: below that the columns stack and there is nothing
                opposite to line up with. */}
            <span
              aria-hidden="true"
              className="hidden font-mono text-[0.7rem] uppercase tracking-[0.18em] lg:mb-4 lg:inline-flex"
            >
              &nbsp;
            </span>

            {/* Two paragraphs, and the second is the one that does the work:
                the first says who, the second says why that arrangement is
                worth anything to the reader. */}
            <p data-reveal className="max-w-[58ch] text-base leading-relaxed text-muted">
              I am Bilal Shafqat. I run paid campaigns, design the interface,
              write the code, and wire the CRM behind it. Not a studio and not a
              network of subcontractors, so the person you brief is the person
              who does the work.
            </p>
            <p data-reveal className="mt-4 max-w-[58ch] text-base leading-relaxed text-muted">
              Most projects lose their time and their quality at the seams
              between suppliers, where the agency waits on the developer and the
              developer waits on the designer. Those seams are where I spend my
              days, and here they simply do not exist.
            </p>

            {/* Three facts rather than a service list. The services are already
                stated twice above this band, by the rotating opener and by the
                hero paragraph, and a third pass would be the third time on one
                screen. */}
            <dl data-reveal className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
              {FACTS.map((fact) => (
                <div key={fact.label}>
                  <dd className="t-h3 text-ink">{fact.value}</dd>
                  <dt className="mt-2 text-xs leading-relaxed text-muted">{fact.label}</dt>
                </div>
              ))}
            </dl>

            {/* The rule parts the figures from the actions. The column edge
                already parts the body from the heading. */}
            <hr data-reveal className="mt-10 border-t border-border" />

            <div
              data-reveal
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
            >
              <CtaButton href="/appointment">Book a free consultation</CtaButton>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-ink transition-opacity hover:opacity-70"
              >
                More about how I work
                <ArrowRight
                  size={16}
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
