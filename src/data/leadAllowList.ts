/**
 * The allow-lists /api/lead checks `service`, `serviceInterest`, `budget`,
 * `timeline` and `goal` against, in one place.
 *
 * Kept apart from `leadOptions.ts` on purpose: that file is imported by client
 * components (AppointmentBooking), and this one pulls in `pillars`, which would
 * drag the whole service catalogue and its icons into the browser bundle.
 *
 * The route and `npm run lead-options-check` both import from here, so the
 * check tests the same sets the route enforces rather than a copy of them. On
 * 2026-10-14 three of the four /contact dropdown values were being refused
 * because the route's list and the form's list had drifted apart.
 */
import { megaMenuGroups } from "@/data/serviceCategories";
import { pillars } from "@/data/pillars";
import { BUDGET_OPTIONS, TIMELINE_OPTIONS, SERVICE_EXTRA_OPTIONS, HEALTH_CHECK_GOALS } from "@/data/leadOptions";

/** Every `service` value a form on the site can send:
 *   - megaMenuGroups titles: InlineLeadForm on /services/[slug], and the
 *     /appointment topic select;
 *   - pillar labels: the /contact dropdown;
 *   - SERVICE_EXTRA_OPTIONS: fixed labels, including "Something else". */
export function buildAllowedServices(): Set<string> {
  return new Set<string>([
    ...megaMenuGroups.map((g) => g.title),
    ...pillars.map((p) => p.label),
    ...SERVICE_EXTRA_OPTIONS,
  ]);
}

export const ALLOWED_SERVICES: ReadonlySet<string> = buildAllowedServices();
export const ALLOWED_BUDGETS: ReadonlySet<string> = new Set(BUDGET_OPTIONS);
export const ALLOWED_TIMELINES: ReadonlySet<string> = new Set(TIMELINE_OPTIONS);
export const ALLOWED_GOALS: ReadonlySet<string> = new Set(HEALTH_CHECK_GOALS);
