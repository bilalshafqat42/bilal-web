"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2, MessageCircle } from "lucide-react";
import { pillars } from "@/data/pillars";
import { getAttribution } from "@/lib/attribution";
import { trackLead, trackWhatsApp } from "@/lib/analytics";

const WHATSAPP = "971529766006";
const EMAIL = "bilalshafqat42@gmail.com";

type Status = "idle" | "submitting" | "success" | "fallback" | "error";

const fieldClass =
  "w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-gold/50 focus:ring-2 focus:ring-gold/20";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
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

  const whatsappHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hi Bilal, I tried the contact form on your site.\n\n${summary()}`
  )}`;
  const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(
    "Enquiry from bilalshafqat.com"
  )}&body=${encodeURIComponent(summary())}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStatus("submitting");

    const botcheck = (new FormData(e.currentTarget).get("company") as string) || "";

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          botcheck,
          source: "contact-page-form",
          attribution: getAttribution(),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        // Fired only on confirmed delivery, so the conversion count matches
        // what actually reached the CRM rather than counting button presses.
        trackLead("contact-page-form", values.service);
        setStatus("success");
        return;
      }
      setError(data.error || "Something went wrong.");
      setStatus(data.fallback ? "fallback" : "error");
    } catch {
      setError("Could not reach the server.");
      setStatus("fallback");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border glass p-8 text-center" role="status">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15">
          <Check size={22} className="text-gold" />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-ink">Thanks, that&apos;s come through.</h3>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          I&apos;ll come back to you personally, usually within one business day.
          If it&apos;s urgent, WhatsApp is faster.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP}`}
          onClick={() => trackWhatsApp("contact-form-success")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors"
        >
          <MessageCircle size={15} /> Message on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border glass p-7 sm:p-8">
      <h2 className="text-xl font-semibold text-ink">Send me the details</h2>
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
            {pillars.map((p) => (
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

      <div aria-live="polite">
        {status === "fallback" ? (
          <div className="mt-5 rounded-xl border border-gold/30 bg-gold/5 p-4">
            <p className="text-sm font-medium text-ink">That didn&apos;t send.</p>
            <p className="mt-1.5 text-sm text-muted leading-relaxed">
              Rather than lose your message, send it to me directly — everything you
              typed is already filled in.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
                <MessageCircle size={15} /> Send on WhatsApp
              </a>
              <a href={mailtoHref} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white/5 transition-colors">
                Send by email
              </a>
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <p className="mt-5 rounded-xl border border-border bg-surface/60 p-4 text-sm text-muted">
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
