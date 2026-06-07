import "./globals.css";
import type { Metadata, Viewport } from "next";
import { koho, mono } from "@/fonts";
import ThemeProvider from "@/context/ThemeContext/ThemeContext";
import QueryProvider from "@/providers/QueryProvider";
import { Analytics } from "@/components/layout/Analytics";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  TWITTER_HANDLE,
  LOCALE,
} from "@/lib/seo";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEEFE9" },
    { media: "(prefers-color-scheme: dark)", color: "#151515" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  keywords: [
    "Aghoghomena Akasukpe",
    "Systems Engineer",
    "Full-Stack Engineer",
    "Platform Engineer",
    "AI agent infrastructure",
    "Model Context Protocol",
    "MCP",
    "agent orchestration",
    "Next.js",
    "TypeScript",
    "backend engineer",
  ],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
      "application/feed+json": "/feed.json",
    },
  },
  // Tell Google/AI it may show full-size image previews and untruncated
  // snippets (the AEO-relevant directives); default file-convention
  // opengraph-image.tsx / twitter-image.tsx supply the share images.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: LOCALE,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
  manifest: "/manifest.json",
};

// Anti-FOUC: set the theme class on <html> before first paint so the warm
// paper / charcoal background never flashes the wrong color.
const themeScript = `(function(){try{document.documentElement.classList.add('js');var t=localStorage.getItem('theme');var d=t==='dark'||(t===null&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

// Anti-FOUC for the opt-in "desktop OS" alternate skin: if the visitor
// previously chose OS mode AND this is a desktop viewport (>= 1024px),
// set the `os-mode` class on <html> before first paint so the normal
// document site never flashes before the OS shell mounts. Touch/small
// screens never get the class (the OS is pointer-only by design). CSP-safe
// via the same intentional `'unsafe-inline'` as the theme script above.
const osModeScript = `(function(){try{if(localStorage.getItem('os-mode')==='os'&&window.innerWidth>=1024){document.documentElement.classList.add('os-mode');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The anti-FOUC script toggles the `dark` class on <html> before
    // hydration, so this element's class legitimately differs from SSR.
    // Scope the suppression to <html> only.
    <html
      lang="en"
      className={`${koho.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: osModeScript }} />
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
