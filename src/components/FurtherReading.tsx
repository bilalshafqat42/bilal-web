import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { readingMinutes } from "@/data/blogPosts";
import { articlesForService } from "@/data/serviceArticles";

/**
 * The articles behind one service, linked from the service page.
 *
 * Exists to send authority the other way. Every internal link to the articles
 * came from `/blog` and from other articles; the service pages, which are the
 * strongest pages on the site, linked to none of them (roadmap 366). This is
 * the hub-to-spoke half of that loop.
 *
 * Renders nothing when the service has no articles of its own, which is ten of
 * the fifteen. See `serviceArticles.ts` for why those ten do not borrow from
 * their category parent instead.
 *
 * Markup deliberately mirrors "Keep reading" on the article template: same card,
 * same reading-time eyebrow, same hover. Two different treatments for the same
 * idea on two templates would be a difference a reader has to resolve for
 * nothing.
 */
export default function FurtherReading({ serviceSlug }: { serviceSlug: string }) {
  const posts = articlesForService(serviceSlug);
  if (!posts.length) return null;

  return (
    <section className="relative mt-20 sm:mt-24">
      <div className="site-container">
        <Reveal>
          <h2 className="t-h3 text-ink">Further reading</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            Written on this subject rather than about the service, so you can
            judge how I think about the work before speaking to me.
          </p>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface/40 p-5 transition-colors hover:border-gold/35"
              >
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                  {readingMinutes(p)} min read
                </span>
                <span className="mt-3 text-base font-medium leading-snug text-ink transition-colors group-hover:text-gold">
                  {p.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/blog"
          className="tap-target mt-10 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          All writing <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
