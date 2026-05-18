/**
 * Shared link-preview (OpenGraph / Twitter) renderers. Two looks:
 *  - identityImage: headshot + name + role + proof. Home and About, where
 *    a face earns the click on LinkedIn/X/Slack.
 *  - terminalImage: the site's owned `>` prompt motif. Case studies and
 *    writing, where the title is the payload.
 *
 * Built-in next/og font only: satori in this Next version rejects the
 * repo's woff2 fonts (proven during the favicon work), so fontFamily
 * "monospace" is used everywhere, which also matches the mono-forward
 * brand. Headshot is embedded as a data URI (build-time static routes).
 */
import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const PAPER = "#EEEFE9";
const INK = "#151515";
const ACCENT = "#F54E00";

let headshot: string | null = null;
function headshotDataUri() {
  if (headshot) return headshot;
  const buf = readFileSync(
    join(process.cwd(), "src/assets/img/mena.jpg"),
  );
  headshot = `data:image/jpeg;base64,${buf.toString("base64")}`;
  return headshot;
}

// Solid accent block: the owned cursor motif, used as a punctuation mark.
function Block({ w, h }: { w: number; h: number }) {
  return (
    <span style={{ display: "flex", width: w, height: h, background: ACCENT }} />
  );
}

export function identityImage(opts: {
  kicker: string;
  role: string;
  proof: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          color: INK,
          padding: 64,
          fontFamily: "monospace",
        }}
      >
        <img
          alt=""
          src={headshotDataUri()}
          width={336}
          height={420}
          style={{
            objectFit: "cover",
            objectPosition: "top",
            border: `1px solid ${INK}`,
            alignSelf: "center",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 56,
            flex: 1,
          }}
        >
          <div style={{ display: "flex", fontSize: 24, color: ACCENT }}>
            &gt; {opts.kicker}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              marginTop: 20,
            }}
          >
            Aghoghomena Akasukpe
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 32,
              color: ACCENT,
              marginTop: 14,
            }}
          >
            {opts.role}
            <span style={{ display: "flex", marginLeft: 10 }}>
              <Block w={14} h={30} />
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#5b5b57",
              marginTop: 40,
            }}
          >
            {opts.proof}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

export function terminalImage(opts: {
  kicker: string;
  title: string;
  footer: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: 72,
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: ACCENT }}>
          &gt; {opts.kicker}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.12,
          }}
        >
          {opts.title}
        </div>
        <div
          style={{ display: "flex", alignItems: "center", fontSize: 26, color: INK }}
        >
          {opts.footer}
          <span style={{ display: "flex", marginLeft: 12 }}>
            <Block w={13} h={26} />
          </span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
