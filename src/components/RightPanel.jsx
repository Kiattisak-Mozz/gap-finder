import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { X, Flame } from 'lucide-react'
import { opportunities } from '../data/opportunities'

const avatars = ['🧑', '👩', '🧔']

export default function RightPanel() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current.children, {
        x: 30, opacity: 0, duration: 0.5,
        stagger: 0.12, ease: 'power3.out', delay: 0.3,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="flex flex-col gap-4">

      {/* ── Offer card ── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-dashed border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Flame size={14} className="text-orange-400" />
          <span className="text-[12px] font-bold text-gray-800">Offer</span>
        </div>
        <p className="text-[12px] text-gray-500 leading-relaxed mb-3">
          Create your own profile in the avatar builder platform without login process.
        </p>
        <div className="flex items-center gap-1.5 mb-3">
          {avatars.map((a, i) => (
            <span
              key={i}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg border-2 border-white"
              style={{ marginLeft: i > 0 ? '-8px' : 0 }}
            >
              {a}
            </span>
          ))}
        </div>
        <button className="w-full py-2 rounded-xl bg-gray-900 text-white text-[12px] font-semibold hover:bg-gray-700 transition-colors">
          Get Started
        </button>
      </div>

      {/* ── Opportunities list ── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold text-gray-800">All Gaps</p>
          <span className="text-[10px] text-gray-400">{opportunities.length} total</span>
        </div>
        <div className="flex flex-col gap-2">
          {opportunities.slice(0, 5).map(opp => (
            <div
              key={opp.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <span className="text-[22px] flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-white transition-colors">
                {opp.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-gray-800 truncate">{opp.title}</p>
                <p className="text-[10px] text-gray-400 truncate">{opp.income}</p>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0
                ${opp.statusType === 'ready'
                  ? 'bg-emerald-50 text-emerald-600'
                  : opp.statusType === 'build'
                    ? 'bg-violet-50 text-violet-600'
                    : 'bg-amber-50 text-amber-600'
                }`}
              >
                {opp.statusType === 'ready' ? 'Ready' : opp.statusType === 'build' ? 'Scoped' : 'Research'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── News/subscribe card ── */}
      <div
        className="relative rounded-2xl p-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)' }}
      >
        <button className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
          <X size={12} />
        </button>
        <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest mb-1">Weekly Digest</p>
        <p className="text-white text-[14px] font-bold leading-snug mb-3">
          Get new gaps on your phone
        </p>
        <p className="text-blue-200 text-[11px] mb-3">
          Priceless and optimal signal every week.
        </p>
        <button className="bg-white text-blue-700 text-[11px] font-bold px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
          Subscribe
        </button>
        <div className="absolute -bottom-4 -right-4 text-[64px] opacity-20 select-none">📱</div>
      </div>
    </div>
  )
}
