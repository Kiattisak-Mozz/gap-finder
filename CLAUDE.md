# CLAUDE.md

Guidance for Claude / AI assistants working in this repo. Keep it short and current.

## What this is

**Gap Finder** — an AI opportunity dashboard for finding, prioritising, and deciding on
passive-income business gaps (Thai / SEA / global). Phase 1 is hardcoded data; it grows toward
live scanning agents. See `PRODUCT.md` for intent and `DESIGN.md` for the visual system.

## Stack

- **React 18** + **Vite 5**, **react-router-dom 7**
- **Tailwind CSS 3** (config in `tailwind.config.js`) + CSS custom properties in `src/index.css`
- **GSAP** for motion, **lucide-react** for icons
- No TypeScript, no test runner, no linter, **no CI** configured yet

## Commands

```bash
npm run dev      # vite dev server (HMR)
npm run build    # production build — use this as the correctness gate (no tests exist)
npm run preview  # serve the built dist/
```

There is no `lint` or `test` script. After changes, run `npm run build` and confirm exit 0.

## Project shape

```
src/
  main.jsx                  # providers: Router > Theme > Language > App
  App.jsx                   # routes
  index.css                 # design tokens (OKLCH), base, utilities, motion, reduced-motion
  theme/ThemeContext.jsx    # useTheme(): isDark + toggle, persisted (gap-theme), .dark class
  i18n/LanguageContext.jsx  # useLang(): lang/t/localize/toggle, persisted (gap-lang), default th
  components/layout/        # Layout, Sidebar, TopBar  ← canonical app shell
  pages/                    # Dashboard, Opportunities, Scanner, Projects, Plugins
  data/opportunities.js     # hardcoded Phase 1 data (bilingual fields: title/titleEn, gap/gapEn)
```

## Important: design-system migration status

All routed pages are migrated to the new design system — `pages/Dashboard.jsx`, plus
`Opportunities`, `Scanner`, `Projects`, `Plugins` — using cobalt/cyan OKLCH tokens,
Playpen/Anuphan/Mono fonts, i18n, responsive, and the shared decision vocabulary. Shared
primitives live in `components/ui/`: `DecisionChip`, `PageHeader` (and the config in
`data/decision.js`). The app shell is `components/layout/`.

Legacy/unused leftovers (safe-delete candidates, confirm first): `src/pages/Dashboard.jsx.bak`,
`src/components/Sidebar.jsx` (duplicate of `layout/Sidebar.jsx`), and the older root
`components/*` files no longer imported by any page (`Header`, `StatsRow`, `FeaturedCard`,
`OpportunityCard`, `RightPanel`, `ProjectTable`, `RevenueWidget`, `StatChart`, `PluginBar`,
`QuickActions`, `TopBar`, and unused `components/ui/*` like `Card`, `SegmentedBar`, `DonutChart`).

## Conventions

- **Tokens, not hex.** Style with `var(--token)` from `index.css`; both themes are defined
  there. Don't hardcode colors in components.
- **Fonts**: one family, **Noto Sans Thai**, everywhere (display/body/mono). Hierarchy via
  weight + size, not typeface switching. `.tnum` for aligned figures.
- **i18n**: every user string goes through `t('key')`; add the key to both `th` and `en` in
  `LanguageContext.jsx`. Unit-bearing data uses `localize(value, field)`.
- **Bilingual data**: read `lang === 'en' ? opp.titleEn : opp.title` (and `gapEn`/`gap`).

## Pitfalls learned the hard way (don't repeat)

- **GSAP + React 18 StrictMode**: a bare `gsap.from(el, {opacity:0})` can leave the element
  stuck at `opacity:0` after the double mount. Wrap in `gsap.context(..., ref)` + `ctx.revert()`,
  and/or set `clearProps: 'opacity,transform'`.
- **Never gate visibility on ScrollTrigger here.** The page scrolls inside
  `<main overflow-y-auto>`, not the window, so a default (window-scoped) trigger never fires and
  the section renders blank. Animate on mount with `clearProps` instead.
- **SVG dot animation**: animate `opacity`, not `scale` — GSAP scales SVG around its own matrix
  origin and visually displaces the dots.
- **`key` is a reserved prop**: don't name a data field `key` and spread it into a component
  (`{...item}`) — React consumes it. Use e.g. `labelKey`.
- **NavLink `to="#"`** is considered active on every route → permanent highlight. Gate active
  styling on a real route (`isActive && to !== '#'`).
- **Tailwind `font-sans` on a wrapper** can serve a stale generated value from the dev server;
  rely on the `body` font-family instead.
- **Dev-server staleness**: after editing `tailwind.config.js` or hitting an HMR error cascade,
  restart the dev server rather than trusting hot reload.
- **Contrast checks**: `getComputedStyle` may return raw `oklch()`; paint to a 1×1 canvas to get
  sRGB before computing ratios.

## Git

Default branch is `master`. Commit/push only when asked. No hooks; commits run nothing.
