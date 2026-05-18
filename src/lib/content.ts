import { posts, work } from "#content";

export const publishedPosts = posts
  .filter((p) => !p.draft)
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export const publishedWork = work
  .filter((w) => !w.draft)
  .sort((a, b) => a.order - b.order);

export const allTags = Array.from(
  new Set(publishedPosts.flatMap((p) => p.tags)),
).sort();

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
