"use client";

import { SelectedWork } from "@/components/sections/SelectedWork";
import { Research } from "@/components/sections/Research";
import { WritingTeaser } from "@/components/sections/WritingTeaser";
import { AgentDemo } from "@/components/sections/AgentDemo";
import { ContactSection } from "@/components/sections/ContactSection";
import { AboutDetails } from "@/components/sections/AboutDetails";
import { Terminal } from "@/components/interactive/Terminal";
import { ABOUT_NARRATIVE } from "@/content/site";

// Playful "trash" easter egg: positioning noise this site deliberately let go.
const DEPRECATED = [
  "job titles that describe a box instead of the work",
  "positioning that buries the build under the buzzword",
  "walls of jargon where a plain sentence would do",
];

// Every app reuses the EXISTING section component as its window body (no
// forked copy). The .os-window-body CSS neutralizes the <Section> page
// padding so the real components read correctly inside a window.

export type AppId =
  | "about"
  | "work"
  | "writing"
  | "research"
  | "agent"
  | "shell"
  | "contact"
  | "readme"
  | "trash"
  | "resume"
  | "exit";

export type OsApp = {
  id: AppId;
  /** Playful engineer "filename" shown under the desktop icon. */
  file: string;
  /** Window title (mono, in the title bar). */
  title: string;
  /** Maps a URL hash to this app for deep-link opening. */
  hash?: string;
} & (
  | { kind: "window"; w: number; h: number; Body: React.ComponentType }
  /** Side effects (resume viewer / leaving OS mode), not windows. */
  | { kind: "action"; action: "resume" | "exit" }
);

function Pane({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.125em] text-text/60">
        <span className="mr-2 text-accent">&gt;</span>
        {heading}
      </p>
      {children}
    </div>
  );
}

function AboutApp() {
  return (
    <Pane heading="whoami">
      <div className="mb-6 space-y-3 text-sm text-text/75">
        {ABOUT_NARRATIVE.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
      <AboutDetails flush showResume={false} />
    </Pane>
  );
}

function ShellApp() {
  return (
    <Pane heading="agent shell">
      <Terminal />
    </Pane>
  );
}

function ReadmeApp() {
  return (
    <Pane heading="readme.txt">
      <div className="space-y-3 font-mono text-sm leading-relaxed text-text/80">
        <p>
          You are in <strong className="text-text">desktop mode</strong>: a
          playful skin over the same site. Every section is an app. Same
          content, different shell.
        </p>
        <p>
          Double-click (or focus and press Enter) a desktop icon to open its
          window. Drag a window by its title bar. Press Escape to close the
          focused window.
        </p>
        <p>
          Want the normal site back? Open{" "}
          <span className="text-accent">exit</span>, use the
          &quot;Go&quot; menu, or the &quot;Website mode&quot; button. Your
          choice is remembered.
        </p>
        <p className="text-text/70">
          Nothing here is a real OS. No files, no tracking, no sound.
        </p>
      </div>
    </Pane>
  );
}

function TrashApp() {
  return (
    <Pane heading="deprecated.txt">
      <ul className="space-y-3 text-sm text-text/75">
        {DEPRECATED.map((pt) => (
          <li key={pt} className="flex gap-2">
            <span className="text-accent" aria-hidden>
              &gt;
            </span>
            <span>{pt}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 font-mono text-xs text-text/65">
        Filed under trash on purpose. Out with the noise.
      </p>
    </Pane>
  );
}

export const OS_APPS: OsApp[] = [
  {
    id: "about",
    file: "whoami.sh",
    title: "whoami.sh",
    kind: "window",
    w: 760,
    h: 560,
    hash: "#about",
    Body: AboutApp,
  },
  {
    id: "work",
    file: "work/",
    title: "work/ · selected work",
    kind: "window",
    w: 820,
    h: 560,
    hash: "#selected-work",
    Body: SelectedWork,
  },
  {
    id: "writing",
    file: "writing.log",
    title: "writing.log",
    kind: "window",
    w: 720,
    h: 480,
    hash: "#writing",
    Body: WritingTeaser,
  },
  {
    id: "research",
    file: "research.bib",
    title: "research.bib",
    kind: "window",
    w: 760,
    h: 520,
    hash: "#research",
    Body: Research,
  },
  {
    id: "agent",
    file: "agent.run",
    title: "agent.run",
    kind: "window",
    w: 720,
    h: 520,
    hash: "#agent-demo",
    Body: AgentDemo,
  },
  {
    id: "shell",
    file: "shell",
    title: "shell · agent terminal",
    kind: "window",
    w: 640,
    h: 440,
    Body: ShellApp,
  },
  {
    id: "contact",
    file: "contact.eml",
    title: "contact.eml",
    kind: "window",
    w: 800,
    h: 560,
    hash: "#contact",
    Body: ContactSection,
  },
  {
    id: "readme",
    file: "readme.txt",
    title: "readme.txt",
    kind: "window",
    w: 520,
    h: 420,
    Body: ReadmeApp,
  },
  {
    id: "trash",
    file: "trash",
    title: "trash · deprecated",
    kind: "window",
    w: 520,
    h: 380,
    Body: TrashApp,
  },
  {
    id: "resume",
    file: "resume.pdf",
    title: "resume.pdf",
    kind: "action",
    action: "resume",
  },
  {
    id: "exit",
    file: "exit",
    title: "exit",
    kind: "action",
    action: "exit",
  },
];

export const APP_BY_ID: Record<AppId, OsApp> = Object.fromEntries(
  OS_APPS.map((a) => [a.id, a]),
) as Record<AppId, OsApp>;
