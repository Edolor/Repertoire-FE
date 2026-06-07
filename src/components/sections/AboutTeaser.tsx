import Link from "next/link";
import Image from "next/image";
import portrait from "@/assets/img/mena.jpg";
import { Section } from "@/components/primitives/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ABOUT_NARRATIVE, PERSON } from "@/content/site";

// Home teaser only. The full experience, education, honours, and testimonials
// live on /about; this stays a short, scannable introduction.
export function AboutTeaser() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Short version"
      intro={
        <Link href="/about" className="link-underline text-accent-2">
          Full background, experience &amp; honours &gt;
        </Link>
      }
    >
      <div className="grid gap-8 sm:grid-cols-[200px_1fr] sm:gap-10">
        <figure className="max-w-[200px]">
          <div className="panel border border-divider bg-surface p-1.5 transition-colors hover:border-accent-2">
            <Image
              src={portrait}
              alt={PERSON.name}
              width={200}
              height={250}
              placeholder="blur"
              sizes="200px"
              className="aspect-[4/5] w-full object-cover grayscale transition-[filter] duration-300 hover:grayscale-0"
            />
          </div>
          <figcaption className="mt-2 font-mono text-xs text-text/65">
            <span className="text-accent">&gt;</span> {PERSON.name}
          </figcaption>
        </figure>

        <div>
          <div className="max-w-2xl space-y-4 text-pretty text-text/75">
            {ABOUT_NARRATIVE.slice(0, 2).map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/about" variant="primary">
              Full background &amp; experience
            </ButtonLink>
            <ButtonLink href="/research" variant="outline">
              Research
            </ButtonLink>
            <ButtonLink href={PERSON.github} target="_blank" variant="ghost">
              GitHub
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
