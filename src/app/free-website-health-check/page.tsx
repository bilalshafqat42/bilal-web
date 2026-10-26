import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  Bot,
  Clock,
  Cookie,
  FileText,
  Gauge,
  Inbox,
  MapPin,
  MousePointerClick,
  ShieldCheck,
  Target,
  type LucideIcon,
} from "lucide-react";
import { pageMetadata } from "@/lib/site";
import PageOpener from "@/components/layout/PageOpener";
import Reveal from "@/components/ui/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import CtaButton from "@/components/ui/CtaButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import FaqSection from "@/components/ui/FaqSection";
import JsonLd from "@/components/seo/JsonLd";
import HealthCheckForm from "@/components/forms/HealthCheckForm";
import { SITE_URL, breadcrumbNode, faqNode, serviceNode } from "@/lib/schema";
import {
  HEALTH_CHECK_FAQS,
  HEALTH_CHECK_PATH,
  HEALTH_CHECK_POINTS,
  HEALTH_CHECK_SUMMARY,
} from "@/data/healthCheck";

/* "Website audit" is in the title and description, "health check" everywhere
 * a visitor is asked to act. Roadmap hard rule: the site-wide CTA never says
 * "audit"; the 2026-08-26 amendment allows it as the name of an offer on its
 * own page. Measured with scripts/lib/serpWidth.mjs: title 50 characters,
 * about 460px; description 142 characters, about 882px. */
export const metadata: Metadata = pageMetadata({
  title: "Free Website Audit in Dubai: 10-Point Health Check",
  description:
    "A free website audit for Dubai businesses: 10 checks on speed, forms, tracking, ads and search. The top fixes come back in writing. No logins.",
  path: HEALTH_CHECK_PATH,
});

/** In the same order as HEALTH_CHECK_POINTS. */
const ICONS: LucideIcon[] = [
  Gauge,
  MousePointerClick,
  Inbox,
  Activity,
  Cookie,
  MapPin,
  FileText,
  Bot,
  Target,
  ShieldCheck,
];

const getList = [
  "A short written summary by email: what passed, what did not, and what I could not confirm from outside.",
  "The top fixes in order, starting with whatever is most likely costing you enquiries.",
  "Plain English, so you can fix things yourself, hand the list to your developer, or ask me.",
];

const forList = [
  "Businesses in Dubai and the UAE whose website is meant to bring in enquiries.",
  "Anyone about to spend on Google or Meta ads who wants the landing page and tracking right first.",
  "Owners whose enquiries have dropped, or whose reports and CRM never seem to agree.",
];

const steps = [
  { title: "Send the address", body: "Fill in the form with your website and your main goal." },
  { title: "I check it from outside", body: "Public tools and a browser only. No logins, no access requests." },
  { title: "You get the summary", body: "By email, with the top fixes in order." },
];

const pageUrl = `${SITE_URL}${HEALTH_CHECK_PATH}`;

const nodes = [
  {
    ...serviceNode({
      name: "Free website and marketing health check",
      description: HEALTH_CHECK_SUMMARY,
      serviceType: "Website audit",
      url: pageUrl,
    }),
    // Stated because it is true and visible on the page: there is no charge.
    offers: { "@type": "Offer", price: "0", priceCurrency: "AED", url: pageUrl },
  },
  breadcrumbNode(pageUrl, [
    { name: "Home", item: SITE_URL },
    { name: "Free website health check", item: pageUrl },
  ]),
  faqNode(pageUrl, HEALTH_CHECK_FAQS),
];

export default function HealthCheckPage() {
  return (
    <>
      <JsonLd nodes={nodes} />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <PageOpener
          crumbs={[{ label: "Home", href: "/" }, { label: "Free website health check" }]}
          eyebrow="Free health check"
          title="A free 10-point health check for your website, ads and tracking"
          standfirst={
            <>
              <p>
                A website can look fine and still lose enquiries: slow on a phone, a
                form nobody has tested in months, or tracking that records visits but
                not enquiries. This is a free website audit of ten points like those,
                done by hand from the outside.
              </p>
              <p>
                No logins and no access to your accounts. You get a short written
                summary of the top fixes by email.
              </p>
            </>
          }
          actions={
            <>
              <CtaButton href="#request">Request the free check</CtaButton>
              <SecondaryButton href="#checks">See the ten checks</SecondaryButton>
            </>
          }
        />

        <section id="checks" className="relative section scroll-mt-28">
          <div className="site-container">
            <Reveal>
              <Eyebrow>What I check</Eyebrow>
              <h2 className="t-h2 mt-4 text-ink">The ten points of the website audit</h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
                Each one is something a visitor, Google or an ad platform notices, and
                each can be checked without asking you for a password.
              </p>
            </Reveal>
            <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {HEALTH_CHECK_POINTS.map((point, i) => {
                const Icon = ICONS[i] ?? FileText;
                return (
                  <li key={point.title} className="flex gap-4 r-card surface-1 p-6">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-gold-2/10 text-gold"
                    >
                      <Icon size={20} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="t-h5 text-ink">
                        <span className="mr-2 font-mono text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
                        {point.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{point.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="relative section-tight">
          <div className="site-container grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full r-card surface-1 p-7 sm:p-8">
                <Eyebrow>What you get</Eyebrow>
                <h2 className="t-h3 mt-3 text-ink">A short list of fixes, not a long report</h2>
                <ul className="mt-5 space-y-3">
                  {getList.map((line) => (
                    <li key={line} className="flex gap-3 text-base leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full r-card surface-1 p-7 sm:p-8">
                <Eyebrow>Who it is for</Eyebrow>
                <h2 className="t-h3 mt-3 text-ink">Sites that are meant to bring in work</h2>
                <ul className="mt-5 space-y-3">
                  {forList.map((line) => (
                    <li key={line} className="flex gap-3 text-base leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="request" className="relative section-tight scroll-mt-28">
          <div className="site-container">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <Reveal>
                <HealthCheckForm />
              </Reveal>

              <Reveal delay={0.1}>
                <div className="h-full r-card surface-1 p-7">
                  <Eyebrow>How it works</Eyebrow>
                  <h2 className="t-h3 mt-3 text-ink">Three steps, no call needed</h2>
                  <ol className="mt-5 space-y-5">
                    {steps.map((s, i) => (
                      <li key={s.title} className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 font-mono text-xs text-gold">
                          {i + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-muted">
                          <span className="block font-medium text-ink">{s.title}</span>
                          {s.body}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-7 flex items-start gap-3 border-t border-border pt-5 text-sm leading-relaxed text-muted">
                    <Clock size={16} className="mt-0.5 shrink-0 text-gold" />
                    <span>
                      <span className="block font-medium text-ink">Typical reply</span>
                      Within one working day, Monday to Friday. If the review needs
                      longer, that reply says when to expect it.
                    </span>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-muted">
                    Rather talk it through?{" "}
                    <Link href="/appointment" className="text-gold underline underline-offset-4 hover:opacity-80">
                      Book a free consultation
                    </Link>
                    .
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <FaqSection
          eyebrow="Questions"
          title="About the free health check"
          faqs={HEALTH_CHECK_FAQS}
          intro={
            <>
              What you send is used only to do the review and reply to you. The{" "}
              <Link href="/privacy" className="text-ink underline underline-offset-4 hover:text-gold">
                privacy policy
              </Link>{" "}
              says how enquiries are stored. For a deeper look at search, see{" "}
              <Link href="/services/seo" className="text-ink underline underline-offset-4 hover:text-gold">
                SEO services
              </Link>
              .
            </>
          }
        />
      </main>
    </>
  );
}
