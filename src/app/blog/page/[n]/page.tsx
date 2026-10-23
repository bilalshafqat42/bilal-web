import type { Metadata } from "next";
import PageOpener from "@/components/layout/PageOpener";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import BlogList from "@/components/article/BlogList";
import TopicChips from "@/components/article/TopicChips";
import { blogPosts } from "@/data/blogPosts";
import { TOPICS, topicsFor, type TopicSlug } from "@/data/blogTopics";
import { SITE_URL, breadcrumbNode, ID, ref } from "@/lib/schema";
import { OG_IMAGES } from "@/lib/ogImage";
import { blogPageSlice, totalBlogPages, blogPagePath } from "@/lib/blogPagination";
import { blogPagedTitle, blogPagedDescription } from "@/lib/site";

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

const topicCounts = () =>
  Object.fromEntries(
    TOPICS.map((t) => [t.slug, blogPosts.filter((p) => topicsFor(p).includes(t.slug)).length]),
  ) as Record<TopicSlug, number>;

const pageNumber = (n: string) => (/^\d+$/.test(n) ? Number(n) : NaN);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  const page = pageNumber(n);
  if (!Number.isInteger(page) || page < 2 || page > totalBlogPages()) return {};
  const title = blogPagedTitle(page);
  const description = blogPagedDescription(page);
  return {
    title,
    description,
    // Self-canonical, not a canonical back to /blog. Pointing every page at
    // page one tells Google the other pages are duplicates of it, and the
    // articles listed only on page four then have one fewer route in.
    alternates: { canonical: blogPagePath(page) },
    openGraph: { title, description, type: "website", url: blogPagePath(page), images: OG_IMAGES },
    twitter: { card: "summary_large_image", title, description, images: OG_IMAGES.map((i) => i.url) },
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
      description: blogPagedDescription(page),
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
        <PageOpener
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Writing", href: "/blog" },
            { label: `Page ${page}` },
          ]}
          title="Writing"
          standfirst={
            <>
              Page {page} of {totalPages}. Notes on the things I hit in client work, from React
              hooks to the design references I keep going back to.
            </>
          }
        />

        <section className="relative section-tight">
          <div className="site-container">
            {/* Plain links to `/blog?topic=...`: a topic view spans every
                article, so it lives on `/blog`, never on page N. */}
            <TopicChips active={null} counts={topicCounts()} total={blogPosts.length} />
            <div className="mt-10">
              <BlogList posts={posts} page={page} totalPages={totalPages} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
