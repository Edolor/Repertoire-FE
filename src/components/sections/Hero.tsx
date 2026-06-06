import { Terminal } from "@/components/interactive/Terminal";
import { ButtonLink } from "@/components/ui/Button";
import { PERSON, PROOF } from "@/content/site";
import { DashedDivider } from "@/components/primitives/Section";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="mx-auto w-full max-w-content px-5 py-12 sm:px-8 sm:py-16"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.125em] text-text/70">
            <span className="text-accent">&gt;</span> {PERSON.role}
          </p>
          <h1
            id="hero-heading"
            className="mt-4 text-balance text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-5xl"
          >
            {PERSON.outcome}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base text-text/70 sm:text-lg">
            {PERSON.signature}
          </p>
          <p className="mt-4 font-mono text-xs text-text/60">
            <span className="text-accent">&gt;</span> {PERSON.availability}
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="/#contact" variant="primary" size="lg">
              Get in touch
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
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 py-8 sm:grid-cols-4 sm:gap-x-8 sm:py-10">
        {PROOF.map((p) => (
          <li key={p.label}>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-text/65">
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
