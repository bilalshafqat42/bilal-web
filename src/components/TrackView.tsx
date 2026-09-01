"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/analytics";

/**
 * Fires a ViewContent event for a page.
 *
 * Exists because the service and case study pages are server components, and the
 * pixel and dataLayer both live in the browser. Renders nothing.
 */
export default function TrackView({ name, category }: { name: string; category: string }) {
  useEffect(() => {
    trackViewContent(name, category);
  }, [name, category]);
  return null;
}
