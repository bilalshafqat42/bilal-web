import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";
import FaqSection from "@/components/ui/FaqSection";
import PageOpener from "@/components/layout/PageOpener";
import { faqGroups, allFaqs } from "@/data/faqs";
import CtaButton from "@/components/ui/CtaButton";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, faqNode, breadcrumbNode } from "@/lib/schema";
import Eyebrow from "@/components/ui/Eyebrow";


export const metadata: Metadata = pageMetadata({
  // "Freelance Marketer & Developer" until 2026-10-13. Same positioning change
  // as /about and /contact (roadmap 397).
  title: "FAQ | Hiring a Freelance Digital Marketer in Dubai",
  description:
    "Straight answers on hiring a freelance digital marketer instead of an agency: how projects start, working across timezones from Dubai, and measuring results.",
  path: "/faq",
});

export default function FaqPage() {
  // One FAQPage covering every question, so search engines and AI assistants can
  // read the whole set rather than whichever group happens to be first.


  // One graph, nodes keyed by @id. Both FAQ sets below are rendered visibly on
  // this page — verified, not assumed.
  const pageUrl = `${SITE_URL}/faq`;
  const nodes = [
    breadcrumbNode(pageUrl, [{ name: "Home", item: SITE_URL }, { name: "FAQ", item: `${SITE_URL}/faq` }]),
    faqNode(pageUrl, allFaqs.map((f) => ({ question: f.question, answer: f.answer }))),
  ];

  return (
    <>
      <JsonLd nodes={nodes} />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <PageOpener
          crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
          title="Questions people actually ask"
          standfirst={
            <>
              Honest answers about how this works, including the parts that
              usually go unsaid. If your question isn&apos;t here, ask me directly
              and I&apos;ll add it.
            </>
          }
          actions={
            <nav aria-label="Sections" className="flex flex-wrap gap-2">
              {faqGroups.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="tap-target rounded-full surface-2 px-4 py-2 text-xs font-medium text-muted transition-colors hover:border-gold/35 hover:text-ink"
                >
                  {g.title}
                </a>
              ))}
            </nav>
          }
        />

        {/* One FaqSection per group, so the group name stays beside its own
            questions as you read them.

            This replaces collapsed `<details>` accordions. They were chosen
            because they work without hydration and Ctrl+F finds their text, but
            they also hid 16 answers behind 16 clicks on the one page whose whole
            purpose is answering questions, and they were the last FAQ layout on
            the site that did not match the others. The answers are now simply
            there to read. */}
        {faqGroups.map((group, i) => (
          <FaqSection
            key={group.id}
            id={group.id}
            eyebrow={`${String(i + 1).padStart(2, "0")} / ${String(faqGroups.length).padStart(2, "0")}`}
            title={group.title}
            faqs={group.items}
            className="scroll-mt-28 pt-16 sm:pt-20"
          />
        ))}

        <section className="relative section">
          <div className="site-container">
            <Reveal>
              <div className="relative overflow-hidden r-panel surface-3 px-8 py-14 text-center sm:px-16">
                <div
                  className="blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50"
                  style={{ animationDelay: "-4s" }}
                />
                <div className="relative">
                  <Eyebrow>Next step</Eyebrow>
                  <h2 className="t-h2 mt-4 text-ink">
                    Still deciding? <span className="text-gradient">Just ask.</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">
                    A first conversation costs nothing and often ends with me
                    telling you a smaller piece of work would do the job.
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
