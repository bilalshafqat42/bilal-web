import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import BlogList from "@/components/BlogList";
import { SITE_URL, breadcrumbNode, ID, ref } from "@/lib/schema";
import { OG_IMAGES } from "@/lib/ogImage";
import { blogPageSlice, totalBlogPages, blogPagePath } from "@/lib/blogPagination";

/**
 * Writing, page two onward.
 *
 * Page one is `/blog` and stays there: it is the indexed URL, the one in the
 * nav, and the one every article's breadcrumb points at. Redirecting it to
 * `/blog/page/1` to make the routes symmetrical would move an established URL
 * for no reader-facing gain, so `generateStaticParams` starts at 2 and
 * `dynamicParams = false` makes `/blog/page/1` a 404 rather than a duplicate of
 * `/blog`.
 */
export const dynamicParams = false;

type Props = { params: Promise<{ n: string }> };

export function generateStaticParams() {
  return Array.from({ length: totalBlogPages() - 1 }, (_, i) => ({ n: String(i + 2) }));
}

const pageNumber = (n: string) => (/^\d+$/.test(n) ? Number(n) : NaN);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  const page = pageNumber(n);
  if (!Number.isInteger(page) || page < 2 || page > totalBlogPages()) return {};
  const title = `Writing — Page ${page}`;
  return {
    title,
    description:
      "Practical notes on React hooks, React Native and design practice, written from client work rather than from the documentation.",
    // Self-canonical, not a canonical back to /blog. Pointing every page at
    // page one tells Google the other pages are duplicates of it, and the
    // articles listed only on page four then have one fewer route in.
    alternates: { canonical: blogPagePath(page) },
    openGraph: { title, type: "website", url: blogPagePath(page), images: OG_IMAGES },
  };
}

export default async function BlogPagedPage({ params }: Props) {
  const { n } = await params;
  const page = pageNumber(n);
  const totalPages = totalBlogPages();
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();

  const posts = blogPageSlice(page);
  const url = `${SITE_URL}${blogPagePath(page)}`;

  const nodes = [
    breadcrumbNode(url, [
      { name: "Home", item: SITE_URL },
      { name: "Writing", item: `${SITE_URL}/blog` },
      { name: `Page ${page}`, item: url },
    ]),
    {
      "@type": "Blog",
      "@id": `${url}#blog`,
      name: "Writing by Bilal Shafqat",
      description:
        "Practical notes on React hooks, React Native and design practice, written from client work.",
      url,
      inLanguage: "en",
      author: ref(ID.person, "Person"),
      publisher: ref(ID.business, "ProfessionalService"),
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/${p.slug}#article`,
        headline: p.title,
        url: `${SITE_URL}/${p.slug}`,
        datePublished: p.published,
      })),
    },
  ];

  return (
    <>
      <JsonLd nodes={nodes} />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <section className="page-opener relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="site-container relative">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
              <Link href="/" className="transition-colors hover:text-ink">Home</Link>
              <ChevronRight size={13} />
              <Link href="/blog" className="transition-colors hover:text-ink">Writing</Link>
              <ChevronRight size={13} />
              <span className="text-ink">Page {page}</span>
            </nav>
            <h1 className="t-h1 mt-8 text-ink">Writing</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Page {page} of {totalPages}. Notes on the things I hit in client work, from React
              hooks to the design references I keep going back to.
            </p>
          </div>
        </section>

        <section className="relative mt-14 sm:mt-16">
          <div className="site-container">
            <BlogList posts={posts} page={page} totalPages={totalPages} />
          </div>
        </section>
      </main>
    </>
  );
}
