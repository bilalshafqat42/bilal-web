"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, Search, Sparkles } from "lucide-react";
import { buildIndex, search, type Chunk } from "@/lib/searchIndex";

// Built once. ~25KB of text shipped to the browser, which buys instant,
// zero-cost answers with no API key and no server round-trip.
const INDEX = buildIndex();

type Turn = { role: "user" | "assistant"; content: string; results?: Chunk[] };

const SUGGESTIONS = [
  "Do you build mobile apps?",
  "How much does a landing page cost?",
  "Can you work with clients outside the UAE?",
  "What have you done for property developers?",
];

/** Turns "/services/paid-marketing" in the answer text into a real link. */
function withLinks(text: string) {
  return text.split(/(\/[a-z0-9-]+(?:\/[a-z0-9-]+)*)/g).map((part, i) =>
    /^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(part) ? (
      <a key={i} href={part} className="text-gold underline underline-offset-2 hover:opacity-80">
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
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
    const results = search(INDEX, q);
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
    }
  }

  const answered = turns.filter((t) => t.role === "assistant" && (t.content || t.results?.length)).length;

  return (
    <section id="ask" className="relative py-24 scroll-mt-28 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium tracking-wide text-gold uppercase">
            <Sparkles size={13} /> Ask anything
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
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
          <div className="flex items-center gap-2 rounded-2xl border border-border glass p-2 focus-within:border-gold/40">
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
                  <div className="rounded-2xl border border-border glass px-5 py-4 text-sm text-muted leading-relaxed whitespace-pre-wrap">
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
            <a
              href="/contact"
              className="btn-primary mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              Send your project details <ArrowRight size={15} />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
