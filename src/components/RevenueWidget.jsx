import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

/* tiny sparkline SVG */
function Sparkline() {
  return (
    <svg viewBox="0 0 80 28" className="w-full h-7" preserveAspectRatio="none">
      <polyline
        points="0,22 14,14 28,18 40,8 54,12 68,4 80,10"
        fill="none"
        stroke="#22C55E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function RevenueWidget() {
  const ref = useRef(null)
  const valRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out', delay: 0.3 })
      const obj = { val: 0 }
      gsap.to(obj, {
        val: 340,
        duration: 1.6,
        delay: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          if (valRef.current) valRef.current.textContent = Math.round(obj.val) + '%'
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="bg-white rounded-2xl p-4 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[13px] font-semibold text-gray-800">Revenue Overview</p>
        <span className="text-[10px] font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
          3 New
        </span>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">Estimated passive income</p>

      <div className="flex items-end gap-2 mb-3">
        <p ref={valRef} className="text-[28px] font-black text-gray-900 leading-none">
          0%
        </p>
        <span className="text-[11px] text-red-400 flex items-center gap-0.5 mb-0.5">
          <ArrowDownRight size={12} /> avg ROI
        </span>
      </div>

      <Sparkline />

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-[11px]">
        <div className="flex items-center gap-1 text-red-400">
          <ArrowDownRight size={12} />
          <span className="font-medium">฿0 min start</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-500">
          <ArrowUpRight size={12} />
          <span className="font-medium">฿150K/mo top</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <span>₿</span>
          <span className="font-medium">24 gaps</span>
        </div>
      </div>
    </div>
  )
}
