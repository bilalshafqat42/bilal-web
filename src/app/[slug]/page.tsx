import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import ArticleBody from "@/components/ArticleBody";
import CtaButton from "@/components/CtaButton";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, articleNode, breadcrumbNode } from "@/lib/schema";
import { OG_IMAGES } from "@/lib/ogImage";
import { blogPosts, blogPost, readingMinutes } from "@/data/blogPosts";
import { BLOG_RECOVERED_ON } from "@/data/contentDates";

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
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/${post.slug}` },
    openGraph: {
      title: post.title,
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
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

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
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-3xl px-6">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
              <Link href="/" className="transition-colors hover:text-ink">Home</Link>
              <ChevronRight size={13} />
              <Link href="/blog" className="transition-colors hover:text-ink">Writing</Link>
              <ChevronRight size={13} />
              <span className="text-ink">{post.title}</span>
            </nav>

            {/* `t-h2`, not `t-h1`. The scale is tuned for landing-page heroes of
                three or four words; these headlines run to 78 characters, and at
                `t-h1` the title alone filled a 1440x900 viewport — the reader
                reached the article by scrolling past its own name. Measured, not
                assumed. The element is still the page's only `h1`. */}
            <h1 className="t-h2 mt-8 text-balance text-ink">{post.title}</h1>

            <p className="mt-6 text-lg leading-relaxed text-muted">{post.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
              <time dateTime={post.published}>{formatDate(post.published)}</time>
              <span aria-hidden="true" className="text-border">/</span>
              <span>{readingMinutes(post)} min read</span>
              {post.tags.map((t) => (
                <span key={t} className="rounded-full border border-border px-3 py-1 tracking-[0.1em] text-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <article className="relative mx-auto max-w-3xl px-6">
          <ArticleBody blocks={post.blocks} />
        </article>

        <section className="relative mt-20 sm:mt-24">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
                    Working on something
                  </span>
                  <h2 className="t-h2 mt-4 text-ink">
                    Need this <span className="text-gradient">built properly?</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
                    I build the web and mobile products these notes come out of. A first
                    conversation costs nothing and often ends with a smaller scope than you expected.
                  </p>
                  <CtaButton href="/appointment" className="mt-9">Book a free consultation</CtaButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {related.length ? (
          <section className="relative mt-20 sm:mt-24">
            <div className="mx-auto max-w-5xl px-6">
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
                className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
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
