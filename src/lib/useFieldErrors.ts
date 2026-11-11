"use client";

import { useCallback, useRef, useState, type FocusEvent, type FormEvent } from "react";

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;


/** Same pattern as the lead API (`src/app/api/lead/route.ts`). */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The same rule as an HTML `pattern`, so the browser blocks the submit too. */
export const EMAIL_PATTERN = "[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}";

/** A field's own check beyond the browser's, e.g. `normaliseWebsite`. Returns
 *  the message to show, or "" when the value is fine. */
export type FieldCheck = (value: string) => string;

/** Shared default, so a form with no own checks passes the same object every
 *  render and the callbacks below stay stable. */
const NO_CHECKS: Partial<Record<string, FieldCheck>> = {};

/**
 * Inline field errors for the lead forms, shown when a person leaves a field.
 *
 * Design audit of 2026-10-27: every form checked only on submit, so a mistyped
 * email surfaced as a browser bubble after pressing Send, and on a phone the
 * bubble often sat over the keyboard. Now the message appears under the field
 * as soon as focus moves on, and clears as soon as the value is fixed.
 *
 * Built on the browser's own constraint checks (`required`, `type="email"`,
 * `maxLength`), so each form keeps its markup and the rules stay in one place:
 * the attributes. An empty required field is only flagged once something was
 * typed in it; tabbing past a field nobody has touched yet is not a mistake.
 * Submit still runs the browser's checks as before.
 *
 * The forms render the message with `FieldError`, which carries `role="alert"`
 * so a screen reader announces it when it appears.
 */
export function useFieldErrors(checks: Partial<Record<string, FieldCheck>> = NO_CHECKS) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const touched = useRef(new Set<string>());

  const messageFor = useCallback(
    (el: Field): string => {
      const value = el.value.trim();
      if (el.validity.valueMissing || (el.required && !value)) {
        return touched.current.has(el.id) ? "This field is required." : "";
      }
      // The server's own rule as well (2026-11-11). The browser accepts
      // "name@gmail", the server rejects it, and the visitor used to see a
      // generic "something went wrong" instead of being told to fix a typo.
      if (el.type === "email" && (el.validity.typeMismatch || (value && !EMAIL.test(value)))) {
        return "That email address doesn't look right. Try something like you@company.com.";
      }
      if (el.validity.tooLong) return "That is longer than this field allows.";
      const own = checks[el.id];
      return own && value ? own(value) : "";
    },
    [checks]
  );

  const onBlur = useCallback(
    (e: FocusEvent<Field>) => {
      const el = e.currentTarget;
      const msg = messageFor(el);
      setErrors((prev) => (prev[el.id] === msg ? prev : { ...prev, [el.id]: msg }));
    },
    [messageFor]
  );

  /** On every change: remember the field was used, and clear its message the
   *  moment the value passes. A new message waits for the next blur. */
  const onInput = useCallback(
    (e: FormEvent<Field>) => {
      const el = e.currentTarget;
      if (el.value) touched.current.add(el.id);
      setErrors((prev) => (prev[el.id] && !messageFor(el) ? { ...prev, [el.id]: "" } : prev));
    },
    [messageFor]
  );

  /** Spread onto a field with a stable `id`. */
  const fieldProps = (id: string) => ({
    onBlur,
    onInput,
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
  });

  const setError = useCallback((id: string, message: string) => {
    setErrors((prev) => ({ ...prev, [id]: message }));
  }, []);

  return { errors, fieldProps, setError };
}
