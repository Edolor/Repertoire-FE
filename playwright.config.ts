import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke-test harness. These specs load the real app in a real browser and
 * fail on any uncaught page error or console error — catching client-only
 * runtime crashes (e.g. dynamic `ssr: false` components) that `next build`
 * cannot, because a build never evaluates those chunks.
 *
 * Extend `tests/smoke/` with a spec per user-facing flow as features land.
 */
export default defineConfig({
  testDir: "./tests/smoke",
  // Sequentially pre-compiles dev routes so the parallel suite measures
  // behavior, not next-dev first-hit compilation. See the file's comment.
  globalSetup: "./tests/smoke/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
