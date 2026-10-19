import { useId } from "react";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

/**
 * The spam trap input, shared by every lead form.
 *
 * - Meaningless name and label, so autofill never matches it (see
 *   `src/lib/honeypot.ts` for the lead this lost when it was "company").
 * - `autoComplete` is an unrecognised token rather than "off": Chrome ignores
 *   "off" for address autofill but will not fill a field whose token it does
 *   not know. The data attributes tell LastPass, 1Password, Bitwarden and
 *   Dashlane to leave it alone.
 * - Off-screen rather than `display: none`, which some bots detect and skip.
 * - Out of the tab order and hidden from assistive tech, so no person reaches it.
 */
export default function Honeypot() {
  // The popup can be open over a page that has its own form, so the id is
  // unique per instance; only the name is fixed.
  const id = `${HONEYPOT_FIELD}-${useId()}`;
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
    >
      <label htmlFor={id}>Leave this empty</label>
      <input
        id={id}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="nope-hp-x7q"
        defaultValue=""
        data-lpignore="true"
        data-1p-ignore="true"
        data-bwignore="true"
        data-form-type="other"
      />
    </div>
  );
}
