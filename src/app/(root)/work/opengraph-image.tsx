import { terminalImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt =
  "Selected work by Aghoghomena Akasukpe: agent infrastructure, full-stack product, and backend systems.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return terminalImage({
    kicker: "aghoghomena.com / work",
    title: "What I've built",
    footer: "Aghoghomena Akasukpe · Systems & Full-Stack Engineer",
  });
}
