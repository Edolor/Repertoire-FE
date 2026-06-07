import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Unit tests (Vitest). E2E/smoke tests live in tests/smoke (Playwright) and are
// excluded here. Path aliases mirror tsconfig so tests import like app code.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "#content": fileURLToPath(new URL("./src/content-data.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
  },
});
