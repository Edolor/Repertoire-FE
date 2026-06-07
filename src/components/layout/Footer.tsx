import Link from "next/link";
import { PERSON, NAV } from "@/content/site";
import { CopyButton } from "@/components/primitives/CopyButton";
import { SoundToggle } from "@/components/primitives/SoundToggle";

export function Footer() {
  return (
    <footer className="border-t border-divider">
      <div className="mx-auto grid max-w-content gap-8 px-5 py-12 sm:grid-cols-2 sm:px-8">
        <div>
          <p className="font-mono text-sm text-text/70">
            <span className="text-accent">&gt;</span> {PERSON.name}
          </p>
          <p className="mt-2 max-w-sm text-pretty text-sm text-text/60">
            {PERSON.role}. Building agent systems and breaking them.
          </p>
          {/* Hiring + peer paths: never funneled through the contact form. */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm">
            <span className="inline-flex items-center gap-1.5">
              <a
                href={`mailto:${PERSON.email}`}
                className="link-underline text-accent-2"
              >
                {PERSON.email}
              </a>
              <CopyButton value={PERSON.email} label="email" />
            </span>
            <a
              href={PERSON.github}
              target="_blank"
              rel="noreferrer"
              className="link-underline text-text/70 hover:text-text"
            >
              GitHub
            </a>
            <a
              href={PERSON.linkedin}
              target="_blank"
              rel="noreferrer"
              className="link-underline text-text/70 hover:text-text"
            >
              LinkedIn
            </a>
            <a
              href={PERSON.resume}
              target="_blank"
              rel="noreferrer"
              className="link-underline text-text/70 hover:text-text"
            >
              Resume
            </a>
            <Link href="/feed.xml" className="link-underline text-text/70 hover:text-text">
              RSS
            </Link>
          </div>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-col gap-2 font-mono text-sm sm:items-end"
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="link-underline text-text/70 transition-[font-weight] hover:font-semibold hover:text-text"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/research"
            className="link-underline text-text/70 transition-[font-weight] hover:font-semibold hover:text-text"
          >
            Research
          </Link>
        </nav>
      </div>
      <div className="border-t border-divider">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-5 py-5 font-mono text-xs text-text/50 sm:px-8">
          <p>
            © {new Date().getFullYear()} {PERSON.name}. This site is software you
            can poke: press{" "}
            <span className="border border-divider px-1">&#8984;K</span>.
          </p>
          <SoundToggle />
        </div>
      </div>
    </footer>
  );
}
