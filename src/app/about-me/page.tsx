import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Me - Bilal Shafqat",
  description:
    "Bilal Shafqat: 15 years across marketing, design, and development. Career history, education, and the hands-on experience behind the work, based in Dubai, UAE.",
  alternates: { canonical: "/about-me/" },
};

const stats = [
  { value: "15+", label: "Years of experience globally" },
  { value: "400+", label: "Happy customers globally" },
  { value: "500+", label: "Projects completed" },
  { value: "97%", label: "Customer satisfaction rate" },
];

const experience = [
  {
    role: "Web Developer, UI & UX Designer",
    org: "Leos Developments — Real Estate",
    period: "Nov 2022 – present",
    body: "Designed and developed multilingual real estate web pages and landing pages. Created social media posts, brochures, prototypes, and other marketing materials, and managed on-page SEO. Built a custom React application for real estate sales agents, optimised for big-screen client presentations.",
  },
  {
    role: "Frontend Developer — Shopify & eCommerce",
    org: "Devigital",
    period: "2022",
    body: "Front-end developer on bokksu.com, responsible for their Shopify eCommerce stores. Led a team of 8 junior front-end developers, mentoring them in JavaScript, React, HTML, CSS, SCSS, BEM, and responsive development. Converted Figma designs into responsive Shopify templates using LiquidJS.",
  },
  {
    role: "React Developer — eCommerce",
    org: "Petsmarket",
    period: "2021",
    body: "Built a multilingual eCommerce application using React, Redux Toolkit, i18next, React Router, and React Helmet. Worked closely with the SEO team to preserve existing SEO links and data through the rebuild, maintaining search visibility throughout.",
  },
  {
    role: "React Developer — eCommerce",
    org: "Nexusberry",
    period: "2020",
    body: "Developed custom applications for eCommerce stores using React and Ant Design, working closely with QA and the wider team to ensure thorough project testing.",
  },
  {
    role: "Web Developer, UI & UX Designer",
    org: "Key2Code Software House",
    period: "2015 – 2019",
    body: "Worked across both development and UI/UX design, with leadership responsibility for a team of 3 developers, 2 designers, and an SEO manager.",
  },
  {
    role: "UI & UX Designer, Frontend Developer",
    org: "Smaw Tech",
    period: "2014 – 2015",
    body: "Designed modern web application interfaces and implemented Bootstrap's grid system for responsiveness across devices.",
  },
  {
    role: "UI & UX Designer, Frontend Developer",
    org: "Vitalsouls",
    period: "2012 – 2013",
    body: "Specialised in crafting interactive, responsive web templates, designing and optimising website layouts and user experiences for engagement.",
  },
  {
    role: "Web & Graphic Designer",
    org: "Elance (freelance)",
    period: "2011 – 2015",
    body: "Freelance web and graphic design: brochure design, logo creation, banner design, and web design for international clients.",
  },
];

const education = [
  { title: "Computer Science", org: "Virtual University", period: "2014 – 2018" },
  { title: "MERN Stack Development", org: "Nexusberry", period: "2021" },
  { title: "Web Developer Apprenticeship", org: "Microsoft", period: "2020" },
  { title: "Web Development with PHP", org: "Punjab University", period: "2015" },
  { title: "Web & Graphic Designing", org: "VTI", period: "2013" },
];

export default function AboutMePage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
              About Me
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              15 years of building, designing, and marketing
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed">
              I design, develop, and maintain modern web and mobile
              applications, and run the marketing that drives traffic to them.
              That combination, technical depth alongside marketing execution,
              is what lets me take a project from idea through to launch without
              handing it between departments.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/#contact"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
              >
                Book a free consultation <ArrowRight size={16} />
              </a>
              <a
                href="/portfolio/"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
              >
                View my work
              </a>
            </div>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border glass p-6 text-center">
                  <p className="text-3xl font-bold text-gold">{s.value}</p>
                  <p className="mt-2 text-xs text-muted leading-relaxed">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl sm:text-[2rem] font-semibold leading-tight text-ink">
              Experience &amp; career
            </h2>
            <div className="mt-8 space-y-4">
              {experience.map((e) => (
                <div key={e.org + e.period} className="rounded-2xl border border-border glass p-6 sm:p-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold leading-snug text-ink">{e.role}</h3>
                    <span className="text-xs text-muted/70">{e.period}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gold">{e.org}</p>
                  <p className="mt-3 text-sm text-muted leading-relaxed">{e.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-16 sm:mt-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl sm:text-[2rem] font-semibold leading-tight text-ink">
              Education &amp; courses
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {education.map((e) => (
                <div key={e.title} className="rounded-xl border border-border glass p-5">
                  <h3 className="text-sm font-semibold text-ink">{e.title}</h3>
                  <p className="mt-1 text-sm text-muted">{e.org}</p>
                  <p className="mt-1 text-xs text-muted/70">{e.period}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Contact />
      <Footer />
    </>
  );
}
