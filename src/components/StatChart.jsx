import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const periods = ['Weekly', 'Monthly', 'Yearly']

/* 2 wavy SVG paths like the screenshot */
const sellPath = 'M0,55 C15,55 20,30 40,28 C60,26 65,45 80,40 C95,35 105,20 120,18 C135,16 145,35 160,30 C175,25 185,10 200,8 C215,6 225,22 240,20'
const buyPath  = 'M0,70 C15,70 25,50 40,48 C55,46 65,62 80,58 C95,54 110,38 120,35 C135,32 145,52 160,48 C175,44 185,28 200,25 C215,22 225,42 240,38'

export default function StatChart() {
  const ref = useRef(null)
  const [period, setPeriod] = useState('Monthly')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out', delay: 0.45 })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-gray-800">Statistic</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-5 h-0.5 bg-emerald-400 rounded-full inline-block" />
            Passive
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className="w-5 h-0.5 bg-gray-300 rounded-full inline-block" style={{ borderStyle: 'dashed' }} />
            Active
          </div>
          <div className="flex items-center gap-2 ml-3">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors
                  ${period === p
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:text-gray-700'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip-like callout */}
      <div className="relative">
        <div className="absolute left-[90px] top-2 bg-white border border-gray-100 shadow-md rounded-lg px-3 py-1.5 text-[11px] z-10 pointer-events-none">
          <span className="text-red-400 font-medium">↓ ฿5K </span>
          <span className="text-emerald-500 font-medium">↑ ฿80K</span>
        </div>

        {/* Y-axis labels */}
        <div className="flex">
          <div className="flex flex-col justify-between text-[10px] text-gray-300 mr-3 h-[90px] pt-1 pb-1">
            {['80k', '60k', '40k', '20k'].map(v => <span key={v}>{v}</span>)}
          </div>

          {/* SVG chart */}
          <div className="flex-1">
            <svg viewBox="0 0 240 90" className="w-full h-[90px]" preserveAspectRatio="none">
              {/* Grid lines */}
              {[18, 40, 58, 75].map(y => (
                <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="#F3F4F6" strokeWidth="1" />
              ))}
              {/* Sell (passive) - green solid */}
              <path d={sellPath} fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
              {/* Buy (active) - gray dashed */}
              <path d={buyPath} fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />
              {/* Dot at peak */}
              <circle cx="200" cy="8" r="4" fill="#22C55E" />
              <circle cx="200" cy="8" r="7" fill="#22C55E" fillOpacity="0.2" />
            </svg>

            {/* X-axis */}
            <div className="flex justify-between text-[10px] text-gray-300 mt-1 px-0">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon','Tue'].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
