import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That path does not resolve.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="panel w-full max-w-md overflow-hidden border border-divider bg-surface font-mono text-sm">
        <div className="flex items-center gap-2 border-b border-divider px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-2" />
          <span className="ml-2 text-xs text-text/50">agent shell — 404</span>
        </div>
        <div className="graph-paper space-y-1 p-4">
          <p className="text-text/70">
            <span className="text-accent">&gt;</span> resolve {""}
            <span className="text-text/90">{"<this-path>"}</span>
          </p>
          <p className="text-accent">error: command not found (404)</p>
          <p className="text-text/65">that path does not resolve.</p>
          <div className="pt-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-accent bg-accent px-3 py-1.5 text-accent-fg transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2"
            >
              <span aria-hidden>&gt;</span> cd ~{" "}
              <span className="opacity-80">· back home</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
