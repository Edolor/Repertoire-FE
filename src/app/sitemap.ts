import type { MetadataRoute } from "next";
import { publishedPosts, publishedWork } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const stat: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/writing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
  const posts: MetadataRoute.Sitemap = publishedPosts.map((p) => ({
    url: `${SITE_URL}${p.permalink}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const work: MetadataRoute.Sitemap = publishedWork.map((w) => ({
    url: `${SITE_URL}${w.permalink}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));
  return [...stat, ...work, ...posts];
}
