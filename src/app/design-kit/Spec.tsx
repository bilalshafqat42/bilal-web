"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Shows the size the browser actually draws its child at: font size, weight,
 * line height, and the box's width and height.
 *
 * Read from the rendered element rather than written by hand, so the design
 * kit cannot claim a size the site no longer uses. Re-measured on resize,
 * because the type scale is fluid and the numbers change with the window.
 */
export default function Spec({
  children,
  show = "type",
}: {
  children: ReactNode;
  /** `type` for text, `box` for a button or a card. */
  show?: "type" | "box";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const measure = () => {
      const el = ref.current?.firstElementChild as HTMLElement | null;
      if (!el) return;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const fs = parseFloat(cs.fontSize);
      const lh = cs.lineHeight === "normal" ? "normal" : `${Math.round(parseFloat(cs.lineHeight))}px`;
      setLabel(
        show === "type"
          ? `${Math.round(fs)}px · weight ${cs.fontWeight} · line ${lh}`
          : `${Math.round(r.width)} × ${Math.round(r.height)}px · text ${Math.round(fs)}px`,
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [show]);

  return (
    <div>
      <div ref={ref}>{children}</div>
      <p className="mt-2 font-mono text-[0.72rem] tracking-wide text-faint">{label || " "}</p>
    </div>
  );
}
