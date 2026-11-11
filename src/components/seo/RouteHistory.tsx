"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { notePath } from "@/lib/attribution";

/**
 * Records each in-site route change for lead attribution (see `notePath`).
 * Renders nothing and stores nothing: the record lives in memory only.
 */
export default function RouteHistory() {
  const pathname = usePathname();
  useEffect(() => {
    notePath(pathname);
  }, [pathname]);
  return null;
}
