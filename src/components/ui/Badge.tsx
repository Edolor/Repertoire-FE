import { cn } from "@/lib/cn";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border border-divider bg-surface px-2.5 py-1 font-mono text-xs text-text/80",
        className,
      )}
    >
      {children}
    </span>
  );
}
