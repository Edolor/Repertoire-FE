import { TESTIMONIALS } from "@/content/site";
import { Avatar } from "@/components/primitives/Avatar";

// Fully attributed, no carousel. Excerpts link to the originals.
export function Testimonials({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="font-mono text-xs uppercase tracking-widest text-text/65">
        <span className="text-accent">&gt;</span> what people who worked with me
        say
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="flex h-full flex-col border border-divider bg-surface p-5"
          >
            <blockquote className="text-sm italic text-text/80">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-start gap-3 font-mono">
              <Avatar
                seed={t.name}
                look={"look" in t ? t.look : undefined}
                size={40}
                className="shrink-0 border border-divider"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight text-text/90">
                  {t.name}
                </p>
                <p className="text-xs text-text/70">{t.title}</p>
                <p className="mt-0.5 text-[11px] tracking-wide text-text/60">
                  {t.relationship}
                </p>
                <a
                  href={t.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-block text-xs text-accent-2 hover:underline"
                >
                  full recommendation on LinkedIn &gt;
                </a>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
