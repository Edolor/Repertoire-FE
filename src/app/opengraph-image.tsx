import { identityImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { PERSON } from "@/content/site";

export const alt =
  "Aghoghomena Akasukpe, Systems & Full-Stack Engineer. Agent infrastructure (MCP), Next.js / TypeScript, First Class, MSc CS, PST 2025.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return identityImage({
    kicker: "aghoghomena.com",
    role: PERSON.role,
    proof: "Agent infra (MCP) · Full-stack · First Class 4.88 · MSc CS · PST 2025",
  });
}
