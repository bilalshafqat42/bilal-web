"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { getConsent, setConsent } from "@/lib/consent";
import { captureAttribution } from "@/lib/attribution";

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const answered = getConsent();
    if (answered === "granted") captureAttribution();
    // Only ask if they have not answered before.
    if (answered === null) {
      const t = setTimeout(() => setOpen(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  function choose(value: "granted" | "denied") {
    setConsent(value);
    if (value === "granted") captureAttribution();
    setOpen(false);
  }

  // Publish the banner's presence so the floating Quick Enquiry button can get
  // out of its way. On a phone the banner stacks to a column and fills the
  // lower third of the screen, hiding that button for the whole of a first
  // visit — the visit where it matters most (roadmap 213.35).
  //
  // A data attribute rather than shared state: neither component has to import
  // the other, and the rule lives with the button it moves.
  useEffect(() => {
    if (!open) return;
    document.documentElement.dataset.consentOpen = "true";
    return () => {
      delete document.documentElement.dataset.consentOpen;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5"
    >
      {/* `relative` so the mobile close button below positions against this
          card rather than against the fixed wrapper, where it landed a few
          pixels off (roadmap 213.35). */}
      <div className="glass-nav pointer-events-auto relative mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-border p-5 shadow-2xl shadow-black/40 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15">
          <Cookie size={19} className="text-gold" />
        </span>

        <div className="flex-1">
          <p id="consent-title" className="text-sm font-semibold text-ink">
            Cookies and campaign tracking
          </p>
          <p className="mt-1.5 text-sm text-muted leading-relaxed">
            I&apos;d like to remember which campaign or search brought you here, so
            I know what&apos;s working. It stays on this site for this session only,
            and is never sold or shared.{" "}
            <Link href="/privacy" className="text-gold underline underline-offset-2 hover:opacity-80">
              What&apos;s stored
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => choose("denied")}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white/5"
          >
            Decline
          </button>
          <button
            onClick={() => choose("granted")}
            className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Accept
          </button>
        </div>

        <button
          onClick={() => choose("denied")}
          aria-label="Close and decline"
          className="absolute right-4 top-4 text-muted hover:text-ink transition-colors sm:hidden"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
