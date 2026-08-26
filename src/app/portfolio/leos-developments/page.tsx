import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "LEOS Developments — Website & Brand Social | Bilal Shafqat",
  description:
    "Case study: corporate website and brand social campaign creative for LEOS Developments, a UK-headquartered residential developer with a Dubai experience centre.",
  alternates: { canonical: "/portfolio/leos-developments" },
};

const social = [
  "leos-social-media",
  "leos-social-2",
  "leos-social-3",
  "leos-social-4",
  "leos-social-5",
  "leos-social-6",
  "leos-social-7",
];

export default function LeosCaseStudy() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-7xl px-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
              <a href="/" className="hover:text-ink transition-colors">Home</a>
              <ChevronRight size={13} />
              <a href="/portfolio" className="hover:text-ink transition-colors">Work</a>
              <ChevronRight size={13} />
              <span className="text-ink">LEOS Developments</span>
            </nav>

            <Reveal>
              <div className="mt-8 max-w-3xl">
                <Image
                  src="/portfolio/leos/logo/leos-logo.svg"
                  alt="LEOS Developments"
                  width={2000}
                  height={551}
                  priority
                  className="h-10 w-auto"
                />
                <h1 className="mt-7 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
                  Corporate website and brand social for a{" "}
                  <span className="underline decoration-gold decoration-4 underline-offset-4">
                    UK and Dubai developer
                  </span>
                </h1>
                <p className="mt-6 text-lg text-muted leading-relaxed">
                  LEOS Developments is a residential developer headquartered in
                  Weybridge, Surrey, with offices in London and an experience
                  centre in Dubai. I handled the corporate website build and the
                  brand and campaign social creative across their developments.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                {[
                  ["Client", "LEOS Developments"],
                  ["Sector", "Residential real estate"],
                  ["Markets", "United Kingdom & Dubai"],
                  ["Scope", "Website, social creative"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs uppercase tracking-wide text-gold">{k}</dt>
                    <dd className="mt-1.5 text-sm text-ink leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        <section className="relative mt-20 sm:mt-28">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                The website
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">
                The full corporate site, including the developments showcase and
                the Dubai experience centre section. Scroll inside the frame to
                view the complete page.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 overflow-hidden rounded-2xl border border-border glass">
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="ml-3 truncate text-xs text-muted">
                    LEOS Developments — corporate website
                  </span>
                </div>
                <div className="no-scrollbar max-h-[70vh] overflow-y-auto">
                  <Image
                    src="/portfolio/leos/landing-page/leos-landing-page.avif"
                    alt="Full-page view of the LEOS Developments corporate website"
                    width={1928}
                    height={6555}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="w-full"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative mt-20 sm:mt-28">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
                Social media creative
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">
                Brand and campaign assets built to run across paid and organic
                social, kept consistent with the identity used on the website.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {social.map((name, i) => (
                <Reveal key={name} delay={(i % 3) * 0.08}>
                  <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
                    <Image
                      src={`/portfolio/leos/social-media/${name}.avif`}
                      alt={`LEOS Developments social media creative ${i + 1}`}
                      width={1200}
                      height={1200}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-auto w-full"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mt-20 sm:mt-28">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-border glass-strong px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-ink">
                    Launching a development?{" "}
                    <span className="text-gradient">Let&apos;s talk.</span>
                  </h2>
                  <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                    <a
                      href="/contact"
                      className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
                    >
                      Book a free consultation <ArrowRight size={16} />
                    </a>
                    <a
                      href="/portfolio"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
                    >
                      See all work
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
