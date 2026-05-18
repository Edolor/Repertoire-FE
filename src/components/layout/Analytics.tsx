import Script from "next/script";

/**
 * Cookieless, self-hostable analytics (Plausible / Umami shape). NOT GA4.
 * Renders nothing unless BOTH env vars are set, so by default there is no
 * third-party script and no CSP exception is needed. When configured, the
 * script host must also be added to script-src/connect-src in
 * next.config.js (it reads the same env vars and documents the exception).
 */
export function Analytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  if (!src || !domain) return null;
  return (
    <Script
      src={src}
      data-domain={domain}
      strategy="afterInteractive"
      defer
    />
  );
}
