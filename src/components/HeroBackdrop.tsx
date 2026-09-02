/**
 * Layered backdrop for the homepage hero.
 *
 * Built as its own component rather than more CSS on `.grid-fade`, which only
 * has `::before` and `::after` to work with. This needs five layers: a tint, a
 * ceiling grid, a floor grid, the horizon bloom and the particles. `.grid-fade`
 * stays as it is for the ten other pages that use it, so this richer treatment
 * carries no risk to them.
 *
 * Reference: Wope's hero. Faithful on the geometry and the light, deliberately
 * restrained on the tint. The reference is violet throughout; this is the same
 * geometry and light in the site gold, which is the accent everything else on
 * the page already uses.
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

const GRID_LINES =
  "linear-gradient(rgba(247,219,133,0.85) 1px, transparent 1px), " +
  "linear-gradient(90deg, rgba(247,219,133,0.7) 1px, transparent 1px)";

export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Tint. Kept low and centred on the horizon so it lifts the black without
          turning the whole page purple. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 74%, rgba(96,74,26,0.40), transparent 68%)," +
            "radial-gradient(ellipse 120% 90% at 50% 0%, rgba(40,36,28,0.5), transparent 70%)",
        }}
      />

      {/* Ceiling. The same grid mirrored above the vanishing point, which is
          what makes the reference read as a space rather than a floor with a
          light on it. Fades out fast so it stays behind the type. */}
      <div className="absolute inset-x-0 top-0" style={{ height: "34%", perspective: "260px", perspectiveOrigin: "50% 100%" }}>
        <div
          className="absolute inset-x-[-14%] bottom-0"
          style={{
            top: "-110%",
            transform: "rotateX(-79deg)",
            transformOrigin: "50% 100%",
            backgroundImage: GRID_LINES,
            backgroundSize: "100% 92px, 40px 100%",
            opacity: 0.16,
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 62%)",
          }}
        />
      </div>

      {/* Floor.
          The grid needs to fade in two directions at once: into the horizon,
          and off the left and right edges. Without the second fade the rows
          compressed at 79 degrees alias into a dotted moire band across the
          outer thirds, exactly where the bloom does not wash them out.

          Both fades come from one radial mask on the rotated element itself.
          Two mask layers with `mask-composite: intersect` do not work here
          (Chrome reports the composite as applied and paints to the edge
          anyway), and neither does a horizontal mask on an ancestor, which it
          declines to apply across the perspective boundary.

          The 16% horizontal radius is measured, not guessed: it is applied in
          the element's own pre-transform space, which is 128% of the viewport
          wide, so the figure is much smaller than the on-screen fade suggests.
          Sweeping it, peak-minus-median brightness in the edge band falls from
          37.5 at 42% to 2.5 at 16%, while the centre holds at 43.4. */}
      <div className="absolute inset-x-0 bottom-0" style={{ height: "26%", perspective: "220px", perspectiveOrigin: "50% 0%" }}>
        <div
          className="absolute inset-x-[-14%] top-0"
          style={{
            bottom: "-190%",
            transform: "rotateX(79deg)",
            transformOrigin: "50% 0",
            backgroundImage: GRID_LINES,
            backgroundSize: "100% 86px, 40px 100%",
            maskImage:
              "radial-gradient(ellipse 16% 50% at 50% 0%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 42%, transparent 100%)",
          }}
        />
      </div>

      {/* Horizon bloom. Three stacked ellipses, hot core outward: a single soft
          one reads as a smudge rather than a source. */}
      <div
        className="absolute left-1/2"
        style={{
          top: "74%",
          width: "78%",
          height: "260px",
          transform: "translate(-50%, -58%)",
          filter: "blur(26px)",
          background:
            "radial-gradient(ellipse 30% 13% at 50% 50%, rgba(255,248,224,0.88), transparent 70%)," +
            "radial-gradient(ellipse 52% 26% at 50% 50%, rgba(242,201,76,0.58), transparent 72%)," +
            "radial-gradient(ellipse 80% 48% at 50% 52%, rgba(198,148,44,0.32), transparent 74%)",
        }}
      />

      {/* Particles. */}
      {PARTICLES.map((p) => (
        <span
          key={`${p.x}-${p.y}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            opacity: p.o,
          }}
        />
      ))}

      {/* Floor fade into the section below, so the grid does not end on a line. */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: "18%", background: "linear-gradient(to bottom, transparent, var(--color-bg))" }}
      />
    </div>
  );
}
