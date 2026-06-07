import { terminalImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt =
  "Research & publications by Aghoghomena Akasukpe: PST 2025 (IEEE Xplore) and a $20K MITACS research award.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return terminalImage({
    kicker: "aghoghomena.com / research",
    title: "External evidence, in plain language",
    footer: "PST 2025 (IEEE) · $20K MITACS · Aghoghomena Akasukpe",
  });
}
