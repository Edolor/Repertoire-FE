"use client";

import Link from "next/link";
import { Section } from "@/components/primitives/Section";
import { useResume } from "@/context/ResumeContext/ResumeContext";
import { Button, ButtonLink } from "@/components/ui/Button";
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
      <div className="max-w-3xl space-y-4 text-pretty text-text/75">
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
    </Section>
  );
}
