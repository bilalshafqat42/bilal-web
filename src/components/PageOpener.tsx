import type { ReactNode } from "react";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import Eyebrow from "@/components/Eyebrow";

/**
 * The band every page opens with: white ground, breadcrumb, eyebrow, h1,
 * standfirst.
 *
 * **Was copied into sixteen files, character for character.**
 *
 *     <section className="page-opener relative overflow-hidden pt-32 sm:pt-40">
 *       <div className="pointer-events-none absolute inset-0 grid-fade" />
 *       <div className="site-container relative">
 *
 * Sixteen copies is sixteen chances for one to drift, and four more pages
 * skipped the band entirely: `/portfolio` and `/portfolio/[discipline]` opened
 * with no padding and no band at all, `/process` with a translucent dark one.
 * Measured on 2026-10-07: 160px of top padding on eleven pages, 128px on one,
 * 0px on two.
 *
 * The homepage is the one deliberate exception and does not use this. It opens
 * with a hero, not a page header, and `HomeParallax` is a different thing
 * wearing the same position.
 *
 * **`aside` is where a page puts something beside the heading** — the portrait
 * on `/about`, the availability card on `/appointment`. Passing it here rather
 * than letting each page build its own two-column grid is what stopped those
 * pages drifting in the first place.
 */

type Props = {
  /** Rendered as the h1. Every page has exactly one, which `h1-check` enforces. */
  title: ReactNode;
  /** The small gold label above the title. */
  eyebrow?: string;
  /** One or two sentences under the title. */
  standfirst?: ReactNode;
  /** Omit on a top-level page, where a trail of one crumb says nothing. */
  crumbs?: Crumb[];
  /** Buttons under the standfirst. */
  actions?: ReactNode;
  /** Content beside the heading, on `lg` and up. Stacks under it below that. */
  aside?: ReactNode;
  className?: string;
};

export default function PageOpener({
  title,
  eyebrow,
  standfirst,
  crumbs,
  actions,
  aside,
  className = "",
}: Props) {
  const heading = (
    <div>
      {crumbs?.length ? <Breadcrumb items={crumbs} className="mb-8" /> : null}
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1 className={`t-h1 text-ink ${eyebrow ? "mt-4" : ""}`}>{title}</h1>
      {standfirst ? (
        <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{standfirst}</div>
      ) : null}
      {actions ? <div className="mt-9 flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );

  return (
    <section className={`page-opener relative overflow-hidden pt-32 sm:pt-40 ${className}`}>
      {/* Decorative. `pointer-events-none` so it never eats a click on the
          breadcrumb sitting over it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-fade" />
      <div className="site-container relative">
        {aside ? (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            {heading}
            {aside}
          </div>
        ) : (
          heading
        )}
      </div>
    </section>
  );
}
