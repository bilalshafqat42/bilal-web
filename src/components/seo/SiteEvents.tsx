"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Click tracking for the whole site from one listener (added 2026-11-19), so
 * no page or component has to remember to call `track` itself.
 *
 * - `cta_click`: any CtaButton or SecondaryButton (they carry `data-cta`), and
 *   any other link to the booking, contact or health-check pages, with the
 *   button text, where it goes and the page it was on.
 * - `filter_select`: the /portfolio discipline filter and the /blog topic links.
 *
 * Goes through `track`, so it obeys the same consent rules as every other event.
 * Nothing personal is sent: button text, paths and filter names only.
 */
const BOOKING_PATHS = ["/appointment", "/contact", "/free-website-health-check"];

function text(el: Element): string {
  return (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
}

export default function SiteEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      const page_path = window.location.pathname;
      {
        const cta = a.getAttribute("data-cta");
        if (cta || BOOKING_PATHS.includes(url.pathname)) {
          track("cta_click", { cta_text: text(a), cta_style: cta || "link", link_path: url.pathname, page_path });
        }
        const topic = url.pathname === "/blog" ? url.searchParams.get("topic") : null;
        if (topic) track("filter_select", { filter_type: "blog_topic", filter_value: topic, page_path });
      }
    };
    const onChange = (e: Event) => {
      const input = e.target as HTMLInputElement | null;
      if (!input || input.type !== "radio" || !input.closest(".work-filter")) return;
      const label = input.labels?.[0];
      track("filter_select", {
        filter_type: "portfolio",
        filter_value: (label ? text(label) : input.id).replace(/\s*\d+$/, ""),
        page_path: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("change", onChange);
    };
  }, []);
  return null;
}
