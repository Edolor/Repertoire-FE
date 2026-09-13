/*
 * Hand-drawn-style line art for /day-out. Every scene is a 120x120
 * viewBox using the page palette via CSS variables, so the SVGs inherit
 * the card's colours and never need an external asset. Strokes are round
 * capped and slightly imperfect on purpose.
 */

const line = {
  fill: "none",
  stroke: "var(--ink-soft)",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const thin = { ...line, strokeWidth: 1.4 };

type ArtProps = { className?: string; title: string };

function Frame({
  className,
  title,
  children,
}: ArtProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      role="img"
      aria-label={title}
      data-art
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}

/** 1. A matcha latte in a glass with a whisk beside it. */
export function MatchaArt(p: Omit<ArtProps, "title">) {
  return (
    <Frame {...p} title="A glass of matcha latte beside a bamboo whisk">
      {/* steam */}
      <path {...thin} d="M45 20c-3.2 4 2.8 7-.4 11" stroke="var(--matcha-deep)" />
      <path {...thin} d="M56 16c-3.2 4 2.8 7-.4 11" stroke="var(--matcha-deep)" />
      {/* glass body */}
      <path {...line}
        d="M34.5 38 L38.4 92.5 q.3 5.6 5.9 5.6 h15.4 q5.6 0 5.9-5.6 L69.5 38 Z"
        fill="#fff"
        fillOpacity="0.55"
      />
      {/* milk */}
      <path
        d="M38.8 62 L40.3 91.4 q.2 4.2 4.3 4.2 h14.8 q4.1 0 4.3-4.2 L65.2 62 Z"
        fill="#f5ecdd"
      />
      {/* matcha layer with a soft wavy edge */}
      <path
        d="M36.4 44 L38.6 62.6 C43 60 48 65 53.5 62.4 C58 60.4 62 61.8 65.3 62.6 L67.6 44 Z"
        fill="var(--matcha)"
      />
      {/* foam */}
      <ellipse {...thin} cx="52" cy="43.5" rx="15.6" ry="3.6" fill="#c9d8bb" />
      <path {...thin} d="M45 43.2c2.5-1.5 5-1.5 7.5 0" stroke="var(--matcha-deep)" />
      {/* whisk handle */}
      <rect {...line} x="88" y="66" width="8" height="32" rx="4" fill="var(--blush)" />
      {/* whisk tines */}
      <path {...thin} d="M92 66C86 57 78 48 85 36" />
      <path {...thin} d="M92 66C89 56 85 46 88.5 34" />
      <path {...thin} d="M92 66C92 55 92 44 92 32.5" />
      <path {...thin} d="M92 66C95 56 99 46 95.5 34" />
      <path {...thin} d="M92 66C98 57 106 48 99 36" />
      <path {...thin} d="M85 60c4.6-2.2 9.4-2.2 14 0" stroke="var(--matcha-deep)" />
      {/* sprinkle */}
      <circle cx="24" cy="70" r="1.6" fill="var(--blush-deep)" />
      <circle cx="19" cy="80" r="1.1" fill="var(--matcha-deep)" />
      <circle cx="104" cy="22" r="1.3" fill="var(--blush-deep)" />
    </Frame>
  );
}

/** 2. A lighthouse with a few soft waves and a bird. */
export function LighthouseArt(p: Omit<ArtProps, "title">) {
  return (
    <Frame {...p} title="A small lighthouse above soft waves, a bird overhead">
      {/* light rays */}
      <path {...thin} d="M76 32.5l9-3.4" stroke="var(--blush-deep)" />
      <path {...thin} d="M77 37h10" stroke="var(--blush-deep)" />
      <path {...thin} d="M44 32.5l-9-3.4" stroke="var(--blush-deep)" />
      <path {...thin} d="M43 37H33" stroke="var(--blush-deep)" />
      {/* tower */}
      <path {...line} d="M50.5 45 L44.5 90.5 H75.5 L69.5 45 Z" fill="#fffaf2" />
      <path d="M48.6 58.5 L47.6 66.5 H72.4 L71.4 58.5 Z" fill="var(--blush)" />
      <path d="M46.6 74 L45.6 82 H74.4 L73.4 74 Z" fill="var(--blush)" />
      {/* gallery + lantern + roof */}
      <rect {...thin} x="46" y="41" width="28" height="5.2" rx="2.4" fill="var(--matcha)" />
      <rect {...thin} x="52" y="30.5" width="16" height="10.5" rx="2" fill="#fff3d6" />
      <path {...thin} d="M50 30.5 L60 21.5 L70 30.5 Z" fill="var(--matcha-deep)" />
      <circle cx="60" cy="20" r="1.7" fill="var(--ink-soft)" />
      {/* door */}
      <path {...thin} d="M56.8 90.5v-7.5q3.2-3.4 6.4 0v7.5" fill="var(--matcha-deep)" />
      {/* rock */}
      <path {...line} d="M36 92c8-5 40-5 48 0" fill="var(--matcha)" />
      {/* waves */}
      <path {...line}
        d="M12 101c5-4.5 11 4.5 16 0s11-4.5 16 0 11 4.5 16 0 11-4.5 16 0 11 4.5 16 0 11-4.5 16 0"
        stroke="var(--matcha-deep)"
      />
      <path {...thin} d="M24 110c5-4 11 4 16 0s11-4 16 0 11 4 16 0 11-4 16 0" stroke="var(--matcha)" />
      <path {...thin} d="M40 117.5c5-3.5 11 3.5 16 0s11-3.5 16 0" stroke="var(--blush-deep)" />
      {/* bird */}
      <path {...thin} d="M20 28c3-4.5 6.2-1.5 7.2 0 1-1.5 4.2-4.5 7.2 0" />
    </Frame>
  );
}

/** 3. A bowling pin and ball, slightly playful. */
export function BowlingArt(p: Omit<ArtProps, "title">) {
  return (
    <Frame {...p} title="A bowling ball rolling toward a tilted pin">
      {/* lane */}
      <path {...thin} d="M12 101H108" stroke="var(--matcha)" strokeDasharray="2 5" />
      {/* pin, leaning a little */}
      <g transform="rotate(-9 68 62)">
        <path {...line}
          d="M68 22 C62 22 60 27 60 32 C60 38 65 42 64 48 C63 55 55 60 55 72 C55 84 60 97 68 97 C76 97 81 84 81 72 C81 60 73 55 72 48 C71 42 76 38 76 32 C76 27 74 22 68 22 Z"
          fill="#fffaf2"
        />
        <path d="M63.5 51.5q4.5 2.2 9 0" stroke="var(--blush-deep)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M62.2 57.5q5.8 2.4 11.6 0" stroke="var(--blush-deep)" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
      {/* ball */}
      <circle {...line} cx="35" cy="81" r="16" fill="var(--matcha)" />
      <circle cx="31" cy="75" r="1.9" fill="var(--ink-soft)" fillOpacity="0.55" />
      <circle cx="37.5" cy="73" r="1.9" fill="var(--ink-soft)" fillOpacity="0.55" />
      <circle cx="36.5" cy="80" r="1.9" fill="var(--ink-soft)" fillOpacity="0.55" />
      <path {...thin} d="M26 70c3-4 8-6 13-5" stroke="#fff" strokeOpacity="0.7" />
      {/* motion */}
      <path {...thin} d="M13 73q-4 8 0 16" stroke="var(--blush-deep)" />
      <path {...thin} d="M7.5 69q-6 12 0 24" stroke="var(--blush)" />
      {/* a couple of playful dots */}
      <circle cx="96" cy="30" r="1.5" fill="var(--blush-deep)" />
      <circle cx="102" cy="40" r="1.1" fill="var(--matcha-deep)" />
    </Frame>
  );
}

/** 4. A little car on a winding road. */
export function CarArt(p: Omit<ArtProps, "title">) {
  return (
    <Frame {...p} title="A little car on a winding road heading north">
      {/* road */}
      <path
        d="M6 111 C30 111 30 80 50 78 C72 76 68 46 96 44 C106 43 110 40 116 34"
        fill="none"
        stroke="var(--matcha-soft)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M6 111 C30 111 30 80 50 78 C72 76 68 46 96 44 C106 43 110 40 116 34"
        fill="none"
        stroke="#fffdf8"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="5 6"
      />
      {/* trees */}
      <path {...thin} d="M14 62v-10" />
      <circle {...thin} cx="14" cy="46" r="6.5" fill="var(--matcha)" />
      <path {...thin} d="M98 88v-9" />
      <circle {...thin} cx="98" cy="73.5" r="5.5" fill="var(--matcha)" />
      <path {...thin} d="M84 24v-6" />
      <circle {...thin} cx="84" cy="14.5" r="4" fill="var(--blush)" />
      {/* car */}
      <g transform="rotate(-4 51 70)">
        <path {...line}
          d="M30 74 V70 Q30 66 34 66 H40 L45.5 58.5 H58.5 L64.5 66 H68 Q72 66 72 70 V74 Z"
          fill="var(--blush)"
        />
        <path {...thin} d="M42.5 66 L46.5 60.5 H50.5 V66 Z" fill="#fffdf8" />
        <path {...thin} d="M53 60.5 H57.5 L61.5 66 H53 Z" fill="#fffdf8" />
        <circle {...thin} cx="39" cy="74.5" r="4.2" fill="var(--ink-soft)" />
        <circle {...thin} cx="63" cy="74.5" r="4.2" fill="var(--ink-soft)" />
        <circle cx="39" cy="74.5" r="1.4" fill="#fffdf8" />
        <circle cx="63" cy="74.5" r="1.4" fill="#fffdf8" />
        <circle cx="72.5" cy="70.5" r="1.1" fill="#fff3d6" />
      </g>
      {/* exhaust puffs */}
      <circle cx="24" cy="72" r="2.4" fill="var(--blush)" fillOpacity="0.8" />
      <circle cx="18.5" cy="69.5" r="1.6" fill="var(--blush)" fillOpacity="0.6" />
      {/* north */}
      <path {...thin} d="M108 20v-8m0 0l-3 3m3-3l3 3" stroke="var(--matcha-deep)" />
    </Frame>
  );
}

/** Sprig of leaves, used between sections. */
export function Sprig() {
  return (
    <svg viewBox="0 0 132 40" aria-hidden="true">
      <path {...thin} d="M12 31C40 8 92 8 120 31" stroke="currentColor" />
      {[
        [30, 21, -38],
        [47, 13.5, -18],
        [66, 10, 0],
        [85, 13.5, 18],
        [102, 21, 38],
      ].map(([x, y, r], i) => (
        <path
          key={i}
          d="M0 0 Q6 -9 13 0 Q6 4.5 0 0 Z"
          fill="var(--matcha)"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
          transform={`translate(${x} ${y}) rotate(${r}) ${i % 2 ? "" : "scale(1 -1)"}`}
        />
      ))}
    </svg>
  );
}

/** Sprinkle of dots, used between stops. */
export function Sprinkle() {
  return (
    <svg viewBox="0 0 132 24" aria-hidden="true">
      <circle cx="34" cy="14" r="1.6" fill="var(--blush-deep)" />
      <circle cx="46" cy="9" r="1.1" fill="var(--matcha-deep)" />
      <circle cx="58" cy="13" r="2" fill="var(--matcha)" />
      <circle cx="70" cy="8" r="1.3" fill="var(--blush-deep)" />
      <circle cx="82" cy="12" r="1.7" fill="var(--matcha-deep)" />
      <circle cx="96" cy="10" r="1.1" fill="var(--blush)" />
    </svg>
  );
}

export type CoupleColors = {
  skin: string;
  hair: string;
  line: string;
  him: string;
  her: string;
  dot: string;
};

const COUPLE_DEFAULT: CoupleColors = {
  skin: "#a4714f",
  hair: "#3b2a22",
  line: "var(--ink-soft)",
  him: "var(--matcha)",
  her: "var(--blush)",
  dot: "var(--blush-deep)",
};

/**
 * Us: two small busts leaning toward each other. Decorative. Plain
 * attributes and no CSS vars when `colors` is passed, so the same drawing
 * also renders inside next/og (satori) for the share card.
 */
export function CoupleArt({
  className,
  colors = COUPLE_DEFAULT,
  width,
  height,
}: {
  className?: string;
  colors?: CoupleColors;
  width?: number;
  height?: number;
}) {
  const c = colors;
  const stroke = { fill: "none", stroke: c.line, strokeWidth: 1.6, strokeLinecap: "round" as const };
  // A <g>, not a fragment: satori (next/og) cannot render React fragments.
  const fluff = (cx: number, cy: number, r: number, pts: Array<[number, number]>) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={c.hair} />
      {pts.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={r * 0.36} fill={c.hair} />
      ))}
    </g>
  );
  return (
    <svg
      className={className}
      viewBox="0 0 200 124"
      width={width}
      height={height}
      aria-hidden="true"
    >
      {/* him */}
      <g transform="rotate(5 70 100)">
        <path d="M36 124 C36 98 51 87 70 87 C89 87 104 98 104 124 Z" fill={c.him} />
        <rect x="64" y="70" width="12" height="12" fill={c.skin} />
        {fluff(70, 48, 25, [[49, 36], [56, 27], [70, 23], [84, 27], [91, 36], [46, 50], [94, 50], [50, 63], [90, 63]])}
        <circle cx="70" cy="58" r="16" fill={c.skin} />
        <path d="M62.5 57.5q3-3.2 6 0" {...stroke} />
        <path d="M71.5 57.5q3-3.2 6 0" {...stroke} />
        <path d="M65.5 65q4.5 3.6 9 0" {...stroke} />
      </g>
      {/* her */}
      <g transform="rotate(-5 130 100)">
        <path d="M96 124 C96 98 111 87 130 87 C149 87 164 98 164 124 Z" fill={c.her} />
        <rect x="124" y="70" width="12" height="12" fill={c.skin} />
        {fluff(130, 46, 29, [[104, 34], [112, 23], [130, 17], [148, 23], [156, 34], [100, 50], [160, 50], [104, 66], [156, 66]])}
        <circle cx="130" cy="58" r="16" fill={c.skin} />
        <path d="M122.5 57.5q3-3.2 6 0" {...stroke} />
        <path d="M131.5 57.5q3-3.2 6 0" {...stroke} />
        <path d="M125.5 65q4.5 3.6 9 0" {...stroke} />
        <circle cx="152" cy="30" r="3.2" fill={c.dot} />
        <circle cx="146" cy="24" r="1.8" fill={c.dot} />
      </g>
      {/* a little something in the air between them */}
      <circle cx="100" cy="40" r="1.6" fill={c.dot} />
      <circle cx="94" cy="30" r="1.1" fill={c.dot} />
      <circle cx="106" cy="30" r="1.1" fill={c.dot} />
    </svg>
  );
}
