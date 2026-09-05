"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search, Sparkles, X } from "lucide-react";
import { buildIndex, search, type Chunk } from "@/lib/searchIndex";
import { SEARCH_OPEN_EVENT } from "@/lib/searchPanel";

const INDEX = buildIndex();

const STARTERS = [
  "I need a website",
  "Run ads for my business",
  "Design a brand identity",
  "Set up my CRM",
];

const KIND_LABEL: Record<Chunk["kind"], string> = {
  service: "Service",
  faq: "Answer",
  work: "Work",
  info: "Info",
};

export default function SpotlightSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => (query.trim() ? search(INDEX, query, 6) : []),
    [query]
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  // ⌘K / Ctrl+K from anywhere, and Escape to leave — the two shortcuts people
  // already expect from Spotlight and every command palette.
  useEffect(() => {
    const open = () => setOpen(true);
    window.addEventListener(SEARCH_OPEN_EVENT, open);
    return () => window.removeEventListener(SEARCH_OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Opening a modal should move focus into it and stop the page behind from
  // scrolling; closing must restore both.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open]);

  // Reset the highlighted row when the query changes. Done during render rather
  // than in an effect: it is derived state, so an effect would render one frame
  // with a stale highlight before correcting it.
  const [lastQuery, setLastQuery] = useState(query);
  if (query !== lastQuery) {
    setLastQuery(query);
    setActive(0);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      window.location.href = results[active].url;
    }
  }

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    panelRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // The floating trigger is gone. It was one of three widgets stacked in the
  // bottom corners, and on a 14-inch screen it sat over the project strip —
  // "Hadley Heights" rendered as "eights". The panel is now opened from the
  // header's search button, or with Cmd+K from anywhere.
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="AI Search"
      className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
    >
      <button
        aria-label="Close AI Search"
        onClick={close}
        className="mega-backdrop absolute inset-0 cursor-default"
      />

      <div
        ref={panelRef}
        className="glass-nav relative flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/50"
      >
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
            <Sparkles size={14} />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask anything about my work or services..."
            aria-label="Ask anything about my work or services"
            className="min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-muted/70 outline-none"
          />
          <button onClick={close} aria-label="Close" className="shrink-0 text-muted hover:text-ink">
            <X size={17} />
          </button>
        </div>

        <div className="no-scrollbar overflow-y-auto p-2">
          {!query.trim() ? (
            <div className="p-3">
              <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted">
                Try one of these
              </p>
              <div className="mt-3 space-y-1">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-white/5"
                  >
                    <Search size={13} className="shrink-0 text-muted transition-colors group-hover:text-gold" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length ? (
            <div className="space-y-1">
              {results.map((r, i) => (
                <Link
                  key={r.url + r.title}
                  href={r.url}
                  data-index={i}
                  onMouseEnter={() => setActive(i)}
                  className={`flex items-start gap-3 rounded-xl px-3 py-3 transition-colors ${
                    i === active ? "bg-white/[0.07]" : "hover:bg-white/5"
                  }`}
                >
                  <span className="mt-0.5 shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                    {KIND_LABEL[r.kind]}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink">{r.title}</span>
                    <span className="mt-0.5 line-clamp-2 block text-xs text-muted leading-relaxed">
                      {r.body}
                    </span>
                  </span>
                  {i === active ? (
                    <CornerDownLeft size={14} className="ml-auto mt-1 shrink-0 text-gold" />
                  ) : null}
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-ink">Nothing on the site matches that.</p>
              <p className="mt-2 text-sm text-muted">
                Ask Bilal directly and he&apos;ll answer personally.
              </p>
              <Link
                href="/contact"
                className="btn-primary mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Ask a question
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-2.5 text-[11px] text-muted">
          <span className="flex items-center gap-4">
            <span>↑↓ to move</span>
            <span>↵ to open</span>
            <span>esc to close</span>
          </span>
          <span className="hidden items-center gap-1.5 text-muted/70 sm:flex">
            <Sparkles size={11} className="text-gold/70" />
            Searches this site only
          </span>
        </div>
        </div>
      </div>
  );
}
