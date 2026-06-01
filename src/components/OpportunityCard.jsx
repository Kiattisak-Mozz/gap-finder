import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowUpRight, Clock, Zap } from 'lucide-react'

const statusConfig = {
  ready:    { label: 'Build Now',  bg: 'bg-emerald-500',  text: 'text-white' },
  build:    { label: 'In Scope',   bg: 'bg-violet-500',   text: 'text-white' },
  research: { label: 'Research',   bg: 'bg-amber-400',    text: 'text-white' },
}

const diffLabel = ['', 'Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard']

export default function OpportunityCard({ opp, index }) {
  const cardRef = useRef(null)
  const iconRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    const ctx = gsap.context(() => {
      gsap.from(card, { y: 32, opacity: 0, duration: 0.55, delay: 0.3 + index * 0.07, ease: 'power3.out' })
      gsap.to(iconRef.current, {
        y: -6, duration: 2.4 + index * 0.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })
    })
    const enter = () => gsap.to(card, { y: -4, duration: 0.2, ease: 'power2.out' })
    const leave = () => gsap.to(card, { y: 0,  duration: 0.2, ease: 'power2.out' })
    card.addEventListener('mouseenter', enter)
    card.addEventListener('mouseleave', leave)
    return () => {
      ctx.revert()
      card.removeEventListener('mouseenter', enter)
      card.removeEventListener('mouseleave', leave)
    }
  }, [index])

  const st = statusConfig[opp.statusType]

  return (
    <div
      ref={cardRef}
      className={`relative bg-white dark:bg-[#13131F] rounded-3xl p-5 cursor-pointer
        border transition-colors duration-200
        ${opp.featured
          ? 'border-emerald-200 dark:border-emerald-500/20 shadow-md shadow-emerald-500/5'
          : 'border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'
        }`}
    >
      {/* Featured ribbon */}
      {opp.featured && (
        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          ★ Top Pick
        </div>
      )}

      {/* Icon + title */}
      <div className="flex items-start gap-3.5 mb-4">
        <div
          ref={iconRef}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: opp.iconBg }}
        >
          {opp.icon}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-[14px] font-bold text-gray-900 dark:text-white leading-snug">{opp.title}</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">{opp.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
        {opp.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {opp.tags.map(tag => (
          <span
            key={tag}
            className="text-[11px] font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-white/6 text-gray-600 dark:text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Budget bar */}
      <div className="mb-4">
        <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
          {opp.budget.breakdown.map(b => (
            <div
              key={b.label}
              className="h-full rounded-full"
              style={{ width: `${b.pct}%`, background: b.color }}
            />
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5">
        <div>
          <p className="text-[11px] text-gray-400">งบเริ่มต้น</p>
          <p className="text-[13px] font-bold text-gray-800 dark:text-gray-100">{opp.budget.total}</p>
        </div>

        <div className="text-right">
          <p className="text-[11px] text-gray-400">รายได้คาด</p>
          <p className="text-[13px] font-bold text-emerald-500">{opp.income}</p>
        </div>
      </div>

      {/* Meta + status */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="flex items-center gap-1">
            <Zap size={11} />
            <span className="text-[11px]">{diffLabel[opp.difficulty]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={11} />
            <span className="text-[11px]">{opp.timeToROI}</span>
          </div>
        </div>
        <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${st.bg} ${st.text}`}>
          {st.label}
        </span>
      </div>
    </div>
  )
}
