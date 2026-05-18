import { identityImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { PERSON } from "@/content/site";

export const alt =
  "Aghoghomena Akasukpe, Agentic AI Systems Engineer. PST 2025, $20K MITACS, MCP clients, AI red-teaming.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return identityImage({
    kicker: "aghoghomena.com",
    role: PERSON.role,
    proof: "PST 2025 · $20K MITACS · MCP clients · AI red-teaming",
  });
}
