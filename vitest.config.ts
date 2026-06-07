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
  // Use the automatic JSX runtime (same as Next's SWC config) so RTL component
  // tests don't need React in scope. Without this, esbuild's classic transform
  // emits React.createElement and JSX-rendering tests throw "React is not defined".
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
  },
});
