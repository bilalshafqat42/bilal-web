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
 * Each delivered lead moves to `failed-leads.replayed.jsonl`; anything that
 * still fails stays in `failed-leads.jsonl` for the next run.
 *
 * Both files hold personal data (UAE PDPL). Once the leads are confirmed in
 * Performo, delete `failed-leads.replayed.jsonl`.
 *
 * Reads CRM_LEAD_API_URL, CRM_LEAD_API_KEY and LEAD_BACKUP_DIR from the
 * environment, falling back to .env.local only for values not already set.
 */
import { promises as fs, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const dryRun = process.argv.includes("--dry-run");

if (existsSync(".env.local")) {
  try {
    process.loadEnvFile(".env.local"); // does not override variables already set
  } catch {
    // Unreadable .env.local: carry on with the environment as it is.
  }
}

const crmUrl = process.env.CRM_LEAD_API_URL;
const apiKey = process.env.CRM_LEAD_API_KEY;
const dir = process.env.LEAD_BACKUP_DIR?.trim()
  ? path.resolve(process.env.LEAD_BACKUP_DIR.trim())
  : path.join(os.homedir(), "lead-backup");
const pending = path.join(dir, "failed-leads.jsonl");
const replayed = path.join(dir, "failed-leads.replayed.jsonl");

if (!dryRun && !crmUrl) {
  console.error("CRM_LEAD_API_URL is not set. Nothing can be replayed.");
  process.exit(1);
}

let raw;
try {
  raw = await fs.readFile(pending, "utf8");
} catch (err) {
  if (err.code === "ENOENT") {
    console.log(`No backup file at ${pending}. Nothing to replay.`);
    process.exit(0);
  }
  throw err;
}

const lines = raw.split("\n").filter((l) => l.trim());
if (!lines.length) {
  console.log("Backup file is empty. Nothing to replay.");
  process.exit(0);
}

const keep = [];
const done = [];

for (const [i, line] of lines.entries()) {
  let record;
  try {
    record = JSON.parse(line);
  } catch {
    console.warn(`  line ${i + 1}: not valid JSON, kept as is`);
    keep.push(line);
    continue;
  }
  const lead = record?.lead;
  const label = `line ${i + 1} (${record?.savedAt ?? "?"}, ${record?.reason ?? "?"})`;
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
      headers: { "Content-Type": "application/json", ...(apiKey ? { "x-api-key": apiKey } : {}) },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(10_000),
    });
    if (res.ok) {
      console.log(`  sent ${label}`);
      done.push(JSON.stringify({ ...record, replayedAt: new Date().toISOString() }));
    } else {
      console.warn(`  ${label}: CRM answered ${res.status}, kept`);
      keep.push(line);
    }
  } catch (err) {
    console.warn(`  ${label}: ${err?.name ?? "error"}, kept`);
    keep.push(line);
  }
}

if (dryRun) {
  console.log(`\nDry run: ${lines.length} lead(s) in ${pending}. Nothing sent.`);
  process.exit(0);
}

if (done.length) {
  await fs.appendFile(replayed, done.join("\n") + "\n", { mode: 0o600 });
}
// Rewrite the pending file through a temp file and a rename, so a crash
// mid-write never truncates it. Leads appended by the server while this ran
// are picked up again rather than overwritten.
const latest = await fs.readFile(pending, "utf8");
const arrivedSince = latest.split("\n").filter((l) => l.trim()).slice(lines.length);
const remaining = [...keep, ...arrivedSince];
const tmp = `${pending}.tmp`;
await fs.writeFile(tmp, remaining.length ? remaining.join("\n") + "\n" : "", { mode: 0o600 });
await fs.rename(tmp, pending);

console.log(`\n${done.length} sent, ${remaining.length} still pending.`);
if (done.length) {
  console.log(`Delivered leads moved to ${replayed}. Delete it once they are confirmed in Performo (PDPL).`);
}
process.exit(remaining.length ? 2 : 0);
