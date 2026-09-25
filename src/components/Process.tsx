"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { processSteps as steps } from "@/data/process";

/**
 * The four delivery stages.
 *
 * Rewritten 2026-09-16. The previous version pinned the section on desktop and
 * held it for `(steps.length - 1) * window.innerHeight` — three full screens of
 * scrolling during which the page did not move. Scroll-jacking is the single
 * most reliably disliked pattern on a marketing site: the scrollbar stops
 * meaning anything, the browser's own find-on-page lands on content that is not
 * visible, and anyone who scrolls past their step has to scroll back up through
 * a pin to reach it again.
 *
 * It also cost `gsap` + `ScrollTrigger` + `@gsap/react`, which made /process the
 * heaviest route on the site at 858KB against a 740KB baseline — roughly 100KB
 * of animation library to move four blocks of text.
 *
 * What replaces it: one vertical stepper, the same markup at every width. The
 * rail on the left is `position: sticky`, which keeps your place without taking
 * the scroll away from you, and its active state comes from an
 * `IntersectionObserver` rather than a scroll handler. There is no second copy
 * of the markup for mobile, and nothing to opt out of under reduced motion,
 * because nothing moves that the reader did not ask to move.
 *
 * The images are gone on purpose. `data/process.ts` said it plainly: they were
 * real project work that "only loosely match each step", which is decoration
 * standing in for evidence. Each stage now links to work that genuinely shows
 * that stage instead — except stage four, which has no published measurement
 * work yet, and is left without a link rather than given a false one.
 */
export default function Process() {
  const [active, setActive] = useState(0);
  const stageRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const nodes = stageRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        // The topmost stage currently crossing the band wins, so scrolling back
        // up reactivates the earlier stage rather than leaving the rail stuck on
        // whichever one happened to fire last.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => nodes.indexOf(e.target as HTMLElement))
          .filter((i) => i >= 0);
        if (visible.length) setActive(Math.min(...visible));
      },
      // A band across the middle of the viewport rather than the whole of it,
      // so one stage is active at a time instead of three.
      { rootMargin: "-45% 0px -45% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" className="relative bg-bg-soft/40 py-24 sm:py-32">
      <div className="site-container">
        <SectionHeading
          // The only heading on /process, so it has to be the h1. SectionHeading
          // defaults to h2, and without this the page ships with none.
          as="h1"
          eyebrow="How I Work"
          title="A Structured Path From"
          highlight="Brief To Shipped Work"
          description="Whether it's a paid campaign, a website, or a custom application, every project follows the same clear process — from brief to launch to optimisation."
          align="left"
        />

        <div className="mt-16 grid grid-cols-1 gap-x-16 lg:grid-cols-[13rem_minmax(0,1fr)]">
          {/* Orientation rail. Sticky, not pinned: it follows you down the page
              without ever taking the scroll away. Hidden below lg, where the
              numbers on the stages themselves already do this job. */}
          <nav
            aria-label="Project stages"
            className="hidden lg:block lg:sticky lg:top-32 lg:self-start"
          >
            <ol className="space-y-1">
              {steps.map((s, i) => {
                const on = i === active;
                return (
                  <li key={s.step}>
                    <a
                      href={`#stage-${s.step}`}
                      className={`flex items-baseline gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                        on ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                      }`}
                      aria-current={on ? "step" : undefined}
                    >
                      <span
                        className={`font-mono text-[0.7rem] tabular-nums transition-colors ${
                          on ? "text-gold" : "text-muted/60"
                        }`}
                      >
                        {s.step}
                      </span>
                      <span
                        className={`text-sm font-medium leading-snug transition-colors ${
                          on ? "text-ink" : "text-muted"
                        }`}
                      >
                        {s.title}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <ol className="space-y-14 sm:space-y-20">
            {steps.map((s, i) => (
              <li key={s.step}>
                <article
                  id={`stage-${s.step}`}
                  ref={(el) => {
                    stageRefs.current[i] = el;
                  }}
                  className="scroll-mt-32 border-t border-border pt-8"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] tabular-nums text-gold">
                      {s.step}
                    </span>
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                      {s.subtitle}
                    </span>
                  </div>

                  <h2 className="t-h2 mt-4 text-ink">
                    {s.title}
                  </h2>

                  <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-muted">
                    {s.description}
                  </p>

                  {/* A two-column list of what the stage covers. Reads as a
                      checklist rather than a paragraph, which is how anyone
                      actually scans a process page. */}
                  <ul className="mt-7 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-base leading-relaxed text-muted">
                        <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-gold/70" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {s.proofHref ? (
                    <Link
                      href={s.proofHref}
                      className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
                    >
                      {s.proofLabel} <ArrowRight size={15} />
                    </Link>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
