import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next's default is ["image/webp"] only, so AVIF sources were being
    // re-encoded down to WebP. Listing AVIF first lets browsers that accept it
    // (all current ones) negotiate the smaller format, with WebP as the fallback.
    // AVIF encodes more slowly, but each variant is generated once and cached.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
