import localFont from "next/font/local";

// Grotesque sans for everything (kept from the original install).
export const koho = localFont({
  src: [
    { path: "./fonts/KoHo-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/KoHo-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/KoHo-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/KoHo-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/KoHo-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

// Self-hosted mono for code, labels, data, and the cursor/prompt motif.
// Mono on a marketing page is the strongest "I'm an engineer" signal.
export const mono = localFont({
  src: [
    { path: "./fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/JetBrainsMono-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Consolas",
    "Liberation Mono",
    "monospace",
  ],
});
