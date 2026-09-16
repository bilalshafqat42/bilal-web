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
 * once. Nothing on screen changes.
 *
 * `Engagement` and `WhoIWorkWith` still use framer for `AnimatePresence`
 * expand/collapse, which is a genuinely harder thing to hand-roll, so the
 * library still loads on the two pages that render them.
 */

/** Shared observer: one instance for every revealed element on the page rather
 *  than one per component. Eleven files using this meant dozens of observers. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer, or reduced motion: show it immediately, at rest. Queued to
    // the next frame so this is not a synchronous setState inside an effect.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      // Matches framer's `viewport={{ margin: "-80px" }}`: starts 80px before
      // the element reaches the viewport edge.
      { rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView] as const;
}

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span";
};

export default function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : `translateY(${y}px)`,
        transition: "opacity 600ms cubic-bezier(.22,1,.36,1), transform 600ms cubic-bezier(.22,1,.36,1)",
        transitionDelay: delay ? `${delay}s` : undefined,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Staggered group. The parent observes; the children read `--i` for their own
 * delay, which is how the 0.1s stagger survives without framer's variants.
 */
export function RevealStagger({ children, className }: { children: ReactNode; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={className} data-reveal={inView ? "in" : "out"}>
      {children}
    </div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`reveal-item ${className ?? ""}`}>{children}</div>;
}
