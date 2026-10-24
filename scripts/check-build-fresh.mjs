/**
 * Fails when the production build in `.next/` is missing or older than the
 * source it was built from.
 *
 * `npm run lead-probe` starts `next start`, which serves whatever is in
 * `.next/`. Without this, a probe run after editing `src/app/api/lead` but
 * before rebuilding tests yesterday's route and reports it as passing (audit
 * batch 3). In CI the build step runs first in the same job, so this passes
 * there.
 *
 * Usage:  node scripts/check-build-fresh.mjs
 */
import { existsSync, readdirSync, statSync } from "node:fs";

const root = new URL("../", import.meta.url);
const buildId = new URL(".next/BUILD_ID", root);

if (!existsSync(buildId)) {
  console.error("No production build (.next/BUILD_ID missing). Run `npm run build` first.");
  process.exit(1);
}
const built = statSync(buildId).mtimeMs;

/** Newest modification time under a path, files only. */
const newest = (url) => {
  if (!existsSync(url)) return { t: 0, f: null };
  const s = statSync(url);
  if (!s.isDirectory()) return { t: s.mtimeMs, f: url.pathname };
  let best = { t: 0, f: null };
  for (const d of readdirSync(url, { withFileTypes: true })) {
    const n = newest(new URL(d.name + (d.isDirectory() ? "/" : ""), url));
    if (n.t > best.t) best = n;
  }
  return best;
};

const inputs = ["src/", "public/", "next.config.ts", "package-lock.json", ".env.local", ".env.production"];
let latest = { t: 0, f: null };
for (const p of inputs) {
  const n = newest(new URL(p, root));
  if (n.t > latest.t) latest = n;
}

if (latest.t > built) {
  console.error(`The build in .next/ is older than ${latest.f.replace(root.pathname, "")}.`);
  console.error("Run `npm run build` first, so the probe tests the code as it is now.");
  process.exit(1);
}
console.log("Build in .next/ is newer than the source. Continuing.");
