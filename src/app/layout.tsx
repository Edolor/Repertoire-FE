import "./globals.css";
import type { Metadata, Viewport } from "next";
import { koho, mono } from "@/fonts";
import ThemeProvider from "@/context/ThemeContext/ThemeContext";
import QueryProvider from "@/providers/QueryProvider";
import { Analytics } from "@/components/layout/Analytics";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEEFE9" },
    { media: "(prefers-color-scheme: dark)", color: "#151515" },
  ],
};

const SITE_TITLE = "Aghoghomena Akasukpe | Agentic AI Systems Engineer";
const SITE_DESCRIPTION =
  "I build production agent systems: Model Context Protocol clients, agent orchestration, skills runtimes, semantic memory, and tool-execution isolation. Then I red-team them. MSc Computer Science (AI & Security), peer-reviewed PST 2025, $20K MITACS research award.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aghoghomena.com"),
  title: { default: SITE_TITLE, template: "%s | Aghoghomena Akasukpe" },
  description: SITE_DESCRIPTION,
  authors: [{ name: "Aghoghomena Akasukpe" }],
  keywords: [
    "Aghoghomena Akasukpe",
    "Agentic AI Systems Engineer",
    "Model Context Protocol",
    "MCP",
    "agent orchestration",
    "AI security",
    "AI red teaming",
    "LLM tool use",
    "agent systems consulting",
  ],
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: {
    type: "website",
    url: "https://www.aghoghomena.com",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Aghoghomena Akasukpe",
    images: [{ url: "/twitter-banner.png", width: 1200, height: 630, alt: "Aghoghomena Akasukpe, Agentic AI Systems Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/twitter-banner.png"],
  },
  manifest: "/manifest.json",
};

// Anti-FOUC: set the theme class on <html> before first paint so the warm
// paper / charcoal background never flashes the wrong color.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t===null&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${koho.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
