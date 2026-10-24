import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

/**
 * Which build is live, for `.github/workflows/purge-cache.yml` (audit batch 1,
 * 2026-10-24).
 *
 * The purge job used to guess: it hashed the /_next/static file list on the
 * homepage and treated any change as "the new build is up". A failed fetch
 * and a half-deployed page both counted as a change, so Cloudflare could be
 * purged before the new build was live, and refill with the old HTML.
 *
 * Rendered once, at `next build` (force-static), so the answer is frozen into
 * the build it describes:
 *
 *   sha=<git commit the build was made from, or "unknown">
 *   build=<a random id, different for every build>
 *
 * The commit comes from the first of these that exists at build time: a CI
 * variable (GIT_SHA, SOURCE_COMMIT, COMMIT_SHA, GITHUB_SHA), then
 * `git rev-parse HEAD` if the build folder is a git checkout. Hostinger's
 * build environment is not documented either way, so the workflow uses `sha`
 * when it matches the pushed commit and falls back to `build` changing.
 *
 * Holds nothing private: a commit id and a random token.
 */
export const dynamic = "force-static";

function commitSha(): string {
  for (const name of ["GIT_SHA", "SOURCE_COMMIT", "COMMIT_SHA", "GITHUB_SHA"]) {
    const value = process.env[name]?.trim();
    if (value && /^[0-9a-f]{7,40}$/i.test(value)) return value.toLowerCase();
  }
  try {
    const out = execSync("git rev-parse HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 5_000,
    })
      .toString()
      .trim();
    if (/^[0-9a-f]{40}$/i.test(out)) return out.toLowerCase();
  } catch {
    // Not a git checkout, or no git binary. Fine: `build` still changes.
  }
  return "unknown";
}

export function GET() {
  return new Response(`sha=${commitSha()}\nbuild=${randomUUID()}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}
