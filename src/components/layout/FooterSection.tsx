"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * One footer column: a plain heading from `md` up, a disclosure button below.
 *
 * Design audit of 2026-10-27: on a phone the footer ran to about 2,500px, more
 * than fifty links stacked in one column before the copyright line. Folded, it
 * is four rows a visitor can open one at a time.
 *
 * The links are always in the HTML. Closed only adds `hidden` below `md`, so
 * crawlers still read every footer link on every page, which is the footer's
 * main job (see the note on `serviceGroups` in `Footer.tsx`). A closed
 * `<details>` was the other option and was not used: its contents cannot be
 * shown from `md` up by a class alone in every browser the site supports.
 */
export default function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-border md:border-0">
      <p className="hidden text-sm font-semibold text-ink md:block">{title}</p>
      {/* 44px tall: the audit's minimum for a primary tap target on a phone. */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 w-full items-center justify-between text-left text-sm font-semibold text-ink md:hidden"
      >
        {title}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`text-muted transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div id={panelId} className={`${open ? "block pb-5" : "hidden"} md:block`}>
        {children}
      </div>
    </div>
  );
}
