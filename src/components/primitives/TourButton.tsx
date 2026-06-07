"use client";

/** Kicks off the self-driving page tour (also bound to the Konami code). */
export function TourButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("start-tour"))}
      className={
        className ??
        "inline-flex items-center gap-2 border border-divider px-3 py-2 font-mono text-xs text-text/70 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent-2 focus-visible:outline-none"
      }
    >
      <span className="text-accent">▶</span> take the self-driving tour
    </button>
  );
}
