import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
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
          <Reveal key={r.title} delay={idx * 0.05}>
            <article className="panel flex h-full flex-col border border-l-4 border-divider border-l-accent-3 bg-surface p-5 sm:p-6">
              <h3 className="text-lg font-bold">{r.title}</h3>
              <p className="mt-1 font-mono text-xs text-text/70">{r.venue}</p>
              <p className="mt-3 text-sm leading-relaxed text-text/75">{r.why}</p>
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="mt-auto pt-4 font-mono text-xs text-accent-2 hover:underline"
              >
                {r.hrefLabel} &gt;
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
