/**
 * Every published project as a portfolio card, in one place.
 *
 * Added 2026-11-12 with `WorkShowcase`, which replaced the homepage's
 * PortfolioGrid. Any page that shows work picks cards from here by slug, so a
 * project's name, image and one-line summary are written once and the same
 * card looks the same on the homepage, the Work page and anywhere else.
 *
 * `image` is the card picture. The showcase paints it in two frames: a 5:6
 * portrait in a pair, and a 15:8 wide feature on desktop. A 16:10 image is
 * cropped into the portrait frame from the side `focus` names, which is why
 * every current image sets `focus: "left"`: the website heroes put their
 * headline on the left. Art-directed mockups cut for each frame replace these
 * in the next step of the redesign, through `portrait` and `wide`.
 */

export type WorkImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Which side survives the crop. Defaults to centre. */
  focus?: "left" | "center" | "top";
};

export type WorkCard = {
  slug: string;
  title: string;
  href: string;
  /** One line, shown beside a wide card. Plain, under about 110 characters. */
  summary: string;
  image: WorkImage;
  /** An image cut for the 5:6 portrait frame, when one exists. */
  portrait?: WorkImage;
  /** An image cut for the 15:8 wide frame, when one exists. */
  wide?: WorkImage;
};

export const workCards: Record<string, WorkCard> = {
  homemaid: {
    slug: "homemaid",
    title: "Homemaid",
    href: "/portfolio/homemaid",
    summary: "A bilingual booking platform, automation and launch campaigns for a Dubai home services company.",
    image: {
      src: "/portfolio/homemaid/homemaid-card.avif",
      width: 1600,
      height: 1000,
      alt: "The Homemaid homepage: Your Home, Our Commitment, with the quick booker and the HomeMaid team",
      focus: "left",
    },
  },
  "aks-chemicals": {
    slug: "aks-chemicals",
    title: "AKS Chemicals",
    href: "/portfolio/aks-chemicals",
    summary: "A new website, SEO, AI search, social media, and Google and Meta ads for a textile chemicals manufacturer.",
    image: {
      src: "/portfolio/aks-chemicals/aks-chemicals-card.avif",
      width: 1600,
      height: 1000,
      alt: "The AKS Chemicals website hero: The chemistry behind the cloth, in a serif headline on dark ink",
      focus: "left",
    },
  },
  texdale: {
    slug: "texdale",
    title: "Texdale",
    href: "/portfolio/texdale",
    summary: "End-to-end digital marketing for a UK textile chemicals manufacturer: website, app, SEO and campaigns.",
    image: {
      src: "/portfolio/texdale/texdale-card.avif",
      width: 1600,
      height: 1000,
      alt: "The Texdale website hero: Chemistry for the wet process, above folded indigo denim",
      focus: "left",
    },
  },
  "nextgen-hr": {
    slug: "nextgen-hr",
    title: "NextGen HR",
    href: "/portfolio/nextgen-hr",
    summary: "A recruitment agency in Dubai, from the first design to the live ads.",
    image: {
      src: "/portfolio/nextgen-hr/nextgen-hr-card.avif",
      width: 1440,
      height: 900,
      alt: "The NextGen HR website hero: People first. Hiring done right, over the Dubai skyline at night",
      focus: "left",
    },
  },
  "leos-developments": {
    slug: "leos-developments",
    title: "LEOS Developments",
    href: "/portfolio/leos-developments",
    summary: "Corporate website, a mobile app and off-plan launch campaigns for a UK and Dubai developer.",
    image: {
      src: "/portfolio/leos/cavendish/landing-page/cavendish-thumb.avif",
      width: 1200,
      height: 799,
      alt: "Cavendish Square landing page for LEOS Developments, with the register-your-interest and construction progress routes",
      focus: "center",
    },
  },
};

/** Cards for these slugs, in this order. An unknown slug is skipped rather
 *  than throwing, so a page never breaks over a project being renamed. */
export function cardsFor(slugs: string[]): WorkCard[] {
  return slugs.map((s) => workCards[s]).filter((c): c is WorkCard => Boolean(c));
}
