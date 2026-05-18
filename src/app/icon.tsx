import { ImageResponse } from "next/og";

// The favicon IS the brand wordmark: `aa` plus the owned orange block
// cursor, on warm paper. Rendered with next/og (same as the OG images)
// so the design tokens are the single source of truth (#EEEFE9 paper,
// #151515 charcoal, #F54E00 accent). next/og's bundled satori rejects
// our woff2 fonts, so this uses the built-in font like opengraph-image;
// at 16-32px the letterforms are indistinguishable and the orange block
// is what carries the brand.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#EEEFE9",
          color: "#151515",
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "-0.04em",
        }}
      >
        <span>aa</span>
        <span
          style={{
            display: "flex",
            width: 9,
            height: 30,
            marginLeft: 3,
            background: "#F54E00",
          }}
        />
      </div>
    ),
    size,
  );
}
