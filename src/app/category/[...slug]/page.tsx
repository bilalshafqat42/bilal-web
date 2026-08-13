import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { posts, getPostsByCategory, formatPostDate, summarise } from "@/lib/posts";

/**
 * Category archives carried over from the previous WordPress site. The old
 * URLs were nested (e.g. /category/react-js/redux/), so this is a catch-all
 * that reproduces those exact paths. Only the final segment identifies the
 * category being listed.
 */
const CATEGORY_PATHS: string[][] = [
  ["blog"],
  ["portfolio"],
  ["portfolio", "ecommerce"],
  ["react-js"],
  ["react-js", "redux"],
  ["design"],
  ["ui-ux-design"],
  ["typescript"],
  ["javascript"],
  ["seo"],
  ["tools"],
  ["ai"],
  ["ai", "chatgpt"],
  ["ai", "deepseek"],
  ["ui-ux-design", "figma"],
  ["css"],
  ["css", "flexbox"],
  ["javascript", "es6"],
  ["node-js"],
  ["react-js", "react-hooks"],
];

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return CATEGORY_PATHS.map((slug) => ({ slug }));
}

function resolveCategory(slugParts: string[]) {
  const leaf = slugParts[slugParts.length - 1];
  const known = posts.flatMap((p) => p.categories).find((c) => c.slug === leaf);
  return { leaf, name: known?.name ?? leaf.replace(/-/g, " ") };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { name } = resolveCategory(slug);
  const path = `/category/${slug.join("/")}/`;

  return {
    title: `${name} — Articles by Bilal Shafqat`,
    description: `Articles and guides on ${name} from Bilal Shafqat, covering practical, hands-on web development and design work.`,
    alternates: { canonical: path },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const isKnownPath = CATEGORY_PATHS.some(
    (p) => p.length === slug.length && p.every((seg, i) => seg === slug[i])
  );
  if (!isKnownPath) notFound();

  const { leaf, name } = resolveCategory(slug);
  const categoryPosts = getPostsByCategory(leaf);

  return (
    <>
      <Nav />
      <main className="flex-1 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <nav aria-label="Breadcrumb" className="flex justify-center">
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

            <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-ink capitalize">
              {name}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted leading-relaxed">
              {categoryPosts.length > 0
                ? `${categoryPosts.length} article${categoryPosts.length === 1 ? "" : "s"} on ${name}.`
                : `No articles published under ${name} yet.`}
            </p>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-5xl px-6">
          {categoryPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {categoryPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/${post.slug}/`}
                  className="card-hover flex flex-col rounded-2xl border border-border glass p-6"
                >
                  <h2
                    className="text-lg font-semibold leading-snug text-ink"
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                  <p className="mt-3 text-sm text-muted leading-relaxed">{summarise(post, 140)}</p>
                  <time dateTime={post.date} className="mt-4 text-xs text-muted/70">
                    {formatPostDate(post.date)}
                  </time>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <a
                href="/blog/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:opacity-80 transition-opacity"
              >
                Browse all articles →
              </a>
            </div>
          )}
        </section>
      </main>
      <Contact />
      <Footer />
    </>
  );
}
