/**
 * The message under a field, from `useFieldErrors`.
 *
 * `role="alert"` so it is announced the moment it appears, without moving
 * focus away from the field the person is now in. The id matches the field's
 * `aria-describedby`, so it is read again when they return to that field.
 */
export default function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} role="alert" className="mt-2 text-xs leading-relaxed text-ink">
      {message}
    </p>
  );
}
