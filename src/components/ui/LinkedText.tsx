import { Fragment } from "react";
import Link from "next/link";
import { parseInlineLinks } from "@/lib/inlineLinks";

/** Renders service copy with its `[label](/path)` links as real links. See
 *  `src/lib/inlineLinks.ts`. Server component: no client JavaScript. */
export default function LinkedText({ text }: { text: string }) {
  return (
    <>
      {parseInlineLinks(text).map((seg, i) =>
        seg.href ? (
          <Link
            key={i}
            href={seg.href}
            className="text-ink underline decoration-gold/50 decoration-1 underline-offset-4 transition-colors hover:text-gold"
          >
            {seg.text}
          </Link>
        ) : (
          <Fragment key={i}>{seg.text}</Fragment>
        )
      )}
    </>
  );
}
