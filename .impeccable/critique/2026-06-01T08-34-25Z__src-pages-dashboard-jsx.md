---
target: Dashboard
total_score: 17
p0_count: 0
p1_count: 3
timestamp: 2026-06-01T08-34-25Z
slug: src-pages-dashboard-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Count-ups and badges communicate activity, but most actions give no success, loading, disabled, or empty-state feedback. |
| 2 | Match System / Real World | 3 | The opportunity language is useful and market-specific, though some labels drift between "gap", "project", "opportunity", and "income". |
| 3 | User Control and Freedom | 2 | Navigation exists, but cards and many action buttons do not expose clear back/undo/cancel states or predictable outcomes. |
| 4 | Consistency and Standards | 2 | The card vocabulary is consistent visually, but action controls, icons, button labeling, and metric meanings vary across the screen. |
| 5 | Error Prevention | 1 | "Add Gap", "Import Data", "Start Building", pause/stop, and card clicks have no guardrails, confirmation, or form/state constraints. |
| 6 | Recognition Rather Than Recall | 2 | Most navigation is labeled, but icon-only header buttons and arrow buttons require guessing. |
| 7 | Flexibility and Efficiency | 1 | No visible bulk actions, filters, sorting, keyboard shortcuts for dashboard work, or power-user paths beyond search. |
| 8 | Aesthetic and Minimalist Design | 2 | The surface is attractive, but too many equal-weight widgets compete before the user knows what to do next. |
| 9 | Error Recovery | 1 | No visible error, empty, offline, failed import, or failed scan recovery paths. |
| 10 | Help and Documentation | 1 | Help appears in the sidebar but is not contextual to decisions like ROI, budget, difficulty, or status. |
| **Total** | | **17/40** | **Poor: solid visual direction, weak task confidence and accessibility.** |

## Anti-Patterns Verdict

**LLM assessment**: The dashboard has real product intent, but it still carries a visible "AI dashboard" aftertaste: soft card grid, animated metrics, green SaaS palette, tiny arrow buttons, live timer, emoji objects, and many rounded panels with similar weight. It looks competent, not broken, but a fluent product user would pause because the interface feels more like a styled dashboard sample than a decision tool for choosing which opportunity to build next.

**Deterministic scan**: Target scan on `src/pages/Dashboard.jsx` returned no findings. Broader source scan on `src` found 1 warning: `overused-font` in `src/index.css:1` for Plus Jakarta Sans. That is not a functional failure, but it supports the visual critique: the typography does not yet give Gap Finder a distinct product voice.

**Visual overlays**: No reliable user-visible overlay is available. Browser automation was attempted, but the in-app browser list was empty in this session, so overlay injection could not run. Fallback signals used: source review, deterministic detector, dev-server HTTP check, production build, and contrast calculations.

## Overall Impression

Gap Finder already has a usable app-shell direction and a clear theme: opportunity discovery for a solo builder. The biggest opportunity is to turn it from a metric showcase into a prioritization cockpit. Right now the dashboard says "there are many interesting things here"; it should say "this is the best next move, and here is why."

## What's Working

The app shell has a stable product shape: persistent sidebar, top search, dashboard content, dark mode, and route structure. That gives the product a good base for future agent-driven features.

The opportunity cards contain useful decision data: market, budget, income, difficulty, ROI timing, status, and gap framing. The raw ingredients for a strong decision workflow are present.

The theme is coherent enough to remember. The green identity, Thai/English content mix, and compact cards match the "builder opportunity command center" idea.

## Priority Issues

**[P1] Contrast misses core accessibility targets**

**Why it matters**: Primary actions and supporting text are hard to read in light mode. Measured contrast: `#22C55E` with white text is 2.28:1, `#6D8C7A` muted text on white is 3.70:1, muted text on page bg is 3.43:1, and `#C4A882` with white text is 2.27:1. These miss WCAG AA for normal text.

**Fix**: Darken the light-mode primary action color for text-bearing surfaces, use `--accent` or a new `--primary-strong` for button backgrounds, and move muted text toward a darker green-gray. Keep bright green for dots, charts, and non-text highlights.

**Suggested command**: `$impeccable audit Dashboard`

**[P1] The primary workflow is unclear**

**Why it matters**: The dashboard offers "Add Gap", "Import Data", "Start Building", "New", "Add", arrow buttons, pause/stop, and clickable cards, but no single action reads as the next best step. Users scanning business opportunities need prioritization, not just more entry points.

**Fix**: Promote one decision flow: pick a top opportunity, compare it against 2 alternatives, then start a validation/build plan. Rename or demote secondary actions into menus. Make the featured opportunity the decision anchor, not one more decorative dark card.

**Suggested command**: `$impeccable shape Dashboard`

**[P1] Interactive elements are not accessible or self-explanatory**

**Why it matters**: Many icon-only controls have no `aria-label`, cards are clickable `div`s instead of buttons/links, and arrow buttons repeat without explaining destination. Keyboard and screen-reader users cannot confidently operate the primary surface.

**Fix**: Convert opportunity cards and project rows to semantic buttons or links, add visible focus states, give icon-only controls specific labels like "Open gap analytics", and remove controls that do not navigate or perform a real action yet.

**Suggested command**: `$impeccable harden Dashboard`

**[P2] Cognitive load is too high for the first viewport**

**Why it matters**: The first viewport asks the user to parse 4 stats, 3 middle widgets, 2 header actions, search, sidebar nav, and a project list before reaching the actual opportunity cards. Several widgets repeat similar signals without clarifying priority.

**Fix**: Collapse the dashboard into three visible zones: decision summary, opportunity queue, and supporting diagnostics. Move secondary analytics below or behind tabs. Replace repeated arrow controls with one clear "View details" pattern where it matters.

**Suggested command**: `$impeccable layout Dashboard`

**[P2] Motion is decorative and ignores reduced-motion preferences**

**Why it matters**: Letter-by-letter title animation, staggered stats, floating icons, count-ups, pulse rings, page enter, chart bars, and timer all move at once. For product UI, motion should confirm state or guide focus, not make users wait or distract from comparison.

**Fix**: Add `prefers-reduced-motion` handling, remove letter-by-letter title animation, stop infinite icon floating, and reserve animation for state changes like scanning, importing, filtering, or ranking updates.

**Suggested command**: `$impeccable animate Dashboard`

## Persona Red Flags

**Alex (Power User)**: Alex wants to shortlist the best opportunity quickly. The dashboard gives no sort/filter controls on the main opportunity grid, no keyboard shortcuts for adding/importing/filtering, no batch compare, and no clear route from "Top Opportunity" to a concrete build plan. The repeated arrow buttons look efficient but do not disclose what they do.

**Sam (Accessibility-Dependent User)**: Sam runs into unlabeled icon buttons in the top bar and cards, clickable rows/cards implemented as non-semantic elements, weak focus styling, text contrast failures, and motion with no reduced-motion branch. Color also carries status and chart meaning without always giving an equivalent text explanation.

**Jordan (First-Timer)**: Jordan can tell this is about business gaps, but not what to do first. "Gap Analytics", "Gap Utilization", "Income Tracker", "Passive Ready", and "ROI เฉลี่ย" are useful terms, yet they are not connected into an explained decision model. The Help item is generic and not located near the points where uncertainty happens.

## Minor Observations

- `stats` and `plugins` are imported in `Dashboard.jsx` but unused, which hints at a split between older and newer dashboard concepts.
- The "Income Tracker" feels like passive-income theater unless it is tied to an actual saved project or build session.
- The top search placeholder says "Search task", but the product domain is opportunities, gaps, projects, and agents.
- The sidebar includes `/trends`, but the app routes do not define that path.
- Several headings and labels use tiny type sizes that make the dashboard feel polished at a glance but tiring under real use.

## Questions to Consider

- What is the one decision this dashboard should help the user make in the first 30 seconds: build, compare, scan, or track?
- Should the top opportunity be selected by ROI, budget fit, Thai-market fit, personal skill fit, or agent confidence?
- Which widgets would disappear if the dashboard were optimized for one real weekly workflow instead of a portfolio screenshot?
