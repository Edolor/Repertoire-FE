import type { Metadata } from "next";
import Image from "next/image";
import portrait from "@/assets/img/personal-selfie.png";
import { ABOUT_NARRATIVE, PERSON } from "@/content/site";
import { AboutDetails } from "@/components/sections/AboutDetails";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aghoghomena Akasukpe, Agentic AI Systems Engineer. Background, experience, education, and honours.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-text/55">
        <span className="text-accent">&gt;</span> About
      </p>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <Image
          src={portrait}
          alt="Aghoghomena Akasukpe"
          width={120}
          height={120}
          priority
          className="h-28 w-28 border border-divider object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{PERSON.name}</h1>
          <p className="mt-1 font-mono text-sm text-accent">{PERSON.role}</p>
        </div>
      </div>

      <div className="mt-8 space-y-4 text-pretty text-text/75">
        {ABOUT_NARRATIVE.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      <AboutDetails />
    </div>
  );
}
