/**
 * The home page's in-page sections, in render order — the single source of
 * truth for: the section rail (SectionRail), the active-section observer, and
 * the oversized index watermark each <Section> draws. Reorder here and the
 * numbers + rail follow, instead of hand-syncing three places (which is what
 * drifted during the page split).
 *
 * `hero` is listed for the rail but is intentionally unnumbered, so the
 * numbered sections run 01..N starting at the first section after the hero.
 */
export const HOME_SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "how-i-build", label: "How I build" },
  { id: "about", label: "About" },
  { id: "selected-work", label: "Work" },
  { id: "agent-demo", label: "Agent loop" },
  { id: "writing", label: "Writing" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[number]["id"];

/**
 * Positional, zero-padded index for a home section's watermark (hero is
 * unnumbered). Returns undefined for any id not in the home list, so non-home
 * sections simply render without a number.
 */
export function sectionNumber(id: string): string | undefined {
  const i = HOME_SECTIONS.findIndex((s) => s.id === id) - 1; // hero is unnumbered
  return i >= 0 ? String(i + 1).padStart(2, "0") : undefined;
}
