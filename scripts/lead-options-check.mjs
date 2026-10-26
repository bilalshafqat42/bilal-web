/**
 * Every option a lead form can send is one /api/lead accepts.
 *
 *   npm run lead-options-check
 *
 * Why it exists: on 2026-10-14 three of the four service choices on /contact
 * were being refused with a 400. The dropdown rendered the pillar labels; the
 * route only allowed the category titles. A visitor picked an option the site
 * offered them and the enquiry was lost. Nothing checked that the list a form
 * renders and the list the route enforces were the same list.
 *
 * This imports the option lists the forms render from, and the allow-lists the
 * route enforces (src/data/leadAllowList.ts, the module the route itself
 * imports), and fails if any rendered value would be rejected. It reads data
 * only, so it runs in CI before the build.
 *
 * What the forms render, and from where:
 *   /contact (ContactForm)            pillars[].label, plus CONTACT_OTHER_OPTION
 *   /services/[slug] (InlineLeadForm) megaMenuGroups[].title
 *   /appointment (AppointmentBooking) megaMenuGroups[].title, BUDGET_OPTIONS,
 *                                     TIMELINE_OPTIONS
 *   /free-website-health-check        HEALTH_CHECK_SERVICE, HEALTH_CHECK_GOALS
 *     (HealthCheckForm)
 *   fixed labels                      SERVICE_EXTRA_OPTIONS
 *
 * The route also passes each value through `clean()` (trim, collapse spaces,
 * strip control characters, cap at 200) before checking it, so a value that
 * `clean()` would change is reported too: it would no longer match itself.
 */
import { megaMenuGroups } from "../src/data/serviceCategories.ts";
import { pillars } from "../src/data/pillars.ts";
import {
  BUDGET_OPTIONS,
  TIMELINE_OPTIONS,
  SERVICE_EXTRA_OPTIONS,
  CONTACT_OTHER_OPTION,
  HEALTH_CHECK_GOALS,
  HEALTH_CHECK_SERVICE,
} from "../src/data/leadOptions.ts";
import { ALLOWED_SERVICES, ALLOWED_BUDGETS, ALLOWED_TIMELINES, ALLOWED_GOALS } from "../src/data/leadAllowList.ts";

const GENERIC_LIMIT = 200; // LIMITS.generic in src/app/api/lead/route.ts

const groups = [
  ["/contact service dropdown", pillars.map((p) => p.label), ALLOWED_SERVICES],
  ["/contact 'something else'", [CONTACT_OTHER_OPTION], ALLOWED_SERVICES],
  ["service-page form (megaMenuGroups)", megaMenuGroups.map((g) => g.title), ALLOWED_SERVICES],
  ["fixed service labels", [...SERVICE_EXTRA_OPTIONS], ALLOWED_SERVICES],
  ["/appointment budget", [...BUDGET_OPTIONS], ALLOWED_BUDGETS],
  ["/appointment timeline", [...TIMELINE_OPTIONS], ALLOWED_TIMELINES],
  ["/free-website-health-check service", [HEALTH_CHECK_SERVICE], ALLOWED_SERVICES],
  ["/free-website-health-check goal", [...HEALTH_CHECK_GOALS], ALLOWED_GOALS],
];

let failed = 0;
let checked = 0;
for (const [label, values, allowed] of groups) {
  if (!values.length) {
    console.log(`  FAIL  ${label}: the list is empty`);
    failed++;
    continue;
  }
  const problems = [];
  for (const v of values) {
    checked++;
    if (typeof v !== "string" || !v) problems.push(`${JSON.stringify(v)} is not a non-empty string`);
    else if (!allowed.has(v)) problems.push(`"${v}" is rendered but the route rejects it`);
    else if (v !== v.trim() || /\s{2,}|[\u0000-\u001F\u007F\u2028\u2029]/.test(v) || v.length > GENERIC_LIMIT) {
      problems.push(`"${v}" would be altered by the route's clean() and stop matching`);
    }
  }
  if (problems.length) {
    failed += problems.length;
    console.log(`  FAIL  ${label}`);
    for (const p of problems) console.log(`        ${p}`);
  } else {
    console.log(`  pass  ${label} (${values.length})`);
  }
}

if (failed) {
  console.error(`\n${failed} problem(s). A visitor choosing one of these loses their enquiry to a 400.`);
  process.exit(1);
}
console.log(`\nAll ${checked} rendered option values are accepted by /api/lead.`);
