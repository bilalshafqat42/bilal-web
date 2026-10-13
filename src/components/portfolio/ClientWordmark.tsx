/**
 * A client's name set as type, for a case study whose logo file we do not have.
 *
 * Bilal has screenshots of the work for several companies and no logo assets
 * yet. The alternative to this component was holding each case study back until
 * a logo arrived, which would keep real work off the site for the sake of a
 * decorative mark.
 *
 * It is deliberately not a grey box with the name in it. A placeholder that
 * looks like a placeholder tells a visitor the page is unfinished, and the page
 * is not unfinished — the work is real and the writing is real, only the
 * vector file is missing. So this sets the name in the site's own display face
 * at the optical weight a logo would occupy, which reads as a wordmark rather
 * than as a gap.
 *
 * Swapping a real logo in later is a one-line change at the call site: give the
 * client a `logo` and the `<Image>` branch takes over.
 */
export default function ClientWordmark({ name }: { name: string }) {
  return (
    <span
      // `h-10` matches the rendered height of the logo `<Image>` this stands in
      // for, so the heading below it sits on the same line either way and the
      // page does not shift when a real logo is added.
      className="inline-flex h-10 items-center text-2xl font-semibold tracking-tight text-ink"
    >
      {name}
    </span>
  );
}
