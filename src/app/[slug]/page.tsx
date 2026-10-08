import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import ArticleBody from "@/components/ArticleBody";
import ShareRow from "@/components/ShareRow";
import PageOpener from "@/components/PageOpener";
import CtaButton from "@/components/CtaButton";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, articleNode, breadcrumbNode } from "@/lib/schema";
import { OG_IMAGES } from "@/lib/ogImage";
import { blogPost, readingMinutes, metaTitleOf, relatedPosts } from "@/data/blogPosts";
import { blogPosts } from "@/data/blogPosts";
import { BLOG_RECOVERED_ON } from "@/data/contentDates";
import { serviceForArticle } from "@/data/articleServices";

/**
 * The recovered articles, at the root of the domain.
 *
 * A dynamic segment at the root catches every path no static route claims, so
 * `dynamicParams = false` is doing real work here: without it this file would
 * answer for `/anything-at-all` and the site would lose its 404 entirely.
 * With it, Next renders only the eight slugs `generateStaticParams` returns and
 * treats the rest as not-found, which is the behaviour we had before.
 *
 * Static segments win over a dynamic one at the same level, so `/about`,
 * `/faq`, `/blog` and the rest are unaffected. See `src/data/blogPosts.ts` for
 * why the articles sit here rather than under `/blog/`.
 */
export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPost(slug);
  if (!post) return {};
  // The short form for the tab and the search result; the full headline still
  // renders as the `h1` below.
  const metaTitle = metaTitleOf(post);
  return {
    title: metaTitle,
    description: post.description,
    alternates: { canonical: `/${post.slug}` },
    openGraph: {
      title: metaTitle,
      description: post.description,
      // `article`, not `website` — these carry a real publication date and a
      // named author, which is exactly what the type exists to express.
      type: "article",
      url: `/${post.slug}`,
      publishedTime: post.published,
      authors: ["Bilal Shafqat"],
      tags: post.tags,
      images: OG_IMAGES,
    },
  };
}

/** "13 June 2025" — UAE convention, and unambiguous in a way that 06/13 is not
 *  for a reader outside the US. */
const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/${post.slug}`;
  const related = relatedPosts(post.slug);
  // The service this article is actually about, resolved from its tags. See
  // `articleServices.ts` for why the route off an article is topic-matched
  // rather than the one block of copy all 52 used to share.
  const service = serviceForArticle(post);

  const nodes = [
    breadcrumbNode(url, [
      { name: "Home", item: SITE_URL },
      { name: "Writing", item: `${SITE_URL}/blog` },
      { name: post.title, item: url },
    ]),
    articleNode({
      url,
      headline: post.title,
      description: post.description,
      datePublished: post.published,
      dateModified: BLOG_RECOVERED_ON,
      keywords: post.tags,
      wordCount: post.words,
    }),
  ];

  return (
    <>
      <JsonLd nodes={nodes} />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <PageOpener
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Writing", href: "/blog" },
            { label: post.title },
          ]}
          titleSize="h2"
          title={post.title}
          standfirst={post.description}
          actions={
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
              <time dateTime={post.published}>{formatDate(post.published)}</time>
              <span aria-hidden="true" className="text-border">/</span>
              <span>{readingMinutes(post)} min read</span>
              {post.tags.map((t) => (
                <span key={t} className="r-chip border border-border px-3 py-1 tracking-[0.1em] text-muted">
                  {t}
                </span>
              ))}
            </div>
          }
        />

        {/* Full `site-container` width, 1440 capped, matching every other page.
            The prose used to sit in a capped `max-w-[46rem]` column inside it
            for measure: at 1440 a line of body text runs to roughly 200
            characters, and the typographic convention is 60 to 80.

            Bilal asked for the full width twice, so the cap is gone. The
            tradeoff is real and it is his call. If the long lines turn out to
            read badly, the fix is not to re-cap the text but to put something
            in the right-hand space — a sticky contents list or the service CTA
            — which is how publications fill a wide column without stretching
            the measure. Noted here so the next person does not simply revert
            this and undo a deliberate decision. */}
        <article className="site-container relative">
          <ArticleBody blocks={post.blocks} />
          {/* At the foot of the body, above the service pitch. Sharing is what
              someone does once they have read the thing, and the pitch is the
              action that earns money, so the pitch stays last. */}
          <ShareRow url={url} title={post.title} />
        </article>

        <section className="relative mt-20 sm:mt-24">
          <div className="site-container">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                    {service.pitch.eyebrow}
                  </span>
                  <h2 className="t-h2 mt-4 text-ink">
                    {service.pitch.heading}{" "}
                    <span className="text-gradient">{service.pitch.accent}</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
                    {service.pitch.body}
                  </p>
                  {/* Two routes out, not one. The booking link is the strong
                      ask and stays primary; the service link is the weaker one
                      for a reader who wants to know what the work involves
                      before giving up a calendar slot — which, on a page
                      someone reached by searching "what is rem css", is most
                      of them. It is also the internal link that was missing
                      entirely: the articles carry the impressions and nothing
                      pointed from them at a commercial page. */}
                  <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                    <CtaButton href="/appointment">Book a free consultation</CtaButton>
                    <Link
                      href={service.href}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-white/5"
                    >
                      See {service.label}
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {related.length ? (
          <section className="relative mt-20 sm:mt-24">
            <div className="site-container">
              <h2 className="t-h4 text-ink">Keep reading</h2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {related.map((p) => (
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
                <ArrowLeft size={15} /> All writing
              </Link>
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
