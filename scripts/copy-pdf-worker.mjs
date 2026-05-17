/**
 * Copies the pdf.js worker shipped with the installed pdfjs-dist (the exact
 * version react-pdf depends on) into /public so it is served same-origin.
 *
 * The site's production CSP is `default-src 'self'` (see next.config.js), so a
 * CDN-hosted worker would be blocked. Resolving the worker from node_modules
 * here guarantees the worker version always matches the pdf.js API version —
 * a mismatch is the most common cause of react-pdf failing at runtime.
 *
 * Wired into the `predev` / `prebuild` npm scripts so it stays in sync on every
 * install or version bump.
 */
import { createRequire } from "node:module";
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const projectRoot = dirname(fileURLToPath(import.meta.url)) + "/..";

const workerSrc = require.resolve("pdfjs-dist/build/pdf.worker.min.mjs");
const publicDir = join(projectRoot, "public");
const workerDest = join(publicDir, "pdf.worker.min.mjs");

mkdirSync(publicDir, { recursive: true });
copyFileSync(workerSrc, workerDest);

console.log(`[copy-pdf-worker] ${workerSrc} -> ${workerDest}`);
