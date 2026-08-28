"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search, Sparkles, X } from "lucide-react";
import { buildIndex, search, type Chunk } from "@/lib/searchIndex";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";

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
  const [revealed, setRevealed] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
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

  // The pill introduces itself rather than waiting to be found. It arrives on
  // the visitor's first scroll, or after a short pause if they never scroll,
  // so it reads as an offer of help rather than as chrome that was always
  // there. Whichever happens first wins, and it only ever happens once.
  useEffect(() => {
    let timer = 0;
    const reveal = () => {
      setRevealed(true);
      window.clearTimeout(timer);
      window.removeEventListener("scroll", reveal);
    };
    // Two things share the bottom of the screen, so the pill queues behind the
    // cookie banner rather than arriving underneath it. If consent has already
    // been answered on a previous visit there is nothing to wait for.
    const start = () => {
      timer = window.setTimeout(reveal, 2200);
      window.addEventListener("scroll", reveal, { passive: true, once: true });
    };
    if (getConsent() !== null) {
      start();
    } else {
      window.addEventListener(CONSENT_EVENT, start, { once: true });
    }
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", reveal);
      window.removeEventListener(CONSENT_EVENT, start);
    };
  }, []);

  // Step aside for the footer. The pill is pinned to the bottom-left, which is
  // exactly where the footer's copyright line ends up once the visitor reaches
  // the end of the page. ⌘K still works while it is out of sight.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setAtFooter(entry.isIntersecting),
      // Only once a real slice of the footer is showing, so it does not flicker
      // off the moment the top border appears.
      { rootMargin: "0px 0px -35% 0px" }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  // ⌘K / Ctrl+K from anywhere, and Escape to leave — the two shortcuts people
  // already expect from Spotlight and every command palette.
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

  useEffect(() => setActive(0), [query]);

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

  const trigger = (
    <button
      onClick={() => setOpen(true)}
      aria-label="Open AI Search"
      aria-hidden={!revealed || open || atFooter}
      tabIndex={revealed && !open && !atFooter ? 0 : -1}
      // Bottom-left keeps it clear of the enquiry button and WhatsApp bubble on
      // the right. It slides up into place instead of blinking on, and is inert
      // until revealed so it can never be tabbed to while invisible.
      className={`glass-strong group fixed bottom-6 left-6 z-40 inline-flex items-center gap-2.5 rounded-full border border-gold/25 py-2.5 pl-4 pr-3 text-sm text-ink shadow-lg shadow-black/30 transition-[opacity,transform,border-color,box-shadow] duration-500 ease-out hover:border-gold/50 hover:shadow-xl hover:shadow-black/40 motion-reduce:transition-none sm:pl-4.5 ${
        revealed && !open && !atFooter
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold">
        <Sparkles size={13} />
        <span className="absolute inset-0 rounded-full bg-gold/25 opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
      <span className="font-medium">
        Ask <span className="text-gold">AI Search</span>
      </span>
      <kbd className="hidden rounded-md border border-border bg-surface/70 px-1.5 py-0.5 font-sans text-[10px] text-muted sm:inline-block">
        ⌘K
      </kbd>
    </button>
  );

  if (!open) return trigger;

  return (
    <>
      {trigger}
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
                <a
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
                </a>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-ink">Nothing on the site matches that.</p>
              <p className="mt-2 text-sm text-muted">
                Ask Bilal directly and he&apos;ll answer personally.
              </p>
              <a
                href="/contact"
                className="btn-primary mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Ask a question
              </a>
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
    </>
  );
}
