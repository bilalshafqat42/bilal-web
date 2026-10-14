/**
 * Where undelivered leads are kept. Shared by the route (src/lib/leadBackup.ts)
 * and `npm run replay-leads` (scripts/replay-leads.mjs), so the two can never
 * look in different places. Plain .mjs, no Next and no TypeScript, so the
 * replay script can import it with bare `node`.
 *
 * A directory inside the app is refused. Under `public/` or `.next/` it could
 * be served to anyone who guesses the path, and anywhere else in the app folder
 * it is wiped by the next deploy. A bad value falls back to ~/lead-backup with
 * a warning rather than failing, since losing the backup is worse.
 */
import os from "node:os";
import path from "node:path";

export const PENDING_FILE = "failed-leads.jsonl";
export const REPLAYED_FILE = "failed-leads.replayed.jsonl";

/**
 * @param {string} [appRoot] the app folder to refuse; defaults to the cwd,
 *   which is the app folder for `next start` and for npm scripts.
 * @returns {string} absolute path of the backup directory
 */
export function backupDir(appRoot = process.cwd()) {
  const fallback = path.join(os.homedir(), "lead-backup");
  const configured = process.env.LEAD_BACKUP_DIR?.trim();
  if (!configured) return fallback;
  const resolved = path.resolve(configured);
  const app = path.resolve(appRoot);
  if (resolved === app || resolved.startsWith(app + path.sep)) {
    console.warn("[LEAD BACKUP] LEAD_BACKUP_DIR is inside the app folder; using ~/lead-backup instead.");
    return fallback;
  }
  return resolved;
}
