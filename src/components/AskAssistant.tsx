"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, Search, Sparkles } from "lucide-react";
import { search, type Chunk } from "@/lib/searchRank";
import { loadSearchIndex } from "@/lib/searchData";

// The index is fetched when someone asks, not compiled into the bundle. The
// note that used to sit here said "~25KB of text shipped to the browser"; the
// real figure was ~75KB, and it was shipped on all 28 routes rather than just
// this one, because the ⌘K panel imported the same builder from the root
// layout. Awaiting it here costs a few hundred milliseconds on the first
// question only, against a network round-trip to the model that follows it.

type Turn = { role: "user" | "assistant"; content: string; results?: Chunk[] };

const SUGGESTIONS = [
  "Do you build mobile apps?",
  "How much does a landing page cost?",
  "Can you work with clients outside the UAE?",
  "What have you done for property developers?",
];

/** The first segment of every real route on the site.
 *
 *  A list rather than a shape check, and it is the whole fix for the bug
 *  below. Twelve short strings, so it costs nothing in the bundle; if a new
 *  top-level route is added, add it here or the assistant will stop linking
 *  it. That is the safe direction to fail in — a missing link is invisible, a
 *  link to a 404 is not. */
const ROUTE_ROOTS = new Set([
  "about",
  "appointment",
  "contact",
  "faq",
  "portfolio",
  "pricing",
  "privacy",
  "process",
  "real-estate-marketing",
  "services",
  "thank-you",
]);

/** Turns "/services/paid-marketing" in the answer text into a real link.
 *
 *  **Two guards, and both were missing.** The old version linked anything
 *  matching `/` plus lowercase letters or digits, which turned ordinary prose
 *  into broken links — measured against sentences this assistant is actually
 *  prompted to write:
 *
 *    "available 24/7"          -> a link to /7
 *    "AED 3,500/session"       -> a link to /session
 *    "design/development"      -> a link to /development
 *
 *  Each one rendered as gold underlined text and led to a 404. The system
 *  prompt tells the model to quote "AED 3,500", so that middle case was not
 *  hypothetical.
 *
 *  1. **The slash must not follow a word character.** That alone kills all
 *     three above, because in each the `/` sits between two words or digits.
 *     Done with a capture group rather than a lookbehind, which Safari only
 *     gained recently.
 *  2. **The first segment must be a real route.** Catches the rest: a model
 *     that invents `/blog` or `/case-studies` gets plain text, not a link to
 *     a page that does not exist. */
function withLinks(text: string) {
  // Group 1 is whatever precedes the path, so it is preserved rather than
  // swallowed by the split.
  const parts = text.split(/(^|[^\w])(\/[a-z0-9-]+(?:\/[a-z0-9-]+)*)/g);

  return parts.map((part, i) => {
    const isPath =
      typeof part === "string" &&
      part.startsWith("/") &&
      ROUTE_ROOTS.has(part.split("/")[1] ?? "") &&
      // Only the path capture group can be a link. A preceding-character group
      // never starts with "/", so this holds without tracking group indices.
      /^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(part);

    return isPath ? (
      <a key={i} href={part} className="text-gold underline underline-offset-2 hover:opacity-80">
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

export default function AskAssistant() {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (turns.length) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns]);

  async function ask(q: string) {
    if (!q.trim() || streaming) return;
    setError("");
    setQuestion("");
    const history = turns;
    // Local search first: it is instant and free, so the visitor always gets
    // something useful even if the model is unconfigured or unreachable.
    const index = await loadSearchIndex();
    const results = search(index, q);
    setTurns([...history, { role: "user", content: q }, { role: "assistant", content: "", results }]);
    setStreaming(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });

      if (!res.ok || !res.body) {
        // No key, rate limited, or the model is down — the search results are
        // already on screen, so this is a downgrade rather than a failure.
        if (!results.length) {
          const data = await res.json().catch(() => ({}));
          setError(
            data.error ||
              "Nothing on the site matches that. Ask Bilal directly and he'll answer personally."
          );
        }
        return;
      }

      // Append each chunk as it arrives so the answer types out rather than
      // appearing all at once after a long pause.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setTurns((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: acc, results };
          return next;
        });
      }
    } catch {
      if (!results.length) setError("Couldn't reach the assistant. Email bilalshafqat42@gmail.com.");
    } finally {
      setStreaming(false);
      // **Drop the placeholder turn if nothing ever arrived for it.**
      //
      // `ask` optimistically appends an empty assistant turn so the answer has
      // somewhere to stream into, and the renderer treats "no content and no
      // results" as "still loading" and draws a spinner. Every path that ended
      // without filling that turn — a non-OK response, a thrown fetch, a stream
      // that closed with zero bytes — left the placeholder behind, so the
      // spinner span forever.
      //
      // Reproduced with no `ANTHROPIC_API_KEY` set, which is the current live
      // state: `/api/ask` answers 503, and a question the local search cannot
      // match showed the error message *and* a spinner that never stopped.
      //
      // In `finally` rather than in each branch so there is one place to be
      // right, and a functional update so it reads the turn the stream actually
      // left rather than the one captured when this closure was created.
      setTurns((prev) => {
        const last = prev[prev.length - 1];
        return last?.role === "assistant" && !last.content && !last.results?.length
          ? prev.slice(0, -1)
          : prev;
      });
    }
  }

  const answered = turns.filter((t) => t.role === "assistant" && (t.content || t.results?.length)).length;

  return (
    <section id="ask" className="relative py-24 scroll-mt-28 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold">
            <Sparkles size={13} /> Ask anything
          </span>
          <h2 className="t-h2 mt-4 text-ink">
            Not sure what you need?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted leading-relaxed">
            Ask a question about the work, the services or how this all works. Answers
            come from this site, so nothing is made up.
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
              maxLength={500}
              placeholder="e.g. Can you build a landing page and run the ads for it?"
              aria-label="Ask a question about Bilal's services"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none"
            />
            <button
              type="submit"
              disabled={streaming || !question.trim()}
              aria-label="Send question"
              className="btn-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl disabled:opacity-50"
            >
              {streaming ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            </button>
          </div>
        </form>

        {turns.length === 0 ? (
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
          {turns.map((t, i) =>
            t.role === "user" ? (
              <p key={i} className="ml-auto max-w-[85%] rounded-2xl bg-gold/10 px-5 py-3 text-sm text-ink">
                {t.content}
              </p>
            ) : (
              <div key={i} className="max-w-[92%] space-y-3">
                {t.content ? (
                  <div className="rounded-2xl border border-border panel px-5 py-4 text-sm text-muted leading-relaxed whitespace-pre-wrap">
                    {withLinks(t.content)}
                  </div>
                ) : null}
                {t.results?.length ? (
                  <div className="rounded-2xl border border-border bg-surface/40 p-4">
                    <p className="flex items-center gap-1.5 px-1 text-xs font-medium uppercase tracking-wide text-muted">
                      <Search size={12} /> From this site
                    </p>
                    <div className="mt-2 space-y-1">
                      {t.results.map((r) => (
                        <a
                          key={r.url + r.title}
                          href={r.url}
                          className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
                        >
                          <span className="block text-sm font-medium text-ink">{r.title}</span>
                          <span className="mt-0.5 line-clamp-2 block text-xs text-muted leading-relaxed">
                            {r.body}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
                {!t.content && !t.results?.length ? (
                  <Loader2 size={15} className="animate-spin text-gold" />
                ) : null}
              </div>
            )
          )}
          <div ref={endRef} />
        </div>

        {error ? (
          <p className="mt-5 rounded-xl border border-border bg-surface/60 p-4 text-sm text-muted">{error}</p>
        ) : null}

        {/* The handoff. Appears once the visitor has actually engaged, rather than
            interrupting the first answer with a sales prompt. */}
        {answered >= 2 && !streaming ? (
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
