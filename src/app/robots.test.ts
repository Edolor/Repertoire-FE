import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import { SITE_URL } from "@/lib/seo";

describe("robots", () => {
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

  const has = (bot: string) =>
    rules.some((r) => {
      const ua = r.userAgent;
      const list = Array.isArray(ua) ? ua : ua ? [ua] : [];
      return list.includes(bot);
    });

  it("points sitemap and host at the canonical origin", () => {
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
    expect(result.host).toBe(SITE_URL);
  });

  it("allows all crawlers via a general wildcard rule", () => {
    const general = rules.find((r) => r.userAgent === "*");
    expect(general).toBeDefined();
    expect(general?.allow).toBe("/");
  });

  it("explicitly lists the AI answer-engine crawlers", () => {
    for (const bot of [
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
    ]) {
      expect(has(bot)).toBe(true);
    }
  });

  it("allows the AI-crawler rule rather than disallowing it", () => {
    const aiRule = rules.find((r) => {
      const ua = r.userAgent;
      const list = Array.isArray(ua) ? ua : ua ? [ua] : [];
      return list.includes("ClaudeBot");
    });
    expect(aiRule?.allow).toBe("/");
    expect(aiRule?.disallow).toBeUndefined();
  });
});
