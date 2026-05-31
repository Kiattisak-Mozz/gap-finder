import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { stats } from '../data/opportunities'

const colorMap = {
  green: { text: 'text-accent-green', bg: 'bg-accent-green/10', bar: '#00E96A' },
  orange: { text: 'text-accent-orange', bg: 'bg-accent-orange/10', bar: '#FF6B35' },
  purple: { text: 'text-accent-purple', bg: 'bg-accent-purple/10', bar: '#7C5CFC' },
  yellow: { text: 'text-accent-yellow', bg: 'bg-accent-yellow/10', bar: '#FFD700' },
}

export default function StatsRow() {
  const rowRef = useRef(null)
  const valRefs = useRef([])

  useEffect(() => {
    gsap.from(rowRef.current.children, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.3,
    })

    // Count up animation
    stats.forEach((s, i) => {
      const el = valRefs.current[i]
      if (!el || s.value === 0) return
      const obj = { val: 0 }
      gsap.to(obj, {
        val: s.value,
        duration: 1.5,
        delay: 0.5 + i * 0.1,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = s.suffix === '%'
            ? Math.round(obj.val) + s.suffix
            : s.suffix + Math.round(obj.val)
        },
      })
    })
  }, [])

  return (
    <div ref={rowRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => {
        const c = colorMap[s.color]
        return (
          <div
            key={s.label}
            className="relative bg-white dark:bg-[#13131F] rounded-2xl p-5 border border-gray-100 dark:border-white/6
              hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: c.bar }} />

            {/* Icon bubble */}
            <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
              <div className="w-3 h-3 rounded-full" style={{ background: c.bar }} />
            </div>

            <p className="text-[10px] font-mono text-gray-400 tracking-widest mb-1">{s.label}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-500 mb-2">{s.labelTh}</p>

            <p
              ref={el => valRefs.current[i] = el}
              className={`text-3xl font-black font-mono ${c.text}`}
            >
              {s.value === 0 ? '฿0' : s.suffix === '%' ? '0%' : s.suffix + '0'}
            </p>

            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{s.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
