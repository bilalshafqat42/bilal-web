import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Surface from "@/components/ui/Surface";
import ShareRow from "@/components/article/ShareRow";
import type { ArticleService } from "@/data/articleServices";
import Eyebrow from "@/components/ui/Eyebrow";
import { topicHref } from "@/components/article/TopicChips";
import { TOPICS, type TopicSlug } from "@/data/blogTopics";
import type { ListPost } from "@/components/article/BlogListItem";

/**
 * The right-hand column beside an article: what I do about this, and how to
 * share it.
 *
 * **The pitch moves up here rather than being duplicated.** It used to sit only
 * at the foot of the article, which means it is seen by the people who finished
 * reading and nobody else. In the rail it is visible while someone reads, and
 * the version at the foot stays as the closing argument — the same service, two
 * moments, not two different offers.
 *
 * **Share moves up here too, and this is a correction.** It shipped at the end
 * of the body on 2026-10-07 with the reasoning that sharing happens after
 * reading. That is true of the decision and false of the control: somebody who
 * decides to share at paragraph three should not have to scroll to the bottom to
 * do it. The sidebar is where a side action belongs.
 *
 * **Topics and "Read more like this" were added below on 2026-10-23.** The
 * rail used to end after Share, leaving the column empty for the whole length
 * of the article. Both lists are short on purpose, and the rail holds still
 * (sticky) rather than scrolling away, so the column is never blank. "Read
 * more like this" never repeats the "Keep reading" three at the foot of the
 * page; see `moreLikeThis` in `blogPosts.ts`.
 *
 * **Height, and the floating buttons.** The sticky part is capped at the
 * viewport less the header (7rem) and a 5.5rem band at the bottom, and scrolls
 * inside itself if a short screen cannot fit it (measured: everything fits at
 * 1440x900). That band is where the floating Quick Enquiry button sits, over
 * the right ~150px of this column at 1280-1440. The WhatsApp button sits
 * higher, over the right ~40px only, so nothing in the rail reaches that far
 * right: the topic chips are capped at 15rem and the list keeps `pr-14`.
 *
 * Renders nothing under `lg`. There is no third column on a phone, and a
 * stacked copy of the pitch above the article would push the opening down for
 * no gain — which is the problem the bug sweep already found above the fold
 * (roadmap 364).
 */
export default function ArticleRail({
  service,
  url,
  title,
  topics,
  more,
}: {
  service: ArticleService;
  url: string;
  title: string;
  /** This article's own topics, highlighted in the list of all four. */
  topics: TopicSlug[];
  /** "Read more like this": never the same posts as "Keep reading". */
  more: ListPost[];
}) {
  return (
    // `pb-36` (9rem): when the article ends, the sticky rail stops at the
    // bottom of its column. The padding keeps its controls at least 9rem above
    // that point, so they never come to rest under the floating Quick Enquiry
    // and WhatsApp buttons in the bottom-right corner. ShareRow's compact
    // layout covers the scroll on the way in.
    <aside className="lg:sticky lg:top-28 lg:pb-36">
      {/* The scroll box. `overscroll-contain` so reaching its end does not
          start scrolling the article underneath. `p-1` with a matching
          negative margin so focus rings are not clipped at its edges. */}
      <div className="lg:max-h-[calc(100vh-12.5rem)] lg:-m-1 lg:overflow-y-auto lg:overscroll-contain lg:p-1">
      <Surface pad="md" radius="card">
        {/* Heading and links only. The pitch *body* stays at the foot of the
            article and is deliberately not repeated here: the same forty words
            twice on one page inflates the word count the scorer reads inside
            `<main>` and tells a reader nothing the second time. Measured when
            it was duplicated: 906 words became 981 on every article. */}
        <p className="t-h6 text-ink">{service.pitch.heading} {service.pitch.accent}</p>
        <Link
          href="/appointment"
          className="tap-target mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-opacity hover:opacity-80"
        >
          Book a free consultation <ArrowRight size={15} />
        </Link>
        <Link
          href={service.href}
          className="tap-target mt-3 block text-sm text-muted transition-colors hover:text-ink"
        >
          More on {service.label}
        </Link>
      </Surface>

      <ShareRow url={url} title={title} compact />

      <nav aria-label="Topics" className="mt-5">
        <Eyebrow as="p" size="sm" tone="muted">
          Topics
        </Eyebrow>
        {/* 15rem, not the column's 300px: see "Height" above. */}
        <ul className="mt-3 flex max-w-[15rem] flex-wrap gap-1.5">
          {TOPICS.map((t) => {
            const on = topics.includes(t.slug);
            return (
              <li key={t.slug}>
                <Link href={topicHref(t.slug)} className="work-chip work-chip--sm" data-on={on ? "" : undefined}>
                  {t.label}
                  {on ? <span className="sr-only"> (this article)</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {more.length ? (
        <nav aria-label="Read more like this" className="mt-5 border-t border-border pt-4">
          <Eyebrow as="p" size="sm" tone="muted">
            Read more like this
          </Eyebrow>
          <ul className="mt-2">
            {more.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${p.slug}`}
                  className="group block py-2 pr-14"
                >
                  {/* Title only. A "Guide · 5 min" line under each cost the
                      third title its place on a 900px-tall screen. */}
                  <span className="block text-sm font-medium leading-snug text-ink transition-colors group-hover:text-gold">
                    {p.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      </div>
    </aside>
  );
}
