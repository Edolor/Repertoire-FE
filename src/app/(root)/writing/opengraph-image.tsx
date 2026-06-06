import { terminalImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt =
  "Writing by Aghoghomena Akasukpe: notes on building systems and shipping product.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return terminalImage({
    kicker: "aghoghomena.com / writing",
    title: "Building systems, shipping product",
    footer: "Aghoghomena Akasukpe · Systems & Full-Stack Engineer",
  });
}
