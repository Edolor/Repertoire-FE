import type { AppId } from "./osApps";

// Hand-drawn, single-stroke line icons (owned: no third-party art, no
// dependency). They inherit color via `currentColor` so they read in both
// themes, and scale to any size for the desktop / menu bar / taskbar.

const PATHS: Record<AppId, React.ReactNode> = {
  // identity: head + shoulders
  about: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5" />
    </>
  ),
  // folder
  work: (
    <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2.2h7A1.5 1.5 0 0 1 19 8.7v8.8A1.5 1.5 0 0 1 17.5 19h-13A1.5 1.5 0 0 1 3 17.5z" />
  ),
  // document with text lines
  writing: (
    <>
      <path d="M6 3.5h7.5L18 8v12.5H6z" />
      <path d="M13 3.5V8h5" />
      <path d="M8.5 12h7M8.5 15h7M8.5 18h4" />
    </>
  ),
  // open book
  research: (
    <>
      <path d="M12 6.5C10.5 5.3 8.3 4.8 5 5v12c3.3-.2 5.5.3 7 1.5 1.5-1.2 3.7-1.7 7-1.5V5c-3.3-.2-5.5.3-7 1.5z" />
      <path d="M12 6.5v12" />
    </>
  ),
  // chip with a run/play triangle
  agent: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2" />
      <path d="M10.5 9.5l4 2.5-4 2.5z" />
    </>
  ),
  // terminal window  >_
  shell: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
      <path d="M7 10l3 2.5-3 2.5M12.5 15h4.5" />
    </>
  ),
  // envelope
  contact: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  // info disc
  readme: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v6" />
      <circle cx="12" cy="7.8" r="0.6" fill="currentColor" />
    </>
  ),
  // trash can
  trash: (
    <>
      <path d="M5 7h14M10 7V5h4v2M6.5 7l1 12.5h9L17.5 7" />
      <path d="M10 10.5v6M14 10.5v6" />
    </>
  ),
  // open document being read (reader window)
  reader: (
    <>
      <path d="M6 3.5h7.5L18 8v12.5H6z" />
      <path d="M13 3.5V8h5" />
      <path d="M8.5 11.5h7M8.5 14.5h7M8.5 17.5h4" />
    </>
  ),
  // badged document (resume)
  resume: (
    <>
      <path d="M6 3.5h7.5L18 8v12.5H6z" />
      <path d="M13 3.5V8h5" />
      <circle cx="10" cy="12" r="1.8" />
      <path d="M7.5 18c.4-2 1.4-3 2.5-3s2.1 1 2.5 3" />
      <path d="M13.5 12h2.5M13.5 15h2.5" />
    </>
  ),
  // logout: arrow leaving a frame
  exit: (
    <>
      <path d="M13 4.5H6.5A1.5 1.5 0 0 0 5 6v12a1.5 1.5 0 0 0 1.5 1.5H13" />
      <path d="M15 8.5l3.5 3.5L15 15.5M9.5 12h9" />
    </>
  ),
};

export function OsIcon({
  id,
  className,
}: {
  id: AppId;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[id]}
    </svg>
  );
}
