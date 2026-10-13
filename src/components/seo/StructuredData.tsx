import JsonLd from "@/components/seo/JsonLd";
import { personNode, businessNode, websiteNode } from "@/lib/schema";

/**
 * The site's identity graph: who I am, the business, and the site itself.
 *
 * Homepage only. This previously rendered from the root layout, which put a
 * `Person` node on every route, one copy of the same entity per page, none of
 * them carrying an `@id` to say they were the same person. Other templates now
 * reference `#person` and `#business` by id instead of restating them.
 */
export default function StructuredData() {
  return <JsonLd nodes={[personNode(), businessNode(), websiteNode()]} />;
}
