"use client";

import { useState } from "react";
import { ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { useLeadSubmit, TURNSTILE_ENABLED } from "@/lib/useLeadSubmit";
import { SITE_EMAIL } from "@/lib/contact";
import WhatsAppLink from "@/components/ui/WhatsAppLink";

// Never displayed. Any failed send shows the panel below instead of the
// server's text: on 2026-10-16 this form printed "Could not reach the lead
// system right now." and "Forbidden." to a visitor, which tells them nothing
// they can act on. Same rule as the popup and the contact form.
const NOT_SENT = "That didn't send.";

/**
 * Short enquiry form placed directly on a service page.
 *
 * The page previously offered only links out to /contact and /appointment.
 * Every click between reading and enquiring loses people, and someone who has
 * just read a page about UI/UX design has already told you what they want, so
 * asking them to restate it on another page is friction for no gain.
 *
 * Three fields only. The service is carried in a hidden value from the page it
 * sits on, so the enquiry arrives already labelled.
 */
export default function InlineLeadForm({ service }: { service: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // No success state here: the button stays disabled while the push to
  // /thank-you lands, and a failed send (fallback or not) shows one message.
  const { status, submit, turnstileRef } = useLeadSubmit({
    source: "service-page-form",
    thankYouPath: "/thank-you?source=enquiry",
    honeypotField: "company",
    fallbackState: true,
    defaultError: NOT_SENT,
    networkError: NOT_SENT,
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    submit(e, () => ({
      fields: {
        name,
        email,
        service,
        message: message || `Enquiry from the ${service} page.`,
      },
      service,
    }));

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        className="w-full rounded-xl surface-2 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-faint focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Your email address"
        className="w-full rounded-xl surface-2 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-faint focus:border-gold/50 focus:ring-2 focus:ring-gold/20"
      />
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        // The page title as written, not lowercased: `toLowerCase()` gave
        // "zoho crm integration" and "ios app development".
        placeholder={`What do you need? (Optional. Blank is fine: I'll know it came from the ${service} page.)`}
        aria-label="What do you need"
        className="w-full resize-none rounded-xl surface-2 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-faint focus:border-gold/50 focus:ring-2 focus:ring-gold/20 sm:col-span-2"
      />

      {/* Honeypot. Off-screen rather than display:none, which some bots skip. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {TURNSTILE_ENABLED ? <div ref={turnstileRef} className="sm:col-span-2" /> : null}

      {status === "fallback" || status === "error" ? (
        <div role="alert" className="rounded-xl border border-gold/30 bg-gold/5 p-4 sm:col-span-2">
          <p className="text-sm font-medium text-ink">That didn&apos;t send.</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Rather than lose your message, send it to me directly on WhatsApp, or
            email{" "}
            <a href={`mailto:${SITE_EMAIL}`} className="text-ink underline underline-offset-4">
              {SITE_EMAIL}
            </a>
            . Everything you typed is still in the form above.
          </p>
          <WhatsAppLink
            context="inline-form-fallback"
            message={`Hi Bilal, I tried the enquiry form on your ${service} page.\n\n${message || "I'd like to talk about this."}${name ? `\n\n${name}` : ""}`}
            className="btn-primary mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            <MessageCircle size={15} /> Send on WhatsApp
          </WhatsAppLink>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold disabled:opacity-60 sm:col-span-2"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Sending
          </>
        ) : (
          <>
            Send this enquiry <ArrowRight size={15} />
          </>
        )}
      </button>
      <p className="text-center text-xs text-muted sm:col-span-2">
        Goes straight to me. I reply personally, usually within one working day.
      </p>
    </form>
  );
}
