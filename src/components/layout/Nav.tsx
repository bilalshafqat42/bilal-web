import NavBar from "@/components/layout/NavBar";
import { buildServiceMenu } from "@/data/serviceCategories";

/**
 * Site header, server half.
 *
 * Builds the Services menu on the server and hands the client bar only what it
 * renders: per service a slug, title, accent, one sentence, three section
 * titles and an optional timeline. The full category data (headlines, meta,
 * FAQs, every section) stays out of the client bundle.
 *
 * The root layout renders `<Nav />`, this server component. The interactive
 * client bar it hands the menu to is `NavBar.tsx`.
 */
export default function Nav() {
  return <NavBar menu={buildServiceMenu()} />;
}
