"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The homepage opener and hero, on a parallax.
 *
 * What Bilal asked for: the animated statement sits *behind* and drifts down as
 * you scroll; the hero rides *over* it; and as the hero nears the top of the
 * window its inset block widens from 80% to full bleed.
 *
 * ---------------------------------------------------------------------------
 * **GSAP, on the homepage only. That constraint is the whole design of this
 * file, not a detail.**
 *
 * `gsap` plus `ScrollTrigger` is ~70KB, and roadmap items 189 and 194 removed
 * GSAP from this project precisely because it was landing on every route for
 * one effect. Bilal weighed that and asked for GSAP here, limited to the
 * homepage. Two things keep it limited, and removing either puts GSAP back on
 * all 30 routes:
 *
 *   1. **Only `app/page.tsx` imports this component.** The moment a second
 *      route does, Next hoists gsap into the shared chunk.
 *   2. **It is imported dynamically, inside the effect.** That puts gsap in its
 *      own async chunk fetched after hydration, so it is absent from the
 *      homepage's initial payload as well as from every other route's.
 *
 * Verified by diffing the chunks each route's HTML references — see roadmap
 * item 227.
 * ---------------------------------------------------------------------------
 *
 * Two things worth not undoing:
 *
 * **The opener is `sticky`, not transformed into place.** Pinning it and
 * letting the hero scroll over is what produces the depth; a transform alone
 * would move it without changing what covers what. The drift is the flourish on
 * top of that.
 *
 * **The width is written as a CSS custom property, not animated directly.**
 * `HeroBanner` reads `--hero-w`, so this never needs to know how that section
 * is built and the hero still renders server-side. Width is also a layout
 * property, so values are rounded to 0.5% and unchanged frames skipped —
 * without that, `scrub` reflows the hero on every single frame.
 */

/** The hero commits to full bleed **at the moment it reaches the top of the
 *  window**, and closes again at the same line. Not a range, and not a snap.
 *
 *  **Why not a snap.** The hero used to widen across 260px of scroll with
 *  GSAP's `snap` pulling it to one end. `snap` works by scrolling the window
 *  for you, so a deliberate 60px nudge inside the range became 251px of
 *  movement, measured, and three slow 100px notches from the top became 535px.
 *  The page was taking the gesture away from the person making it, which is
 *  what Bilal reported as strange. Nothing here touches scroll position.
 *
 *  **Why exactly at the top, rather than a little before.** The first version
 *  of this opened 170px early, which reintroduced the bug that made the snap
 *  necessary in the first place: between opening and pinning there was a range
 *  you could stop in where the hero was full-bleed but not yet at the top, with
 *  a strip of the white wrapper above it. Bilal sent two screenshots of exactly
 *  that in item 234.
 *
 *  Tying the open to the pin removes that state by construction. While the hero
 *  is inset, white around it is the design — it is a card on a white page. The
 *  moment it is full bleed it is also pinned at `top: 0`, so there is nothing
 *  above it to show. The widening then happens with the hero already filling
 *  the screen vertically, and what you watch is the white gutters at its sides
 *  closing.
 *
 *  **No hysteresis, deliberately.** Opening and closing on the same line means
 *  a scroll that hovers there reverses the tween rather than glitching, because
 *  the tween below overwrites rather than queues. Offsetting the close would
 *  buy stability at that one pixel and pay for it with a band where the hero is
 *  full-bleed and unpinned — the very state this is built to prevent. */
const OPEN_AT = "top top";

/** Seconds the hero takes to open or close.
 *
 *  Long enough to read as one object changing size rather than a cut, short
 *  enough that it is over before the next thing wants attention. `inOut`
 *  because this tween is no longer tied to a gesture — with the scrub gone
 *  there is no finger to keep up with, so easing in at both ends is what makes
 *  it look like something with mass rather than something switched on. */
const OPEN_SECONDS = 0.7;

/** Scroll distance over which the opener drifts. Unchanged, and still scrubbed:
 *  a drift is a parallax, it belongs to the scroll, and it moves a transform
 *  rather than the window, so it can never fight the person scrolling. */
const TRAVEL = 260;

/** Pixels the opener drifts down across the range. Small on purpose: past
 *  roughly 60px it stops reading as depth and starts reading as a bug. */
const DRIFT = 52;

export default function HomeParallax({
  opener,
  hero,
  after,
}: {
  opener: ReactNode;
  hero: ReactNode;
  /** The section that scrolls **over** the pinned hero. Inside this wrapper
   *  rather than after it, because a sticky element can only travel inside its
   *  own parent: with the about band left outside, the hero would unstick at
   *  exactly the moment the band arrived. */
  after?: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const openerEl = openerRef.current;
    const heroEl = heroRef.current;
    const markerEl = markerRef.current;
    if (!root || !openerEl || !heroEl || !markerEl) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      // Dynamic, so gsap lands in its own async chunk rather than the
      // homepage's initial payload. See the note at the top of this file.
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      // `matchMedia` rather than a hand-rolled listener: it tears the animation
      // down and runs the cleanup below when the query stops matching, which is
      // what resets the hero to full bleed on a resize to mobile.
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          let lastWidth = -1;
          let lastFill = -1;

          const apply = (p: number) => {
            // Quarter of a percent. Fine enough that the 0.7s open reads as
            // continuous, coarse enough that `width` — a layout property — is
            // not rewritten on literally every frame.
            const width = Math.round((80 + p * 20) * 4) / 4;
            if (width !== lastWidth) {
              root.style.setProperty("--hero-w", `${width}%`);
              lastWidth = width;
            }

            // Drives the corner radius only. It used to drive `min-height` too,
            // which is what made the document grow 66px mid-animation; see the
            // note in `HeroBanner`.
            const fill = Math.round(p * 100) / 100;
            if (fill !== lastFill) {
              root.style.setProperty("--hero-fill", `${fill}`);
              lastFill = fill;
            }
          };

          // The hero's size lives on a plain object rather than on the element,
          // so one tween drives both custom properties and the rounding above
          // stays in one place. Tweening the variables directly would hand GSAP
          // two independent string interpolations and no place to dedupe them.
          const state = { p: 0 };
          let open = false;

          const setOpen = (next: boolean) => {
            if (next === open) return;
            open = next;
            // `overwrite: true` so a reversal mid-open picks up the current
            // value and turns around, rather than two tweens fighting over the
            // same property. This is what makes scrolling back and forth across
            // the threshold feel elastic instead of glitchy.
            gsap.to(state, {
              p: next ? 1 : 0,
              duration: OPEN_SECONDS,
              ease: "power3.inOut",
              overwrite: true,
              onUpdate: () => apply(state.p),
            });
          };

          apply(0);

          // **No `scrub` and no `snap` on this one.** It listens for the line
          // being crossed and does not touch the scroll position, which is the
          // whole point — see the note on `OPEN_AT`.
          const gate = ScrollTrigger.create({
            // The zero-height marker, not the hero itself. The hero is sticky,
            // so its position stops tracking the scroll once it pins and
            // ScrollTrigger would measure a start that moves under it. The
            // marker sits at the hero's place in normal flow and never moves —
            // which also means it crosses `top top` at precisely the scroll
            // position where the sticky hero above it pins.
            trigger: markerEl,
            start: OPEN_AT,
            end: "max",
            onEnter: () => setOpen(true),
            onLeaveBack: () => setOpen(false),
            invalidateOnRefresh: true,
            // `onRefresh` rather than trusting the initial state: this fires on
            // init and after every resize, and a reload partway down the page
            // has to arrive already open rather than opening on the first
            // touch of the wheel.
            onRefresh: (self) => {
              const shouldOpen = self.progress > 0;
              if (shouldOpen !== open) {
                open = shouldOpen;
                state.p = shouldOpen ? 1 : 0;
                apply(state.p);
              }
            },
          });

          // The opener's drift, on its own trigger and still scrubbed. It moves
          // a transform and nothing else, so it costs no layout and cannot
          // interfere with the gate above.
          const drift = ScrollTrigger.create({
            trigger: markerEl,
            start: () => `top ${TRAVEL}px`,
            end: "top top",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(openerEl, { y: Math.round(self.progress * DRIFT) }),
            onRefresh: (self) => gsap.set(openerEl, { y: Math.round(self.progress * DRIFT) }),
          });

          return () => {
            gate.kill();
            drift.kill();
            gsap.killTweensOf(state);
            // `removeProperty`, not "set it back to 100%". The resting state now
            // lives in the stylesheet, and whichever one applies depends on the
            // media query — so the only correct thing to do here is stop
            // overriding it and let the sheet decide.
            root.style.removeProperty("--hero-w");
            root.style.removeProperty("--hero-fill");
            gsap.set(openerEl, { clearProps: "transform" });
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
    // `--hero-w` and `--hero-fill` come from `.home-parallax` in `globals.css`,
    // **not from an inline style here**. They were inline and set to the
    // full-bleed state, which meant every desktop visitor saw the hero at full
    // width for a beat and then watched it shrink into the container once GSAP
    // had loaded and corrected it. In the stylesheet the resting state is the
    // first paint and there is nothing to correct. See the note there.
    //
    // `bg-white`, and it is load-bearing rather than cosmetic.
    //
    // The opener is `sticky` *and* drifts down by up to 52px. Once it has
    // drifted, the strip it vacates under the header exposes whatever is behind
    // this wrapper — which is `body`, painted `--color-bg` at #08080b. That read
    // as a thick dark rule under the header and was reported as one. Painting
    // this wrapper white means the vacated strip matches the opener above it and
    // nothing shows through.
    <div ref={rootRef} className="home-parallax relative bg-white">
      {/* Three layers, each pinned to the top and each covering the one
          before it. Scrolling the page is what moves one over the next.

              z-0   opener   pinned, drifts down
              z-10  hero     pinned, rides over the opener
              z-20  after    scrolls over the hero

          All of it is `lg:` only: on a phone three pinned layers would eat the
          whole screen, and the page reads perfectly well as three sections in
          a row. */}
      <div ref={openerRef} className="lg:sticky lg:top-0 lg:z-0 lg:will-change-transform">
        {opener}
      </div>

      {/* A zero-height marker at the hero's place in normal flow. The hero is
          sticky and therefore useless as a ScrollTrigger trigger; this is what
          the width and height animation measures against instead. */}
      <div ref={markerRef} aria-hidden="true" className="h-0" />

      {/* Pinned once it reaches the top, so the band below scrolls over it
          rather than pushing it off. Opaque, so it genuinely covers the
          opener. */}
      <div ref={heroRef} className="relative lg:sticky lg:top-0 lg:z-10">
        {hero}
      </div>

      {after ? <div className="relative z-20">{after}</div> : null}
    </div>
  );
}
