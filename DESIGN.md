# Gap Finder — Design System

Visual system for the Gap Finder dashboard. Source of truth lives in `src/index.css`
(CSS custom properties) and `tailwind.config.js`. Update this file when those change.

> Register: **product** (design serves the task). Bar: earned familiarity, decision-first,
> Thai + English as first-class. See `PRODUCT.md` for product intent.

---

## Color

Strategy: **Restrained + one committed accent.** Cool, instrument/command-center feel.
All colors authored in **OKLCH** as semantic tokens. Dark mode redefines the same token
names — never hardcode hex in components, reference the variables.

### Brand

| Role | Light | Dark | Use |
|---|---|---|---|
| `--primary` (cobalt) | `oklch(0.55 0.185 262)` | `oklch(0.68 0.155 262)` | CTAs, active nav, line chart, key numbers |
| `--on-primary` | near-white | dark ink | text/icons on a `--primary` fill |
| `--secondary` (cyan-teal) | `oklch(0.62 0.13 205)` | `oklch(0.72 0.11 205)` | chart area fill, secondary accents |

The cobalt + cyan pairing is the identity. **The product deliberately avoids green**
(the user rejected the original money-green theme). Do not reintroduce green as a brand or
status color.

### Neutrals (cobalt-tinted, hue 262)

`--bg`, `--surface`, `--surface-2`, `--border`, `--border-2`, `--text`, `--text-2`, `--muted`.
Light bg is a cool near-white; dark bg is a brand-tinted near-black (`oklch(0.165 0.018 262)`),
not pure black. Depth in dark mode comes from surface lightness, not heavy shadow.

### Decision vocabulary (BUILD / SCOPED / RESEARCH)

Each decision state has three tokens: `*-fill` (graphic/icon), `*-soft` (chip background),
`*-ink` (readable text on the soft background). **Never rely on color alone** — every status
shows icon + label + tint together.

| State | fill / soft / ink | Meaning |
|---|---|---|
| BUILD (`ready`) | `--build*` (cool teal) | ready to build now |
| SCOPED (`build`) | `--primary` / `--primary-soft` / `--scoped-ink` | in scope |
| RESEARCH (`research`) | `--park*` (slate-blue) | needs research |

Plus `--kill*` (rust-red) and `--warning` (amber) for destructive / warning semantics only.

### Hero tiles

Dark feature tiles (Top Opportunity, Income Tracker, sidebar app card) use
`--hero-grad` (a deep cobalt-ink gradient, neutral-dark in dark mode) with `--on-hero`
for text. Use `--on-hero`, never `--surface`, for text on hero tiles (surface flips dark in
dark mode and would vanish).

### Contrast

Target **WCAG AA**: body ≥ 4.5:1, large/UI ≥ 3:1. Decision-chip ink tokens are tuned so small
bold labels (~11px) clear 4.5:1 on their soft background in both themes. Verify with a canvas
luminance check (browsers may return raw `oklch()` from `getComputedStyle`, so paint to a
1×1 canvas to read sRGB before computing ratios).

---

## Typography

Three families, capped (display + body + mono). Loaded in `index.html` (`<link>`, not `@import`).

| Token | Family | Role |
|---|---|---|
| `--font-display` | **Playpen Sans Thai** | brand wordmark, headings (`h1–h3`, `.display`), big numbers |
| `--font-sans` | **Anuphan** | body, labels, data, table text (the default on `body`) |
| `--font-mono` | **JetBrains Mono** | tabular figures, the live timer (`.mono`) |

Pairing is contrast-axis (casual handwritten display + geometric Thai/Latin sans). Both
families carry full Thai + Latin glyphs (the content is bilingual). Headings use
`.display`; do not put the display font on dense labels or data.

Do **not** add a Tailwind `font-sans` utility on a wrapper to set the body font — the dev
server can serve a stale generated value. The body font is set once via
`body { font-family: var(--font-sans) }`; let it inherit.

---

## Layout

- App shell = two floating rounded cards (sidebar + content) on the page bg, gap + safe-area
  padding (`Layout.jsx`). Sidebar is fixed on `lg+`, a slide-in drawer below.
- Content well (`<main>`) uses `--bg` so the white/surface cards inside pop.
- Cards are used for genuinely discrete objects (an opportunity). The stat row is **one
  hairline-divided panel**, not four floating cards (earned density, no card-grid reflex).
- Breakpoints (Tailwind): `xs 400 · sm 640 · md 768 · lg 1024 · xl 1280`.
- z-index is semantic (`--z-dropdown … --z-toast`); the mobile search sheet uses `1300`.

### Responsive intent (not just scaling)

- **Top bar**: flexible search (`flex-1 max-w-[280px]`) that never overflows; on mobile the
  search collapses to an icon that opens a full-screen search sheet; mail icon hidden `<sm`;
  user pill → avatar-only `<sm`; right cluster is `ml-auto`.
- **Touch**: `@media (pointer: coarse)` gives primary controls / nav items / icon buttons a
  44px target (`.tap-44`, `aria-label` buttons). Tap feedback via `:active`, sticky-hover
  neutralised with `@media (hover: none)`.
- **Decision pipeline** (under the weekly chart): vertical list on phone, 3-up on `sm+`.
- **Weekly chart**: SVG line+area, width from a `ResizeObserver` so it scales without
  distorting strokes/dots.

---

## Motion

GSAP. Ease with exponential curves (`expo.out` / `power`), no bounce on UI.

- Entrances animate **on mount**, not gated on scroll. **Do not gate visibility on
  ScrollTrigger** — the page scrolls inside `<main overflow-y-auto>`, not the window, so a
  window-scoped trigger never fires and the section ships blank. Use `clearProps` so tweens
  settle to the visible default.
- Wrap component-local GSAP in `gsap.context(..., ref)` and `ctx.revert()` on cleanup, or set
  `clearProps`, so React 18 StrictMode's double-invoke doesn't leave inline `opacity:0` /
  transforms stuck.
- Animate SVG dots with **opacity**, not `scale` — GSAP scales SVG around its own matrix
  origin (CSS `transform-box` doesn't help) and displaces them.
- Every animation is gated behind a `reduceMotion()` check, and CSS has a global
  `prefers-reduced-motion: reduce` reset.

---

## Internationalisation

`src/i18n/LanguageContext.jsx` — `useLang()` gives `{ lang, t, localize, toggle }`, persisted
to `localStorage` (`gap-lang`), default **th**. UI strings live in the `dict`; data-driven
content uses `titleEn` / `gapEn` fields, and `localize()` mechanically converts units
(`/เดือน → /mo`, `ไทย → Thailand`). Add a key to both `th` and `en` when adding copy.

---

## Anti-slop guardrails honored here

No gradient text, no glassmorphism-by-default, no side-stripe borders, no per-section
uppercase eyebrows, no em dashes in copy. Status is never color-only. Featured items are
distinguished by content/order, not a colored ring.
