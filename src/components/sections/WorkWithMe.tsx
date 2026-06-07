import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { Badge } from "@/components/ui/Badge";
import { PILLARS, HOW_I_WORK } from "@/content/site";

export function WorkWithMe() {
  return (
    <Section
      id="how-i-build"
      index="01"
      eyebrow="How I build"
      title="How I build, and what I've shipped"
      intro="Three things I do well, each grounded in real work: the agentic-coding infrastructure at Farpoint, the healthcare backend at Cavista, and full-stack product across the stack."
    >
      <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
        {PILLARS.map((p, idx) => (
          <Reveal key={p.id} delay={idx * 0.06}>
            <div className="flex h-full flex-col border border-divider bg-surface p-5 sm:p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                {p.name}
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-text/85">
                {p.tagline}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text/75">{p.body}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {p.stack.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 border border-dashed border-divider bg-surface/50 p-6">
        <p className="font-mono text-sm font-bold text-accent">
          {HOW_I_WORK.title}
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-text/75">
          {HOW_I_WORK.points.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="font-mono text-accent">&gt;</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
