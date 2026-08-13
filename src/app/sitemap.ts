import type { MetadataRoute } from "next";
import { pillars } from "@/data/pillars";
import { courses } from "@/data/courses";
import { posts } from "@/lib/posts";

const baseUrl = "https://bilalshafqat.com";

// Category archive paths carried over from the previous WordPress site.
const categoryPaths = [
  "blog",
  "portfolio",
  "portfolio/ecommerce",
  "react-js",
  "react-js/redux",
  "react-js/react-hooks",
  "design",
  "ui-ux-design",
  "ui-ux-design/figma",
  "typescript",
  "javascript",
  "javascript/es6",
  "seo",
  "tools",
  "ai",
  "ai/chatgpt",
  "ai/deepseek",
  "css",
  "css/flexbox",
  "node-js",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/services/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...pillars.map((p) => ({
      url: `${baseUrl}/services/${p.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${baseUrl}/portfolio/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about-me/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact-us/`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/blog/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/training/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...courses.map((c) => ({
      url: `${baseUrl}/${c.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Blog posts keep their original publish/modified dates so Google can see
    // which articles are genuinely fresh rather than all appearing re-dated.
    ...posts.map((p) => ({
      url: `${baseUrl}/${p.slug}/`,
      lastModified: new Date(p.modified),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categoryPaths.map((path) => ({
      url: `${baseUrl}/category/${path}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    { url: `${baseUrl}/privacy-policy/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
