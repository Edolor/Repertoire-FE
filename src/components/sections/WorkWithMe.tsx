import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { ScopingWidget } from "@/components/interactive/ScopingWidget";
import { ENGAGEMENTS, ANTI_PITCH } from "@/content/site";

export function WorkWithMe() {
  return (
    <Section
      id="work-with-me"
      eyebrow="Work with me"
      title="Three ways to put a senior agent-systems engineer on your problem"
      intro="Pick the shape that fits. Each one says exactly what you get. The widget maps your situation to one of them."
    >
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-3">
          {ENGAGEMENTS.map((e, idx) => (
            <Reveal key={e.id} delay={idx * 0.06}>
              <div className="flex h-full flex-col border border-divider bg-surface p-5">
                <p className="font-mono text-xs uppercase tracking-widest text-accent">
                  {e.name}
                </p>
                <p className="mt-2 text-sm text-text/70">{e.tagline}</p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-text/45">
                  For
                </p>
                <p className="text-sm text-text/75">{e.forWho}</p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-text/45">
                  You get
                </p>
                <ul className="mt-1 space-y-1 text-sm text-text/80">
                  {e.youGet.map((y) => (
                    <li key={y} className="flex gap-2">
                      <span className="text-accent">&gt;</span>
                      <span>{y}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-4 font-mono text-xs text-text/55">
                  {e.shape}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <ScopingWidget />
      </div>

      <div className="mt-10 border border-dashed border-divider p-5">
        <p className="font-mono text-sm font-bold text-accent">
          {ANTI_PITCH.title}
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-text/75">
          {ANTI_PITCH.points.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="font-mono text-text/40">·</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
