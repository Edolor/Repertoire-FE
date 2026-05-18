import { TESTIMONIALS } from "@/content/site";

// Fully attributed, no carousel. Excerpts link to the originals.
export function Testimonials({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="font-mono text-xs uppercase tracking-widest text-text/45">
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
            <figcaption className="mt-4 font-mono text-xs text-text/60">
              <span className="text-text/85">{t.name}</span>, {t.title}
              <br />
              <span className="text-text/45">{t.relationship}</span>
              <br />
              <a
                href={t.href}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-accent-2 hover:underline"
              >
                full recommendation on LinkedIn &gt;
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
