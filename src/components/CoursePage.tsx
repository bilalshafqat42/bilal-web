import { ArrowRight, CheckCircle2 } from "lucide-react";
import Nav from "./Nav";
import Contact from "./Contact";
import Footer from "./Footer";
import type { Course } from "@/data/courses";

const SITE_URL = "https://bilalshafqat.com";

export default function CoursePage({ course }: { course: Course }) {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.seoDescription,
    url: `${SITE_URL}/${course.slug}/`,
    provider: { "@type": "Person", name: "Bilal Shafqat", url: SITE_URL },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: ["online", "onsite"],
      courseWorkload: `PT${course.modules.length}H`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <Nav />
      <main className="flex-1 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-4xl px-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <li>
              <a href="/" className="hover:text-ink transition-colors">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/training/" className="hover:text-ink transition-colors">
                Training
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink/80">{course.title}</li>
          </ol>
        </nav>

        <section className="relative overflow-hidden mt-8">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
              {course.eyebrow}
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              {course.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed">{course.intro}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/#contact"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
              >
                Enquire about this course <ArrowRight size={16} />
              </a>
              <a
                href="/training/"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
              >
                All training
              </a>
            </div>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl sm:text-[2rem] font-semibold leading-tight text-ink">Course content</h2>
            <div className="mt-8 space-y-4">
              {course.modules.map((m) => (
                <div key={m.number} className="rounded-2xl border border-border glass p-6 sm:p-7">
                  <div className="flex items-start gap-4">
                    <span className="text-sm font-medium tabular-nums text-gold">{m.number}</span>
                    <div>
                      <h3 className="text-lg font-semibold leading-snug text-ink">{m.title}</h3>
                      <p className="mt-2 text-sm text-muted leading-relaxed">{m.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-4xl px-6 grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold leading-tight text-ink">What you&apos;ll walk away with</h2>
              <ul className="mt-5 space-y-3">
                {course.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 text-sm text-muted leading-relaxed">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold leading-tight text-ink">Why learn with me</h2>
              <ul className="mt-5 space-y-3">
                {course.whyMe.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-sm text-muted leading-relaxed">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Contact />
      <Footer />
    </>
  );
}
