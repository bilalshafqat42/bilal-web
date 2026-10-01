import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { readingMinutes, type BlogPost } from "@/data/blogPosts";
import { blogPagePath } from "@/lib/blogPagination";

/** "2 Oct 2026" — UAE convention, and unambiguous where 10/02 is not. */
const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

/**
 * The writing index list, plus its pager.
 *
 * Extracted from `/blog/page.tsx` when paging arrived, so page one and pages
 * two onward cannot drift into rendering the same list two different ways.
 */
export default function BlogList({
  posts,
  page,
  totalPages,
}: {
  posts: BlogPost[];
  page: number;
  totalPages: number;
}) {
  return (
    <>
      <ul className="border-t border-border">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/${p.slug}`}
              className="group grid gap-3 border-b border-border py-8 transition-colors sm:grid-cols-[9rem_1fr_auto] sm:items-baseline sm:gap-6"
            >
              <time
                dateTime={p.published}
                className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted"
              >
                {formatDate(p.published)}
              </time>
              <div>
                <h2 className="t-h5 text-ink transition-colors group-hover:text-gold">{p.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{p.description}</p>
              </div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                {readingMinutes(p)} min
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {totalPages > 1 ? (
        // `nav` with its own label, because this is a second navigation region
        // on a page that already has a breadcrumb and the primary nav.
        <nav aria-label="Writing pages" className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <PagerLink
            href={page > 1 ? blogPagePath(page - 1) : undefined}
            rel="prev"
            label="Previous"
            icon="left"
          />

          <ol className="flex flex-wrap items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                {n === page ? (
                  // The current page is not a link. `aria-current` is what tells
                  // a screen reader which one it is; a link to the page you are
                  // already on is a dead end for everyone.
                  <span
                    aria-current="page"
                    className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 px-3 text-sm font-semibold text-ink"
                  >
                    {n}
                  </span>
                ) : (
                  <Link
                    href={blogPagePath(n)}
                    className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-border px-3 text-sm font-medium text-muted transition-colors hover:border-gold/35 hover:text-ink"
                  >
                    {n}
                  </Link>
                )}
              </li>
            ))}
          </ol>

          <PagerLink
            href={page < totalPages ? blogPagePath(page + 1) : undefined}
            rel="next"
            label="Next"
            icon="right"
          />
        </nav>
      ) : null}
    </>
  );
}

/** Previous/Next. Renders as a disabled-looking span at either end rather than
 *  disappearing, so the pager keeps its shape and the page numbers stay put
 *  instead of sliding sideways between pages. */
function PagerLink({
  href,
  rel,
  label,
  icon,
}: {
  href?: string;
  rel: "prev" | "next";
  label: string;
  icon: "left" | "right";
}) {
  const Icon = icon === "left" ? ChevronLeft : ChevronRight;
  const inner = (
    <>
      {icon === "left" ? <Icon size={15} /> : null}
      {label}
      {icon === "right" ? <Icon size={15} /> : null}
    </>
  );
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors";

  if (!href) {
    return (
      <span aria-hidden="true" className={`${base} border-border/50 text-muted/40`}>
        {inner}
      </span>
    );
  }
  return (
    <Link href={href} rel={rel} className={`${base} border-border text-ink hover:border-gold/35`}>
      {inner}
    </Link>
  );
}
