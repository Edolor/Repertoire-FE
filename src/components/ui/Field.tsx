import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const base =
  "w-full border border-divider bg-bg px-3 py-2.5 text-sm text-text/90 placeholder:text-text/40 focus-visible:border-accent-2 disabled:opacity-50";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(base, className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(base, "resize-y", className)} {...props} />
));
Textarea.displayName = "Textarea";

export function Label({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-1.5 block font-mono text-xs uppercase tracking-wider text-text/70",
        className,
      )}
    >
      {children}
    </label>
  );
}
