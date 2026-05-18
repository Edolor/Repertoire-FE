"use client";

import Link from "next/link";
import Image from "next/image";
import portrait from "@/assets/img/mena.jpg";
import { Section } from "@/components/primitives/Section";
import { useResume } from "@/context/ResumeContext/ResumeContext";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Testimonials } from "@/components/sections/Testimonials";
import { AboutDetails } from "@/components/sections/AboutDetails";
import { ABOUT_NARRATIVE, PERSON } from "@/content/site";

export function AboutTeaser() {
  const { open } = useResume();
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Short version"
      intro={
        <Link href="/about" className="text-accent-2 hover:underline">
          Full background, experience &amp; honours &gt;
        </Link>
      }
    >
      <div className="grid gap-8 sm:grid-cols-[200px_1fr] sm:gap-10">
        <figure className="max-w-[200px]">
          <div className="border border-divider bg-surface p-1.5">
            <Image
              src={portrait}
              alt="Aghoghomena Akasukpe"
              width={200}
              height={250}
              placeholder="blur"
              sizes="200px"
              className="aspect-[4/5] w-full object-cover grayscale transition-[filter] duration-300 hover:grayscale-0"
            />
          </div>
          <figcaption className="mt-2 font-mono text-xs text-text/50">
            <span className="text-accent">&gt;</span> {PERSON.name}
          </figcaption>
        </figure>

        <div>
          <div className="max-w-2xl space-y-4 text-pretty text-text/75">
            {ABOUT_NARRATIVE.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={open} variant="outline">
              Open resume
            </Button>
            <ButtonLink href={PERSON.github} target="_blank" variant="ghost">
              GitHub
            </ButtonLink>
          </div>
        </div>
      </div>

      <Testimonials className="mt-12" />

      {/* Full experience, education, awards, certifications from the
          backend /about (the original portfolio's content), with real
          loading / error / empty states. */}
      <AboutDetails showResume={false} />
    </Section>
  );
}
