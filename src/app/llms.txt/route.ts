import { publishedPosts, publishedWork } from "@/lib/content";
import { PERSON, EXPERTISE, EXPERIENCE, FAQ } from "@/content/site";
import { SITE_URL } from "@/lib/seo";

// /llms.txt (https://llmstxt.org): a clean, link-rich digest for answer
// engines. Generated from the same content the site renders so it never
// drifts. Plain text/markdown, no markup to strip.
export function GET() {
  const abs = (p: string) => `${SITE_URL}${p}`;

  const body = `# Aghoghomena Akasukpe

> ${PERSON.role}. ${PERSON.outcome}

Aghoghomena Akasukpe is a systems and full-stack engineer. He builds the infrastructure under AI agents (agent orchestration, tool execution, Model Context Protocol clients, runtimes, and memory) and ships full-stack product end to end in Next.js, React, and TypeScript. He is currently the agent-infrastructure engineer behind Fabric, Farpoint's agentic coding IDE (MCP tool invocation and orchestration, tool-execution and memory pipelines, and distributed pipelines for large-scale codebase analysis and autonomous code improvement). Best Graduating Student (First Class, 4.88/5.0), MSc Computer Science at Ontario Tech, peer-reviewed at PST 2025 (IEEE), $20,000 MITACS award. Open to full-time roles; available for contract.

## Key facts

- Name: ${PERSON.name}
- Role: ${PERSON.role}
- Site: ${SITE_URL}
- Contact: ${PERSON.email}
- Credentials: Best Graduating Student, School of Computing & Engineering Sciences, Babcock University (First Class, 4.88/5.0, top 1%); MSc Computer Science, Ontario Tech University (Dean's Graduate Scholarship); peer-reviewed PST 2025 publication (IEEE Xplore); $20,000 MITACS research award; AWS Machine Learning Specialty.

## Expertise

${EXPERTISE.map((e) => `- ${e.k}: ${e.v}`).join("\n")}

## Experience

${EXPERIENCE.map((e) => `- ${e.role}, ${e.org} (${e.period}): ${e.note}`).join("\n")}

## FAQ

${FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Pages

- [Home](${SITE_URL}): positioning, work, research, contact
- [About](${abs("/about")}): background, experience, education, honours
- [Writing](${abs("/writing")}): notes on building systems and shipping product

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
