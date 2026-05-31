import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowUpRight, Shield, Zap } from 'lucide-react'

const tagColors = {
  passive: 'border-accent-green/40 text-accent-green bg-accent-green/5',
  thai: 'border-accent-purple/40 text-accent-purple bg-accent-purple/5',
  globe: 'border-accent-orange/40 text-accent-orange bg-accent-orange/5',
  sea: 'border-accent-yellow/40 text-accent-yellow bg-accent-yellow/5',
  hybrid: 'border-blue-400/40 text-blue-400 bg-blue-400/5',
  neutral: 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400',
}

const statusStyles = {
  ready: 'bg-accent-green/10 text-accent-green',
  build: 'bg-accent-purple/10 text-accent-purple',
  research: 'bg-accent-yellow/10 text-accent-yellow',
}

const statusLabels = {
  ready: '✓ BUILD NOW',
  build: '⚙ IN SCOPE',
  research: '🔬 RESEARCH',
}

const difficultyLabel = ['', 'ง่ายมาก', 'ง่าย', 'ปานกลาง', 'ยาก', 'ยากมาก']

export default function OpportunityCard({ opp, index }) {
  const cardRef = useRef(null)
  const floatRef = useRef(null)

  useEffect(() => {
    gsap.from(cardRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      delay: 0.4 + index * 0.08,
      ease: 'power3.out',
    })

    // Float the icon
    gsap.to(floatRef.current, {
      y: -8,
      duration: 2.5 + index * 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    // Hover
    const card = cardRef.current
    const enterHandler = () => gsap.to(card, { y: -4, duration: 0.25, ease: 'power2.out' })
    const leaveHandler = () => gsap.to(card, { y: 0, duration: 0.25, ease: 'power2.out' })
    card.addEventListener('mouseenter', enterHandler)
    card.addEventListener('mouseleave', leaveHandler)
    return () => {
      card.removeEventListener('mouseenter', enterHandler)
      card.removeEventListener('mouseleave', leaveHandler)
    }
  }, [index])

  return (
    <div
      ref={cardRef}
      className={`relative bg-white dark:bg-[#13131F] rounded-2xl p-5 cursor-pointer
        border transition-colors duration-300
        ${opp.featured
          ? 'border-accent-green/30 shadow-[0_0_0_1px_rgba(0,233,106,0.1)]'
          : 'border-gray-100 dark:border-white/6 hover:border-accent-purple/30'
        }`}
    >
      {/* Featured badge */}
      {opp.featured && (
        <div className="absolute top-4 right-4 bg-accent-green text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded-md">
          ★ TOP PICK
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          ref={floatRef}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: opp.iconBg }}
        >
          {opp.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight">{opp.title}</h3>
          <p className="text-[10px] font-mono text-gray-400 mt-0.5">{opp.titleEn}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{opp.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
        {opp.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {opp.tags.map((tag, i) => (
          <span
            key={tag}
            className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${tagColors[opp.tagTypes[i]] || tagColors.neutral}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Budget breakdown */}
      <div className="border-t border-gray-100 dark:border-white/6 pt-4">

        {/* Budget bars */}
        <div className="mb-3">
          <div className="flex gap-2 mb-1.5">
            {opp.budget.breakdown.map(b => (
              <div key={b.label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm" style={{ background: b.color }} />
                <span className="text-[9px] font-mono text-gray-400">{b.label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-1 h-1.5">
            {opp.budget.breakdown.map(b => (
              <div
                key={b.label}
                className="h-full rounded-full"
                style={{ width: `${b.pct}%`, background: b.color, opacity: 0.8 }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-mono text-gray-400">งบเริ่มต้น / Start Budget</p>
            <p className="text-[13px] font-black font-mono text-gray-800 dark:text-gray-100">{opp.budget.total}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-gray-400 mb-1">รายได้คาด</p>
            <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full
              ${opp.roi === 'high' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-yellow/10 text-accent-yellow'}`}>
              🎯 {opp.income}
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Zap size={11} className="text-gray-400" />
              <span className="text-[10px] text-gray-400 font-mono">{difficultyLabel[opp.difficulty]}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={11} className="text-gray-400" />
              <span className="text-[10px] text-gray-400 font-mono">{opp.timeToROI}</span>
            </div>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${statusStyles[opp.statusType]}`}>
            {statusLabels[opp.statusType]}
          </span>
        </div>

        {/* Gap insight */}
        <div className="mt-2 bg-gray-50 dark:bg-white/3 rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-400 font-mono">
            <span className="text-accent-green">▲ GAP:</span> {opp.gap}
          </p>
        </div>
      </div>
    </div>
  )
}
