import type { Page, TestInfo } from "@playwright/test";

/**
 * Records uncaught exceptions and console errors for the lifetime of a page.
 * `pageerror` is the signal that catches client-side runtime crashes such as
 * the pdf.js / webpack ESM-interop bug — a class of failure `next build` and
 * HTTP smoke checks structurally cannot detect.
 *
 * Add genuinely-benign, environment-only noise to IGNORE (keep it tight —
 * an over-broad ignore list is how real regressions slip through).
 */
const IGNORE: RegExp[] = [
  /Download the React DevTools/i,
];

export function trackPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (IGNORE.some((re) => re.test(text))) return;
    errors.push(`console.error: ${text}`);
  });
  return errors;
}

export function assertNoErrors(errors: string[], testInfo?: TestInfo) {
  if (errors.length === 0) return;
  const message = `Runtime errors detected in browser:\n - ${errors.join("\n - ")}`;
  if (testInfo) testInfo.attach("runtime-errors", { body: message });
  throw new Error(message);
}
