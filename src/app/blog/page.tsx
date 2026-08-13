import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { posts, formatPostDate, summarise } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — React, JavaScript, UI/UX & Web Development | Bilal Shafqat",
  description:
    "In-depth guides on React, JavaScript, TypeScript, CSS, UI/UX design, and web development, written from hands-on client and product work.",
  alternates: { canonical: "/blog/" },
};

export default function BlogIndexPage() {
  const allCategories = Array.from(
    new Map(posts.flatMap((p) => p.categories).map((c) => [c.slug, c])).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Nav />
      <main className="flex-1 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
              Blog
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              Notes on building for the web
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed">
              Practical guides on React, JavaScript, TypeScript, CSS, and UI/UX
              design, written from real client and product work rather than
              theory.
            </p>
          </div>
        </section>

        {allCategories.length > 0 ? (
          <div className="mx-auto mt-12 max-w-5xl px-6">
            <div className="flex flex-wrap justify-center gap-2">
              {allCategories.map((c) => (
                <a
                  key={c.slug}
                  href={`/category/${c.slug}/`}
                  className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs text-muted hover:text-ink hover:border-gold/40 transition-colors"
                >
                  {c.name}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <section className="mx-auto mt-12 max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/${post.slug}/`}
                className="card-hover flex flex-col rounded-2xl border border-border glass p-6"
              >
                {post.categories[0] ? (
                  <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                    {post.categories[0].name}
                  </span>
                ) : null}
                <h2
                  className="mt-2 text-lg font-semibold leading-snug text-ink"
                  dangerouslySetInnerHTML={{ __html: post.title }}
                />
                <p className="mt-3 text-sm text-muted leading-relaxed">{summarise(post, 140)}</p>
                <time dateTime={post.date} className="mt-4 text-xs text-muted/70">
                  {formatPostDate(post.date)}
                </time>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Contact />
      <Footer />
    </>
  );
}
