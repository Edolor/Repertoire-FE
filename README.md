# aghoghomena.com

Personal portfolio for Aghoghomena Akasukpe — a Systems & Full-Stack Engineer.
An "engineering-spec" site (warm-paper / charcoal, mono accents, 1px borders,
graph-paper) with a custom motion system, an interactive agent-graph hero, and
an opt-in "desktop OS" alternate skin.

**Stack:** Next.js 15 (App Router) · React 18 · TypeScript · Tailwind CSS ·
Velite (MDX content) · Lenis (smooth scroll) · Vitest (unit) + Playwright
(e2e/smoke). No animation-library dependency — motion is a small custom spring
engine (`src/lib/spring.ts`) + CSS + IntersectionObserver.

## Commands

```bash
npm run dev      # Dev server on http://localhost:3000 (prebuild compiles content via velite)
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint (also runs inside `next build`)
npm run content  # Compile MDX content (velite) — runs automatically in pre{dev,build}
npm test         # Vitest unit tests (src/**/*.test.ts{,x})
npm run smoke    # Playwright smoke/e2e tests (see Testing)
npm run verify   # lint + unit tests + build + smoke
```

> Windows note: `next dev` and `next build` both write `.next` and will clash if
> run together. Stop the dev server before building. If you see an `ENOENT
> .next/routes-manifest.json` 500 in dev after a build, delete `.next` and
> restart dev.

## Testing

Two layers:

- **Unit (Vitest)** — co-located `src/**/*.test.ts(x)`, jsdom environment.
  Cover the pure logic: the spring engine, SEO/JSON-LD builders, sanitizers,
  date/`cn`/contact-schema, the recover/scroll-lock/lenis/toast/sound helpers,
  and the hooks (`useReducedMotion`, `useActiveSection`). Run `npm test` (or
  `npm run test:watch`). Vitest config: `vitest.config.ts` (alias `@` → `src`,
  `#content` → the velite output).
- **Smoke / e2e (Playwright)** — `tests/smoke/`, Chromium. Loads the running app
  and **fails on any uncaught page or console error**, catching client-only
  issues a `next build` can't. `reuseExistingServer` reuses a running
  `npm run dev` outside CI. Includes a regression that **desktop-mode windows
  scroll with the wheel/gesture** (see Motion & scroll).

```bash
npm test                                        # all unit tests
npx vitest run src/lib/spring.test.ts           # one unit file
npm run smoke                                    # all smoke tests
npx playwright test tests/smoke/os-mode.spec.ts  # one smoke file
```

Add a unit test next to any new pure module, and a smoke spec per user-facing
flow. Smoke assertions reference real copy in `src/content/site.ts` — update
them when that copy changes.

## Structure

- `src/app/(root)/` — route group with the shared Header/Footer layout. Pages:
  home (`page.tsx`), `/work`, `/research`, `/about`, `/writing` (+ `/work/[slug]`,
  `/writing/[slug]` detail routes).
- `src/components/` — `sections/` (home sections), `work/` + `research/` (shared
  grids reused by pages and the OS skin), `primitives/`, `ui/`, `interactive/`,
  `layout/`, `os/` (the desktop skin), `command/`.
- `src/content/` — `site.ts` (verified, NDA-sensitive copy — single source of
  truth) and MDX in `content/work` / `content/posts`.
- `src/lib/` — `spring.ts` (motion core), `seo.ts` (JSON-LD), `lenis.ts`,
  `scroll-lock.ts`, `recover.ts` (stale-deploy recovery), `og.tsx`.
- `tests/smoke/` — Playwright specs. Unit tests are co-located in `src/`.

## Motion & scroll (key patterns)

- **Spring engine** (`src/lib/spring.ts`): `Spring` (stiffness/damping/mass) +
  self-parking `rafLoop` + `SPRINGS` presets. Used by Tilt/Magnetic/ScrollProgress.
- **Reduced-motion / reduced-data**: every animation disables under
  `prefers-reduced-motion`; heavy decorative layers are tagged `.decor-heavy`
  and removed under `prefers-reduced-data`.
- **Lenis ↔ overlays**: Lenis hijacks the wheel, so overlays use
  `useScrollLock` (pauses Lenis for the backdrop) **and** `data-lenis-prevent`
  (so the modal still scrolls natively). The back-to-top control wakes Lenis'
  parked loop before `scrollTo`.
- **Lenis ↔ desktop OS skin**: `SmoothScroll` tears Lenis down whenever OS mode
  is active (reacts to `useOsMode().active`); the OS shell is also
  `data-lenis-prevent`. Without this, Lenis' wheel listener swallows gesture
  scroll inside OS windows — covered by `tests/smoke/os-mode.spec.ts`.

## Deploy

Pushed to `master` on GitHub; the host builds from the remote. No CI config in
the repo (dashboard-connected). Stale-deploy chunk errors auto-recover (one
hard reload) via `src/lib/recover.ts` + styled `error`/`global-error` pages.
