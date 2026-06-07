import { chromium, webkit } from "playwright";
import { mkdirSync } from "node:fs";

// Cross-browser sanity (WebKit), OS-skin check, a short hero video, and
// work/writing detail-page shots. Part of the UI overhaul verification pass.
const BASE = process.env.SHOT_BASE || "http://localhost:3000";
const OUT = "screenshots";
mkdirSync(OUT, { recursive: true });

// 1) WebKit cross-browser render (home, both themes).
try {
  const b = await webkit.launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await b.newContext({
      viewport: { width: 1280, height: 900 },
      colorScheme: theme,
    });
    const p = await ctx.newPage();
    await p.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
    await p.evaluate((t) => localStorage.setItem("theme", t), theme);
    await p.reload({ waitUntil: "networkidle" });
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `${OUT}/webkit-${theme}-home.png` });
    await ctx.close();
  }
  await b.close();
  console.log("webkit OK");
} catch (e) {
  console.log("webkit SKIP:", e.message);
}

const cb = await chromium.launch();

// 2) OS alternate-skin check (desktop width, os-mode persisted).
try {
  const ctx = await cb.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.evaluate(() => localStorage.setItem("os-mode", "os"));
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${OUT}/os-skin.png` });
  await ctx.close();
  console.log("os-skin OK");
} catch (e) {
  console.log("os-skin SKIP:", e.message);
}

// 3) Short hero/scroll video (~3.5s).
try {
  const ctx = await cb.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: "dark",
    recordVideo: { dir: `${OUT}/video`, size: { width: 1280, height: 800 } },
  });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.evaluate(() => localStorage.setItem("theme", "dark"));
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(1800); // hero entrance + graph + terminal boot
  for (let i = 0; i < 6; i++) {
    await p.mouse.wheel(0, 260);
    await p.waitForTimeout(220);
  }
  await p.waitForTimeout(600);
  await ctx.close(); // flushes the video file
  console.log("video OK");
} catch (e) {
  console.log("video SKIP:", e.message);
}

// 4) Detail pages (work + writing).
const DETAILS = [
  ["/work/agentic-coding-platform", "work-detail"],
  ["/writing/agent-reliability-is-a-systems-problem", "writing-detail"],
];
for (const [path, label] of DETAILS) {
  try {
    const ctx = await cb.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${OUT}/${label}.png`, fullPage: true });
    await ctx.close();
    console.log(`${label} OK`);
  } catch (e) {
    console.log(`${label} SKIP:`, e.message);
  }
}

await cb.close();
console.log("ALL DONE");
