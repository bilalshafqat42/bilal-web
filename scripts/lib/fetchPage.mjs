// fetch with a timeout and retries, for the measuring scripts.
//
// Added 2026-10-23. On 22 Oct the live audit hung for over 15 minutes, and
// daily after it, because one page took 32s to answer and plain fetch() has no
// timeout. A stuck request now gives up after TIMEOUT_MS, is retried, and if
// it still fails comes back as a non-ok response (status "timeout" or
// "error") so the caller's usual `if (!res.ok)` branch reports it and the run
// carries on.
const TIMEOUT_MS = Number(process.env.FETCH_TIMEOUT_MS) || 20000;
const RETRIES = 2;

export async function fetchPage(url, opts = {}) {
  let last;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (res.status < 500 || attempt === RETRIES) return res;
      last = res.status;
    } catch (err) {
      last = err.name === "TimeoutError" ? "timeout" : "error";
    }
    // No wait after the last attempt: nothing follows it but the give-up.
    if (attempt < RETRIES) await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
  }
  console.error(`  ${url}: gave up after ${RETRIES + 1} tries (${last})`);
  return { ok: false, status: last, text: async () => "" };
}
