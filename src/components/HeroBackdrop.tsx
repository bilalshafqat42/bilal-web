"use client";

import { useEffect, useRef } from "react";

/**
 * Hero backdrop.
 *
 * Approach chosen after inspecting how well-built dark sites actually do this,
 * rather than imitating one reference:
 *
 *   Linear   DOM dot grid, per-dot CSS animation. No libraries, no images.
 *   Framer   animated grain texture plus a video.
 *   Vercel   canvas/WebGL shader (`--hero-shader-y-offset`).
 *   Resend   a Spline 3D scene.
 *
 * This follows Linear's tier. The other three cost bundle weight, main-thread
 * or GPU time, and in Framer's case a video download — all of which work
 * against the performance and organic-search priorities this site is built for.
 * A dot grid with a pointer-tracked spotlight needs no assets and no
 * dependencies at all.
 *
 * The more important decision is restraint, and it is a correction. Several
 * earlier versions of this file chased a reference whose hero is centred around
 * a product screenshot, so it can afford a bright backdrop as its focal point.
 * This hero is text-led: the headline is the subject. A backdrop here has to be
 * a texture that supports the hierarchy, not an object competing with it. So
 * the glow is anchored behind the headline rather than centred in the section,
 * and nothing in here rises above low contrast.
 *
 * Purely decorative, so the whole thing is aria-hidden.
 */

/** Dot spacing. Tight enough to read as a surface rather than as countable
 *  dots, wide enough that the grid never turns into a grey wash. */
const DOT_GAP = 26;

const DOTS = (colour: string) =>
  `radial-gradient(circle at 1px 1px, ${colour} 1px, transparent 0)`;

export default function HeroBackdrop() {
  const spot = useRef<HTMLDivElement>(null);

  // The spotlight follows the pointer. Written straight to a transform on one
  // element and coalesced into a single animation frame, so a fast mouse move
  // cannot queue more work than the compositor can retire. Nothing here reads
  // layout, so it never forces a synchronous reflow.
  useEffect(() => {
    const el = spot.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Coarse pointers have no hover position to track, and firing this on touch
    // would move the light to wherever the last tap landed and leave it there.
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
      // Ignore movement outside the hero: the light should not drift while the
      // visitor is reading further down the page.
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
    <div aria-hidden="true" className="hero-backdrop pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base grid. One element and one background image: no per-dot DOM, which
          at this spacing would be several hundred nodes for no visual gain. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: DOTS("rgba(242,201,76,0.16)"),
          backgroundSize: `${DOT_GAP}px ${DOT_GAP}px`,
          maskImage:
            "radial-gradient(ellipse 85% 80% at 30% 42%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 52%, transparent 86%)",
        }}
      />

      {/* Ambient glow, anchored behind the headline rather than centred in the
          section. This hero is left-weighted, and a centred light left the
          brightest point sitting in the gutter between the two columns. */}
      <div
        className="absolute"
        style={{
          left: "var(--glow-x)",
          top: "var(--glow-y)",
          width: "var(--glow-w)",
          height: "var(--glow-h)",
          transform: "translate(-50%, -50%)",
          filter: "blur(70px)",
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(242,201,76,0.16), transparent 72%)," +
            "radial-gradient(ellipse 80% 70% at 45% 55%, rgba(205,152,42,0.10), transparent 76%)",
        }}
      />

      {/* Spotlight. A brighter copy of the same grid, shown only inside a soft
          circle that tracks the pointer.

          `background-attachment: fixed` is the trick that keeps this a pure
          transform: it pins the dot pattern to the viewport, so translating
          this element slides the visible window across a grid that itself never
          moves. Animating `mask-position` instead would repaint the layer on
          every pointer event.

          Starts at zero opacity and is switched on by the effect above, so a
          visitor who never moves a mouse — or has reduced motion, or a touch
          screen — is not shown a light stuck in the top-left corner. */}
      <div
        ref={spot}
        className="absolute opacity-0 transition-opacity duration-700"
        style={{
          left: "calc(var(--spot-size) / -2)",
          top: "calc(var(--spot-size) / -2)",
          width: "var(--spot-size)",
          height: "var(--spot-size)",
          backgroundImage: DOTS("rgba(255,236,168,0.85)"),
          backgroundSize: `${DOT_GAP}px ${DOT_GAP}px`,
          backgroundAttachment: "fixed",
          maskImage:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.35) 42%, transparent 68%)",
        }}
      />

      {/* Hairline at the section join. Reads as a horizon without needing any
          of the machinery a literal one took. */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(242,201,76,0.22) 18%, rgba(242,201,76,0.34) 50%, rgba(242,201,76,0.22) 82%, transparent)",
        }}
      />

      {/* Dissolves the grid into the section below rather than letting it meet
          the edge on a line of half-cut dots. */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: "26%", background: "linear-gradient(to bottom, transparent, var(--color-bg) 88%)" }}
      />
    </div>
  );
}
