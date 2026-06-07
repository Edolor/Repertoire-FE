"use client";

import { useEffect } from "react";
import Link from "next/link";
import { isStaleChunkError, hardReload, autoRecoverOnce } from "@/lib/recover";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const stale = isStaleChunkError(error);

  // If this looks like a stale deploy, transparently reload to the latest once.
  useEffect(() => {
    if (stale) autoRecoverOnce();
  }, [stale]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <div className="panel w-full max-w-md overflow-hidden border border-divider bg-surface font-mono text-sm">
        <div className="flex items-center gap-2 border-b border-divider px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-2" />
          <span className="ml-2 text-xs text-text/50">agent shell — error</span>
        </div>
        <div className="graph-paper space-y-1 p-4">
          {stale ? (
            <>
              <p className="text-text/70">
                <span className="text-accent">&gt;</span> fetch latest build
              </p>
              <p className="text-accent">notice: a new version shipped</p>
              <p className="text-text/65">
                your browser was holding cached assets. reloading to the latest…
              </p>
            </>
          ) : (
            <>
              <p className="text-text/70">
                <span className="text-accent">&gt;</span> render this page
              </p>
              <p className="text-accent">error: something threw at runtime</p>
              <p className="text-text/65">
                this has been logged. retry, or reload for a fresh copy.
              </p>
            </>
          )}
          {error.digest && (
            <p className="text-text/45">ref: {error.digest}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-3">
            {stale ? (
              <button
                type="button"
                onClick={hardReload}
                className="border border-accent bg-accent px-3 py-1.5 text-accent-fg transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2"
              >
                Reload latest
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => reset()}
                  className="border border-accent bg-accent px-3 py-1.5 text-accent-fg transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2"
                >
                  Try again
                </button>
                <button
                  type="button"
                  onClick={hardReload}
                  className="border border-divider px-3 py-1.5 text-text/70 transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2"
                >
                  Reload
                </button>
              </>
            )}
            <Link
              href="/"
              className="ml-1 text-accent-2 underline-offset-2 hover:underline"
            >
              &gt; cd ~
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
