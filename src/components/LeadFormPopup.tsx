"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MessageSquarePlus, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function LeadFormPopup() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

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
    setTimeout(() => setStatus("idle"), 300);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          botcheck: data.get("botcheck") === "on",
        }),
      });
      const result = await res.json();
      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-primary fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold shadow-lg shadow-black/30 transition-shadow hover:shadow-xl"
        aria-haspopup="dialog"
      >
        <MessageSquarePlus size={18} />
        <span className="hidden sm:inline">Quick Enquiry</span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-form-heading"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeAndReset}
          />

          <div className="glass-strong relative w-full max-w-md rounded-2xl border border-border p-7 sm:p-8">
            <button
              type="button"
              onClick={closeAndReset}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-white/5 hover:text-ink transition-colors"
            >
              <X size={18} />
            </button>

            {status === "success" ? (
              <div className="py-6 text-center">
                <CheckCircle2 size={40} className="mx-auto text-gold" />
                <h3 className="mt-4 text-lg font-semibold text-ink">Query sent</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Thanks for reaching out. I&apos;ll get back to you shortly.
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
                <h3 id="lead-form-heading" className="text-lg font-semibold text-ink">
                  Send a quick query
                </h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">
                  Tell me a bit about what you need and I&apos;ll follow up directly.
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
                    <label htmlFor="lead-name" className="text-xs font-medium text-muted">
                      Name
                    </label>
                    <input
                      id="lead-name"
                      name="name"
                      type="text"
                      required
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none focus:border-gold/50"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-email" className="text-xs font-medium text-muted">
                      Email
                    </label>
                    <input
                      id="lead-email"
                      name="email"
                      type="email"
                      required
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none focus:border-gold/50"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-phone" className="text-xs font-medium text-muted">
                      Phone (optional)
                    </label>
                    <input
                      id="lead-phone"
                      name="phone"
                      type="tel"
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none focus:border-gold/50"
                      placeholder="+971 5X XXX XXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-message" className="text-xs font-medium text-muted">
                      What do you need help with?
                    </label>
                    <textarea
                      id="lead-message"
                      name="message"
                      required
                      rows={3}
                      className="mt-1.5 w-full resize-none rounded-xl border border-border bg-surface/60 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none focus:border-gold/50"
                      placeholder="Briefly describe your project or query"
                    />
                  </div>

                  {status === "error" ? (
                    <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-300">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" />
                      <span>
                        Something went wrong. Please email{" "}
                        <a href="mailto:bilalshafqat42@gmail.com" className="underline">
                          bilalshafqat42@gmail.com
                        </a>{" "}
                        directly instead.
                      </span>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn-primary mt-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Sending...
                      </>
                    ) : (
                      "Send query"
                    )}
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
