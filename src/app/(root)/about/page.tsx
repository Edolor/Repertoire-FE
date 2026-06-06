import type { Metadata } from "next";
import Image from "next/image";
import portrait from "@/assets/img/mena.jpg";
import { ABOUT_NARRATIVE, PERSON } from "@/content/site";
import { AboutDetails } from "@/components/sections/AboutDetails";
import { Testimonials } from "@/components/sections/Testimonials";
import { JsonLd } from "@/components/JsonLd";
import {
  graph,
  personNode,
  profilePageNode,
  breadcrumbNode,
} from "@/lib/seo";

const ABOUT_DESCRIPTION =
  "Aghoghomena Akasukpe, Systems & Full-Stack Engineer. Background, experience, education, and honours: agentic-coding infrastructure at Farpoint, Software Engineer at Cavista, Best Graduating Student (First Class), MSc Computer Science at Ontario Tech, PST 2025, $20K MITACS.";

export const metadata: Metadata = {
  title: "About",
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: `About | ${PERSON.name}`,
    description: ABOUT_DESCRIPTION,
  },
};

const aboutLd = graph(
  personNode,
  profilePageNode("/about"),
  breadcrumbNode([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]),
);

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <JsonLd data={aboutLd} />
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-text/55">
        <span className="text-accent">&gt;</span> About
      </p>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="shrink-0 border border-divider bg-surface p-1.5">
          <Image
            src={portrait}
            alt="Aghoghomena Akasukpe"
            width={160}
            height={200}
            priority
            placeholder="blur"
            sizes="160px"
            className="aspect-[4/5] w-32 object-cover object-top sm:w-40"
          />
        </div>
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

      <Testimonials className="mt-12" />

      <AboutDetails />
    </div>
  );
}
