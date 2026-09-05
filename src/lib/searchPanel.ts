/**
 * Cross-component signal for opening the search panel.
 *
 * The panel lives in `SpotlightSearch`, which is mounted once in the root
 * layout; the button that opens it now lives in the header. Rather than lift
 * that state into a provider for one boolean, the header dispatches an event
 * and the panel listens — the same pattern `CONSENT_EVENT` already uses in
 * this codebase.
 */
export const SEARCH_OPEN_EVENT = "bs-search-open";

export function openSearchPanel() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SEARCH_OPEN_EVENT));
}
