"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Oversized wordmark that rises from behind the footer as it comes into view and
 * settles back down on the way out.
 *
 * Scrubbed rather than played once: the movement is tied to scroll position, so
 * scrolling back up genuinely reverses it instead of leaving the mark stranded.
 *
 * Decorative only — `aria-hidden`, and the real wordmark higher in the footer
 * remains the accessible one, so this adds nothing for a screen reader to repeat.
 */
export default function FooterWordmark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const mark = markRef.current;
      if (!wrap || !mark) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(mark, { yPercent: 0, opacity: 1 });
        return;
      }

      const tween = gsap.fromTo(
        mark,
        { yPercent: 55, opacity: 0.25 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            // Starts as the footer edge appears and completes once it is fully
            // in view, so the reveal tracks the footer rather than the page.
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: wrapRef }
  );

  return (
    // overflow-hidden is what makes it read as rising from behind the footer
    // rather than simply fading in.
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none mt-10 overflow-hidden">
      <span
        ref={markRef}
        className="font-display block select-none whitespace-nowrap text-center font-bold leading-[0.8] tracking-tight text-white/[0.10]"
        style={{ fontSize: "clamp(3.5rem, 15.5vw, 15rem)" }}
      >
        Bilal Shafqat
      </span>
    </div>
  );
}
