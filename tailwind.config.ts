import type { Config } from "tailwindcss";

const withAlpha = (token: string) => `rgb(var(${token}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{md,mdx}",
  ],
  // Syntax-highlighting token classes (hljs-*) are emitted by rehype-highlight
  // into the build-time HTML, which the content globs above never scan — keep
  // their theme rules from being purged, and auto-cover new token types.
  safelist: [{ pattern: /^hljs/ }],
  theme: {
    fontFamily: {
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      mono: ["var(--font-mono)", "ui-monospace", "monospace"],
    },
    extend: {
      colors: {
        bg: withAlpha("--bg"),
        text: withAlpha("--text"),
        surface: withAlpha("--surface"),
        divider: withAlpha("--divider"),
        accent: withAlpha("--accent"),
        "accent-2": withAlpha("--accent-2"),
        "accent-3": withAlpha("--accent-3"),
        "accent-fg": withAlpha("--accent-fg"),
      },
      maxWidth: {
        content: "72rem",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
