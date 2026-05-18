import { publishedPosts, publishedWork } from "@/lib/content";
import { PERSON, EXPERTISE, ENGAGEMENTS, FAQ } from "@/content/site";
import { SITE_URL } from "@/lib/seo";

// /llms.txt (https://llmstxt.org): a clean, link-rich digest for answer
// engines. Generated from the same content the site renders so it never
// drifts. Plain text/markdown, no markup to strip.
export function GET() {
  const abs = (p: string) => `${SITE_URL}${p}`;

  const body = `# Aghoghomena Akasukpe

> ${PERSON.role}. ${PERSON.outcome}

Aghoghomena Akasukpe builds production agent systems (Model Context Protocol clients, agent orchestration, skills runtimes, semantic memory, tool-execution isolation) and then red-teams them. MSc Computer Science (AI and Security), peer-reviewed at PST 2025, $20,000 MITACS BSI research award.

## Key facts

- Name: ${PERSON.name}
- Role: ${PERSON.role}
- Site: ${SITE_URL}
- Contact: ${PERSON.email}
- Credentials: MSc Computer Science (AI and Security); peer-reviewed PST 2025 publication; $20,000 MITACS BSI research award; core engineer on a production agentic coding platform.

## Expertise

${EXPERTISE.map((e) => `- ${e.k}: ${e.v}`).join("\n")}

## Engagements

${ENGAGEMENTS.map((e) => `- ${e.name}: ${e.tagline} ${e.shape}`).join("\n")}

## FAQ

${FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Pages

- [Home](${SITE_URL}): positioning, work, research, contact
- [About](${abs("/about")}): background, experience, education, honours
- [Writing](${abs("/writing")}): notes on building and breaking agents

## Selected work

${publishedWork
  .map((w) => `- [${w.title}](${abs(w.permalink)}): ${w.summary}`)
  .join("\n")}

## Writing

${publishedPosts
  .map((p) => `- [${p.title}](${abs(p.permalink)}): ${p.description}`)
  .join("\n")}

## Feeds

- RSS: ${abs("/feed.xml")}
- JSON Feed: ${abs("/feed.json")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
