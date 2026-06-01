import { Hammer, Target, Telescope } from 'lucide-react'

/* Single source of truth for the BUILD / SCOPED / RESEARCH decision vocabulary.
   fill = graphic/icon · soft = chip background · ink = readable text on soft (see DESIGN.md). */
export const decision = {
  ready:    { label: 'BUILD',    thKey: 'dec.ready.th',    Icon: Hammer,    fill: 'var(--build)',   ink: 'var(--build-ink)',  soft: 'var(--build-soft)' },
  build:    { label: 'SCOPED',   thKey: 'dec.build.th',    Icon: Target,    fill: 'var(--primary)', ink: 'var(--scoped-ink)', soft: 'var(--primary-soft)' },
  research: { label: 'RESEARCH', thKey: 'dec.research.th', Icon: Telescope, fill: 'var(--park)',    ink: 'var(--park-ink)',   soft: 'var(--park-soft)' },
}
