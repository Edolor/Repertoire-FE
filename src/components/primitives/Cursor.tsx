import { cn } from "@/lib/cn";

/**
 * The owned motif. `>` is the only section/list anchor glyph site-wide.
 * The blinking block `▮` cursor appears ONLY inside interactive modules
 * (hero terminal, command palette, agent explorable), nowhere else.
 */
export function Prompt({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("font-mono text-accent select-none", className)}
    >
      &gt;
    </span>
  );
}

export function Cursor({
  blink = true,
  className,
}: {
  blink?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block w-[0.55em] h-[1.1em] translate-y-[0.15em] bg-accent",
        blink && "blink",
        className,
      )}
    />
  );
}
