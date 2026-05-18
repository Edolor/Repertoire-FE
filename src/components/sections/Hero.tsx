import { Terminal } from "@/components/interactive/Terminal";
import { ButtonLink } from "@/components/ui/Button";
import { PERSON, PROOF } from "@/content/site";
import { DashedDivider } from "@/components/primitives/Section";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="mx-auto w-full max-w-content px-5 pb-8 pt-14 sm:px-8 sm:pt-20"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-text/55">
            <span className="text-accent">&gt;</span> {PERSON.role}
          </p>
          <h1
            id="hero-heading"
            className="mt-4 text-balance text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            {PERSON.outcome}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg text-text/70">
            <span className="font-mono text-accent">&quot;</span>
            {PERSON.signature}
            <span className="font-mono text-accent">&quot;</span>
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/#work-with-me" variant="primary" size="lg">
              Work with me
            </ButtonLink>
            <ButtonLink
              href={PERSON.resume}
              target="_blank"
              variant="outline"
              size="lg"
            >
              Resume
            </ButtonLink>
            <ButtonLink
              href={PERSON.github}
              target="_blank"
              variant="ghost"
              size="lg"
            >
              GitHub
            </ButtonLink>
          </div>
        </div>
        <div>
          <Terminal />
        </div>
      </div>

      <DashedDivider className="mt-12" />
      {/* Proof bar, above the fold edge. */}
      <ul className="grid grid-cols-2 gap-x-6 gap-y-4 py-6 sm:grid-cols-4">
        {PROOF.map((p) => (
          <li key={p.label}>
            <p className="font-mono text-[11px] uppercase tracking-widest text-text/45">
              {p.label}
            </p>
            <p className="mt-1 text-sm font-medium text-text/85">{p.value}</p>
          </li>
        ))}
      </ul>
      <DashedDivider />
    </section>
  );
}
