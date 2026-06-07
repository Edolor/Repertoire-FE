import { forwardRef } from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const button = cva(
  "relative isolate overflow-hidden inline-flex items-center justify-center gap-2 font-mono text-sm font-medium transition-[transform,background-color,border-color,box-shadow,color] duration-150 ease-out will-change-transform active:translate-y-px disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:hover:transform-none before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:-translate-x-[130%] before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-[600ms] before:ease-out hover:before:translate-x-[130%] motion-reduce:before:hidden",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-fg border border-accent hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-12px_rgb(var(--accent)/0.75)]",
        secondary:
          "border border-accent-2 bg-transparent text-accent-2 hover:bg-accent-2/5 hover:-translate-y-0.5",
        outline:
          "border border-divider bg-transparent text-text hover:border-text/40 hover:bg-surface hover:-translate-y-0.5",
        ghost: "bg-transparent text-text hover:bg-surface hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(button({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof button>;

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  // Make the safe path the default: any link opening a new tab gets
  // noopener/noreferrer unless the caller deliberately overrides it. Closes
  // the reverse-tabnabbing / referrer-leak footgun at the component boundary
  // instead of relying on every call site to remember it.
  const rel =
    props.target === "_blank" ? props.rel ?? "noopener noreferrer" : props.rel;
  return (
    <Link
      className={cn(button({ variant, size }), className)}
      {...props}
      rel={rel}
    />
  );
}
