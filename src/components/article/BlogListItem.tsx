import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";
import type { Kind, TopicSlug } from "@/data/blogTopics";

/**
 * One row of the writing index.
 *
 * Split out of `BlogList` on 2026-10-23 so the server-rendered list and the
 * client-side topic filter on `/blog` draw a row the same way. It takes plain
 * fields rather than a `BlogPost`, and imports nothing from `@/data/blogPosts`:
 * the filter is a client component, and a runtime import of the posts here
 * would ship every article body to the browser.
 */
export type ListPost = {
  slug: string;
  title: string;
  description: string;
  published: string;
  minutes: number;
  kind: Kind;
  topics: TopicSlug[];
};

/** "2 Oct 2026" — UAE convention, and unambiguous where 10/02 is not. */
const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export default function BlogListItem({ post: p }: { post: ListPost }) {
  return (
    <li>
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
        <Eyebrow tone="muted">
          {p.kind} · {p.minutes} min
        </Eyebrow>
      </Link>
    </li>
  );
}
