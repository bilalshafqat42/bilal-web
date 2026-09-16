"use client";

import type { Chunk } from "./searchRank";

/**
 * Fetches the search index once per page load, on demand.
 *
 * Both the ⌘K panel and the assistant need the same data and neither needs it
 * until someone interacts. The promise is cached at module scope, so two
 * components asking at once share a single request, and a second open costs
 * nothing.
 *
 * Failure is deliberately quiet and non-sticky: it resolves to an empty index
 * so the caller renders "no results" rather than throwing, and the cached
 * promise is cleared so the next attempt tries again rather than being stuck
 * with the failure for the rest of the session.
 */
let cached: Promise<Chunk[]> | null = null;

export function loadSearchIndex(): Promise<Chunk[]> {
  if (!cached) {
    cached = fetch("/search-index.json")
      .then((r) => (r.ok ? (r.json() as Promise<Chunk[]>) : []))
      .catch(() => {
        cached = null;
        return [] as Chunk[];
      });
  }
  return cached;
}
