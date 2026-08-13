import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { courses } from "@/data/courses";

export const metadata: Metadata = {
  title: "Training - Bilal Shafqat",
  description:
    "One-to-one training in web and graphic design, frontend development, and React.js, taught by a working developer and designer rather than from a pre-recorded curriculum.",
  alternates: { canonical: "/training/" },
};

const skills = [
  "Web & graphic designing",
  "Frontend web development",
  "React.js development",
  "WordPress & eCommerce",
  "Digital marketing",
  "Freelancing & client work",
];

export default function TrainingPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
              Training
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              Learn design and development, one-to-one
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed">
              I teach the same skills I use on client work every day: design,
              frontend development, React, and the practical side of turning
              those skills into paid work. Sessions run online or in person,
              taught directly by me rather than from a pre-recorded course.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/#contact"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
              >
                Enquire about training <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl sm:text-[2rem] font-semibold leading-tight text-ink">Courses</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {courses.map((c) => (
                <a
                  key={c.slug}
                  href={`/${c.slug}/`}
                  className="card-hover flex flex-col rounded-2xl border border-border glass p-7"
                >
                  <h3 className="text-xl font-semibold leading-snug text-ink">{c.title}</h3>
                  <p className="mt-3 flex-1 text-sm text-muted leading-relaxed">{c.intro.slice(0, 140)}…</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                    View course <ArrowRight size={15} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl sm:text-[2rem] font-semibold leading-tight text-ink">What&apos;s covered</h2>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {skills.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-sm text-muted leading-relaxed">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Contact />
      <Footer />
    </>
  );
}
