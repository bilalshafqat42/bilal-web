import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy & What's Stored — Bilal Shafqat",
  description:
    "Exactly what this website stores, what happens to enquiry details, and how to decline campaign tracking.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

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
    what: "Enquiry details you type (name, email, phone, service, message)",
    where: "Sent to my lead system when you press send",
    why: "So I can reply to you.",
    optional: "Yes — don't submit the form. Email or WhatsApp me instead.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pb-16 sm:pb-20">
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 grid-fade" />
          <div className="relative mx-auto max-w-3xl px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
              Privacy
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight text-ink">
              What this site stores
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              Short version: this site has no advertising cookies, no third-party
              trackers, and no analytics scripts. The only things kept are listed
              below, and the campaign tracking is optional.
            </p>
          </div>
        </section>

        <section className="relative mt-14">
          <div className="mx-auto max-w-3xl px-6">
            <div className="space-y-5">
              {rows.map((r) => (
                <div key={r.what} className="rounded-2xl border border-border glass p-6">
                  <h2 className="text-base font-semibold text-ink">{r.what}</h2>
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

            <div className="mt-10 rounded-2xl border border-border glass p-6">
              <h2 className="text-base font-semibold text-ink">Changing your mind</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Clearing this site&apos;s data in your browser removes the stored
                choice and the banner will ask again. Session storage clears by
                itself when you close the tab.
              </p>
              <h2 className="mt-6 text-base font-semibold text-ink">Getting your details removed</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                If you&apos;ve sent an enquiry and want it deleted, email{" "}
                <a href="mailto:bilalshafqat42@gmail.com" className="text-gold underline underline-offset-2 hover:opacity-80">
                  bilalshafqat42@gmail.com
                </a>{" "}
                and it will be removed.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
