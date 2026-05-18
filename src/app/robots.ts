import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Everything is public and citation-worthy. AI answer-engine crawlers are
// allowed explicitly (not just via "*") so the intent is unambiguous and
// survives future edits: getting cited by ChatGPT/Perplexity/Google AI is
// the goal, not something to guard against.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "Bingbot",
          "DuckDuckBot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
