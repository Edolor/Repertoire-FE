import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { CornerBrackets } from "@/components/primitives/CornerBrackets";
import { RESEARCH } from "@/content/site";

export function Research() {
  return (
    <Section
      id="research"
      index="04"
      eyebrow="Research & publications"
      title="External evidence, in plain language"
      intro="Each item with a why-this-matters, not just a citation."
    >
      <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
        {RESEARCH.map((r, idx) => (
          <Reveal key={r.title} delay={idx * 0.05} className="h-full">
            <article className="panel group relative flex h-full flex-col border border-divider bg-surface p-5 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-accent-3/45 hover:shadow-[0_22px_50px_-26px_rgb(var(--accent-3)/0.5)] motion-reduce:transition-none motion-reduce:hover:transform-none sm:p-6">
              <CornerBrackets />
              <h3 className="text-lg font-bold leading-snug transition-colors group-hover:text-accent-3">
                {r.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-text/65">{r.venue}</p>
              <p className="mt-3 text-sm leading-relaxed text-text/75">{r.why}</p>
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-xs text-accent-2"
              >
                <span className="group-hover:underline">{r.hrefLabel}</span>
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                >
                  &gt;
                </span>
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
