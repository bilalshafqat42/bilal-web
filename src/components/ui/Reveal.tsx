"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll reveal, without framer-motion.
 *
 * Rewritten 2026-09-16. This file was the only reason framer-motion reached
 * most of the site: eleven files import `Reveal`, so a 118KB animation library
 * shipped to nearly every route to fade three elements up by 24 pixels.
 *
 * The replacement is an `IntersectionObserver` toggling one class, with the
 * movement in CSS. Identical easing, duration and offset to the framer version
 * — `cubic-bezier(.22,1,.36,1)`, 600ms, 24px, fires 80px before entry, runs
 * once.
 *
 * ---------------------------------------------------------------------------
 * Revised 2026-09-24 (roadmap 213.4), and this is the part worth not undoing.
 *
 * The previous version wrote `opacity: 0` as an inline style during **server**
 * rendering and cleared it only after hydration. Measured against a production
 * build: the page's `<h1>` sat inside an `opacity:0` wrapper on **19 of 31
 * routes** — every case study, every service page, /about, /portfolio,
 * /process, /real-estate-marketing — with a peak of 45 hidden blocks on one
 * page. Two costs. LCP could not resolve until JavaScript had downloaded,
 * parsed and hydrated, which is the metric this site sells. And if hydration
 * ever failed, those pages rendered blank.
 *
 * The fix is not to drop the animation. It is to notice that **an element
 * already on screen was never going to animate anyway** — its observer fires
 * on the first callback — so hiding it bought nothing and cost the score.
 *
 * So: the server renders everything at rest. On mount, each element measures
 * itself. Anything already inside the viewport stays at rest and never hides.
 * Anything below the fold takes the from-state and animates in on scroll as
 * before — and because it is below the fold, the visitor cannot see it being
 * hidden.
 *
 * Net effect: no reveal is lost anywhere a visitor could see one, the initial
 * HTML is complete and readable with JavaScript disabled, and no h1 on the
 * site is hidden at paint.
 */

/** `rest` is what the server renders and what anything on screen keeps. */
type RevealState = "rest" | "hidden" | "in";

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<RevealState>("rest");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer, or reduced motion: stay at rest. Nothing to undo, because
    // at rest is now the default rather than something to recover to.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Already on screen — including the whole first viewport, which is where
    // every page's h1 lives. Hiding it here would blank content the visitor is
    // already looking at and delay LCP for an animation they would never see.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    // Queued to the next frame rather than set synchronously: it keeps this out
    // of `react-hooks/set-state-in-effect`, and it guarantees the browser has
    // painted the at-rest frame before the from-state is applied. Invisible
    // either way, since this only runs for elements below the fold.
    const raf = requestAnimationFrame(() => setState("hidden"));

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("in");
          io.disconnect();
        }
      },
      // Matches framer's `viewport={{ margin: "-80px" }}`: starts 80px before
      // the element reaches the viewport edge.
      { rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return [ref, state] as const;
}

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export default function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const [ref, state] = useReveal<HTMLDivElement>();
  const hidden = state === "hidden";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? `translateY(${y}px)` : "none",
        transition:
          "opacity 600ms cubic-bezier(.22,1,.36,1), transform 600ms cubic-bezier(.22,1,.36,1)",
        transitionDelay: delay ? `${delay}s` : undefined,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Staggered group. The parent publishes its state on `data-reveal`; the
 * children read it in CSS, which is how the 0.1s stagger survives without
 * framer's variants.
 *
 * `data-reveal` is only written once the parent has decided to hide — on the
 * server and at rest it is absent, and `.reveal-item` is visible by default, so
 * a stagger group is as complete in the initial HTML as anything else here.
 */
export function RevealStagger({ children, className }: { children: ReactNode; className?: string }) {
  const [ref, state] = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      data-reveal={state === "rest" ? undefined : state === "hidden" ? "out" : "in"}
    >
      {children}
    </div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`reveal-item ${className ?? ""}`}>{children}</div>;
}
