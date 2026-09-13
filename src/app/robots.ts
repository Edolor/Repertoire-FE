import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Everything is public and citation-worthy. AI answer-engine crawlers are
// allowed explicitly (not just via "*") so the intent is unambiguous and
// survives future edits: getting cited by ChatGPT/Perplexity/Google AI is
// the goal, not something to guard against.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /day-out (a private invitation shared by link) is deliberately NOT
      // disallowed here: a disallowed URL is never fetched, so its noindex
      // is never seen and the bare URL can still be listed. It is kept out
      // via meta robots + an X-Robots-Tag header (next.config.js) instead.
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
