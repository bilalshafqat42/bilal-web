import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Surface from "@/components/Surface";
import ShareRow from "@/components/ShareRow";
import type { ArticleService } from "@/data/articleServices";

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
 * Renders nothing under `lg`. There is no third column on a phone, and a
 * stacked copy of the pitch above the article would push the opening down for
 * no gain — which is the problem the bug sweep already found above the fold
 * (roadmap 364).
 */
export default function ArticleRail({
  service,
  url,
  title,
}: {
  service: ArticleService;
  url: string;
  title: string;
}) {
  return (
    <aside className="lg:sticky lg:top-28">
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
    </aside>
  );
}
