import Link from "next/link";
import type { MouseEvent } from "react";
import { TOPICS, type TopicSlug } from "@/data/blogTopics";

/** The URL for a topic view of the writing index. Never a route of its own:
 *  `/blog` with a query string, so the canonical stays `/blog`. */
export const topicHref = (slug: TopicSlug | null) => (slug ? `/blog?topic=${slug}` : "/blog");

/**
 * All / Marketing / Development / Design / AI & Tools.
 *
 * No hooks and no `"use client"`, so it renders from the server on
 * `/blog/page/N` (plain links to `/blog?topic=...`) and inside the client
 * filter on `/blog`, which passes `onSelect` to filter in place.
 */
export default function TopicChips({
  active,
  counts,
  total,
  onSelect,
}: {
  active: TopicSlug | null;
  counts: Record<TopicSlug, number>;
  total: number;
  onSelect?: (slug: TopicSlug | null, e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const items: { slug: TopicSlug | null; label: string; n: number }[] = [
    { slug: null, label: "All", n: total },
    ...TOPICS.map((t) => ({ slug: t.slug, label: t.label, n: counts[t.slug] ?? 0 })),
  ];
  return (
    <nav aria-label="Filter writing by topic">
      <ul className="flex flex-wrap items-center gap-2">
        {items.map((it) => (
          <li key={it.label}>
            <Link
              href={topicHref(it.slug)}
              scroll={false}
              aria-current={active === it.slug ? "true" : undefined}
              onClick={onSelect ? (e) => onSelect(it.slug, e) : undefined}
              className="work-chip"
            >
              {it.label}
              <span className="work-chip-count">{it.n}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
