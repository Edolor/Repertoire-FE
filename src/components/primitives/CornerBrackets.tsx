import { cn } from "@/lib/cn";

/**
 * Four L-shaped corner ticks that fade in and settle flush on `group` hover —
 * the engineering-spec "registration mark" motif. Decorative; sits inside a
 * `relative group` ancestor. Collapses to a static no-op under reduced-motion.
 */
export function CornerBrackets({ className }: { className?: string }) {
  const base =
    "pointer-events-none absolute h-2.5 w-2.5 border-accent opacity-0 transition-all duration-200 group-hover:opacity-100 motion-reduce:transition-none";
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <span className={cn(base, "left-0 top-0 border-l border-t -translate-x-px -translate-y-px group-hover:translate-x-0 group-hover:translate-y-0")} />
      <span className={cn(base, "right-0 top-0 border-r border-t translate-x-px -translate-y-px group-hover:translate-x-0 group-hover:translate-y-0")} />
      <span className={cn(base, "bottom-0 left-0 border-b border-l -translate-x-px translate-y-px group-hover:translate-x-0 group-hover:translate-y-0")} />
      <span className={cn(base, "bottom-0 right-0 border-b border-r translate-x-px translate-y-px group-hover:translate-x-0 group-hover:translate-y-0")} />
    </span>
  );
}
