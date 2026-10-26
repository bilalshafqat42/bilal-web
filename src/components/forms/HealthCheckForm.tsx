"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { SITE_EMAIL } from "@/lib/contact";
import { useLeadSubmit, TURNSTILE_ENABLED } from "@/lib/useLeadSubmit";
import { normaliseWebsite, WEBSITE_URL_MAX } from "@/lib/websiteUrl";
import { HEALTH_CHECK_GOALS, HEALTH_CHECK_SERVICE, HEALTH_CHECK_SOURCE } from "@/data/leadOptions";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import Eyebrow from "@/components/ui/Eyebrow";
import Honeypot from "@/components/forms/Honeypot";

const fieldClass =
  "w-full rounded-xl surface-2 px-4 py-3 text-sm text-ink placeholder:text-faint outline-none transition focus:border-gold/50 focus:ring-2 focus:ring-gold/20";
const labelClass = "block text-xs font-medium uppercase tracking-wide text-muted";

const WEBSITE_ERROR = "That doesn't look like a website address. Try something like yourcompany.com.";

/**
 * The request form on /free-website-health-check.
 *
 * Same pipeline as every other lead form: `useLeadSubmit` posts to /api/lead,
 * the honeypot and Turnstile are the shared ones, and `generate_lead` fires
 * only once the route confirms the CRM took it. What is different is two
 * fields, `websiteUrl` and `goal`, which the route writes into the message
 * because Performo has no field for them.
 *
 * The website is checked here by the same rule the route uses
 * (`normaliseWebsite`), so a visitor sees the problem beside the field instead
 * of a refusal after sending. It is a text input with `inputMode="url"` rather
 * than `type="url"`: the browser's own URL check refuses "yourcompany.com"
 * without `https://`, which is how most people type their own site.
 */
export default function HealthCheckForm() {
  const { status, error, submit, turnstileRef } = useLeadSubmit({
    source: HEALTH_CHECK_SOURCE,
    thankYouPath: `/thank-you?source=${HEALTH_CHECK_SOURCE}`,
    fallbackState: true,
    defaultError: "Something went wrong. Please try again.",
    networkError: "Could not reach the server.",
  });

  const [values, setValues] = useState({
    name: "",
    email: "",
    websiteUrl: "",
    phone: "",
    goal: HEALTH_CHECK_GOALS[HEALTH_CHECK_GOALS.length - 1],
    message: "",
  });
  const [websiteError, setWebsiteError] = useState("");

  const set =
    (k: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((v) => ({ ...v, [k]: e.target.value }));
      if (k === "websiteUrl" && websiteError) setWebsiteError("");
    };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const website = normaliseWebsite(values.websiteUrl);
    if (!website) {
      e.preventDefault();
      setWebsiteError(WEBSITE_ERROR);
      document.getElementById("hc-website")?.focus();
      return;
    }
    return submit(e, () => ({
      fields: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        websiteUrl: website,
        goal: values.goal,
        message: values.message,
        service: HEALTH_CHECK_SERVICE,
      },
      service: HEALTH_CHECK_SERVICE,
    }));
  };

  // Everything typed, for WhatsApp, when the lead system could not take it.
  const fallbackMessage = () =>
    [
      "Hi Bilal, I tried to request the free website health check on your site.",
      "",
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.phone ? `Phone: ${values.phone}` : null,
      `Website: ${values.websiteUrl}`,
      `Main goal: ${values.goal}`,
      values.message ? `\n${values.message}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

  return (
    <form onSubmit={onSubmit} className="r-card surface-1 p-7 sm:p-8">
      <Eyebrow>Request the check</Eyebrow>
      <h2 className="t-h3 mt-3 text-ink">Tell me which site to look at</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Your name, email and website are all I need. The rest helps me focus on
        what matters to you.
      </p>

      {/* Spam trap: bots fill it, people never see it. */}
      <Honeypot />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="hc-name" className={labelClass}>
            Name <span className="text-gold">*</span>
          </label>
          <input id="hc-name" required value={values.name} onChange={set("name")} className={`mt-2 ${fieldClass}`} placeholder="Your name" autoComplete="name" maxLength={120} />
        </div>
        <div>
          <label htmlFor="hc-email" className={labelClass}>
            Email <span className="text-gold">*</span>
          </label>
          <input id="hc-email" type="email" required value={values.email} onChange={set("email")} className={`mt-2 ${fieldClass}`} placeholder="you@company.com" autoComplete="email" maxLength={254} />
        </div>
        <div>
          <label htmlFor="hc-website" className={labelClass}>
            Website address <span className="text-gold">*</span>
          </label>
          <input
            id="hc-website"
            type="text"
            inputMode="url"
            required
            value={values.websiteUrl}
            onChange={set("websiteUrl")}
            className={`mt-2 ${fieldClass}`}
            placeholder="yourcompany.com"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={WEBSITE_URL_MAX}
            aria-invalid={websiteError ? true : undefined}
            aria-describedby={websiteError ? "hc-website-error" : undefined}
          />
          {websiteError ? (
            <p id="hc-website-error" className="mt-2 text-xs leading-relaxed text-ink">
              {websiteError}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="hc-phone" className={labelClass}>
            Phone or WhatsApp
          </label>
          <input id="hc-phone" type="tel" value={values.phone} onChange={set("phone")} className={`mt-2 ${fieldClass}`} placeholder="+971 50 123 4567" autoComplete="tel" maxLength={40} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="hc-goal" className={labelClass}>
            Main goal <span className="text-gold">*</span>
          </label>
          <select id="hc-goal" required value={values.goal} onChange={set("goal")} className={`mt-2 ${fieldClass}`}>
            {HEALTH_CHECK_GOALS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="hc-message" className={labelClass}>
          Anything I should know
        </label>
        <textarea
          id="hc-message"
          rows={4}
          value={values.message}
          onChange={set("message")}
          className={`mt-2 ${fieldClass} resize-y`}
          placeholder="Optional. For example: we run Google Ads to the contact page, or the form stopped sending last month."
          maxLength={4000}
        />
      </div>

      {TURNSTILE_ENABLED ? <div ref={turnstileRef} className="mt-4" /> : null}

      <div aria-live="polite">
        {status === "fallback" ? (
          <div className="mt-5 rounded-xl border border-gold/30 bg-gold/5 p-4">
            <p className="text-sm font-medium text-ink">That didn&apos;t send.</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Rather than lose your request, send it to me on WhatsApp with everything
              you typed already filled in, or email <span className="text-ink">{SITE_EMAIL}</span>.
              Your details are still in the form above.
            </p>
            <WhatsAppLink
              context="health-check-fallback"
              message={fallbackMessage()}
              className="btn-primary mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              <MessageCircle size={15} /> Send on WhatsApp
            </WhatsAppLink>
          </div>
        ) : null}

        {status === "error" ? (
          <p className="mt-5 rounded-xl surface-2 p-4 text-sm text-muted">{error}</p>
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
            Request my free health check <ArrowRight size={16} />
          </>
        )}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Your details are used only to send you the review and reply to you.
        Nothing is shared or sold, and you are not added to a mailing list. See the{" "}
        <Link href="/privacy" className="text-ink underline underline-offset-4 hover:text-gold">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
