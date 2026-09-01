"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { clearConsent, getConsent } from "@/lib/consent";

/**
 * Lets a visitor change a consent answer they have already given.
 *
 * Without this the stored choice is permanent: the banner never asks again, so
 * someone who declined could never opt in and someone who accepted could never
 * opt out. Consent has to be as easy to withdraw as it was to give.
 *
 * Renders nothing until mounted, because the stored answer lives in
 * localStorage and the server cannot know it.
 */
export default function ConsentReset({ className = "" }: { className?: string }) {
  const [current, setCurrent] = useState<string | null | undefined>(undefined);

  useEffect(() => setCurrent(getConsent()), []);

  if (current === undefined || current === null) return null;

  return (
    <button
      type="button"
      onClick={clearConsent}
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-gold/40 hover:bg-white/5 ${className}`}
    >
      <RotateCcw size={14} />
      {current === "granted" ? "Withdraw my consent" : "Change my choice"}
    </button>
  );
}
