import { cn } from "@/lib/cn";
import { Prompt } from "./Cursor";

type SectionProps = {
  id: string;
  eyebrow?: string;
  index?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/**
 * Deep-linkable landmark section. The eyebrow uses the `>` prompt motif as
 * its anchor. Real <section> with an aria-labelledby heading for landmarks.
 */
export function Section({
  id,
  eyebrow,
  index,
  title,
  intro,
  className,
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn(
        "relative mx-auto w-full max-w-content px-5 py-12 sm:px-8 sm:py-16",
        className,
      )}
    >
      {/* Editorial asymmetry: an oversized, faint index watermark. */}
      {index && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-4 hidden select-none font-mono text-[8rem] font-bold leading-none text-text/[0.045] sm:block lg:text-[11rem]"
        >
          {index}
        </span>
      )}
      {eyebrow && (
        <p className="relative mb-4 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.125em] text-text/60">
          {index && (
            <>
              <span className="bloom-accent tabular-nums text-accent/80">{index}</span>
              <span aria-hidden className="h-3 w-px bg-divider" />
            </>
          )}
          <span>
            <Prompt className="mr-2" />
            {eyebrow}
          </span>
          {/* Spec coordinate label. */}
          <span className="ml-auto hidden font-mono text-[10px] normal-case tracking-normal text-text/25 sm:inline">
            {`// ${id}`}
          </span>
        </p>
      )}
      {title && (
        <h2
          id={headingId}
          className="t-h2 relative max-w-3xl text-balance font-bold"
        >
          {title}
        </h2>
      )}
      {/* Spec dimension line under the title. */}
      {title && (
        <div
          aria-hidden
          className="mt-4 flex items-center gap-1.5 text-text/20"
        >
          <span className="h-2 w-px bg-current" />
          <span className="h-px w-full max-w-[7rem] bg-current" />
          <span className="h-2 w-px bg-current" />
        </div>
      )}
      {intro && (
        <div className="mt-5 max-w-2xl text-pretty text-base text-text/70 sm:mt-6 sm:text-lg">
          {intro}
        </div>
      )}
      <div className={cn(title || intro ? "mt-8 sm:mt-10 lg:mt-12" : "")}>{children}</div>
    </section>
  );
}

export function DashedDivider({
  className,
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={cn(vertical ? "divider-dashed-y" : "divider-dashed", className)}
    />
  );
}
