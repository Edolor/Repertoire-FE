import { Eyebrow } from "./Eyebrow";

type PageHeaderProps = {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
};

/**
 * The standard index-page header: eyebrow + <h1> + intro. Locks the h1 type
 * scale and intro width to one definition so the /work, /research (and any
 * future index) pages can't drift. Server-component-safe.
 *
 * Distinct from <Section>, which emits an <h2> landmark with the index
 * watermark — index pages need the page <h1>, so this is its own primitive.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  className,
}: PageHeaderProps) {
  return (
    <header className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="t-h2 mt-3 max-w-3xl text-balance font-bold">{title}</h1>
      {intro && (
        <p className="mt-5 max-w-2xl text-pretty text-text/70 sm:text-lg">
          {intro}
        </p>
      )}
    </header>
  );
}
