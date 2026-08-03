"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MessageCircle, X, CheckCircle2 } from "lucide-react";

const WHATSAPP_NUMBER = "971529766006";

const SERVICES = [
  "Paid Marketing (Google & Social)",
  "Performance Marketing",
  "Web Design & Development",
  "MERN Stack Development",
  "Mobile App Development",
  "Graphic Design",
  "Social Media Management",
  "Something else",
];

function buildWhatsAppMessage({
  name,
  phone,
  email,
  service,
  meetingTime,
}: {
  name: string;
  phone: string;
  email: string;
  service: string;
  meetingTime: string;
}) {
  const formattedTime = meetingTime
    ? new Date(meetingTime).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Not specified";

  return [
    "Hi Bilal, I'd like to talk about a project.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    `Preferred meeting time: ${formattedTime}`,
  ].join("\n");
}

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeAndReset = () => {
    setOpen(false);
    setTimeout(() => setDone(false), 300);
  };

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("botcheck") === "on") return;

    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");
    const service = String(data.get("service") || "");
    const meetingTime = String(data.get("meetingTime") || "");

    // Open WhatsApp synchronously, in direct response to the click, so browsers
    // don't treat it as a blocked popup once the CRM fetch below is in flight.
    const waMessage = buildWhatsAppMessage({ name, phone, email, service, meetingTime });
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`,
      "_blank",
      "noopener,noreferrer"
    );

    // Best-effort CRM copy — doesn't block or affect the WhatsApp flow above.
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        service,
        meetingTime,
        message: `Requested via WhatsApp enquiry — service: ${service}`,
        source: "whatsapp-popup",
      }),
    }).catch(() => {
      // Silent: WhatsApp is the primary channel here, CRM sync is a bonus.
    });

    setDone(true);
    form.reset();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Chat on WhatsApp"
        aria-haspopup="dialog"
        className="fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-shadow hover:shadow-xl"
      >
        <MessageCircle size={22} fill="white" strokeWidth={0} />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-form-heading"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeAndReset} />

          <div className="glass-strong relative w-full max-w-md rounded-2xl border border-border p-7 sm:p-8">
            <button
              type="button"
              onClick={closeAndReset}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-white/5 hover:text-ink transition-colors"
            >
              <X size={18} />
            </button>

            {done ? (
              <div className="py-6 text-center">
                <CheckCircle2 size={40} className="mx-auto text-[#25D366]" />
                <h3 className="mt-4 text-lg font-semibold text-ink">WhatsApp opened</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Your details are pre-filled in WhatsApp — just hit send there to reach
                  Bilal directly.
                </p>
                <button
                  type="button"
                  onClick={closeAndReset}
                  className="mt-6 btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 id="whatsapp-form-heading" className="text-lg font-semibold text-ink">
                  Chat on WhatsApp
                </h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">
                  Share a few details and I&apos;ll open WhatsApp with everything filled
                  in, ready to send.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                  <input
                    type="checkbox"
                    name="botcheck"
                    className="hidden"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div>
                    <label htmlFor="wa-name" className="text-xs font-medium text-muted">
                      Name
                    </label>
                    <input
                      id="wa-name"
                      name="name"
                      type="text"
                      required
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none focus:border-[#25D366]/50"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="wa-email" className="text-xs font-medium text-muted">
                      Email
                    </label>
                    <input
                      id="wa-email"
                      name="email"
                      type="email"
                      required
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none focus:border-[#25D366]/50"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="wa-phone" className="text-xs font-medium text-muted">
                      Phone
                    </label>
                    <input
                      id="wa-phone"
                      name="phone"
                      type="tel"
                      required
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none focus:border-[#25D366]/50"
                      placeholder="+971 5X XXX XXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="wa-service" className="text-xs font-medium text-muted">
                      Service you&apos;re looking for
                    </label>
                    <select
                      id="wa-service"
                      name="service"
                      required
                      defaultValue=""
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-ink outline-none focus:border-[#25D366]/50"
                    >
                      <option value="" disabled>
                        Select a service
                      </option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s} className="bg-bg-soft">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="wa-meeting" className="text-xs font-medium text-muted">
                      Preferred meeting time
                    </label>
                    <input
                      id="wa-meeting"
                      name="meetingTime"
                      type="datetime-local"
                      required
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-ink outline-none focus:border-[#25D366]/50 [color-scheme:dark]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-shadow hover:shadow-lg hover:shadow-[#25D366]/30"
                  >
                    <MessageCircle size={16} fill="white" strokeWidth={0} />
                    Open WhatsApp
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
