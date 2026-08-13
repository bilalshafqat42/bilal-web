import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { posts, getPostBySlug, formatPostDate, prepareContent, summarise } from "@/lib/posts";

const SITE_URL = "https://bilalshafqat.com";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const description = summarise(post, 300);

  return {
    title: post.seoTitle,
    description,
    alternates: { canonical: `/${post.slug}/` },
    openGraph: {
      title: post.seoTitle,
      description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      url: `${SITE_URL}/${post.slug}/`,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const description = summarise(post, 300);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title.replace(/<[^>]*>/g, ""),
    description,
    datePublished: post.date,
    dateModified: post.modified,
    author: { "@type": "Person", name: "Bilal Shafqat", url: SITE_URL },
    publisher: { "@type": "Person", name: "Bilal Shafqat", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/${post.slug}/` },
  };

  const related = posts
    .filter(
      (p) => p.slug !== post.slug && p.categories.some((c) => post.categories.some((pc) => pc.slug === c.slug))
    )
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Nav />
      <main className="flex-1 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <article className="mx-auto max-w-3xl px-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <li>
                <a href="/" className="hover:text-ink transition-colors">
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a href="/blog/" className="hover:text-ink transition-colors">
                  Blog
                </a>
              </li>
            </ol>
          </nav>

          <header className="mt-8">
            {post.categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {post.categories.map((c) => (
                  <a
                    key={c.slug}
                    href={`/category/${c.slug}/`}
                    className="inline-flex items-center rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs font-medium tracking-wide text-gold uppercase hover:border-gold/40 transition-colors"
                  >
                    {c.name}
                  </a>
                ))}
              </div>
            ) : null}

            <h1
              className="mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight text-ink"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />

            <p className="mt-5 flex items-center gap-2 text-sm text-muted">
              <Calendar size={14} className="text-gold" />
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            </p>
          </header>

          <div
            className="post-content mt-10"
            dangerouslySetInnerHTML={{ __html: prepareContent(post.content) }}
          />

          <div className="mt-14 border-t border-border pt-8">
            <a
              href="/blog/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink/90 hover:text-gold transition-colors"
            >
              <ArrowLeft size={15} /> Back to all articles
            </a>
          </div>

          {related.length > 0 ? (
            <section className="mt-14">
              <h2 className="text-lg font-semibold text-ink/80">Related articles</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {related.map((p) => (
                  <a
                    key={p.slug}
                    href={`/${p.slug}/`}
                    className="card-hover rounded-xl border border-border glass p-5"
                  >
                    <span
                      className="block text-sm font-medium leading-snug text-ink"
                      dangerouslySetInnerHTML={{ __html: p.title }}
                    />
                    <span className="mt-2 block text-xs text-muted">{formatPostDate(p.date)}</span>
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </main>
      <Contact />
      <Footer />
    </>
  );
}
