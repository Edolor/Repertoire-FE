# BUILD PROMPT: "Desktop OS" alternate mode for aghoghomena.com

You are implementing a new feature in an existing Next.js 15 portfolio
(`Repertoire-FE`). Read this entire file first. **Read `CLAUDE.md` in the
repo root before writing code** — it contains hard rules (strict CSP, no em
dashes, the verify gate, the design system, the data layer) that override
any default and that you MUST follow. This prompt restates the important
ones, but CLAUDE.md is authoritative.

This is an additive feature. Do not rewrite the existing site. Do not
modify the backend.

---

## 1. What you are building (one sentence)

An **opt-in, full-screen "desktop operating system" alternate skin** of the
existing portfolio: the visitor clicks a button to switch from the normal
document site into a playful faux-OS where each section of the site becomes
an app the user opens into draggable windows, with a desktop of icons, a
menu/taskbar, and popups, and a button to switch back. The choice persists.

## 2. The inspiration (study this, do not copy it)

The reference is **posthog.com**, whose homepage is itself a faux desktop
OS. Observed structure (you may re-verify by opening it in a browser, but
this is accurate as studied):

- The whole viewport is a **desktop**, not a scrolling document. A
  patterned wallpaper, no page scroll on the desktop itself.
- A **top menu bar** (macOS-style): a few dropdown menus (e.g. "Product
  OS", "Pricing", "Docs", "Company") plus a primary CTA pinned top-right.
- **Desktop icons** in columns down the left and right edges, each with a
  small glyph and a playful "filename" label (`home.mdx`, `customers.mdx`,
  `demo.mov`, `Docs`, `Trash`, and crucially **`Switch to website mode`**
  as its own desktop icon).
- Double-clicking an icon opens an **app window**: a titled chrome bar
  with min/zoom/close controls, a body that holds that section's real
  content, sometimes with its own toolbar (Zoom, Font) and internal
  tabs/sub-nav. Windows can overlap and be focused.
- A **mascot** and a cookie banner styled as an OS dialog.
- A persistent **"Switch to website mode"** that collapses the entire OS
  into a clean, conventional, scrolling marketing/doc site with the *same
  content*, plus a small toast confirming the switch, and a way back.

**You must build an analogous experience with this site's OWN identity.**
Do NOT use any PostHog asset, the hedgehog, their wallpaper, their icons,
their copy, or their trademarks. Use this repo's existing design system and
owned motif (see §4).

## 3. Decisions already made (do not re-litigate)

- **Entry: opt-in via a button.** The normal credible site stays the
  default. A clearly labeled control flips into OS mode. The mode choice
  **persists** (localStorage) and restores on next visit.
- **Scope: full-screen OS shell over the whole site.** Real app windows,
  desktop icons, a menu/taskbar, popups. App windows reuse the EXISTING
  section components' content (do not fork the content).
- **Mobile: graceful fallback.** Window-dragging is bad on touch. Below a
  breakpoint (use `1024px`), OS mode is unavailable: hide/disable the
  toggle and, if a persisted preference says "os" on a small screen,
  render the normal site anyway. Build the OS for pointer/desktop only. No
  separate touch OS.

## 4. Hard constraints (from CLAUDE.md — non-negotiable)

1. **Strict CSP.** `default-src 'self'`, no `unsafe-eval` in production.
   No `eval`, no `new Function`, no runtime code loading, no third-party
   scripts/assets. Everything same-origin. Inline `<script>` is only for
   the existing theme/JSON-LD pattern.
2. **No em dashes anywhere in any copy or UI string.** Use colons, commas,
   parentheses, or separate sentences. Before finishing, grep `—` across
   `src` and remove every hit you introduced.
3. **Owned motif only.** The `>` prompt is the section/list anchor glyph;
   the blinking block cursor (`@/components/primitives/Cursor`) appears
   only inside interactive modules. Reuse design tokens (`bg text surface
   divider accent accent-2 accent-3 accent-fg`), the dashed-divider
   primitive, KoHo + JetBrains Mono fonts. The OS chrome should look like
   *this site's* engineering-spec aesthetic rendered as an OS (mono
   labels, dashed/1px borders, the two accents), NOT like macOS or
   Windows or PostHog.
4. **Light AND dark.** Both themes are first-class. The OS must look
   correct in both (it reads `.dark` on `<html>` via the existing
   `ThemeContext`). Do not hardcode colors; use the token classes.
5. **`prefers-reduced-motion`.** All window open/close/drag motion must be
   reduced or disabled when the user prefers reduced motion. Sound off
   (there is none; keep it that way).
6. **Accessibility.** Real `<button>`s, focus rings, `aria-label`s, focus
   trap inside a focused/modal window, Escape closes the focused window,
   keyboard reachable (icons are buttons; Enter/Space "opens"). Windows
   use `role="dialog"` with an accessible name. The whole OS must be
   operable from the keyboard, not only mouse drag.
7. **Supply chain.** Prefer zero new dependencies. If a tiny drag library
   is truly needed, exact-pin it, justify it in one line, and prefer
   hand-rolled pointer-event dragging (it is ~40 lines and avoids a dep).
   Do not add a windowing framework.
8. **Verify gate.** `npm run lint && npm run build && npm run smoke` must
   be green. Extend `tests/smoke/` with specs for this feature (see §9).
   A green build does NOT prove client code works; this feature is almost
   entirely client-only, so smoke is mandatory.
9. **Commits:** branch off `master`, natural messages, never the word
   "CLAUDE", never commit `CLAUDE.md`. Do not push unless asked.

## 5. Architecture to follow

- New code under `src/components/os/`. A single client provider
  `OsModeProvider` (wrap it high, e.g. inside `src/app/(root)/layout.tsx`,
  around the existing tree) exposes `useOsMode(): { enabled, enable,
  disable, toggle }`. Persist to `localStorage` key `os-mode` and add an
  anti-FOUC inline read in `src/app/layout.tsx` (mirror the existing theme
  script pattern: it is inline, CSP-safe via existing `'unsafe-inline'`)
  so OS mode does not flash the normal site first. Respect the 1024px
  guard in the script (never enable OS on small viewports).
- When `enabled` and viewport is desktop: render the OS shell as a
  `position: fixed` full-viewport layer ABOVE the normal site, and set
  the normal document non-scrolling/inert behind it (or simply do not
  render the normal `<main>` while OS is on — your call, but keep one
  source of content; see next point).
- **Reuse existing section components for window bodies.** Each app window
  renders an existing component, e.g. window "selected-work" renders
  `<SelectedWork/>`, "writing" renders a list from `@/lib/content`,
  "about" renders `<AboutDetails/>` + narrative, "research"
  `<Research/>`, "contact" `<ContactSection/>`, "terminal" `<Terminal/>`,
  "agent" `<AgentExplorable/>`, "resume" triggers `useResume().open()`.
  Do not duplicate copy; import and render the real components inside a
  scrollable window body. Strip their outer `Section` padding where it
  looks wrong inside a window (add a prop or a wrapper; do not fork).
- The toggle button: place one in the existing `Header` ("Desktop mode")
  AND expose a desktop icon "exit to website" inside the OS. Also add a
  Command Palette action ("Toggle desktop mode") via the existing
  `CommandPalette` items list.

## 6. OS shell spec (build exactly this set)

- **Desktop**: full-viewport token-themed surface with a subtle
  `graph-paper` background (class already exists in globals.css). No page
  scroll. A small, owned mascot/glyph is optional and must be original
  (e.g. a mono `▮` "agent" sprite); NO hedgehog.
- **Icons**: a column of desktop icons (real `<button>`s) with a mono
  label each, using playful engineer "filenames" that map to sections:
  `whoami.sh` → About, `work/` → Selected work, `writing.log` → Writing,
  `research.bib` → Research, `agent.run` → Agent demo, `shell` →
  Terminal, `resume.pdf` → Resume, `contact.eml` → Contact, and
  `exit →` → leave OS mode. Single click focuses, Enter/double-click
  opens. Keyboard: arrow-key roving focus is a nice-to-have, not required;
  Tab order is required.
- **Menu/taskbar**: a top bar with the wordmark (`aa▮`), a couple of
  dropdown menus (e.g. "Go" listing all apps, "View" with light/dark
  toggle reusing `useTheme().toggle`, "Help" with a short "what is this"),
  and a pinned primary CTA on the right ("Work with me" → opens the
  contact/engagement window). A taskbar strip listing open windows that
  re-focuses/restores them on click.
- **Windows**: a `Window` component. Title bar (mono) with the app name,
  buttons: minimize (to taskbar), maximize/restore, close. Draggable by
  the title bar via pointer events (hand-rolled; clamp within viewport).
  Focused window raises z-index and gets an accent border; others dim
  slightly. Resizable is optional; if skipped, pick sensible default
  sizes and a max-height with internal scroll. Opening animates
  (scale/opacity) unless reduced-motion. `role="dialog"`,
  `aria-label={appName}`, Escape closes, focus trapped while focused,
  focus returns to the launching icon on close.
- **Popups**: at least one genuinely useful popup, e.g. a first-run
  "readme.txt" window explaining this is an alternate skin and how to
  exit, shown once (localStorage flag). Optionally a "trash" icon that is
  a tasteful joke but still functional (e.g. opens an anti-pitch note).
- **Switch back**: prominent, never hidden. The `exit →` icon, a menu
  item, and the Header button all call `disable()`. Show a brief toast
  ("switched to website mode") using an existing/owned toast pattern (no
  new dep; a token-styled fixed div that auto-dismisses).
- **Content parity**: every section reachable in the normal site must be
  reachable in OS mode. No dead ends. Deep links: opening the site at
  `/#contact` etc. while OS is on should open the matching window.

## 7. Reduced/again constraints checklist (verify each before done)

- [ ] Works in light and dark; no hardcoded hex outside tokens.
- [ ] No em dashes anywhere (grep clean).
- [ ] No new CSP exception; no eval; no third-party asset.
- [ ] `prefers-reduced-motion` disables window/drag animation.
- [ ] Keyboard: open icon, operate window, Escape to close, Tab trapped.
- [ ] < 1024px never shows OS (toggle hidden/guarded, persisted pref
      ignored on small screens).
- [ ] No new runtime dependency (or one pinned + justified).
- [ ] Existing normal site unchanged when OS mode is off.
- [ ] No PostHog/hedgehog/third-party imagery or copy.

## 8. Persistence & SSR

- localStorage key `os-mode` = `"os" | "site"`. Default `"site"`.
- Anti-FOUC inline script in `src/app/layout.tsx` sets a class (e.g.
  `os-mode`) on `<html>` early, guarded by `window.innerWidth >= 1024`.
  Add `suppressHydrationWarning` reasoning consistent with the existing
  theme script (the `<html>` already has it).
- The OS shell is `"use client"`. The normal site still SSRs. Never render
  the OS on the server (gate on a mounted flag) to avoid hydration
  mismatch; the inline script prevents the flash in the meantime.

## 9. Testing (mandatory, extend `tests/smoke/`)

Add `tests/smoke/os-mode.spec.ts` using the existing
`trackPageErrors`/`assertNoErrors` helpers. Cover, with NO console/page
errors:

1. Toggle on from the Header button → OS desktop visible (assert a
   desktop icon, e.g. `work/`, is visible). Use a 30s first-paint timeout
   (dev cold-compile; see CLAUDE.md smoke gotcha).
2. Open an app: activate the `work/` icon → a `role="dialog"` window with
   the selected-work heading appears.
3. Escape (or close button) closes the focused window.
4. `exit →` (or Header button) returns to the normal site; assert a
   normal-site element (e.g. the hero heading) is visible again.
5. Reload with OS persisted → still in OS mode (desktop visible).
6. Set a narrow viewport (e.g. 390px) → OS toggle not available and the
   normal site renders even if `os-mode` is persisted.

Keep the existing 12 specs green. Run the full `npm run verify`. If the
suite looks uniformly broken, kill a stale server on :3000 and re-run
(see CLAUDE.md). Report honestly what smoke did and did not exercise.

## 10. Definition of done

- The feature works as specified, opt-in, persisted, desktop-only with
  mobile fallback, content parity, keyboard + reduced-motion + a11y, both
  themes.
- `npm run verify` green; `tests/smoke/os-mode.spec.ts` added and passing;
  existing specs still passing; `npm audit` clean.
- No em dashes; no CSP exception; no PostHog asset; no backend change.
- Committed on a branch off `master` with a natural message (no "CLAUDE"),
  `CLAUDE.md` not committed, not pushed.
- A short written report: what was built, what smoke exercised and what it
  did not, and any open follow-ups.

## 11. Do NOT

- Do not make OS mode the default or remove the normal site.
- Do not fork section copy/content; render the existing components.
- Do not add a windowing/drag framework or any third-party asset.
- Do not weaken the CSP, add `eval`, or load remote code.
- Do not use a hedgehog or any PostHog/third-party asset, icon, or text.
- Do not use em dashes.
- Do not claim done on a green build alone; smoke the client flows.
