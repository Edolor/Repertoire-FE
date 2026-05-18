/** @type {import('next').NextConfig} */

/*
 * CSP exceptions are OPT-IN and documented. The default policy is strict
 * same-origin. Each integration below adds the minimum hosts it needs, and
 * ONLY when its env var is set, mirroring the pdf.js-worker self-host
 * pattern. With no env configured, the policy is identical to the original
 * `default-src 'self'` and no third-party origin is allowed.
 *
 *  - Cookieless analytics (Plausible/Umami): NEXT_PUBLIC_ANALYTICS_SRC.
 *      Adds the script origin to script-src + its host to connect-src.
 *  - Cal.com booking embed: NEXT_PUBLIC_CALCOM_ORIGIN (e.g.
 *      https://cal.com or a self-hosted instance). Adds it to frame-src.
 *  - Cloudflare Turnstile: NEXT_PUBLIC_TURNSTILE_SITE_KEY present means the
 *      widget script loads; adds challenges.cloudflare.com to
 *      script-src/frame-src/connect-src.
 */
const origin = (url) => {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
};

const ANALYTICS = origin(process.env.NEXT_PUBLIC_ANALYTICS_SRC);
const CALCOM = process.env.NEXT_PUBLIC_CALCOM_ORIGIN || "";
const TURNSTILE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  ? "https://challenges.cloudflare.com"
  : "";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com", pathname: "/**" },
    ],
  },
  async headers() {
    // Dev mode (React Refresh / HMR) evaluates modules via eval(), which
    // requires 'unsafe-eval'. Kept out of the production CSP.
    const isDev = process.env.NODE_ENV !== "production";

    const scriptSrc = [
      "script-src 'self' 'unsafe-inline'",
      isDev ? "'unsafe-eval'" : "",
      ANALYTICS,
      TURNSTILE,
    ]
      .filter(Boolean)
      .join(" ");

    const connectSrc = [
      "connect-src 'self' https://api.aghoghomena.com",
      ANALYTICS,
      TURNSTILE,
    ]
      .filter(Boolean)
      .join(" ");

    const frameSrc = ["frame-src 'self'", CALCOM, TURNSTILE]
      .filter(Boolean)
      .join(" ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              scriptSrc,
              // pdf.js (react-pdf resume viewer) runs in a same-origin Web
              // Worker copied into /public; blob: covers its bootstrap path.
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "img-src 'self' data: blob: https://drive.google.com",
              connectSrc,
              frameSrc,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
