import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const R    = 54
const CIRC = 2 * Math.PI * R   // ≈ 339.3

export default function DonutChart({ segments, total, centerLabel }) {
  const circlesRef = useRef([])
  const countRef   = useRef(null)

  // Pre-compute each segment's start rotation + dash length
  let cumPct = 0
  const computed = segments.map(s => {
    const startRot = cumPct * 3.6            // degrees
    const length   = (s.percent / 100) * CIRC - 5   // 5px gap between segments
    cumPct += s.percent
    return { ...s, startRot, length }
  })

  useEffect(() => {
    // 1. Draw each segment (strokeDasharray 0→length)
    circlesRef.current.forEach((el, i) => {
      if (!el) return
      gsap.fromTo(el,
        { strokeDasharray: `0 ${CIRC}` },
        {
          strokeDasharray: `${computed[i].length} ${CIRC}`,
          duration: 1.0,
          delay: 0.15 + i * 0.15,
          ease: 'power2.out',
        }
      )
    })

    // 2. Count-up center number
    if (countRef.current) {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: total,
        duration: 1.4,
        delay: 0.3,
        ease: 'power2.out',
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = Math.round(obj.val)
        },
      })
    }
  }, [])

  return (
    <div className="flex items-center gap-6 flex-wrap">
      {/* SVG ring */}
      <div className="relative flex-shrink-0" style={{ width: 144, height: 144 }}>
        <svg width={144} height={144} className="-rotate-90" overflow="visible">
          {/* Track */}
          <circle
            cx={72} cy={72} r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth={13}
            className="text-gray-100 dark:text-white/6"
          />
          {/* Animated segments */}
          {computed.map((s, i) => (
            <circle
              key={i}
              ref={el => circlesRef.current[i] = el}
              cx={72} cy={72} r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={13}
              strokeDasharray={`0 ${CIRC}`}
              strokeLinecap="round"
              transform={`rotate(${s.startRot} 72 72)`}
            />
          ))}
        </svg>

        {/* Center count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span ref={countRef} className="text-[28px] font-black text-gray-800 dark:text-white leading-none">
            0
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5">{centerLabel}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
        {segments.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2 group">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
              style={{ background: s.color }}
            />
            <span className="text-[12px] text-gray-500 dark:text-gray-400">{s.label}</span>
            <span className="text-[12px] font-bold text-gray-800 dark:text-white">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
