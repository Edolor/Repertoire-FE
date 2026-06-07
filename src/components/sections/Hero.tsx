import { Terminal } from "@/components/interactive/Terminal";
import { AgentGraph } from "@/components/interactive/AgentGraph";
import { ButtonLink } from "@/components/ui/Button";
import { PERSON, PROOF } from "@/content/site";
import { DashedDivider } from "@/components/primitives/Section";

// Decorative ambient depth behind the hero. Pure CSS, theme-aware, and fully
// disabled under prefers-reduced-motion (the keyframes are gated in globals).
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="hero-glow absolute -left-[10%] -top-[30%] h-[60%] w-[55%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(var(--accent) / 0.16), transparent)" }}
      />
      <div
        className="hero-glow absolute right-[-5%] top-[5%] h-[55%] w-[45%] rounded-full blur-3xl"
        style={{ animationDelay: "-7s", background: "radial-gradient(closest-side, rgb(var(--accent-2) / 0.12), transparent)" }}
      />
    </div>
  );
}

export function Hero() {
  // CSS-driven word cascade: real text in the markup (SSR + no-JS safe),
  // reduced-motion turns the animation off in globals.
  const words = PERSON.outcome.split(" ");

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative mx-auto w-full max-w-content px-5 py-12 sm:px-8 sm:py-16"
    >
      <HeroBackdrop />
      <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="hero-rise font-mono text-xs uppercase tracking-[0.125em] text-text/70">
            <span className="text-accent">&gt;</span> {PERSON.role}
          </p>
          <h1
            id="hero-heading"
            className="mt-4 text-balance text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-5xl"
          >
            {words.map((w, i) => (
              <span
                key={i}
                className="hero-word"
                style={{ animationDelay: `${0.12 + i * 0.028}s` }}
              >
                {w}
              </span>
            ))}
          </h1>
          <p
            className="hero-rise mt-5 max-w-xl text-pretty text-base text-text/70 sm:text-lg"
            style={{ animationDelay: "0.5s" }}
          >
            {PERSON.signature}
          </p>
          <p
            className="hero-rise mt-4 font-mono text-xs text-text/60"
            style={{ animationDelay: "0.58s" }}
          >
            <span className="text-accent">&gt;</span> {PERSON.availability}
          </p>
          <div
            className="hero-rise mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            style={{ animationDelay: "0.66s" }}
          >
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
        <div
          className="hero-rise flex flex-col gap-4"
          style={{ animationDelay: "0.34s" }}
        >
          <AgentGraph />
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
