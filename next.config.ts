import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The previous WordPress site served every URL with a trailing slash
  // (/services/, /react-usememo-hook-explained/). Matching that convention
  // means every indexed URL resolves directly with no redirect hop.
  trailingSlash: true,

  async redirects() {
    return [
      // Old standalone service pages. Each points at the equivalent section of
      // the pillar page that replaced it, so the redirect stays topically
      // relevant (Google discards redirects to unrelated pages).
      {
        source: "/ui-ux-design",
        destination: "/services/design-content-conversion/#ui-ux-design",
        permanent: true,
      },
      {
        source: "/web-design",
        destination: "/services/design-content-conversion/#web-design",
        permanent: true,
      },
      {
        source: "/web-development",
        destination: "/services/website-app-development/#website-design-development",
        permanent: true,
      },
      {
        source: "/web-application-development",
        destination: "/services/website-app-development/#custom-marketing-tools-calculators",
        permanent: true,
      },
      // Digital business card page — closest equivalent is the contact page.
      {
        source: "/card",
        destination: "/contact-us/",
        permanent: true,
      },
      // The old WordPress site used Rank Math's sitemap index. Those URLs are
      // registered in Search Console and linked from the old robots.txt, so
      // point them at the sitemap Next.js generates instead of 404ing.
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/post-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/category-sitemap.xml", destination: "/sitemap.xml", permanent: true },
    ];
  },
};

export default nextConfig;
