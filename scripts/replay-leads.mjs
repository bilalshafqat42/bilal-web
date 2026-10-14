/**
 * Re-sends leads that /api/lead could not deliver to Performo.
 *
 * When Performo is down, unreachable or not configured, the route appends the
 * full lead to `${LEAD_BACKUP_DIR}/failed-leads.jsonl` (default ~/lead-backup).
 * Run this on the server once Performo is back:
 *
 *   npm run replay-leads -- --dry-run   show what would be sent, send nothing
 *   npm run replay-leads                send them
 *
 * Each delivered lead leaves a receipt in `failed-leads.replayed.jsonl`:
 * eventId, savedAt, replayedAt and the email domain, nothing else. The full
 * lead is in Performo by then, so keeping a second copy of the name, email,
 * phone and message on the server would only be PII held for no purpose
 * (UAE PDPL). Anything that still fails goes back into `failed-leads.jsonl`
 * for the next run.
 *
 * **Claim first, so nothing is lost.** The pending file is renamed to
 * `failed-leads.processing-<timestamp>.jsonl` before anything is sent. The
 * server keeps appending new failures to a fresh `failed-leads.jsonl` while
 * this runs, and leftovers are APPENDED to that file at the end, never written
 * over it. The previous version read the file, sent, then rewrote it, so a
 * lead appended in between could be overwritten. A processing file left behind
 * by a crash is picked up again by the next run. Each lead's `eventId`, when it
 * has one, goes out as an `Idempotency-Key` header so a lead re-sent after such
 * a crash can be recognised as a duplicate.
 *
 * The directory comes from src/lib/leadBackupDir.mjs, the same function the
 * route uses, so a LEAD_BACKUP_DIR inside the app is refused here too.
 *
 * `failed-leads.jsonl` and any processing file hold personal data in full
 * (UAE PDPL). The replayed receipts do not, and can be deleted whenever the
 * leads are confirmed in Performo.
 *
 * Reads CRM_LEAD_API_URL, CRM_LEAD_API_KEY and LEAD_BACKUP_DIR from the
 * environment, falling back to .env.local only for values not already set.
 */
import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { backupDir, PENDING_FILE, REPLAYED_FILE } from "../src/lib/leadBackupDir.mjs";

const dryRun = process.argv.includes("--dry-run");
const appRoot = fileURLToPath(new URL("..", import.meta.url));

const envFile = path.join(appRoot, ".env.local");
if (existsSync(envFile)) {
  try {
    process.loadEnvFile(envFile); // does not override variables already set
  } catch {
    // Unreadable .env.local: carry on with the environment as it is.
  }
}

const crmUrl = process.env.CRM_LEAD_API_URL;
const apiKey = process.env.CRM_LEAD_API_KEY;
const dir = backupDir(appRoot);
const pending = path.join(dir, PENDING_FILE);
const replayed = path.join(dir, REPLAYED_FILE);
const PROCESSING = /^failed-leads\.processing-.+\.jsonl$/;

if (!dryRun && !crmUrl) {
  console.error("CRM_LEAD_API_URL is not set. Nothing can be replayed.");
  process.exit(1);
}

async function listProcessing() {
  try {
    return (await fs.readdir(dir)).filter((f) => PROCESSING.test(f)).sort().map((f) => path.join(dir, f));
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

// Files to work through: any left by an interrupted run, then the current
// pending file, claimed by renaming it (atomic on one filesystem). A dry run
// claims nothing and only reads.
const files = await listProcessing();
if (dryRun) {
  if (existsSync(pending)) files.push(pending);
} else {
  const claimed = path.join(dir, `failed-leads.processing-${new Date().toISOString().replace(/[:.]/g, "-")}.jsonl`);
  try {
    await fs.rename(pending, claimed);
    files.push(claimed);
    // The route may have opened the pending file for an append just before
    // the rename. The rename does not interrupt it: the write lands in the
    // renamed file. One second is ample for a single JSON line to finish, and
    // reading earlier could miss that last lead until the next run's crash
    // recovery picked it up.
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}

if (!files.length) {
  console.log(`No backup file at ${pending}. Nothing to replay.`);
  process.exit(0);
}

const keep = [];
const done = [];
let total = 0;

for (const file of files) {
  const lines = (await fs.readFile(file, "utf8")).split("\n").filter((l) => l.trim());
  total += lines.length;
  const name = path.basename(file);

  for (const [i, line] of lines.entries()) {
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      console.warn(`  ${name} line ${i + 1}: not valid JSON, kept as is`);
      keep.push(line);
      continue;
    }
    const lead = record?.lead;
    const label = `${name} line ${i + 1} (${record?.savedAt ?? "?"}, ${record?.reason ?? "?"})`;
    if (!lead || typeof lead !== "object") {
      console.warn(`  ${label}: no lead object, kept`);
      keep.push(line);
      continue;
    }
    // `.invalid` is reserved (RFC 2606) and never a real person: it is what
    // `npm run lead-probe` sends, and those must never reach Performo.
    if (typeof lead.email === "string" && /\.invalid$/i.test(lead.email.trim())) {
      console.log(`  ${label}: test lead (.invalid address), discarded`);
      continue;
    }
    if (dryRun) {
      const domain = typeof lead.email === "string" ? lead.email.slice(lead.email.lastIndexOf("@")) : "none";
      console.log(`  would send ${label}: email domain ${domain}, source page ${lead.pageUrl ?? "-"}`);
      continue;
    }
    try {
      const res = await fetch(crmUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-api-key": apiKey } : {}),
          // A hint only: Performo may ignore it. The eventId is also in the
          // body, where Performo already dedupes Meta conversions on it.
          ...(typeof lead.eventId === "string" && lead.eventId ? { "Idempotency-Key": lead.eventId } : {}),
        },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) {
        console.log(`  sent ${label}`);
        // A receipt, not the lead: see the note at the top of this file.
        const email = typeof lead.email === "string" ? lead.email.trim() : "";
        done.push(
          JSON.stringify({
            eventId: lead.eventId ?? record.eventId ?? null,
            savedAt: record.savedAt ?? null,
            replayedAt: new Date().toISOString(),
            emailDomain: email.includes("@") ? email.slice(email.lastIndexOf("@") + 1).toLowerCase() : null,
          }),
        );
      } else {
        console.warn(`  ${label}: CRM answered ${res.status}, kept`);
        keep.push(line);
      }
    } catch (err) {
      console.warn(`  ${label}: ${err?.name ?? "error"}, kept`);
      keep.push(line);
    }
  }
}

if (dryRun) {
  console.log(`\nDry run: ${total} lead(s) in ${files.length} file(s) under ${dir}. Nothing sent.`);
  process.exit(0);
}

// Delivered first, then leftovers, then the claimed files go. If this crashes
// before the unlink, the next run re-reads the processing file; delivered ones
// are then re-sent with the same Idempotency-Key.
if (done.length) {
  await fs.appendFile(replayed, done.join("\n") + "\n", { mode: 0o600 });
  await fs.chmod(replayed, 0o600);
}
if (keep.length) {
  // Appended, never overwritten: the server may have written new failures to
  // a fresh pending file while this ran.
  await fs.appendFile(pending, keep.join("\n") + "\n", { mode: 0o600 });
  await fs.chmod(pending, 0o600);
}
for (const file of files) await fs.unlink(file);

console.log(`\n${done.length} sent, ${keep.length} put back in ${PENDING_FILE}.`);
if (done.length) {
  console.log(`Receipts for delivered leads (no personal data) added to ${replayed}.`);
}
process.exit(keep.length ? 2 : 0);
