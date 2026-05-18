import { ImageResponse } from "next/og";

// Apple touch icon: same `aa` + orange block wordmark as the favicon,
// scaled to 180x180 with breathing room (iOS masks/rounds it itself).
// Built-in next/og font, matching icon.tsx and opengraph-image.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 92,
          letterSpacing: "-0.04em",
        }}
      >
        <span>aa</span>
        <span
          style={{
            display: "flex",
            width: 24,
            height: 82,
            marginLeft: 8,
            background: "#F54E00",
          }}
        />
      </div>
    ),
    size,
  );
}
