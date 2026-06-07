import { request, type FullConfig } from "@playwright/test";

/**
 * The smoke harness boots `next dev` (see CLAUDE.md). `next dev` compiles
 * each route lazily on first request. Under the parallel suite that race
 * (many cold routes compiling at once) makes the heaviest pages exceed an
 * assertion timeout for reasons unrelated to correctness.
 *
 * This pre-warms every route SEQUENTIALLY before any test runs, so the
 * suite measures behavior, not first-hit compilation. It deliberately does
 * not swallow real failures: tests still assert content and zero runtime
 * errors against the (now compiled) routes.
 */
async function globalSetup(config: FullConfig) {
  const base =
    config.projects[0]?.use?.baseURL ?? "http://localhost:3000";
  const ctx = await request.newContext({ baseURL: base });

  const routes = [
    "/",
    "/work",
    "/research",
    "/about",
    "/writing",
    "/writing/agent-reliability-is-a-systems-problem",
    "/work/agentic-coding-platform",
    "/feed.xml",
    "/feed.json",
  ];

  for (const r of routes) {
    try {
      await ctx.get(r, { timeout: 120_000 });
    } catch {
      // A failure here is surfaced by the real test that exercises it.
    }
  }
  await ctx.dispose();
}

export default globalSetup;
