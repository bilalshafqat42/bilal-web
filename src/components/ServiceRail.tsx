"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { accentClasses, megaMenuGroups } from "@/data/pillars";
import Eyebrow from "@/components/Eyebrow";

/**
 * The preview panel beside the Services menu.
 *
 * **The problem.** Fifteen service names and nothing else. Somebody who does
 * not already know whether they want Web Design or UI/UX Design has to open
 * one, read it, come back and open the other. Most of them just leave. Every
 * name in that menu is a blind click.
 *
 * Hovering a service now fills this panel with what the page says about itself,
 * before anyone commits to the click.
 *
 * **Everything in here is already published on the site.** The paragraph is the
 * first sentence of the service page's own intro, the bullets are its real
 * section headings, and the timeline is condensed from a published FAQ answer
 * with the source named in `pillars.ts`. Nothing is written for the menu.
 *
 * That constraint is the point. The prototype this came from carried a "Recent
 * work" line on every card — "Property developer, 4.6x ROAS", "Booking app, 12k
 * installs" — and all fourteen were invented. A timeline is a service promise
 * in the same way a result is a claim, so the seven services with no published
 * answer show no timeline rather than a guessed one.
 *
 * **Desktop only.** There is no hover on a phone, so the mobile menu does not
 * render this at all rather than shipping a panel nobody can reach.
 */

/** The first sentence of a page's intro, which is written as a standalone
 *  opening line on every one of the fifteen. Split on a full stop followed by
 *  whitespace, so "Next.js" and "4.6x" survive. */
function firstSentence(text: string): string {
  const match = text.match(/^.*?[.?!](?=\s|$)/);
  return (match ? match[0] : text).trim();
}

export default function ServiceRail({ slug }: { slug: string | null }) {
  const group = slug ? megaMenuGroups.find((g) => g.slug === slug) : undefined;

  if (!group) {
    return (
      <div className="flex w-full flex-col">
        <Eyebrow as="p" size="sm" tone="muted">
          Start here
        </Eyebrow>
        <h3 className="t-h5 mt-3 text-ink">Not sure which one you need?</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Most people arrive with a problem rather than a service name. Hover
          any service to see what it covers and how long it usually takes.
        </p>
        <div className="mt-6 border-t border-border pt-5">
          <Eyebrow as="p" size="sm" tone="muted">
            Based in
          </Eyebrow>
          <p className="mt-1.5 text-sm text-ink">Dubai, UAE</p>
          <Eyebrow as="p" size="sm" tone="muted" className="mt-4">
            Typical reply
          </Eyebrow>
          <p className="mt-1.5 text-sm text-ink">Within one working day</p>
        </div>
      </div>
    );
  }

  const accent = accentClasses[group.accent];

  return (
    // `key` restarts the fade when the hovered service changes. Without it React
    // reuses the element, the animation never re-runs, and the panel swaps with
    // a hard cut.
    <div key={group.slug} className="motion-safe:animate-[fade-rise_.28s_ease-out_both] flex w-full flex-col">
      <Eyebrow as="p" size="sm" tone="muted">
        What you get
      </Eyebrow>
      <h3 className="t-h5 mt-3 text-ink">{group.title}</h3>
      {/* Clamped to three lines. The opening sentences run from 60 to 190
          characters across the fifteen, and left unclamped the tallest card
          (Website & App Development) forced a 708px menu with 400px of void in
          every other state. Three lines bounds it. The full sentence is one
          click away on the page itself. */}
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
        {firstSentence(group.intro)}
      </p>

      <ul className="mt-5 space-y-2.5">
        {group.items.slice(0, 3).map((item) => (
          <li key={item.title} className="flex items-start gap-2.5 text-sm text-muted">
            <span
              aria-hidden="true"
              className={`mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`}
            />
            {item.title}
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-border pt-5">
        {group.railTimeline ? (
          <>
            <Eyebrow as="p" size="sm" tone="muted">
              Typical timeline
            </Eyebrow>
            <p className="mt-1.5 text-sm text-ink">{group.railTimeline}</p>
          </>
        ) : null}
        <Link
          href={`/services/${group.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className={`${group.railTimeline ? "mt-4" : ""} inline-flex items-center gap-1.5 text-sm font-semibold text-gold`}
        >
          Read the full page <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
