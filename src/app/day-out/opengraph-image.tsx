import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CoupleArt } from "./illustrations";

/*
 * Link-preview card for /day-out. Messaging apps (iMessage, WhatsApp,
 * Instagram DMs) render og:image + og:title + og:description, so this is
 * what she sees before tapping. Same palette as the page.
 *
 * Fonts: satori (the renderer behind next/og) reads TTF/OTF/WOFF and
 * rejects WOFF2, which is all next/font emits. So the four faces are
 * committed as TrueType under src/assets/fonts/og (OFL licensed) and read
 * from disk at build time; the route is static, so this runs once.
 */
export const alt = "A date with Ifeoma. I planned us a day.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FONT_DIR = join(process.cwd(), "src/assets/fonts/og");
const font = (file: string) => readFileSync(join(FONT_DIR, file));

const CREAM = "#fbf7f0";
const CARD = "#fffdf8";
const MATCHA = "#a8c09a";
const MATCHA_DEEP = "#7c9a6e";
const BLUSH_DEEP = "#cf9f9f";
const INK = "#4a3a30";
const INK_SOFT = "#7a6658";

function Sprig() {
  const leaves: Array<[number, number, number, boolean]> = [
    [30, 21, -38, true],
    [47, 13.5, -18, false],
    [66, 10, 0, true],
    [85, 13.5, 18, false],
    [102, 21, 38, true],
  ];
  return (
    <svg width="200" height="60" viewBox="0 0 132 40">
      <path
        d="M12 31C40 8 92 8 120 31"
        fill="none"
        stroke={MATCHA_DEEP}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {leaves.map(([x, y, r, flip], i) => (
        <path
          key={i}
          d="M0 0 Q6 -9 13 0 Q6 4.5 0 0 Z"
          fill={MATCHA}
          stroke={MATCHA_DEEP}
          strokeWidth="1.2"
          strokeLinejoin="round"
          transform={`translate(${x} ${y}) rotate(${r}) ${flip ? "scale(1 -1)" : ""}`}
        />
      ))}
    </svg>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          backgroundColor: CREAM,
          backgroundImage:
            "linear-gradient(135deg, #eef2e6 0%, #fbf7f0 48%, #f9eee9 100%)",
          fontFamily: "Nunito",
          color: INK,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            borderRadius: 44,
            backgroundColor: CARD,
            boxShadow: "0 30px 60px -30px rgba(74,58,48,0.30)",
            padding: "28px 72px",
          }}
        >
          <div style={{ display: "flex", marginBottom: 12, flexShrink: 0 }}>
            <CoupleArt
              width={178}
              height={110}
              colors={{
                skin: "#a4714f",
                hair: "#3b2a22",
                line: INK_SOFT,
                him: MATCHA,
                her: "#e8c4c4",
                dot: BLUSH_DEEP,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 9,
              color: MATCHA_DEEP,
            }}
          >
            AN INVITATION
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              marginTop: 10,
              fontFamily: "Cormorant Garamond",
              fontSize: 96,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: -1,
            }}
          >
            <span>A date with</span>
            <span style={{ fontStyle: "italic", marginLeft: 26 }}>Ifeoma.</span>
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 36, lineHeight: 1.3, color: INK_SOFT, flexShrink: 0 }}>
            I planned us a day.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 2,
              flexShrink: 0,
              fontFamily: "Cormorant Garamond",
              fontStyle: "italic",
              fontSize: 36,
              lineHeight: 1.3,
              color: BLUSH_DEEP,
            }}
          >
            Excited to see you.
          </div>
          <div style={{ display: "flex", marginTop: 18, flexShrink: 0 }}>
            <Sprig />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant Garamond", data: font("CormorantGaramond-Medium.ttf"), weight: 500, style: "normal" },
        { name: "Cormorant Garamond", data: font("CormorantGaramond-MediumItalic.ttf"), weight: 500, style: "italic" },
        { name: "Nunito", data: font("Nunito-Regular.ttf"), weight: 400, style: "normal" },
        { name: "Nunito", data: font("Nunito-SemiBold.ttf"), weight: 600, style: "normal" },
      ],
    },
  );
}
