import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import ArticleBody from "@/components/article/ArticleBody";
import ShareRow from "@/components/article/ShareRow";
import ArticleToc from "@/components/article/ArticleToc";
import ArticleRail from "@/components/article/ArticleRail";
import { tocOf } from "@/lib/headingIds";
import PageOpener from "@/components/layout/PageOpener";
import CtaButton from "@/components/ui/CtaButton";
import Reveal from "@/components/ui/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, articleNode, breadcrumbNode, faqNode } from "@/lib/schema";
import { OG_IMAGES } from "@/lib/ogImage";
import {
  blogPost,
  readingMinutes,
  metaTitleOf,
  relatedPosts,
  moreLikeThis,
  listPostOf,
  faqOf,
} from "@/data/blogPosts";
import { kindOf, topicsFor, topicBySlug } from "@/data/blogTopics";
import { topicHref } from "@/components/article/TopicChips";
import { blogPosts } from "@/data/blogPosts";
import { serviceForArticle } from "@/data/articleServices";
import Eyebrow from "@/components/ui/Eyebrow";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { HEALTH_CHECK_PATH } from "@/data/healthCheck";

/**
 * The recovered articles, at the root of the domain.
 *
 * A dynamic segment at the root catches every path no static route claims, so
 * `dynamicParams = false` is doing real work here: without it this file would
 * answer for `/anything-at-all` and the site would lose its 404 entirely.
 * With it, Next renders only the slugs `generateStaticParams` returns (one per
 * file in `src/content/blog/`) and treats the rest as not-found, which is the
 * behaviour we had before.
 *
 * Static segments win over a dynamic one at the same level, so `/about`,
 * `/faq`, `/blog` and the rest are unaffected, and a post whose slug matched
 * one of them would never render: `npm run related-check` fails on that. See `src/data/blogPosts.ts` for
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
      modifiedTime: post.updatedAt,
      authors: ["Bilal Shafqat"],
      tags: post.tags,
      // The post's own lead image when it has one, otherwise the site-wide
      // default. A share card showing the article's actual claim beats one
      // showing the site logo for the 77th time.
      images: post.image
        ? [{ url: post.image.src, width: post.image.width, height: post.image.height, alt: post.image.alt }]
        : OG_IMAGES,
    },
    // Declared alongside `openGraph`: without it the route inherits the
    // layout's card, which is the homepage's title and description.
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: post.description,
      images: post.image ? [post.image.src] : OG_IMAGES.map((i) => i.url),
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
  // rather than the one block of copy every article used to share.
  const service = serviceForArticle(post);
  const toc = tocOf(post.blocks);
  const kind = kindOf(post);
  const topics = topicsFor(post);
  const more = moreLikeThis(post.slug, 3).map(listPostOf);
  // Only from a visible "Frequently asked questions" section with `h3`
  // questions; empty for every other article. See `faqOf`.
  const faq = faqOf(post);

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
      // The last day the article's words changed, per post. It used to be the
      // recovery date for every article, new ones included.
      dateModified: post.updatedAt,
      keywords: post.tags,
      wordCount: post.words,
      // The card image the page already shows above the body, as an absolute
      // URL. Posts without one send no `image` rather than a stand-in.
      image: post.image
        ? { url: `${SITE_URL}${post.image.src}`, width: post.image.width, height: post.image.height }
        : undefined,
    }),
    // The article's own FAQ, word for word as the page shows it, and only
    // when it has one (42 of the 83 articles on 2026-10-23).
    ...(faq.length ? [faqNode(url, faq)] : []),
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
              {/* Guide, Tip or News: the rule is `kindOf` in blogTopics.ts. */}
              <span className="font-semibold text-gold">{kind}</span>
              <span aria-hidden="true" className="text-border">/</span>
              <time dateTime={post.published}>{formatDate(post.published)}</time>
              {/* The same `updatedAt` the schema sends as `dateModified`.
                  Until 2026-10-19 a refreshed article showed only its 2025
                  publish date here while telling Google it changed in 2026,
                  so the reader and the crawler saw two different ages. */}
              {post.updatedAt !== post.published ? (
                <>
                  <span aria-hidden="true" className="text-border">/</span>
                  <span>
                    Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                  </span>
                </>
              ) : null}
              <span aria-hidden="true" className="text-border">/</span>
              <span>{readingMinutes(post)} min read</span>
              {/* Topics link to the filtered writing index; tags stay as
                  plain labels. */}
              {topics.map((t) => (
                <Link
                  key={t}
                  href={topicHref(t)}
                  className="r-chip border border-gold/30 px-3 py-1 tracking-[0.1em] text-gold transition-colors hover:border-gold/35 hover:text-ink"
                >
                  {topicBySlug(t).label}
                </Link>
              ))}
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
        {/* Three columns from `xl`, measured rather than chosen.
            ----------------------------------------------------------------
            Bilal asked twice for the article to run the full container width,
            so the prose cap came off. Measured at 1440 on 2026-10-08 the text
            ran 1,360px at 18px — about **151 characters a line**, against a
            comfortable 60 to 80.

                3 columns @ 1440     804px article     89 characters
                2 columns @ 1440   1,152px article    128 characters
                1 column  @ 1440   1,360px article    151 characters

            Two columns barely helps. Three lands it, and it keeps the width he
            asked for rather than taking it back.

            At `lg` (1024-1279) the middle column would fall to 468px, about 52
            characters, which is too narrow — so the rail drops and only the
            contents list stays. Below `lg` it is one column, as before. */}
        <div className="section-tight site-container relative grid grid-cols-1 gap-12 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          {/* Order: the contents list renders first in the DOM so a keyboard or
              screen-reader user reaches the article's structure before its
              body, and `order` only moves it visually on small screens. */}
          <div className="hidden lg:block">
            <ArticleToc entries={toc} />
          </div>

          <article>
            {post.image ? (
              <Image
                src={post.image.src}
                alt={post.image.alt}
                width={post.image.width}
                height={post.image.height}
                sizes="(min-width: 1024px) 720px, 92vw"
                preload
                className="mb-10 w-full"
              />
            ) : null}
            <ArticleBody blocks={post.blocks} />
            {/* Still here as well as in the rail. The rail is for somebody
                reading; this is the closing argument for somebody who
                finished, and it is the only one a phone ever sees. */}
            <ShareRow url={url} title={post.title} />
          </article>

          <div className="hidden xl:block">
            <ArticleRail service={service} url={url} title={post.title} topics={topics} more={more} />
          </div>
        </div>

        <section className="relative section">
          <div className="site-container">
            <Reveal>
              <div className="relative overflow-hidden r-panel surface-3 px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <Eyebrow>
                    {service.pitch.eyebrow}
                  </Eyebrow>
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
                    <SecondaryButton href={service.href}>See {service.label}
                      <ChevronRight size={15} /></SecondaryButton>
                  </div>
                  {/* A third, smaller step for a reader not ready to book: the
                      free health check still arrives as a lead. A line, not a
                      button, so the booking stays the clear first choice. */}
                  <p className="mt-7 text-sm text-muted">
                    Not ready to book a call?{" "}
                    <Link
                      href={HEALTH_CHECK_PATH}
                      className="text-gold underline underline-offset-4 hover:opacity-80"
                    >
                      Get a free website health check
                    </Link>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {related.length ? (
          <section className="relative section">
            <div className="site-container">
              <h2 className="t-h4 text-ink">Keep reading</h2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/${p.slug}`}
                      className="group flex h-full flex-col r-card surface-2 p-5 transition-colors hover:border-gold/35"
                    >
                      <Eyebrow size="sm" tone="muted">
                        {readingMinutes(p)} min read
                      </Eyebrow>
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
