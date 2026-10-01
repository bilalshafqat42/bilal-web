import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import CtaButton from "@/components/CtaButton";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbNode, ID, ref } from "@/lib/schema";
import { OG_IMAGES } from "@/lib/ogImage";
import BlogList from "@/components/BlogList";
import { blogPageSlice, totalBlogPages } from "@/lib/blogPagination";

export const metadata: Metadata = {
  title: "Writing — Notes on React, Front-End and Design",
  description:
    "Practical notes on React hooks, React Native and design practice, written from client work rather than from the documentation.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Writing — Notes on React, Front-End and Design",
    description:
      "Practical notes on React hooks, React Native and design practice, written from client work.",
    type: "website",
    url: "/blog",
    images: OG_IMAGES,
  },
};

export default function BlogIndexPage() {
  const url = `${SITE_URL}/blog`;
  const totalPages = totalBlogPages();
  const posts = blogPageSlice(1);

  // A `Blog` node listing the posts, rather than eight loose `Article` nodes
  // duplicating what each article page already declares about itself. The
  // `blogPost` entries are pointers at those `@id`s, so nothing is restated.
  const nodes = [
    breadcrumbNode(url, [
      { name: "Home", item: SITE_URL },
      { name: "Writing", item: url },
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
      // The posts on *this* page, not all 57. The markup is a description of
      // the page it sits on, and listing entries a visitor cannot see here is
      // the same mistake as claiming a rating nobody left.
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
              <span className="text-ink">Writing</span>
            </nav>
            <h1 className="t-h1 mt-8 text-ink">Writing</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Notes on the things I hit in client work — React hooks that look simple until
              they cost you a render, and the design references I keep going back to.
            </p>
          </div>
        </section>

        <section className="relative mt-14 sm:mt-16">
          <div className="site-container">
            <BlogList posts={posts} page={1} totalPages={totalPages} />
          </div>
        </section>

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
                    Next step
                  </span>
                  <h2 className="t-h2 mt-4 text-ink">
                    Rather have it <span className="text-gradient">built for you?</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
                    Fifteen years across marketing, design and development, as one point of contact.
                  </p>
                  <CtaButton href="/appointment" className="mt-9">Book a free consultation</CtaButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
