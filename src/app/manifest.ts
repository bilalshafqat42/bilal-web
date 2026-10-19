import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

/**
 * Web app manifest, served at /manifest.webmanifest and linked from every page
 * by Next. Until 2026-10-19 there was none, and /favicon.ico and the Apple
 * touch icon were missing too: each request got the 90KB 404 page.
 *
 * The icons are rendered from `public/logo/bs.svg` (the "Bs." mark), the same
 * file as `src/app/icon.svg`. Regenerate them from that file if the mark
 * changes; do not hand-edit the PNGs.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    start_url: "/",
    display: "browser",
    background_color: "#08080b",
    theme_color: "#08080b",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
