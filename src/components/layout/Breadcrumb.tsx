import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * The trail above a page heading.
 *
 * **Was written out by hand in nine files**, every one the same `<nav>`, the
 * same chevron and the same classes. Nine copies is nine chances for one to
 * drift, and the tap-target fix in roadmap 364 had to reach all of them through
 * a CSS selector on `nav[aria-label="Breadcrumb"]` precisely because there was
 * no component to put it in.
 *
 * The last crumb is the current page and is deliberately **not** a link: a link
 * to the page you are on is a dead control, and screen readers announce it as a
 * destination that goes nowhere.
 *
 * This renders the visible trail only. The `BreadcrumbList` structured data is
 * built separately in `lib/schema.ts` from the same page data, because the two
 * have different requirements — the markup wants a short last crumb, the schema
 * wants absolute URLs for every level including the current page.
 */

export type Crumb = {
  label: string;
  /** Omitted on the final crumb, which is the current page. */
  href?: string;
};

export default function Breadcrumb({
  items,
  className = "",
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-1.5 text-xs text-muted ${className}`}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            {i > 0 ? <ChevronRight size={13} aria-hidden="true" /> : null}
            {item.href && !last ? (
              <Link href={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span className={last ? "text-ink" : undefined} aria-current={last ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
