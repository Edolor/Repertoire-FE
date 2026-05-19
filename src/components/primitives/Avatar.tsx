// Deterministic generative avatar. No external assets, no runtime deps
// (CSP forbids hotlinked photos). Two modes:
//   - `look` given: an explicitly authored, respectful illustration (used
//     for the real named recommenders so gender/age/attire are accurate,
//     not left to a hash).
//   - `look` omitted: every trait is hashed from `seed` (stable per name)
//     so the component stays reusable elsewhere.
// Idle motion (breathing bob + occasional blink) is collapsed to ~0ms by
// the global prefers-reduced-motion rule in globals.css.

type HairStyle =
  | "short"
  | "sidePart"
  | "buzz"
  | "bun"
  | "afro"
  | "long"
  | "bob"
  | "shortGrey";

type Look = {
  skin: string;
  hairColor: string;
  hairStyle: HairStyle;
  /** Jacket / top color. */
  cloth: string;
  attire?: "blazer" | "suit" | "casual";
  glasses?: boolean;
};

// Deliberately NOT a realistic skin-tone ramp. A single neutral tone so
// the figure never encodes race; identity reads from hair/attire/age cues.
const NEUTRAL_SKIN = "#AEB4BD";
const HAIR = ["#2B2620", "#5A3B22", "#8A8A8A", "#1A1A1A", "#A9743B"];
// Clothing pulls from the brand accents so it never reads off-brand.
const CLOTH = ["rgb(245 78 0)", "rgb(29 74 255)", "rgb(220 147 0)", "#5A6472"];
const BG = ["#E9E2D6", "#DCE3EC", "#E8DEC8", "#DDE1DF"];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const BASE_STYLES: HairStyle[] = [
  "short",
  "sidePart",
  "buzz",
  "bun",
  "afro",
  "long",
];

function Hair({ style, color }: { style: HairStyle; color: string }) {
  switch (style) {
    case "short":
      return <path d="M24 33A16 16 0 0 1 56 33Q56 26 48 25Q40 23 32 25Q24 26 24 33Z" fill={color} />;
    case "sidePart":
      return <path d="M24 33A16 16 0 0 1 56 33Q57 24 47 24Q44 30 33 30Q26 30 27 26Q24 28 24 33Z" fill={color} />;
    case "buzz":
      return <path d="M26 32A14 14 0 0 1 54 32Q54 27 48 26Q40 24.5 32 26Q26 27 26 32Z" fill={color} />;
    case "bun":
      return (
        <>
          <circle cx="40" cy="14" r="5.5" fill={color} />
          <path d="M24 33A16 16 0 0 1 56 33Q56 26 48 25Q40 23 32 25Q24 26 24 33Z" fill={color} />
        </>
      );
    case "afro":
      return <circle cx="40" cy="24" r="17.5" fill={color} />;
    case "long":
      return (
        <path
          d="M22 30c0-13 8-18 18-18s18 5 18 18v22c0 4-3 6-5 5-3-2-2-7-2-12 0-8-4-13-11-13s-11 5-11 13c0 5 1 10-2 12-2 1-5-1-5-5z"
          fill={color}
        />
      );
    case "bob":
      // Tidy chin-length cut: a crown cap plus two clean side locks that
      // frame the face. Forehead stays clear; no inner loops/artifacts.
      return (
        <>
          <path
            d="M24 33A16 16 0 0 1 56 33Q56 24 48 23Q40 21 32 23Q24 24 24 33Z"
            fill={color}
          />
          <path d="M25 31Q21 42 26 50L31 49Q28 41 29 32Z" fill={color} />
          <path d="M55 31Q59 42 54 50L49 49Q52 41 51 32Z" fill={color} />
        </>
      );
    case "shortGrey":
      // Short, neat, slightly receded at the temples: an older-male read.
      return (
        <path
          d="M27 32C27 19 33 15 40 15s13 4 13 17c-1-6-5-9-9-9-1 3-7 3-8 0-4 0-8 3-9 9z"
          fill={color}
        />
      );
  }
}

function Attire({
  kind,
  cloth,
}: {
  kind: "blazer" | "suit" | "casual";
  cloth: string;
}) {
  if (kind === "casual") {
    return <path d="M16 80c0-15 11-24 24-24s24 9 24 24z" fill={cloth} />;
  }
  // Blazer + suit share a jacket with a shirt V; suit adds a tie.
  return (
    <>
      {/* shirt / blouse behind the jacket */}
      <path d="M30 55h20v25H30z" fill="#EFEAE0" />
      {/* collar notches */}
      <path d="M33 55l7 6 7-6-3-2h-8z" fill="#FFFFFF" />
      {kind === "suit" && (
        <path d="M38 61h4l-1 13-1 3-1-3z" fill="#26324A" />
      )}
      {/* jacket with a V opening */}
      <path
        d="M14 80V64c0-6 8-9 17-10l9 16 9-16c9 1 17 4 17 10v16z"
        fill={cloth}
      />
      {/* lapels, a touch darker for definition */}
      <path d="M31 54l9 16-4 1-8-15z" fill="rgb(0 0 0 / 0.18)" />
      <path d="M49 54l-9 16 4 1 8-15z" fill="rgb(0 0 0 / 0.18)" />
    </>
  );
}

export function Avatar({
  seed,
  size = 40,
  className,
  look,
}: {
  seed: string;
  size?: number;
  className?: string;
  look?: Look;
}) {
  const h = hash(seed);
  const skin = look?.skin ?? NEUTRAL_SKIN;
  const hairColor = look?.hairColor ?? HAIR[(h >> 3) % HAIR.length];
  const hairStyle = look?.hairStyle ?? BASE_STYLES[(h >> 6) % BASE_STYLES.length];
  const cloth = look?.cloth ?? CLOTH[(h >> 9) % CLOTH.length];
  const attire = look?.attire ?? "casual";
  const bg = BG[(h >> 12) % BG.length];
  const maskId = `av-${h}`;

  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      role="presentation"
      aria-hidden
      className={className}
    >
      <mask id={maskId} maskUnits="userSpaceOnUse">
        <rect width="80" height="80" rx="6" fill="#fff" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <rect width="80" height="80" fill={bg} />
        <g
          style={{
            transformOrigin: "center",
            animation: "avatar-bob 4.5s ease-in-out infinite alternate",
          }}
        >
          <Attire kind={attire} cloth={cloth} />
          {/* neck */}
          <rect x="35" y="44" width="10" height="14" rx="3" fill={skin} />
          {/* head */}
          <circle cx="40" cy="33" r="16" fill={skin} />
          <Hair style={hairStyle} color={hairColor} />
          {/* subtle brows for a mature, composed read */}
          <path
            d="M31 29.5q3-2 6 0M43 29.5q3-2 6 0"
            stroke={hairColor}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
          {/* eyes (blink) */}
          <g
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: "avatar-blink 6s steps(1) infinite",
            }}
          >
            <ellipse cx="34" cy="33" rx="1.7" ry="2.4" fill="#2a2622" />
            <ellipse cx="46" cy="33" rx="1.7" ry="2.4" fill="#2a2622" />
          </g>
          {look?.glasses && (
            <g
              stroke="#3a3a3a"
              strokeWidth="1.4"
              fill="none"
              opacity="0.85"
            >
              <rect x="29" y="30" width="9" height="7" rx="2" />
              <rect x="42" y="30" width="9" height="7" rx="2" />
              <path d="M38 33h4M29 32l-3-1M51 32l3-1" />
            </g>
          )}
          {/* gentle, professional smile */}
          <path
            d="M35 40c2 2.4 8 2.4 10 0"
            stroke="rgb(40 40 45 / 0.45)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
}
