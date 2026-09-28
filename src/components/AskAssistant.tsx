"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { search, type Chunk } from "@/lib/searchRank";
import { loadSearchIndex } from "@/lib/searchData";

/**
 * "Not sure what you need?" — a question box that finds the page answering it.
 *
 * ---------------------------------------------------------------------------
 * **This used to call a language model, and on 2026-09-28 that was removed on
 * Bilal's instruction: he wants the free version.**
 *
 * What went with it: `src/app/api/ask/route.ts`, the `@anthropic-ai/sdk`
 * dependency, the `ANTHROPIC_API_KEY` env entry, and everything in this file
 * that existed to stream and render model output — the reader loop, the
 * streaming state, the placeholder turn, and `withLinks`, which turned paths in
 * the answer text into links.
 *
 * **It was not doing anything for visitors anyway.** No key was ever set, so
 * `/api/ask` answered 503 to every request the site has ever made to it. The
 * search below is what people were actually getting.
 *
 * ---------------------------------------------------------------------------
 * **Why this is still worth having.** The search is local, instant and free:
 * the index is a JSON file fetched on the first question, and the ranking runs
 * in the browser. It covers 196 chunks of this site, so it answers "do you
 * build mobile apps" by handing over the mobile app case study — which is a
 * better outcome than a paragraph describing it.
 *
 * **The copy had to change with it.** The heading promised that "answers come
 * from this site", which was true of the model and is the wrong word for a
 * search: this returns pages, not prose, and saying otherwise would have the
 * section under-deliver on its own first sentence. It now says what it does.
 */

type Result = { query: string; chunks: Chunk[] };

const SUGGESTIONS = [
  "Do you build mobile apps?",
  "How much does a landing page cost?",
  "Can you work with clients outside the UAE?",
  "What have you done for property developers?",
];

export default function AskAssistant() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [busy, setBusy] = useState(false);

  async function ask(q: string) {
    if (!q.trim() || busy) return;
    setBusy(true);
    setQuestion("");
    try {
      // Fetched on first use rather than bundled: the index is ~75KB, and it
      // used to ship on every route because the ⌘K panel imported the same
      // builder from the root layout.
      const index = await loadSearchIndex();
      setResults((prev) => [...prev, { query: q, chunks: search(index, q) }]);
    } finally {
      setBusy(false);
    }
  }

  const asked = results.length;

  return (
    <section id="ask" className="relative py-24 scroll-mt-28 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
            <Sparkles size={13} /> Find it fast
          </span>
          <h2 className="t-h2 mt-4 text-ink">Not sure what you need?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted leading-relaxed">
            Describe what you are after and this will point you at the page that covers
            it. It searches this site only, so nothing here is invented.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
          className="mt-9"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-border panel p-2 focus-within:border-gold/40">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={200}
              placeholder="e.g. Can you build a landing page and run the ads for it?"
              aria-label="Search this site"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none"
            />
            <button
              type="submit"
              disabled={busy || !question.trim()}
              aria-label="Search"
              className="btn-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl disabled:opacity-50"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {asked === 0 ? (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="rounded-full border border-border bg-surface/60 px-4 py-2 text-xs text-muted transition-colors hover:border-gold/35 hover:text-ink"
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}

        <div aria-live="polite" className="mt-8 space-y-5">
          {results.map((r, i) => (
            <div key={i} className="space-y-3">
              <p className="ml-auto max-w-[85%] rounded-2xl bg-gold/10 px-5 py-3 text-sm text-ink">
                {r.query}
              </p>

              {r.chunks.length ? (
                <div className="max-w-[92%] rounded-2xl border border-border bg-surface/40 p-4">
                  <p className="flex items-center gap-1.5 px-1 text-xs font-medium uppercase tracking-wide text-muted">
                    <Search size={12} /> From this site
                  </p>
                  <div className="mt-2 space-y-1">
                    {r.chunks.map((c) => (
                      <a
                        key={c.url + c.title}
                        href={c.url}
                        className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
                      >
                        <span className="block text-sm font-medium text-ink">{c.title}</span>
                        <span className="mt-0.5 line-clamp-2 block text-xs text-muted leading-relaxed">
                          {c.body}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                /* An empty result is a real answer here, not an error: the
                   search covers the whole site, so "nothing matched" means the
                   site genuinely does not cover it. Sending them to Bilal is
                   the useful next step rather than an apology. */
                <div className="max-w-[92%] rounded-2xl border border-border bg-surface/40 px-5 py-4">
                  <p className="text-sm text-muted leading-relaxed">
                    Nothing on the site covers that yet.{" "}
                    <Link href="/contact" className="text-gold underline underline-offset-2">
                      Ask Bilal directly
                    </Link>{" "}
                    and he&apos;ll answer personally.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* The handoff. Appears once the visitor has actually looked for
            something twice, rather than interrupting the first search. */}
        {asked >= 2 && !busy ? (
          <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/5 p-6 text-center">
            <p className="text-sm text-ink">Want Bilal to look at this properly?</p>
            <p className="mt-1.5 text-sm text-muted">
              Send the details and he&apos;ll come back personally, usually within a business day.
            </p>
            <Link
              href="/contact"
              className="btn-primary mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              Send your project details <ArrowRight size={15} />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
