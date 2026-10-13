"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowRight, Check, FileText, Loader2, MessageCircle } from "lucide-react";
import { getAttribution } from "@/lib/attribution";
import { SITE_EMAIL } from "@/lib/contact";
import { useLeadSubmit, TURNSTILE_ENABLED } from "@/lib/useLeadSubmit";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import Eyebrow from "@/components/ui/Eyebrow";
import { secondaryButtonClass } from "@/components/ui/SecondaryButton";

/** "/portfolio/leos-developments/hadley-heights" -> "Portfolio / Leos Developments / Hadley Heights" */
function prettyPath(path: string): string {
  const clean = path.split("?")[0].replace(/\/$/, "");
  if (!clean || clean === "/") return "Home";
  return clean
    .split("/")
    .filter(Boolean)
    .map((seg) =>
      seg
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    )
    .join(" / ");
}

const fieldClass =
  "w-full rounded-xl surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-gold/50 focus:ring-2 focus:ring-gold/20";

/**
 * The page the visitor was reading before they came to /contact, captured by the
 * attribution lib. Read through useSyncExternalStore rather than a mount effect:
 * it is browser-only state, and the snapshot is cached at module scope so React
 * gets a referentially stable value instead of a fresh object every render.
 */
let cachedContext: { path: string; url: string } | null | undefined;
function readPageContext() {
  if (cachedContext === undefined) {
    const a = getAttribution();
    const path = a.pageOfInterest || "";
    cachedContext =
      path && path !== "/contact" ? { path, url: a.pageUrl || window.location.href } : null;
  }
  return cachedContext;
}
const noopSubscribe = () => () => {};
function usePageContext() {
  return useSyncExternalStore(noopSubscribe, readPageContext, () => null);
}

/** One option in the "What do you need?" select. Passed in by the server page
 *  so this client file does not pull `@/data/pillars` into the browser bundle. */
export type ServiceOption = { slug: string; label: string };

export default function ContactForm({ serviceOptions }: { serviceOptions: ServiceOption[] }) {
  const { status, error, submit, turnstileRef } = useLeadSubmit({
    source: "contact-page-form",
    thankYouPath: "/thank-you?source=contact",
    honeypotField: "company",
    markSuccess: true,
    fallbackState: true,
    defaultError: "Something went wrong.",
    networkError: "Could not reach the server.",
  });
  // Which page the enquiry is about. On /contact the current page is useless,
  // so prefer the in-site page they clicked through from. Read after mount
  // because it depends on browser APIs.

  const pageContext = usePageContext();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  // Everything the visitor typed, formatted for WhatsApp or email. Used when the
  // lead system is unreachable so a real enquiry is never simply lost.
  const summary = () =>
    [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.phone ? `Phone: ${values.phone}` : null,
      values.service ? `Service: ${values.service}` : null,
      values.message ? `\n${values.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

  // Built at click time rather than on every render: `summary()` reads the
  // live field values, and this is only ever needed once the send has failed.
  const fallbackMessage = () =>
    `Hi Bilal, I tried the contact form on your site.\n\n${summary()}`;

  // Client-side push to /thank-you on delivery (inside the hook), so GA4 and
  // the pixel record the page view without a full reload. The inline success
  // state below still shows if the navigation is slow.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    submit(e, () => ({ fields: { ...values }, service: values.service }));

  if (status === "success") {
    return (
      <div className="r-card surface-1 p-8 text-center" role="status">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15">
          <Check size={22} className="text-gold" />
        </span>
        <h3 className="t-h4 mt-5 text-ink">Thanks, that&apos;s come through.</h3>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          I&apos;ll come back to you personally, usually within one business day.
          If it&apos;s urgent, WhatsApp is faster.
        </p>
        <WhatsAppLink
          context="contact-form-success"
          className={secondaryButtonClass("sm", "mt-6")}
        >
          <MessageCircle size={15} /> Message on WhatsApp
        </WhatsAppLink>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="r-card surface-1 p-7 sm:p-8">
      <Eyebrow>
        The form
      </Eyebrow>
      <h2 className="t-h3 mt-3 text-ink">Send me the details</h2>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        The more you can tell me, the more useful my first reply will be.
      </p>

      {/* Honeypot: bots fill this, people never see it. Positioned off-screen rather
          than sized to zero — a 0x0 clipping wrapper still leaves the input itself
          with a real bounding box, so it was not reliably hidden. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {pageContext ? (
        <div className="mt-6 flex items-start gap-3 rounded-xl surface-2 px-4 py-3">
          <FileText size={15} className="mt-0.5 shrink-0 text-gold" />
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Enquiring about
            </p>
            <p className="mt-0.5 truncate text-sm text-ink" title={pageContext.path}>
              {prettyPath(pageContext.path)}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wide text-muted">
            Name <span className="text-gold">*</span>
          </label>
          <input id="name" required value={values.name} onChange={set("name")} className={`mt-2 ${fieldClass}`} placeholder="Your name" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-muted">
            Email <span className="text-gold">*</span>
          </label>
          <input id="email" type="email" required value={values.email} onChange={set("email")} className={`mt-2 ${fieldClass}`} placeholder="you@company.com" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-medium uppercase tracking-wide text-muted">
            Phone or WhatsApp
          </label>
          <input id="phone" type="tel" value={values.phone} onChange={set("phone")} className={`mt-2 ${fieldClass}`} placeholder="+971 50 123 4567" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="service" className="block text-xs font-medium uppercase tracking-wide text-muted">
            What do you need?
          </label>
          <select id="service" value={values.service} onChange={set("service")} className={`mt-2 ${fieldClass}`}>
            <option value="">Not sure yet</option>
            {serviceOptions.map((p) => (
              <option key={p.slug} value={p.label}>
                {p.label}
              </option>
            ))}
            <option value="Something else">Something else</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="block text-xs font-medium uppercase tracking-wide text-muted">
          Your project
        </label>
        <textarea id="message" rows={5} value={values.message} onChange={set("message")} className={`mt-2 ${fieldClass} resize-y`} placeholder="What are you trying to achieve, any deadline, and whether you already have a site, CRM or ad account running." />
      </div>

      {TURNSTILE_ENABLED ? <div ref={turnstileRef} className="mt-4" /> : null}

      <div aria-live="polite">
        {status === "fallback" ? (
          <div className="mt-5 rounded-xl border border-gold/30 bg-gold/5 p-4">
            <p className="text-sm font-medium text-ink">That didn&apos;t send.</p>
            <p className="mt-1.5 text-sm text-muted leading-relaxed">
              Rather than lose your message, send it to me directly — everything you
              typed is already filled in.
            </p>
            <p className="mt-2 text-sm text-muted">
              Or email <span className="text-ink">{SITE_EMAIL}</span> — your message is still in the
              form above.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <WhatsAppLink
                context="contact-form-fallback"
                message={fallbackMessage()}
                className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                <MessageCircle size={15} /> Send on WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <p className="mt-5 rounded-xl surface-2 p-4 text-sm text-muted">
            {error}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-shadow disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending
          </>
        ) : (
          <>
            Send enquiry <ArrowRight size={16} />
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-muted leading-relaxed">
        Your details are used only to reply to this enquiry. Nothing is shared or
        sold.
      </p>
    </form>
  );
}
