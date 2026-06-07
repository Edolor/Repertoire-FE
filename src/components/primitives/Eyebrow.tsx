import { cn } from "@/lib/cn";

type EyebrowProps = {
  children: React.ReactNode;
  /** Render the `>` accent prompt before the label. Default true. */
  prompt?: boolean;
  /** Element to render as — `p` (default) for labels, `h2` for section headings. */
  as?: "p" | "h2";
  id?: string;
  className?: string;
};

/**
 * The mono uppercase "eyebrow" label with the `>` prompt motif — the single
 * source of truth for tracking/size/opacity. Previously re-typed (and drifted)
 * across ~20 sites. Server-component-safe; renders as <p> by default or <h2>
 * when it heads a section.
 */
export function Eyebrow({
  children,
  prompt = true,
  as: Tag = "p",
  id,
  className,
}: EyebrowProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "font-mono text-xs uppercase tracking-[0.125em] text-text/65",
        className,
      )}
    >
      {prompt && (
        <span aria-hidden className="mr-2 text-accent">
          &gt;
        </span>
      )}
      {children}
    </Tag>
  );
}
