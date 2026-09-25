import type { Metadata } from "next";
import ConsentReset from "@/components/ConsentReset";
import { SITE_URL, breadcrumbNode, graph, ref, ID } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Privacy & What This Site Stores — Bilal Shafqat, Dubai",
  // Was 104 characters and left a third of the space Google gives you unused.
  description:
    "What this site stores: Google Analytics, the Meta Pixel, campaign tracking and enquiry details. What each is for, and how to decline or delete yours.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

/** Shown on the page so a visitor can tell whether what they are reading is
 *  current. Update it whenever the rows below change. */
const LAST_UPDATED = "16 September 2026";

const rows = [
  {
    what: "Your consent choice",
    where: "Browser local storage",
    why: "So the cookie banner doesn't ask again on every visit.",
    optional: "No — without it the banner cannot remember your answer.",
  },
  {
    what: "Campaign source (utm_source, utm_medium, utm_campaign, and ad click IDs such as gclid or fbclid)",
    where: "Browser session storage, cleared when you close the tab",
    why: "So that if you send an enquiry, I can tell which campaign or search brought you here.",
    optional: "Yes — decline on the banner and nothing is stored.",
  },
  {
    what: "Google Analytics (GA4) — pages you visit, roughly where you are, and what kind of device you use",
    where: "Sent to Google, which may transfer it outside the UAE",
    why: "So I can see which pages people actually read and which ones are not working.",
    optional:
      "Partly. The script loads on every page, but it is set to store nothing until you accept. Decline and it keeps storing nothing.",
  },
  {
    what: "Booking details when you open the calendar (name, email, and the answers you picked)",
    where: "Sent to Cal.com, which handles the scheduling",
    why: "So the call lands in both our calendars and you get a confirmation you can reschedule from.",
    optional: "Yes — the calendar only loads if you press \u201cShow available times\u201d, and nothing is sent unless you book.",
  },
  {
    what: "Meta (Facebook) Pixel — page views, and an `_fbp` cookie identifying your browser",
    where: "Sent to Meta Platforms Ireland, which may transfer it outside the UAE",
    why: "So I can measure and retarget advertising. It loads only after you accept.",
    optional: "Yes — decline on the banner and the pixel never loads at all.",
  },
  {
    what: "Enquiry details you type (name, email, phone, service, message)",
    where: "Sent to my lead system when you press send",
    why: "So I can reply to you.",
    optional: "Yes — don't submit the form. Email or WhatsApp me instead.",
  },
];


/**
 * Structured data. This page had none until 2026-09-16, which meant Google had
 * no typed description of it at all.
 */
const pageUrl = `${SITE_URL}/privacy`;

const schema = graph([
  {
    "@type": "WebPage",
    "@id": `${pageUrl}#page`,
    url: pageUrl,
    name: "Privacy and what is stored",
    description: "What this site stores, why, and how to have it removed.",
    inLanguage: "en",
    isPartOf: ref(ID.website, "WebSite"),
    about: ref(ID.business, "ProfessionalService"),
  },
  breadcrumbNode(pageUrl, [
    { name: "Home", item: SITE_URL },
    { name: "Privacy", item: pageUrl },
  ]),
]);

export default function PrivacyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main id="main" tabIndex={-1} className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-3xl px-6">
            <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
              Privacy
            </span>
            <h1 className="t-h1 mt-5 text-ink">
              What this site stores
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              Short version: no advertising cookie is written and the Meta Pixel
              never loads until you accept on the cookie banner. Google Analytics
              does load on every page, but it is set to store nothing about you
              unless you accept, and declining keeps it that way. Everything this
              site can store is listed below, in plain language.
            </p>
          </div>
        </section>

        <section className="relative mt-14">
          <div className="mx-auto max-w-3xl px-6">
            <div className="space-y-5">
              {rows.map((r) => (
                <div key={r.what} className="rounded-2xl border border-border panel p-6">
                  <h2 className="t-h3 text-ink">{r.what}</h2>
                  <dl className="mt-4 space-y-2.5 text-sm">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                      <dt className="w-28 shrink-0 text-xs uppercase tracking-wide text-gold">Stored</dt>
                      <dd className="text-muted">{r.where}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                      <dt className="w-28 shrink-0 text-xs uppercase tracking-wide text-gold">Why</dt>
                      <dd className="text-muted">{r.why}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                      <dt className="w-28 shrink-0 text-xs uppercase tracking-wide text-gold">Optional</dt>
                      <dd className="text-muted">{r.optional}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-border panel p-6">
              <h2 className="t-h3 text-ink">Changing your mind</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Use the button below and the banner will ask again, whichever way
                you answered the first time. It also clears the campaign source
                held for this tab. Clearing this site&apos;s data in your browser
                does the same thing.
              </p>
              <ConsentReset className="mt-4" />
              <h2 className="t-h3 mt-6 text-ink">What you can ask me for</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                You can ask what I hold about you, ask me to correct it, or ask me
                to delete it. Email{" "}
                {/* Plain text rather than a mailto link on purpose: a legal
                    contact route should not depend on the visitor having a mail
                    client configured. Unchanged since item 179. */}
                <span className="text-gold">bilalshafqat42@gmail.com</span> and say
                which.
              </p>

              <h2 className="t-h3 mt-6 text-ink">Who is responsible for this</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Bilal Shafqat, working as an independent freelancer in Dubai,
                United Arab Emirates. Questions about anything on this page go to
                the same address above.
              </p>
            </div>

            <p className="mt-8 text-center text-xs text-muted">
              Last updated {LAST_UPDATED}.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
