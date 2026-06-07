import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import portrait from "@/assets/img/mena.jpg";
import { ABOUT_NARRATIVE, PERSON } from "@/content/site";
import { fetchAbout } from "@/lib/queries";
import type { AboutProps } from "@/types/About.types";
import { Eyebrow } from "@/components/primitives/Eyebrow";
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

// Re-fetch the (slow-moving) about data at most hourly. Fetching on the server
// puts the experience/education/honours in the SSR HTML for crawlers and AEO,
// instead of behind a client spinner.
export const revalidate = 3600;

export default async function AboutPage() {
  // Fail-soft: if the API is unreachable at build/revalidate, fall back to the
  // client fetch inside AboutDetails (its existing loading/error UI).
  let initialAbout: AboutProps | undefined;
  try {
    initialAbout = await fetchAbout();
  } catch {
    initialAbout = undefined;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <JsonLd data={aboutLd} />
      <Eyebrow>About</Eyebrow>
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

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm">
        <Link href="/work" className="link-underline text-accent-2">
          Selected work &gt;
        </Link>
        <Link href="/research" className="link-underline text-accent-2">
          Research &amp; publications &gt;
        </Link>
        <Link href="/writing" className="link-underline text-accent-2">
          Writing &gt;
        </Link>
      </div>

      <Testimonials className="mt-12" />

      <AboutDetails initialData={initialAbout} />
    </div>
  );
}
