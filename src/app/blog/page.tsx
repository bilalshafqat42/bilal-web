import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import CtaButton from "@/components/CtaButton";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbNode, ID, ref } from "@/lib/schema";
import { OG_IMAGES } from "@/lib/ogImage";
import { blogPosts, readingMinutes } from "@/data/blogPosts";

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

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export default function BlogIndexPage() {
  const url = `${SITE_URL}/blog`;

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
      blogPost: blogPosts.map((p) => ({
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
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-5xl px-6">
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
          <div className="mx-auto max-w-5xl px-6">
            <ul className="border-t border-border">
              {blogPosts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className="group grid gap-3 border-b border-border py-8 transition-colors sm:grid-cols-[9rem_1fr_auto] sm:items-baseline sm:gap-6"
                  >
                    <time
                      dateTime={p.published}
                      className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted"
                    >
                      {formatDate(p.published)}
                    </time>
                    <div>
                      <h2 className="t-h5 text-ink transition-colors group-hover:text-gold">
                        {p.title}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                        {p.description}
                      </p>
                    </div>
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                      {readingMinutes(p)} min
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

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
