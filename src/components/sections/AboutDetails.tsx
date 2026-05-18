"use client";

import { useState } from "react";
import Image from "next/image";
import { useAboutQuery } from "@/hooks/useQueries";
import { useResume } from "@/context/ResumeContext/ResumeContext";
import { Button } from "@/components/ui/Button";
import type {
  BaseExperienceProps,
  BaseHonourProps,
} from "@/types/About.types";

// Google Drive banner, served through Next's image optimizer: Next fetches
// it server-side (following Drive's redirect) and re-serves it same-origin,
// so it is immune to client CSP / cross-origin redirect issues. Still fails
// closed: a fetch failure drops the image and the text card stands alone.
function Banner({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);
  if (!src || !ok) return null;
  return (
    <Image
      src={src}
      alt={alt}
      width={640}
      height={420}
      loading="lazy"
      onError={() => setOk(false)}
      sizes="(max-width: 640px) 90vw, 320px"
      className="mb-3 max-h-44 w-full border border-divider bg-bg object-contain p-1"
    />
  );
}

function ExperienceList({ items }: { items: BaseExperienceProps[] }) {
  if (items.length === 0)
    return <p className="text-sm text-text/50">Nothing here yet.</p>;
  return (
    <ul className="divide-y divide-divider border-y border-divider">
      {items.map((e, i) => (
        <li key={`${e.institution}-${i}`} className="py-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-bold">{e.institution}</p>
            <p className="font-mono text-xs text-text/50">
              {e.start_date} to {e.end_date ?? "present"}
            </p>
          </div>
          <p className="font-mono text-xs text-text/55">{e.location}</p>
          <p className="mt-2 text-sm text-text/75">{e.about}</p>
        </li>
      ))}
    </ul>
  );
}

function HonourList({ items }: { items: BaseHonourProps[] }) {
  if (items.length === 0)
    return <p className="text-sm text-text/50">Nothing here yet.</p>;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((h, i) => (
        <li
          key={`${h.title}-${i}`}
          className="border border-divider bg-surface p-4"
        >
          <Banner src={h.banner} alt={`${h.title}: ${h.about}`} />
          <p className="font-bold">{h.title}</p>
          {h.sub_about && (
            <p className="font-mono text-xs text-text/55">{h.sub_about}</p>
          )}
          <p className="mt-2 text-sm text-text/70">{h.about}</p>
          <p className="mt-2 font-mono text-[11px] text-text/45">
            {h.issue_date}
            {h.certification_no && (
              <span> · ID {h.certification_no}</span>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function AboutDetails({
  showResume = true,
  flush = false,
}: {
  showResume?: boolean;
  // flush: drop the top margin (used inside the popup, which has its own
  // header and padding).
  flush?: boolean;
}) {
  const { data, isLoading, isError, refetch } = useAboutQuery();
  const { open } = useResume();

  return (
    <div className={flush ? "" : "mt-12"}>
      {showResume && (
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={open} variant="outline">
            Open resume
          </Button>
        </div>
      )}

      {isLoading && (
        <p className="mt-10 font-mono text-sm text-text/50" aria-live="polite">
          &gt; loading experience &amp; honours…
        </p>
      )}

      {isError && (
        <div className="mt-10 border border-accent/40 bg-accent/5 p-4 font-mono text-sm">
          <p className="text-accent">
            &gt; could not load experience &amp; honours.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 border border-divider px-3 py-1 text-text/70 hover:bg-surface"
          >
            retry
          </button>
        </div>
      )}

      {data && (
        <div className="mt-10 space-y-12">
          <section aria-labelledby="exp-h">
            <h2 id="exp-h" className="text-2xl font-bold">
              Experience
            </h2>
            <div className="mt-4">
              <ExperienceList items={data.experiences} />
            </div>
          </section>
          <section aria-labelledby="edu-h">
            <h2 id="edu-h" className="text-2xl font-bold">
              Education
            </h2>
            <div className="mt-4">
              <ExperienceList items={data.education} />
            </div>
          </section>
          <section aria-labelledby="awd-h">
            <h2 id="awd-h" className="text-2xl font-bold">
              Awards
            </h2>
            <div className="mt-4">
              <HonourList items={data.awards} />
            </div>
          </section>
          <section aria-labelledby="cert-h">
            <h2 id="cert-h" className="text-2xl font-bold">
              Certifications
            </h2>
            <div className="mt-4">
              <HonourList items={data.certifications} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
