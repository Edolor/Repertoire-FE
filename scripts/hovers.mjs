import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

// Captures hover/interaction states the static harness can't: the primary CTA
// lift+shadow and the work-card corner-bracket/elevation hover, both themes.
const BASE = process.env.SHOT_BASE || "http://localhost:3000";
const OUT = "screenshots";
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

async function go(theme) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: theme === "dark" ? "dark" : "light",
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate((t) => localStorage.setItem("theme", t), theme);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  // Primary CTA hover.
  const cta = page.getByRole("link", { name: "Get in touch" }).first();
  await cta.hover();
  await page.waitForTimeout(350);
  await page.locator("#hero").screenshot({ path: `${OUT}/hover-${theme}-cta.png` });

  // First work card hover.
  const card = page.locator("#selected-work article").first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await card.hover();
  await page.waitForTimeout(350);
  await page.locator("#selected-work").screenshot({ path: `${OUT}/hover-${theme}-card.png` });

  await ctx.close();
  console.log(`hovers ${theme}`);
}

await go("light");
await go("dark");
await browser.close();
console.log("ALL DONE");
