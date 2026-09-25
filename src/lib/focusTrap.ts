"use client";

import { useEffect, type RefObject } from "react";

/**
 * Keeps Tab inside an open dialog, and puts focus back where it came from.
 *
 * Added 2026-09-24 (roadmap 213.9). All three overlays on this site —
 * `LeadFormPopup`, `GalleryLightbox` and `SpotlightSearch` — declared
 * `role="dialog" aria-modal="true"` and none of them trapped focus. Tab walked
 * straight out into the page behind, which was neither `inert` nor
 * `aria-hidden`, so the markup was telling assistive technology the rest of the
 * page was unavailable while the browser let a keyboard user walk right into
 * it. `LeadFormPopup` was worse still: it never moved focus into the dialog at
 * all, so opening the enquiry form left a keyboard user standing on the trigger
 * with no sign anything had happened.
 *
 * One hook rather than three implementations, because this is exactly the kind
 * of thing that drifts: the lightbox already restored focus correctly and the
 * other two did not.
 *
 * What it does, in order:
 *   1. remembers what was focused before the dialog opened
 *   2. moves focus inside — to `initialFocus` if given, else the first
 *      focusable thing, else the container itself
 *   3. cycles Tab and Shift+Tab within the container
 *   4. marks everything else in `<body>` as `inert`, so a screen reader's
 *      virtual cursor and a stray click are held back too, not just Tab
 *   5. on close, restores focus to where it started
 *
 * Escape is deliberately NOT handled here. Each dialog already owns its own
 * close behaviour and some of them do more than close.
 */

/** Focusable, in document order. `:not([disabled])` and the `tabindex="-1"`
 *  exclusion are what stop focus landing on something the user cannot use. */
const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  open: boolean,
  initialFocus?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        // Skip anything hidden: `offsetParent` is null for a `display: none`
        // ancestor, which is how a collapsed panel inside the dialog would
        // otherwise capture the first tab stop.
        (el) => el.offsetParent !== null || el === document.activeElement
      );

    // Move focus in. Without this the dialog is open and the keyboard is still
    // outside it, which is the state LeadFormPopup shipped in.
    const first = initialFocus?.current ?? focusable()[0] ?? container;
    if (first === container && !container.hasAttribute("tabindex")) {
      container.setAttribute("tabindex", "-1");
    }
    first.focus();

    // Hold the rest of the page back from assistive technology and from clicks,
    // which is what `aria-modal="true"` has been promising all along.
    //
    // Walked up the ancestor chain rather than applied to `document.body`'s
    // children, because the three dialogs sit at different depths: the popup
    // and the search panel are direct children of `<body>`, but the gallery
    // lightbox renders inside the page section that owns it. Inerting only
    // body-level siblings would have left the whole of `<main>` reachable
    // behind the lightbox.
    const marked: HTMLElement[] = [];
    for (let node = container; node && node !== document.body; node = node.parentElement!) {
      const parent = node.parentElement;
      if (!parent) break;
      for (const sibling of Array.from(parent.children)) {
        if (sibling === node || !(sibling instanceof HTMLElement)) continue;
        if (sibling.hasAttribute("inert")) continue; // already inert; leave it be
        sibling.setAttribute("inert", "");
        marked.push(sibling);
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) {
        // Nothing to move to, so Tab must not leave either.
        e.preventDefault();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === firstItem || active === container)) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && active === lastItem) {
        e.preventDefault();
        firstItem.focus();
      } else if (active instanceof Node && !container.contains(active)) {
        // Focus escaped some other way — a click outside, or a browser control.
        // Pull it back rather than letting the next Tab compound it.
        e.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      // Only what this hook marked. Anything already inert when the dialog
      // opened was skipped above and stays as it was.
      marked.forEach((el) => el.removeAttribute("inert"));
      // Back where they started. A keyboard user who closes a dialog and lands
      // at the top of the document has lost their place on the page.
      previouslyFocused?.focus?.();
    };
  }, [open, containerRef, initialFocus]);
}
