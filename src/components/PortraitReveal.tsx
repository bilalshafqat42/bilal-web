"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

/**
 * The hero portrait: monochrome at rest, colour wiped in under the cursor.
 *
 * Bilal's brief: "normally show my image black n white filter, but when mouse
 * cursor hovers it shows my image with colors with smoky effect and parallax
 * style makes my picture to move as well."
 *
 * Three things happening at once, and each one is a separate mechanism:
 *
 * 1. **The colour.** Two copies of the same file are stacked — the source is
 *    already colour, and the monochrome version is a CSS `grayscale` filter, so
 *    there is no second asset and the browser fetches one image.
 *
 * 2. **The smoke.** The colour copy carries a radial mask centred on the
 *    cursor. Its radius runs 0 to 320px on enter, and its edge is deliberately
 *    long and soft — opaque to 40%, then a slow falloff to nothing — which is
 *    what makes it read as wiping condensation off glass rather than as a hard
 *    circular spotlight.
 *
 * 3. **The parallax.** Both copies shift a few pixels against the cursor. Small
 *    on purpose: the portrait is masked at its edges by `.hero-portrait`, and
 *    anything past about 20px pulls the image out from under that mask and
 *    exposes a hard edge.
 *
 * Everything is driven through CSS custom properties written on one element, so
 * a mouse move costs one style write and no React render.
 *
 * `.hero-portrait` moved from the `<img>` onto this wrapper. It composites two
 * mask layers already, and stacking the reveal mask on top of those would need a
 * third `mask-composite` layer whose behaviour differs across browsers. Keeping
 * the edge fades on the wrapper and the reveal on the inner element keeps the
 * two independent.
 *
 * Pointer-driven, so it is desktop-only in practice; a touch device simply never
 * fires the handlers and keeps the monochrome portrait, which is the intended
 * resting state anyway.
 */

/** How far the colour reaches from the cursor, in px. */
const RADIUS = 320;

/** Maximum parallax shift, in px. See the note above about the edge mask. */
const SHIFT = 16;

export default function PortraitReveal({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  /** Applied to both copies: object-fit, object-position, tone adjustments. */
  className?: string;
  priority?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--r", `${RADIUS}px`);

    // Reduced motion keeps the colour reveal and drops the movement: the reveal
    // is a state change, the drift is the part that is actually motion.
    if (!reduced.current) {
      const dx = (x / r.width - 0.5) * -2 * SHIFT;
      const dy = (y / r.height - 0.5) * -2 * SHIFT;
      el.style.setProperty("--dx", `${dx.toFixed(1)}px`);
      el.style.setProperty("--dy", `${dy.toFixed(1)}px`);
    }
  }, []);

  const onLeave = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    // Radius to zero rather than hiding the layer, so the colour retreats into
    // the cursor's last position instead of blinking out.
    el.style.setProperty("--r", "0px");
    el.style.setProperty("--dx", "0px");
    el.style.setProperty("--dy", "0px");
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="hero-portrait portrait-reveal absolute inset-0"
    >
      {/* Monochrome base. Always present, so the portrait is complete before
          any pointer arrives and for anyone who never uses one. */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`portrait-layer grayscale ${className}`}
      />

      {/* Colour, revealed through the mask. `alt=""` and `aria-hidden`: it is
          the same photograph as the layer beneath, and announcing it twice would
          be noise. */}
      <div className="portrait-colour absolute inset-0">
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          className={`portrait-layer ${className}`}
        />
      </div>
    </div>
  );
}
