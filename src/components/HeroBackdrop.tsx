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
 * Reference: Wope's hero. Faithful on the geometry and the light, in the site
 * gold rather than the reference's violet, which is the accent everything else
 * on the page already uses.
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

/** How many rectangles are in flight at once. Enough that the gap between
 *  neighbours never opens up visibly at any point in the cycle. */
const RING_COUNT = 12;

/** Cycle length. The stagger below divides this evenly, or the spacing between
 *  neighbours would pulse once per cycle. Keep in step with the `ring-expand`
 *  keyframe in globals.css. */
const RING_CYCLE_S = 14;

/** The rectangles are very flat, around 5.8:1 — measured off the reference
 *  rather than picked. Its brightest arc spans roughly 1240px with only about
 *  65px of sag, and fitting an ellipse to that gives semi-axes near 700 by 121.
 *  Flatness is what makes each one read as a wide shallow dome instead of a
 *  box; at 1.75:1 they showed as complete nested rectangles over the headline.
 *
 *  Smallest and largest scale. The keyframe eases rather than running linear,
 *  so each rectangle covers ground slowly near the centre and quickly at the
 *  edge. That is what spaces them tightly near the light and widely at the
 *  outside, which is the entire depth cue: a linear scale gives evenly spaced
 *  rectangles and reads flat. */
const SCALE_MIN = 0.34;
const SCALE_MAX = 2.3;

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

          Only their TOP edges are meant to show. That is what makes each one
          read as a wide shallow dome rising above the light, and it is why the
          reference looks the way it does: its hero has a product screenshot
          sitting over the lower half of the hero, which covers the bottom of
          every rectangle for free. This hero has no such image, so the same
          result has to be masked in — without it you get complete closed boxes
          crossing the headline, which is what the first two attempts did.

          Two masks are needed and they are nested rather than composited. A
          vertical one on the outer element cuts everything below the centre; a
          radial one on the inner element releases the far left and right.
          `mask-composite: intersect` is not reliable here — Chrome reports it
          as applied and paints through it anyway. Nesting works now that there
          is no perspective in the tree; when there was, an ancestor mask was
          silently ignored across that boundary. */}
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
          {Array.from({ length: RING_COUNT }, (_, i) => (
            <div
              key={i}
              className="ring-expand absolute rounded-[22%] border border-[rgba(252,232,166,0.85)]"
              style={{
                left: "50%",
                top: "var(--ring-centre)",
                width: "var(--ring-w)",
                aspectRatio: "var(--ring-aspect)",
                // Negative delay starts each one already part-way through its
                // travel, so the set is spread on the very first frame instead
                // of all of them launching from the centre together.
                animationDelay: `-${(i * RING_CYCLE_S) / RING_COUNT}s`,
                // With reduced motion the animation is switched off, which
                // would otherwise freeze every rectangle on its first keyframe
                // at scale 0.05 and zero opacity, leaving those visitors an
                // empty hero. This holds the same spread as a still image, and
                // the reduced-motion rule in globals.css reads it. Spaced on a
                // curve rather than evenly, to match the eased motion.
                ["--ring-static" as string]: (
                  SCALE_MIN + (SCALE_MAX - SCALE_MIN) * (i / RING_COUNT) ** 1.7
                ).toFixed(3),
              }}
            />
          ))}
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
