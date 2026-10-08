"use client";

import { useEffect, useState } from "react";
import Eyebrow from "@/components/Eyebrow";
import type { TocEntry } from "@/lib/headingIds";

/**
 * The sticky contents list beside an article.
 *
 * **Built because the measure was wrong, not because a sidebar looked nice.**
 * Bilal asked twice for the article to run the full container width, so the
 * prose cap came off. Measured on 2026-10-08 at 1440: the text ran 1,360px at
 * 18px, roughly **151 characters a line**, against a comfortable 60 to 80. At
 * that width the eye loses its place coming back to the start of the next line.
 *
 * The fix he proposed, and the measurement agreed with, was a third column
 * rather than re-capping the text:
 *
 *     3 columns @ 1440     804px article     89 characters
 *     2 columns @ 1440   1,152px article    128 characters
 *     1 column  @ 1440   1,360px article    151 characters
 *
 * Two columns barely helps. Three lands it.
 *
 * **Left, not right.** Documentation sites put "On this page" on the right, but
 * they also carry a site-wide nav tree on the left — two navigations, so the
 * per-page one goes second. There is one here, and in left-to-right reading the
 * first column is where "where am I in this document" belongs, which is where a
 * book puts its contents.
 *
 * `h2` only, and nothing under four entries. Both rules live in `tocOf`.
 */
export default function ArticleToc({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!entries.length) return;
    const nodes = entries
      .map((e) => document.getElementById(e.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;

    // `rootMargin` pulls the detection band up to the top sixth of the viewport.
    // Without it the "current" heading is whichever is nearest the middle, which
    // lags a scroll by half a screen and reads as broken.
    const io = new IntersectionObserver(
      (items) => {
        const visible = items
          .filter((i) => i.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-96px 0px -82% 0px", threshold: 0 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [entries]);

  if (!entries.length) return null;

  return (
    // `aria-hidden` is deliberately NOT set: unlike the menu preview rail, this
    // is the only place the article's structure is listed, and jumping between
    // sections is exactly what a screen reader user wants from it.
    <nav aria-label="On this page" className="lg:sticky lg:top-28">
      <Eyebrow as="p" size="sm" tone="muted">
        On this page
      </Eyebrow>
      <ul className="mt-4 space-y-1 border-l border-border">
        {entries.map((e) => {
          const on = active === e.id;
          return (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                aria-current={on ? "true" : undefined}
                className={`-ml-px block border-l py-1.5 pl-4 text-sm leading-snug transition-colors ${
                  on
                    ? "border-gold font-medium text-ink"
                    : "border-transparent text-muted hover:border-border hover:text-ink"
                }`}
              >
                {e.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
