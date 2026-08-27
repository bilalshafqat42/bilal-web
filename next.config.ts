import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /about-me was a real WordPress URL with existing links and ranking
      // history, so it is redirected rather than left to 404. 308 is permanent,
      // which is what passes the old page's equity to the new one.
      { source: "/about-me", destination: "/about", permanent: true },
      // Deliberately NOT redirecting /training or the course URLs. Bilal has
      // stopped offering training, and pointing a tutorial-intent URL at a
      // marketing page is a soft 404 — Google treats it as a poor match and it
      // can hurt the destination. Letting them 404 lets those pages de-index
      // cleanly, which is the honest outcome for content that no longer exists.
    ];
  },
  images: {
    // Next's default is ["image/webp"] only, so AVIF sources were being
    // re-encoded down to WebP. Listing AVIF first lets browsers that accept it
    // (all current ones) negotiate the smaller format, with WebP as the fallback.
    // AVIF encodes more slowly, but each variant is generated once and cached.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
