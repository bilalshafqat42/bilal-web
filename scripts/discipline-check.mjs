#!/usr/bin/env node
/**
 * Keeps `src/data/disciplines.ts` and the route folders under
 * `src/app/portfolio/` in step.
 *
 * The discipline routes are explicit folders rather than a dynamic segment,
 * because `/portfolio/[client]` already holds that slot. That is the right
 * trade — no collision between a client slug and a discipline slug — but it
 * means the data can gain a page's worth of work without gaining a route, and
 * nothing would say so. This check is what says so.
 *
 * Two failure directions, both real:
 *   - a discipline that HAS work and copy but no folder  → the page is missing
 *   - a folder whose discipline has no work              → the page 404s
 */
import { readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const probe = `
import { disciplines, hasPortfolioPage, disciplineItems, disciplineHref } from "./src/data/disciplines";
console.log(JSON.stringify(disciplines.map((d) => ({
  slug: d.slug, title: d.title, page: hasPortfolioPage(d),
  items: disciplineItems(d).length, href: disciplineHref(d),
}))));
`;

const out = execFileSync("npx", ["--yes", "tsx", "-e", probe], { encoding: "utf8" });
const data = JSON.parse(out.trim().split("\n").pop());

const dirs = new Set(
  readdirSync("src/app/portfolio", { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("["))
    .map((e) => e.name)
);

const errors = [];

for (const d of data) {
  const hasDir = dirs.has(d.slug);
  if (d.page && !hasDir) {
    errors.push(
      `${d.slug}: has ${d.items} pieces and page copy but no route. Create src/app/portfolio/${d.slug}/page.tsx`
    );
  }
  if (!d.page && hasDir) {
    errors.push(
      `${d.slug}: has a route folder but no work or no page copy, so /portfolio/${d.slug} returns 404. Remove the folder or add the assets.`
    );
  }
  if (d.page && hasDir && !existsSync(`src/app/portfolio/${d.slug}/page.tsx`)) {
    errors.push(`${d.slug}: route folder exists but has no page.tsx`);
  }
}

// Every menu destination must resolve to a real page. A discipline with no work
// is meant to point at its service page, never at an empty portfolio URL.
for (const d of data) {
  if (!d.page && d.href.startsWith("/portfolio/") && !d.href.includes("#")) {
    errors.push(`${d.slug}: no page, but its menu href is ${d.href} — that URL does not exist.`);
  }
}

// A discipline slug that collides with a client slug would be shadowed by the
// static folder and the client case study would become unreachable.
const clientOut = execFileSync("npx", ["--yes", "tsx", "-e",
  'import { clients } from "./src/data/caseStudies"; console.log(JSON.stringify(clients.map(c=>c.slug)));'
], { encoding: "utf8" });
const clientSlugs = new Set(JSON.parse(clientOut.trim().split("\n").pop()));
for (const d of data) {
  if (clientSlugs.has(d.slug)) {
    errors.push(`${d.slug}: collides with a client slug. The static discipline route would shadow /portfolio/${d.slug}.`);
  }
}

if (errors.length) {
  console.error("Discipline routes and data are out of step:\n");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

const live = data.filter((d) => d.page);
console.log(
  `Disciplines OK: ${live.length} with pages (${live.map((d) => `${d.slug}:${d.items}`).join(", ")}), ` +
  `${data.length - live.length} routed to services.`
);
