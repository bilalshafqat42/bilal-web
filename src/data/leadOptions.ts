/**
 * The option lists the appointment form renders, in a module both the form and
 * the API route can read.
 *
 * They lived inside the form component, which is `"use client"` — so the server
 * had no way to check a submitted value against the list it came from, and
 * `service`, `budget` and `timeline` were taken on trust. Anything can POST to
 * a public endpoint; a select element constrains the honest visitor and nobody
 * else.
 *
 * No React, no icons, no client APIs, so this is safe to import from a route
 * handler.
 */
export const BUDGET_OPTIONS: readonly string[] = [
  "Not sure yet",
  "Under AED 15,000",
  "AED 15,000 - 35,000",
  "AED 35,000 - 100,000",
  "Over AED 100,000",
];

export const TIMELINE_OPTIONS: readonly string[] = [
  "As soon as possible",
  "Within the next month",
  "One to three months",
  "Just exploring for now",
];

/** Free-text values the route accepts for `service` beyond the eight category
 *  titles: the labels other forms on the site legitimately send. Anything not
 *  in this set or in the category list is rejected rather than forwarded. */
export const SERVICE_EXTRA_OPTIONS: readonly string[] = [
  "Appointment request",
  "General enquiry",
];
