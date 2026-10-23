/**
 * Logo reveal intro: a white splash that plays once, for about 1.7s, on the
 * first full load of the homepage in a browser tab.
 *
 *   0.00-0.35s  the "Bs." mark fades in and scales 0.6 -> 1. The gold shape
 *               starts tucked exactly behind the dark one, so it reads as a
 *               single shape.
 *   0.30-0.85s  the gold shape swings out to its place behind the dark one
 *               while the dark one settles the other way: the split.
 *   0.70-1.25s  "Bilal Shafqat." is revealed left to right beside the mark
 *               while the pair slides from "mark centred" to "pair centred",
 *               so the mark moves left as the name grows. Drawn with
 *               clip-path and transform rather than max-width, which counted
 *               as layout shift (see the CSS).
 *   1.30-1.70s  the overlay fades to nothing and is hidden.
 *
 * All of the motion is CSS in `globals.css` (search "Logo intro"). No
 * animation library and no client JavaScript: this is a server component
 * rendered once in the root layout, so it is never remounted by a client-side
 * navigation and never replays on one.
 *
 * **What it costs on Lighthouse.** The page renders underneath from the first
 * paint; the overlay only covers it. Chrome does not discount an LCP element
 * for being covered, and the overlay's own text starts at opacity 0, so it
 * never becomes the LCP candidate: LCP, TBT and CLS are unchanged. Speed Index
 * does rise, because it scores what is visible on screen and the page is
 * covered for 1.3s; that is the price of any splash. `pointer-events: none`
 * means clicks reach the page even while the splash is up.
 *
 * **The base style is the finished, hidden state.** The keyframes carry the
 * visible states and use `backwards` fill, so if the animation never runs for
 * any reason the page is simply shown. Reduced motion removes the overlay
 * entirely (`display: none`).
 *
 * **The inline script decides whether to play.** It runs synchronously during
 * parsing, right after the overlay, before the first paint:
 *   - not on the homepage -> hidden. A reader landing on an article from
 *     Google came to read, not to watch a logo;
 *   - already played in this tab (sessionStorage) -> hidden, so a refresh
 *     or a return to the homepage does not replay it.
 * `hidden` is set on a server-rendered node before React hydrates, hence
 * `suppressHydrationWarning` (see next/dist/docs, "preventing flash before
 * hydration"). With JavaScript off the script does nothing and the intro
 * plays on every full load, which is harmless.
 *
 * **CSP.** The policy allows inline scripts ('unsafe-inline'), as it must for
 * Next's own bootstrap and the JSON-LD. If it ever moves to hashes, this
 * script's sha256 needs adding; any edit to SCRIPT changes the hash.
 */
const SCRIPT =
  'try{if(location.pathname!=="/"||sessionStorage.getItem("bs-intro"))document.getElementById("logo-intro").hidden=true;else sessionStorage.setItem("bs-intro","1")}catch(e){}';

export default function LogoIntro() {
  return (
    <>
      <div id="logo-intro" className="logo-intro" aria-hidden="true" suppressHydrationWarning>
        <div className="logo-intro-lockup">
          <svg className="logo-intro-mark" viewBox="0 0 242 253" focusable="false">
            <path className="logo-intro-gold" fill="#FBC91B" d="M40.4 44.4L3.9 148.1C-13.1 196.3 28.4 244.8 78.7 235.4L186.8 215.2C237 205.8 258.3 145.6 225 106.7L153.5 23.2C120.2 -15.6 57.4 -3.9 40.4 44.4Z" />
            <g className="logo-intro-front">
              <path fill="#2C2C2C" d="M12.5 76.3V186.3C12.5 237.4 67.8 269.3 112.1 243.8L207.3 188.8C251.6 163.2 251.6 99.3 207.3 73.8L112.1 18.8C67.8 -6.8 12.5 25.2 12.5 76.3Z" />
              <path fill="#FBC91B" d="M114.1 136.2C116.7 139.5 117.9 143.2 117.9 147.4C117.9 153.5 115.8 158.3 111.6 161.8C107.3 165.4 101.4 167.1 93.9 167.1H60.1V94.6H92.7C100.1 94.6 105.9 96.3 110 99.7C114.2 103.1 116.3 107.6 116.3 113.4C116.3 117.7 115.2 121.2 112.9 124.1C110.7 126.9 107.7 128.8 104 129.9C108.2 130.8 111.6 132.9 114.1 136.2V136.2ZM77.7 124H89.3C92.2 124 94.4 123.3 96 122C97.5 120.8 98.3 118.9 98.3 116.4C98.3 113.9 97.5 112 96 110.7C94.4 109.4 92.2 108.8 89.3 108.8H77.7V124V124ZM97.6 150.9C99.3 149.5 100.1 147.6 100.1 145C100.1 142.5 99.2 140.5 97.5 139C95.8 137.6 93.5 136.9 90.6 136.9H77.8V152.9H90.8C93.7 152.9 96 152.2 97.6 150.9L97.6 150.9ZM133.3 165.4C129.4 163.7 126.3 161.3 124 158.3C121.8 155.3 120.5 152 120.2 148.2H137.7C137.9 150.2 138.8 151.9 140.5 153.1C142.1 154.3 144.1 155 146.6 155C148.8 155 150.5 154.5 151.7 153.7C152.9 152.8 153.5 151.7 153.5 150.3C153.5 148.7 152.6 147.4 150.9 146.6C149.2 145.9 146.4 145 142.5 144C138.4 143.1 135 142 132.2 141C129.4 139.9 127.1 138.2 125.1 135.9C123.1 133.6 122.1 130.5 122.1 126.6C122.1 123.2 123 120.2 124.8 117.5C126.6 114.8 129.3 112.6 132.9 111.1C136.4 109.5 140.6 108.7 145.5 108.7C152.8 108.7 158.5 110.5 162.6 114C166.8 117.6 169.2 122.4 169.8 128.3H153.5C153.2 126.3 152.3 124.7 150.9 123.6C149.4 122.4 147.4 121.8 145 121.8C143 121.8 141.4 122.2 140.3 123C139.2 123.8 138.6 124.9 138.6 126.2C138.6 127.9 139.5 129.1 141.3 130C143 130.8 145.8 131.6 149.5 132.4C153.7 133.5 157.2 134.6 159.9 135.7C162.6 136.8 165 138.5 167 140.9C169 143.2 170.1 146.4 170.1 150.4C170.1 153.8 169.2 156.8 167.3 159.5C165.4 162.1 162.7 164.2 159.1 165.7C155.6 167.2 151.5 168 146.8 168C141.8 168 137.3 167.1 133.4 165.4H133.3ZM174.9 165.2C173 163.4 172 161.2 172 158.5C172 155.8 173 153.4 174.9 151.5C176.9 149.7 179.4 148.8 182.5 148.8C185.6 148.8 188 149.7 190 151.5C192 153.4 193 155.7 193 158.5C193 161.2 192 163.4 190 165.2C188 167.1 185.5 168 182.5 168C179.5 168 176.9 167.1 174.9 165.2Z" />
            </g>
          </svg>
          <span className="logo-intro-name">
            Bilal Shafqat<span className="logo-intro-dot">.</span>
          </span>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
    </>
  );
}
