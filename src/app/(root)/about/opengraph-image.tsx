import { identityImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { PERSON } from "@/content/site";

export const alt =
  "About Aghoghomena Akasukpe, Agentic AI Systems Engineer: background, experience, education, and honours.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return identityImage({
    kicker: "aghoghomena.com / about",
    role: PERSON.role,
    proof: "MSc CS (AI & Security) · PST 2025 · $20K MITACS",
  });
}
