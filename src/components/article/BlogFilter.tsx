"use client";

import { Suspense, useEffect, useState, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TOPICS, isTopicSlug, topicBySlug, type TopicSlug } from "@/data/blogTopics";
import TopicChips from "@/components/article/TopicChips";
import BlogListItem, { type ListPost } from "@/components/article/BlogListItem";

/**
 * The topic filter on `/blog` (added 2026-10-23).
 *
 * **SEO first, filter second.** `/blog` is still a static page whose HTML
 * lists page one in full with the pager under it: that list arrives as
 * `children`, rendered on the server, and is what a crawler reads. A topic is
 * a query string (`/blog?topic=marketing`), read here after the page loads,
 * and the canonical stays `/blog`. There are no category pages: the old
 * WordPress `/category/*` URLs are gone and stay gone.
 *
 * **A filtered view lists every matching article, not page one's twelve.**
 * Filtering a single page of twelve would show three marketing posts and
 * imply that was all of them. So `posts` carries a compact row for every
 * article (no bodies) and a topic view replaces the paged list with the full
 * filtered one, newest first, without the pager.
 *
 * Clicks filter in place through `history.pushState`, which Next keeps in sync
 * with `useSearchParams`, so back and forward work. Each chip is still a real
 * link, so a modified click opens a new tab and the filter works with
 * JavaScript off (it simply shows the unfiltered page).
 */
export default function BlogFilter({ posts, children }: { posts: ListPost[]; children: ReactNode }) {
  const [topic, setTopic] = useState<TopicSlug | null>(null);

  const counts = Object.fromEntries(
    TOPICS.map((t) => [t.slug, posts.filter((p) => p.topics.includes(t.slug)).length]),
  ) as Record<TopicSlug, number>;

  function select(slug: TopicSlug | null, e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    window.history.pushState(null, "", slug ? `/blog?topic=${slug}` : "/blog");
    setTopic(slug);
  }

  const shown = topic ? posts.filter((p) => p.topics.includes(topic)) : null;

  return (
    <>
      {/* `useSearchParams` needs a Suspense boundary on a static page, and
          everything inside one is left out of the server HTML. So the only
          thing inside it is this reader, which renders nothing: the list
          itself stays in the HTML. */}
      <Suspense fallback={null}>
        <TopicFromUrl onChange={setTopic} />
      </Suspense>

      <TopicChips active={topic} counts={counts} total={posts.length} onSelect={select} />

      {/* Announced on change; visible only while a topic is selected. */}
      <p role="status" className="mt-4 min-h-6 text-sm text-muted">
        {topic && shown ? (
          <>
            {shown.length} {shown.length === 1 ? "article" : "articles"} in {topicBySlug(topic).label},
            newest first.{" "}
            <Link
              href="/blog"
              scroll={false}
              onClick={(e) => select(null, e)}
              className="text-ink underline decoration-gold/40 underline-offset-4 hover:text-gold"
            >
              Show all writing
            </Link>
          </>
        ) : null}
      </p>

      <div className="mt-3">
        {shown ? (
          <ul className="border-t border-border">
            {shown.map((p) => (
              <BlogListItem key={p.slug} post={p} />
            ))}
          </ul>
        ) : (
          children
        )}
      </div>
    </>
  );
}

function TopicFromUrl({ onChange }: { onChange: (t: TopicSlug | null) => void }) {
  const raw = useSearchParams().get("topic");
  useEffect(() => {
    onChange(isTopicSlug(raw) ? raw : null);
  }, [raw, onChange]);
  return null;
}
