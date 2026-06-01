import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function FeaturedCard({ opp }) {
  const ref = useRef(null)
  const iconRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 })
      gsap.to(iconRef.current, {
        y: -10,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={ref}
      className="relative rounded-2xl overflow-hidden h-[220px] flex flex-col justify-between p-6"
      style={{ background: 'linear-gradient(135deg, #1E3A2F 0%, #2D5A3D 60%, #3A7050 100%)' }}
    >
      {/* Subtle circle decoration */}
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5" />
      <div className="absolute -right-4 top-8 w-32 h-32 rounded-full bg-white/5" />

      {/* Big floating emoji */}
      <div
        ref={iconRef}
        className="absolute right-6 bottom-4 text-[90px] leading-none select-none"
        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }}
      >
        {opp.icon}
      </div>

      {/* Content */}
      <div>
        <span className="inline-block text-[10px] font-semibold tracking-widest uppercase text-emerald-300 bg-white/10 px-3 py-1 rounded-full mb-3">
          ★ Top Opportunity
        </span>
        <h2 className="text-white text-[20px] font-bold leading-snug max-w-[60%]">
          {opp.title}
        </h2>
        <p className="text-emerald-200/80 text-[12px] mt-1 max-w-[55%]">
          {opp.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="bg-white text-gray-900 text-[12px] font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
          Explore Now
        </button>
        <span className="text-emerald-300 text-[12px] font-medium">
          {opp.income}
        </span>
      </div>
    </div>
  )
}
