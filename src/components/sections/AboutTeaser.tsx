"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import portrait from "@/assets/img/mena.jpg";
import { Section } from "@/components/primitives/Section";
import { useAboutQuery } from "@/hooks/useQueries";
import { useResume } from "@/context/ResumeContext/ResumeContext";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Testimonials } from "@/components/sections/Testimonials";
import { AboutDetails } from "@/components/sections/AboutDetails";
import { ABOUT_NARRATIVE, PERSON } from "@/content/site";

export function AboutTeaser() {
  const { open } = useResume();
  const [detailsOpen, setDetailsOpen] = useState(false);
  // Prefetch the backend /about on page load (shares the ["about"] query
  // key with the popup's AboutDetails), so opening the popup is instant.
  useAboutQuery();
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

      {/* The full backend /about content is large, so on the home page
          it lives behind a popup. The canonical inline version is /about. */}
      <Dialog.Root open={detailsOpen} onOpenChange={setDetailsOpen}>
        <Dialog.Trigger asChild>
          <Button type="button" variant="outline" className="mt-12">
            View experience, education &amp; 13 certifications
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[79] bg-black/70 backdrop-blur-sm" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed left-1/2 top-1/2 z-[80] flex max-h-[88vh] w-[94vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col border border-divider bg-bg shadow-2xl focus:outline-none"
          >
            <div className="flex items-center justify-between border-b border-divider px-5 py-3">
              <Dialog.Title className="font-mono text-sm">
                <span className="text-accent">&gt;</span> Experience, education
                &amp; certifications
              </Dialog.Title>
              <Dialog.Close
                aria-label="Close"
                className="border border-divider px-2 py-1 font-mono text-sm hover:bg-surface"
              >
                ✕
              </Dialog.Close>
            </div>
            <div className="overflow-y-auto px-5 pb-6 pt-3">
              <AboutDetails showResume={false} flush />
              <p className="mt-8 font-mono text-xs text-text/55">
                <Link
                  href="/about"
                  className="text-accent-2 hover:underline"
                  onClick={() => setDetailsOpen(false)}
                >
                  &gt; open the full About page
                </Link>
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Section>
  );
}
