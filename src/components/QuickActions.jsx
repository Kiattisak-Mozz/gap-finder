import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const categories = [
  { icon: '🇹🇭', label: 'Thai' },
  { icon: '🌏', label: 'SEA' },
  { icon: '🌐', label: 'Global' },
  { icon: '💤', label: 'Passive' },
  { icon: '⚡', label: 'Active' },
]

export default function QuickActions() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current.children, {
        y: 20, opacity: 0, duration: 0.4,
        stagger: 0.07, ease: 'power2.out', delay: 0.25,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div ref={ref} className="grid grid-cols-5 gap-1">
        {categories.map(({ icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <span className="text-[26px] leading-none group-hover:scale-110 transition-transform duration-150">
              {icon}
            </span>
            <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-800 transition-colors">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
