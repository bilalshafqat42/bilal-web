"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** `page_not_found` with the broken path and where the visitor came from, so
 *  dead links can be found and redirected (added 2026-11-19). */
export default function NotFoundEvent() {
  useEffect(() => {
    let referrer = "";
    try {
      referrer = document.referrer ? new URL(document.referrer).hostname : "";
    } catch {}
    track("page_not_found", { page_path: window.location.pathname.slice(0, 200), referrer_host: referrer });
  }, []);
  return null;
}
