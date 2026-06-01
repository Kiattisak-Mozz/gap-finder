import { decision } from '../../data/decision'

export default function DecisionChip({ type, size = 'md' }) {
  const d = decision[type]
  if (!d) return null
  const { Icon } = d
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-wide flex-shrink-0 ${pad}`}
      style={{ background: d.soft, color: d.ink }}>
      <Icon size={size === 'sm' ? 11 : 12} strokeWidth={2.4} />
      {d.label}
    </span>
  )
}
