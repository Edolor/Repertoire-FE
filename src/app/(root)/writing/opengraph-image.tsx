import { terminalImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt =
  "Writing by Aghoghomena Akasukpe: building and breaking agent systems.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return terminalImage({
    kicker: "aghoghomena.com / writing",
    title: "Building and breaking agents",
    footer: "Aghoghomena Akasukpe · Agentic AI Systems Engineer",
  });
}
