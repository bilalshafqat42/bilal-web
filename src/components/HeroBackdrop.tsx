/**
 * Layered backdrop for the homepage hero.
 *
 * Built as its own component rather than more CSS on `.grid-fade`, which only
 * has `::before` and `::after` to work with. `.grid-fade` stays as it is for
 * the ten other pages that use it, so this carries no risk to them.
 *
 * Geometry, which took three attempts to read correctly off the reference:
 *
 * There is no perspective and no ground plane. It is concentric rounded
 * rectangles sharing one centre, scaling outward. What looks like a set of
 * radial spokes converging on a vanishing point is actually the vertical sides
 * of successive rectangles lining up; what looks like a tilted floor is their
 * lower halves; and the fan across the top of the hero is their upper corners
 * sweeping outward as they grow past the viewport.
 *
 * The two earlier readings were wrong in the same way — both added machinery
 * the reference does not have. First a `rotateX` plane with a gradient grid,
 * which gives straight rows whose outer ends read flat. Then rings *inside*
 * that plane, which curved the rows correctly but kept the perspective, so it
 * read as a road receding rather than rectangles radiating from a light.
 * Removing the perspective was the fix, not tuning it.
 *
 * Reference: Wope's hero — inspected live rather than read off a screenshot,
 * which finally settled how it works. It is NOT procedural geometry. It is a
 * stack of pre-rendered PNG artwork (a bottom plate at 2498x1061, a top plate
 * and mask, a lights plate, a ray, and four separate line plates) with plain
 * CSS keyframes over it. No GSAP, no three.js, no canvas.
 *
 * The important part is what those keyframes animate: `topAnimation`,
 * `lineAnimation` (on four elements) and `bottomRayAnimation` all translate a
 * *gradient strip* in Y, at 6s, 4s and 10.2s, linear. The lines themselves
 * never move. A band of light travels along them.
 *
 * That is why no amount of expanding, rotating or drifting the geometry got
 * close: the motion in the reference is a highlight sweeping over static
 * artwork. So the rectangles here are static too, and a highlight sweeps
 * outward across them.
 *
 * The geometry stays procedural rather than copying the reference's artwork,
 * which is theirs. It is the same technique in the site gold.
 *
 * Purely decorative, so the whole thing is aria-hidden.
 */

// Fixed positions rather than Math.random: a random layout differs between the
// server and client render and React reports a hydration mismatch.
const PARTICLES = [
  { x: 12, y: 18, s: 2, o: 0.35 },
  { x: 23, y: 42, s: 1, o: 0.5 },
  { x: 31, y: 12, s: 1, o: 0.3 },
  { x: 38, y: 55, s: 2, o: 0.4 },
  { x: 44, y: 27, s: 1, o: 0.55 },
  { x: 52, y: 8, s: 1, o: 0.28 },
  { x: 57, y: 47, s: 2, o: 0.45 },
  { x: 63, y: 22, s: 1, o: 0.5 },
  { x: 69, y: 60, s: 1, o: 0.3 },
  { x: 74, y: 15, s: 2, o: 0.38 },
  { x: 81, y: 38, s: 1, o: 0.48 },
  { x: 88, y: 25, s: 1, o: 0.32 },
  { x: 92, y: 52, s: 2, o: 0.42 },
  { x: 17, y: 62, s: 1, o: 0.3 },
  { x: 47, y: 66, s: 1, o: 0.35 },
];

/** How many rectangles. Enough that the gap between neighbours never opens up
 *  visibly anywhere in the field. */
const RECT_COUNT = 12;

/** Smallest and largest scale. Spaced on a curve rather than evenly: a linear
 *  ladder puts them at equal distances apart and the whole thing reads flat,
 *  where packing them tightly around the light and spreading them at the
 *  outside is the entire depth cue. */
const SCALE_MIN = 0.34;
const SCALE_MAX = 2.3;

/** The static ladder of scales. Computed once at module scope — the set never
 *  changes now that the motion is a highlight sweeping over it rather than the
 *  shapes themselves moving. */
const RECTS = Array.from(
  { length: RECT_COUNT },
  (_, i) => +(SCALE_MIN + (SCALE_MAX - SCALE_MIN) * (i / RECT_COUNT) ** 1.7).toFixed(3),
);

/** Shared box for every rectangle. Flatness is measured off the reference, not
 *  picked: its brightest arc spans about 1240px with roughly 65px of sag, which
 *  fits an ellipse with semi-axes near 700 by 121, so about 5.8:1. */
const rectBox = {
  left: "50%",
  top: "var(--ring-centre)",
  width: "var(--ring-w)",
  aspectRatio: "var(--ring-aspect)",
} as const;

export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="hero-backdrop pointer-events-none absolute inset-0 overflow-hidden">
      {/* Tint. Kept low so it lifts the black without tinting the page: the
          further a layer sits from the light, the less chroma it can hold
          before it goes brown. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% var(--horizon), rgba(96,74,26,0.40), transparent 68%)," +
            "radial-gradient(ellipse 120% 90% at 50% 0%, rgba(40,36,28,0.5), transparent 70%)",
        }}
      />

      {/* The rectangles.

          Only their TOP edges are meant to show, which is what makes each one
          read as a wide shallow dome rising above the light. The reference gets
          that for free: its hero has a product screenshot covering the lower
          half, hiding the bottom of every shape. This hero has no such image,
          so it is masked in — without it you get closed boxes crossing the
          headline.

          Two masks, nested rather than composited: a vertical one cutting below
          the centre, a radial one releasing the sides. `mask-composite:
          intersect` does not work (Chrome reports it as applied and paints
          through it anyway), and nesting only behaves because there is no
          perspective in this tree — across a perspective boundary an ancestor
          mask is silently ignored.

          Rendered twice. The base set is dim and permanent; the highlight set
          is bright and revealed by a band that sweeps outward, which is what
          the reference does. Drawing the same set twice is cheaper than it
          sounds: these are bordered divs, so there is no image decode, and the
          highlight layer is the only thing that ever changes. */}
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,1) 52%, rgba(0,0,0,1) calc(var(--ring-centre) - 10%), transparent var(--ring-centre))",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "radial-gradient(ellipse 62% 90% at 50% var(--ring-centre), rgba(0,0,0,1) 0%, rgba(0,0,0,1) 34%, rgba(0,0,0,0.55) 68%, transparent 94%)",
          }}
        >
          {/* Base. Static: in the reference the lines never move. */}
          {RECTS.map((scale, i) => (
            <span
              key={`base-${i}`}
              className="absolute rounded-[22%] border border-[rgba(252,232,166,0.3)]"
              style={{ ...rectBox, transform: `translate(-50%, -50%) scale(${scale})` }}
            />
          ))}

          {/* Highlight. The same shapes at full brightness, revealed only where
              the sweeping band is, so a pulse of light runs outward along them. */}
          <div className="ring-sweep absolute inset-0">
            {RECTS.map((scale, i) => (
              <span
                key={`lit-${i}`}
                className="absolute rounded-[22%] border border-[rgba(255,240,190,0.95)]"
                style={{ ...rectBox, transform: `translate(-50%, -50%) scale(${scale})` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* The light. Three stacked ellipses, hot core outward: a single soft one
          reads as a smudge rather than a source. */}
      <div
        className="absolute left-1/2"
        style={{
          top: "var(--horizon)",
          width: "var(--bloom-w)",
          height: "var(--bloom-h)",
          transform: "translate(-50%, -58%)",
          opacity: "var(--bloom-op)",
        }}
      >
        {/* The breathe animation writes `opacity` directly, so the
            per-breakpoint dimming cannot live on this element or it would be
            overwritten on the first frame. It sits on the wrapper above, where
            the two multiply. */}
        <div
          className="bloom-breathe absolute inset-0"
          style={{
            filter: "blur(26px)",
            background:
              "radial-gradient(ellipse 34% 14% at 50% 50%, rgba(255,250,232,0.95), transparent 70%)," +
              "radial-gradient(ellipse 58% 28% at 50% 50%, rgba(242,201,76,0.72), transparent 72%)," +
              "radial-gradient(ellipse 86% 52% at 50% 52%, rgba(205,152,42,0.45), transparent 74%)",
          }}
        />
      </div>

      {PARTICLES.map((p) => (
        <span
          key={`${p.x}-${p.y}`}
          className="absolute rounded-full bg-white"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, opacity: p.o }}
        />
      ))}

      {/* Dissolves the rectangles into the section below rather than letting
          them meet its edge on a hard line. */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: "30%", background: "linear-gradient(to bottom, transparent, var(--color-bg) 82%)" }}
      />
    </div>
  );
}
