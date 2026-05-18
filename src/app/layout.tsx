import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { koho, bungee } from "@/fonts";
import ThemeProvider from "@/context/ThemeContext/ThemeContext";
import QueryProvider from "@/providers/QueryProvider";

export const viewport: Viewport = {
  themeColor: "#027373",
};

const SITE_TITLE =
  "Aghoghomena Akasukpe | Agentic AI Systems Engineer";
const SITE_DESCRIPTION =
  "I build production agentic AI systems: Model Context Protocol clients, agent orchestration, skills runtimes, semantic memory, and tool-execution isolation. I also red-team them. Core engineer at Farpoint Technologies and an Agentic-AI Security Researcher at Ontario Tech University, where I'm completing an MSc in Computer Science (AI & Security).";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aghoghomena.com"),
  title: SITE_TITLE,
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
    "adversarial machine learning",
    "LLM tool use",
    "context engineering",
    "AI systems engineer",
  ],
  alternates: { canonical: "/" },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <html lang="en">
          <body className={`${koho.variable} ${bungee.variable} font-sans`}>
            {children}
            {/* Google Tracking */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <Script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                ></Script>
                <Script id="google-script">
                  {`window.dataLayer = window.dataLayer || [];
                  function gtag() {
                    dataLayer.push(arguments);
                  }
                  gtag("js", new Date());

                  gtag("config", "${process.env.NEXT_PUBLIC_GA_ID}");`}
                </Script>
              </>
            )}{" "}
          </body>
        </html>
      </QueryProvider>
    </ThemeProvider>
  );
}
