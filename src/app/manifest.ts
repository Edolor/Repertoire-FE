import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/seo";

// Typed manifest route (file convention, auto-linked into <head>). Built from
// the same seo.ts single source of truth as every other surface, so the PWA
// install identity can never drift from the site title/description again.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    theme_color: "#F54E00",
    background_color: "#EEEFE9",
    icons: [
      { src: "/icon", sizes: "64x64 32x32 24x24 16x16", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
