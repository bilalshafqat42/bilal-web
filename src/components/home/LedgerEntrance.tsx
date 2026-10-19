"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The services ledger's entrance, timed to the moment it is actually seen.
 *
 * `Reveal` cannot do this job on desktop. There, `page.tsx` pulls the ledger up
 * one window so it sits *behind* the about band, and the band lifts off it at
 * the end of its scroll range. An `IntersectionObserver` sees the ledger enter
 * the viewport a full window before anyone can see it, so a normal reveal would
 * play out under the band and the visitor would arrive at a section that had
 * already finished arriving. Measured on 2026-10-18 at 1366x900: the band was
 * gone within 126px of scroll and the "Capabilities" label was already at 133px,
 * level with the header, the first frame it was visible. That is the "services
 * section is already gone" Bilal described.
 *
 * So on desktop with motion, a group waits until the ledger's top has reached
 * the top 5% of the window, which only happens once the band is most of the
 * way off. Then
 * it plays the same staggered fade-up the rest of the site uses
 * (`.reveal-item` in `globals.css`), heading first, rows after.
 *
 * Everywhere else (phones and tablets, where there is no lift) it behaves like
 * `RevealStagger`: fires as the group comes within 80px of the bottom edge.
 *
 * Same contract as `Reveal`: rendered at rest on the server, hidden only if it
 * is genuinely out of sight at mount, never hidden under reduced motion.
 */

type State = "rest" | "out" | "in";

const LIFT_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export default function LedgerEntrance({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("rest");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = el.closest("section");
    const lift = window.matchMedia(LIFT_QUERY).matches;

    const seen = () => {
      const vh = window.innerHeight;
      const ownTop = el.getBoundingClientRect().top;
      if (ownTop > vh - 80) return false;
      if (!lift || !section) return true;
      return section.getBoundingClientRect().top < vh * 0.05;
    };

    // Already visible, or already scrolled past (a reload mid-page): stay at
    // rest. Hiding it here would blank content the visitor can see.
    if (seen()) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (seen()) {
          setState("in");
          window.removeEventListener("scroll", onScroll);
        }
      });
    };

    const raf = requestAnimationFrame(() => {
      setState("out");
      window.addEventListener("scroll", onScroll, { passive: true });
    });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={className} data-reveal={state === "rest" ? undefined : state}>
      {children}
    </div>
  );
}
