import type { Metadata } from "next";
import { Check, Clock, Mail } from "lucide-react";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import CtaButton from "@/components/ui/CtaButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { SITE_PHONE, SITE_PHONE_HREF } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Thank you | Bilal Shafqat",
  description: "Your message has been received. I reply personally, usually within one working day.",
  // A conversion page has no business in search results: it would rank for
  // nothing useful and would let people arrive here without converting, which
  // pollutes the very measurement it exists to provide.
  robots: { index: false, follow: false },
  // No canonical (2026-11-11). Without its own `alternates` this page inherited
  // the layout's canonical of "/", so a noindex page named the homepage as its
  // main copy. Setting `alternates` replaces the layout's whole, which drops it.
  alternates: { types: { "application/rss+xml": [{ url: "/rss.xml", title: "Bilal Shafqat: Writing" }] } },
};

type PageProps = {
  searchParams: Promise<{ source?: string }>;
};

/** Tailors one line per entry point. Anything unrecognised falls back to the
 *  generic wording rather than showing an empty space. */
const COPY: Record<string, { heading: string; body: string }> = {
  appointment: {
    heading: "Call requested",
    body: "I confirm every call by email personally, so treat this as requested rather than booked until you hear from me.",
  },
  contact: {
    heading: "Message received",
    body: "It has landed with me directly, not with an assistant or a shared inbox.",
  },
  enquiry: {
    heading: "Enquiry received",
    body: "It has landed with me directly, not with an assistant or a shared inbox.",
  },
  // HEALTH_CHECK_SOURCE in src/data/leadOptions.ts. No turnaround beyond the
  // site's usual reply time is promised here or on the offer page.
  "health-check": {
    heading: "Health check requested",
    body: "I will look at your site myself and send the summary to the email address you gave. If the review needs longer than my first reply, that reply will say when to expect it.",
  },
};

const next = [
  { icon: Clock, text: "I reply personally, usually within one working day, Monday to Friday." },
  { icon: Mail, text: "Check your spam folder if nothing arrives, then email me directly." },
];

/* `?slot=` was printed here, and nothing on the site ever sent it: dead input
 * that let anyone put a sentence of their choosing on this page. Removed
 * 2026-11-12 rather than filtered further. */

export default async function ThankYouPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const source = typeof params.source === "string" ? params.source : undefined;
  const copy = (source && Object.hasOwn(COPY, source) && COPY[source]) || {
    heading: "Thank you",
    body: "Your message has reached me directly, not an assistant or a shared inbox.",
  };

  return (
    <>
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        {/* **The one page that does not use `PageOpener`, deliberately.**
            Every other opener on the site is left-aligned with a breadcrumb, a
            heading and a standfirst. This is a confirmation screen: a centred
            tick, a short line, and what happens next. Forcing a page header
            onto a success state would be consistency for its own sake, and the
            homepage is excepted for the same kind of reason — it opens with a
            hero, not a header. Both are recorded so neither gets "fixed". */}
        <section className="page-opener relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="site-container relative text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
              <Check size={26} />
            </span>

            <h1 className="t-h1 mt-7 text-ink">
              {copy.heading}
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted">{copy.body}</p>

            <ul className="mx-auto mt-10 max-w-md space-y-3 text-left">
              {next.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-base leading-relaxed text-muted">
                  <Icon size={17} className="mt-1 shrink-0 text-gold" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
              <CtaButton href="/portfolio">See my work while you wait</CtaButton>
              <SecondaryButton href="/faq">Read the FAQ</SecondaryButton>
            </div>

            <p className="mt-9 text-sm text-muted">
              Something urgent?{" "}
              <WhatsAppLink
                context="thank-you-page"
                className="text-gold underline underline-offset-4 hover:opacity-80"
              >
                WhatsApp me
              </WhatsAppLink>{" "}
              or call{" "}
              <a href={`tel:${SITE_PHONE_HREF}`} className="text-gold underline underline-offset-4 hover:opacity-80">
                {SITE_PHONE}
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
