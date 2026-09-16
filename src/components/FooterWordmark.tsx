"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Oversized wordmark that rises from behind the footer as it comes into view.
 *
 * Rewritten 2026-09-16 to drop GSAP. This component imported `gsap`,
 * `ScrollTrigger` and `@gsap/react`, and it sits inside `Footer`, which renders
 * on all 28 routes — so **201KB of animation library downloaded on every page,
 * including the privacy policy, for one decorative wordmark**. It was the single
 * largest avoidable cost on the site.
 *
 * What it does now: an `IntersectionObserver` flips one class, and CSS moves the
 * mark. No library, a few hundred bytes.
 *
 * What was lost, honestly: the old version was scroll-*scrubbed*, so the mark
 * tracked scroll position both ways. This plays once on entry and stays. Nobody
 * scrolls a footer back and forth to watch a background wordmark reverse, and
 * that behaviour is not worth 201KB on every page of the site.
 *
 * Decorative only — `aria-hidden`, and the real wordmark higher in the footer
 * remains the accessible one.
 */
export default function FooterWordmark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Reduced motion, or a browser without the observer: show it at rest rather
    // than leaving it parked off-position.
    //
    // Queued rather than set synchronously — a synchronous setState inside an
    // effect triggers a cascading render, which the lint rule catches. One frame
    // later is indistinguishable here and keeps the render pass clean.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      // Fires as the footer edge appears, matching where the old ScrollTrigger
      // used to start.
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  return (
    // overflow-hidden is what makes it read as rising from behind the footer
    // rather than simply fading in.
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none mt-10 overflow-hidden">
      <span
        className={`font-display block select-none whitespace-nowrap text-center font-bold leading-[0.8] tracking-tight text-white/[0.10] transition-[transform,opacity] duration-[1200ms] ease-out motion-reduce:transition-none ${
          shown ? "translate-y-0 opacity-100" : "translate-y-[55%] opacity-25"
        }`}
        style={{ fontSize: "clamp(3.5rem, 15.5vw, 15rem)" }}
      >
        Bilal Shafqat
      </span>
    </div>
  );
}
