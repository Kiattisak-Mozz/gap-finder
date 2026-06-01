import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function SegmentedBar({ percent = 0, blocks = 9, color = '#22C55E' }) {
  const filled   = Math.round((percent / 100) * blocks)
  const blockRefs = useRef([])

  useEffect(() => {
    // Stagger each filled block: scale from 0 + color fade
    blockRefs.current.forEach((el, i) => {
      if (!el || i >= filled) return
      gsap.fromTo(el,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.28,
          delay: i * 0.055,
          ease: 'back.out(1.5)',
          transformOrigin: 'bottom',
        }
      )
    })
  }, [percent])

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-[3px] items-end">
        {Array.from({ length: blocks }).map((_, i) => (
          <div
            key={i}
            ref={el => blockRefs.current[i] = el}
            className="w-[7px] rounded-[2px]"
            style={{
              height: 10,
              background: i < filled ? color : '#E5E7EB',
            }}
          />
        ))}
      </div>
      <span className="text-[12px] font-semibold text-gray-600 dark:text-gray-300 tabular-nums">
        {percent}%
      </span>
    </div>
  )
}
