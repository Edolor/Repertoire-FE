import { defineConfig, defineCollection, s } from "velite";

// Build-time, Zod-validated content. No remote/runtime MDX: every post and
// case study is compiled and type-checked at build, then imported as data.
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(100),
      slug: s.slug("posts"),
      date: s.isodate(),
      updated: s.isodate().optional(),
      // Disciplined tag vocabulary, capped (see velite build assertion).
      tags: s.array(s.string()).default([]),
      description: s.string().max(200),
      draft: s.boolean().default(false),
      // markdown -> precompiled HTML string. Deliberately NOT s.mdx():
      // velite's MDX runtime executes code via new Function(), which the
      // production CSP (no 'unsafe-eval') forbids. HTML is render-safe.
      body: s.markdown(),
      metadata: s.metadata(), // reading time + word count
      excerpt: s.excerpt(),
    })
    .transform((d) => ({ ...d, permalink: `/writing/${d.slug}` })),
});

const work = defineCollection({
  name: "Work",
  pattern: "work/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      slug: s.slug("work"),
      order: s.number().default(0),
      // Anonymized client category, never a real employer name.
      client: s.string(),
      summary: s.string().max(240),
      tags: s.array(s.string()).default([]),
      outcome: s.string(),
      locked: s.boolean().default(false),
      draft: s.boolean().default(false),
      body: s.markdown(),
    })
    .transform((d) => ({ ...d, permalink: `/work/${d.slug}` })),
});

export default defineConfig({
  root: "src/content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, work },
  markdown: { gfm: true },
  prepare: ({ posts }) => {
    const tags = new Set(posts.flatMap((p) => p.tags));
    if (tags.size > 25) {
      throw new Error(
        `Tag vocabulary is ${tags.size}; cap is 25. Consolidate tags.`,
      );
    }
  },
});

export { slugify };
