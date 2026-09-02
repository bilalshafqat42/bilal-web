"use client";

import { useEffect, useRef } from "react";

/**
 * Candidate hero backdrops, built to be compared side by side rather than
 * iterated on one at a time.
 *
 * All four follow the same rule, which is the lesson from the versions that did
 * not work: this hero is text-led, so the headline is the subject. A backdrop
 * here is a texture supporting the hierarchy, never an object competing with
 * it. Anything bright is anchored behind the headline rather than centred in
 * the section, where it would land in the gutter between the two columns.
 *
 * None of them load an image, a font, or a library. That is deliberate: this
 * site is built for organic search, and a hero that costs bundle weight or
 * main-thread time undermines the performance it is selling.
 *
 * Every variant is aria-hidden — purely decorative.
 *
 * A note on the alpha values, which look high in isolation: every glowing layer
 * here carries 38–110px of blur, and blur spreads a fixed amount of light over
 * a much larger area, so apparent brightness drops sharply. Values that read
 * correctly unblurred disappear entirely once softened. The first pass of the
 * aurora and beam variants was invisible on a near-black ground for exactly
 * that reason. Judge these on screen, not in the source.
 */

/** Shared: fades any layer out before it reaches the section edge, so nothing
 *  ends on a hard line or a row of half-cut marks. */
function EdgeFade() {
  return (
    <>
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(242,201,76,0.2) 18%, rgba(242,201,76,0.32) 50%, rgba(242,201,76,0.2) 82%, transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: "26%", background: "linear-gradient(to bottom, transparent, var(--color-bg) 88%)" }}
      />
    </>
  );
}

const shell = "hero-backdrop pointer-events-none absolute inset-0 overflow-hidden";

/* ------------------------------------------------------------------ A: grid */

const DOT_GAP = 26;
const DOTS = (c: string) => `radial-gradient(circle at 1px 1px, ${c} 1px, transparent 0)`;

/**
 * A. Dot grid with a spotlight that tracks the pointer.
 *
 * `background-attachment: fixed` on the bright copy is what keeps the
 * spotlight a pure transform: it pins the pattern to the viewport, so moving
 * the element slides a window across a grid that never moves. Animating
 * `mask-position` instead would repaint on every pointer event.
 */
export function BackdropGrid() {
  const spot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spot.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Coarse pointers have no hover position; tracking would strand the light
    // wherever the last tap landed.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      const host = el.parentElement;
      if (!host) return;
      const r = host.getBoundingClientRect();
      if (e.clientY < r.top - 40 || e.clientY > r.bottom + 40) return;
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    el.style.opacity = "1";
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className={shell}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: DOTS("rgba(242,201,76,0.16)"),
          backgroundSize: `${DOT_GAP}px ${DOT_GAP}px`,
          maskImage:
            "radial-gradient(ellipse 85% 80% at 30% 42%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 52%, transparent 86%)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: "34%",
          top: "40%",
          width: "78%",
          height: "78%",
          transform: "translate(-50%, -50%)",
          filter: "blur(70px)",
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(242,201,76,0.16), transparent 72%)," +
            "radial-gradient(ellipse 80% 70% at 45% 55%, rgba(205,152,42,0.1), transparent 76%)",
        }}
      />
      <div
        ref={spot}
        className="absolute opacity-0 transition-opacity duration-700"
        style={{
          left: "-260px",
          top: "-260px",
          width: "520px",
          height: "520px",
          backgroundImage: DOTS("rgba(255,236,168,0.85)"),
          backgroundSize: `${DOT_GAP}px ${DOT_GAP}px`,
          backgroundAttachment: "fixed",
          maskImage:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.35) 42%, transparent 68%)",
        }}
      />
      <EdgeFade />
    </div>
  );
}

/* ---------------------------------------------------------------- B: aurora */

/**
 * B. Aurora. Three large, heavily blurred masses drifting on long unrelated
 * periods behind the headline.
 *
 * The periods are deliberately coprime-ish (19s, 23s, 29s) so the set never
 * returns to the same arrangement in any watchable span. Equal or harmonically
 * related periods make the whole thing pulse in unison, which is what makes
 * cheap gradient animation look cheap.
 */
export function BackdropAurora() {
  return (
    <div aria-hidden="true" className={shell}>
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            "radial-gradient(ellipse 92% 88% at 34% 44%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 54%, transparent 92%)",
        }}
      >
        <div
          className="aurora-a absolute"
          style={{
            left: "18%",
            top: "22%",
            width: "58%",
            height: "78%",
            filter: "blur(90px)",
            background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(242,201,76,0.42), transparent 70%)",
          }}
        />
        <div
          className="aurora-b absolute"
          style={{
            left: "44%",
            top: "34%",
            width: "50%",
            height: "70%",
            filter: "blur(100px)",
            background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(205,152,42,0.34), transparent 72%)",
          }}
        />
        <div
          className="aurora-c absolute"
          style={{
            left: "6%",
            top: "48%",
            width: "44%",
            height: "60%",
            filter: "blur(110px)",
            background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,236,168,0.26), transparent 74%)",
          }}
        />
      </div>
      {/* A very fine grain over the top. Gradient masses on their own band
          visibly on a dark screen; grain breaks the bands up. Built from two
          offset repeating gradients rather than a noise image, so it stays
          asset-free. */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 3px)," +
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 4px)",
        }}
      />
      <EdgeFade />
    </div>
  );
}

/* ------------------------------------------------------------------ C: beam */

/**
 * C. Beams. Soft shafts of light descending from above the fold, over a fine
 * line grid.
 *
 * Directional light suits a left-weighted composition in a way a centred glow
 * cannot: it gives the section a top-left source, which is where the eye
 * already starts. The beams are skewed rather than vertical so they read as
 * light rather than as columns.
 */
export function BackdropBeams() {
  return (
    <div aria-hidden="true" className={shell}>
      {/* Line grid, finer and lower contrast than the dot version. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,201,76,0.08) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(242,201,76,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 90% 85% at 32% 44%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 56%, transparent 88%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 48%, transparent 86%)",
        }}
      >
        {[
          { left: "10%", w: "18%", o: 0.3, skew: -14, delay: "0s" },
          { left: "26%", w: "11%", o: 0.2, skew: -11, delay: "-4s" },
          { left: "40%", w: "22%", o: 0.24, skew: -17, delay: "-8s" },
        ].map((b) => (
          <div
            key={b.left}
            className="beam-drift absolute"
            style={{
              left: b.left,
              top: "-30%",
              width: b.w,
              height: "150%",
              transform: `skewX(${b.skew}deg)`,
              animationDelay: b.delay,
              filter: "blur(38px)",
              background: `linear-gradient(to bottom, rgba(255,240,190,${b.o}), transparent 78%)`,
            }}
          />
        ))}
      </div>
      <EdgeFade />
    </div>
  );
}

/* -------------------------------------------------------------- D: contours */

/**
 * D. Contours. Fine concentric rings, like a topographic map, centred behind
 * the headline with a slow radial shimmer.
 *
 * `repeating-radial-gradient` draws the whole set in one paint, so this is the
 * cheapest of the four — no per-ring elements. The spacing widens outward
 * because the gradient stops are not evenly divided, which is what stops it
 * reading as a target.
 */
export function BackdropContours() {
  return (
    <div aria-hidden="true" className={shell}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-radial-gradient(ellipse 46% 34% at 34% 44%, transparent 0 26px, rgba(242,201,76,0.12) 26px 27px)",
          maskImage:
            "radial-gradient(ellipse 78% 74% at 34% 44%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 46%, transparent 82%)",
        }}
      />
      <div
        className="contour-pulse absolute inset-0"
        style={{
          backgroundImage:
            "repeating-radial-gradient(ellipse 46% 34% at 34% 44%, transparent 0 26px, rgba(255,240,190,0.3) 26px 27px)",
          maskImage:
            "radial-gradient(ellipse 30% 28% at 34% 44%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, transparent 78%)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: "34%",
          top: "44%",
          width: "62%",
          height: "62%",
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
          background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(242,201,76,0.15), transparent 72%)",
        }}
      />
      <EdgeFade />
    </div>
  );
}
