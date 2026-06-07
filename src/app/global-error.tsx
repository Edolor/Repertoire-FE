"use client";

import { useEffect } from "react";
import "./globals.css";
import { isStaleChunkError, hardReload, autoRecoverOnce } from "@/lib/recover";

// Catches errors thrown in the root layout itself, so it must render its own
// <html>/<body>. Kept self-contained (no site providers/fonts) and styled to
// match the engineering-spec error shell.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const stale = isStaleChunkError(error);
  useEffect(() => {
    if (stale) autoRecoverOnce();
  }, [stale]);

  return (
    <html lang="en">
      <body className="font-mono">
        <main className="flex min-h-screen items-center justify-center px-5 py-16">
          <div className="panel w-full max-w-md overflow-hidden border border-divider bg-surface text-sm">
            <div className="flex items-center gap-2 border-b border-divider px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-3" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-2" />
              <span className="ml-2 text-xs text-text/50">agent shell — fatal</span>
            </div>
            <div className="graph-paper space-y-1 p-4">
              <p className="text-text/70">
                <span className="text-accent">&gt;</span> boot
              </p>
              <p className="text-accent">
                {stale ? "notice: a new version shipped" : "fatal: the app failed to start"}
              </p>
              <p className="text-text/65">
                {stale
                  ? "your browser had cached assets. reloading to the latest…"
                  : "reload for a fresh copy, or retry."}
              </p>
              {error.digest && <p className="text-text/45">ref: {error.digest}</p>}
              <div className="flex flex-wrap items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={hardReload}
                  className="border border-accent bg-accent px-3 py-1.5 text-accent-fg transition-colors hover:bg-accent/90"
                >
                  Reload latest
                </button>
                <button
                  type="button"
                  onClick={() => reset()}
                  className="border border-divider px-3 py-1.5 text-text/70 transition-colors hover:border-accent hover:text-accent"
                >
                  Try again
                </button>
                {/* Full-document nav on purpose: the router may be the thing
                    that failed, so avoid next/link here. */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/" className="ml-1 text-accent-2 underline-offset-2 hover:underline">
                  &gt; cd ~
                </a>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
