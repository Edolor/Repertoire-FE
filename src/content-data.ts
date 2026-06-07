/**
 * Typed access to Velite's build output. We deliberately do NOT re-export
 * Velite's generated `.velite/index.js`: it uses `import ... with { type:
 * 'json' }` import attributes that TypeScript cannot parse under this
 * project's config. Importing the JSON directly with explicit types is the
 * same data, build-time validated by Velite, with zero parser risk.
 */
import postsJson from "../.velite/posts.json";
import workJson from "../.velite/work.json";

export type Post = {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  tags: string[];
  description: string;
  cover?: string;
  draft: boolean;
  body: string;
  metadata: { readingTime: number; wordCount: number };
  excerpt: string;
  permalink: string;
};

export type Work = {
  title: string;
  slug: string;
  order: number;
  client: string;
  summary: string;
  tags: string[];
  outcome: string;
  locked: boolean;
  draft: boolean;
  body: string;
  permalink: string;
};

export const posts = postsJson as Post[];
export const work = workJson as Work[];

// Build-time drift guard. The hand-written `Post`/`Work` types above are kept
// (documented, and they avoid the import-attributes parser issue in
// `.velite/index.js`), but they must stay in lock-step with Velite's
// schema-derived types — the real source of truth. If the velite.config schema
// changes shape, one of these assignments stops compiling, turning silent
// drift into a build error.
import type { Post as VPost, Work as VWork } from "../.velite";
type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;
const _postDrift: Exact<Post, VPost> = true;
const _workDrift: Exact<Work, VWork> = true;
void _postDrift;
void _workDrift;
