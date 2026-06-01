import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { stats } from '../data/opportunities'

const colors = {
  green:  { accent: '#22C55E', light: '#F0FDF4', darkLight: 'rgba(34,197,94,0.12)',  text: 'text-emerald-500' },
  orange: { accent: '#F97316', light: '#FFF7ED', darkLight: 'rgba(249,115,22,0.12)', text: 'text-orange-500' },
  purple: { accent: '#8B5CF6', light: '#F5F3FF', darkLight: 'rgba(139,92,246,0.12)', text: 'text-violet-500' },
  yellow: { accent: '#EAB308', light: '#FEFCE8', darkLight: 'rgba(234,179,8,0.12)',  text: 'text-yellow-500' },
}

export default function StatsRow() {
  const rowRef = useRef(null)
  const valRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(rowRef.current.children, {
        y: 24, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.2,
      })
      stats.forEach((s, i) => {
        const el = valRefs.current[i]
        if (!el || s.value === 0) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: s.value, duration: 1.4, delay: 0.4 + i * 0.08, ease: 'power2.out',
          onUpdate: () => {
            el.textContent = s.suffix === '%'
              ? Math.round(obj.val) + s.suffix
              : s.suffix + Math.round(obj.val)
          },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rowRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-7">
      {stats.map((s, i) => {
        const c = colors[s.color]
        return (
          <div
            key={s.label}
            className="bg-white dark:bg-[#13131F] rounded-2xl sm:rounded-3xl p-4 sm:p-5
              border border-black/5 dark:border-white/5
              hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 sm:mb-4"
              style={{ background: c.light }}
            >
              <div className="w-3 h-3 rounded-full" style={{ background: c.accent }} />
            </div>

            <p
              ref={el => valRefs.current[i] = el}
              className={`text-[26px] sm:text-[32px] font-black leading-none mb-1 ${c.text}`}
            >
              {s.value === 0 ? '฿0' : s.suffix === '%' ? '0%' : s.suffix + '0'}
            </p>

            <p className="text-[12px] sm:text-[13px] font-semibold text-gray-800 dark:text-gray-100 mt-2">{s.labelTh}</p>
            <p className="text-[11px] sm:text-[12px] text-gray-400 mt-0.5 hidden sm:block">{s.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
