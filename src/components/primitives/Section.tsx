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
        "mx-auto w-full max-w-content px-5 py-12 sm:px-8 sm:py-16",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-4 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.125em] text-text/60">
          {index && (
            <>
              <span className="tabular-nums text-accent/80">{index}</span>
              <span aria-hidden className="h-3 w-px bg-divider" />
            </>
          )}
          <span>
            <Prompt className="mr-2" />
            {eyebrow}
          </span>
        </p>
      )}
      {title && (
        <h2
          id={headingId}
          className="t-h2 max-w-3xl text-balance font-bold"
        >
          {title}
        </h2>
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
