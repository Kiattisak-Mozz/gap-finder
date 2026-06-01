import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { opportunities } from '../data/opportunities'

const statusConfig = {
  ready:    { label: 'Build Now', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  build:    { label: 'In Scope',  bg: 'bg-violet-50 dark:bg-violet-500/10',   text: 'text-violet-600 dark:text-violet-400' },
  research: { label: 'Research',  bg: 'bg-amber-50 dark:bg-amber-500/10',     text: 'text-amber-600 dark:text-amber-400' },
}

function DiffDots({ level }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? 'bg-violet-400' : 'bg-gray-100 dark:bg-white/10'}`} />
      ))}
    </div>
  )
}

export default function ProjectTable() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { y: 24, opacity: 0, duration: 0.5, ease: 'power3.out', delay: 0.5 })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="bg-white dark:bg-[#13131F] rounded-2xl sm:rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-black/5 dark:border-white/5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <h2 className="text-[14px] sm:text-[15px] font-bold text-gray-900 dark:text-white">Passive Income Projects</h2>
        <span className="ml-auto text-[11px] sm:text-[12px] text-gray-400 hidden sm:block">อัปเดต Jun 2026</span>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-black/5 dark:divide-white/5">
        {opportunities.map(opp => {
          const st = statusConfig[opp.statusType]
          return (
            <div key={opp.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/2 cursor-pointer transition-colors">
              <span className="text-xl flex-shrink-0">{opp.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100 truncate">{opp.title}</p>
                <p className="text-[11px] text-emerald-500 font-medium mt-0.5">{opp.income}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${st.bg} ${st.text}`}>
                {st.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5">
              {['Project', 'Market', 'Income / mo', 'Difficulty', 'Start Budget', 'ROI Time', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {opportunities.map(opp => {
              const st = statusConfig[opp.statusType]
              return (
                <tr
                  key={opp.id}
                  className="border-b border-black/[0.03] dark:border-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/2 cursor-pointer transition-colors duration-100"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{opp.icon}</span>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">{opp.title}</p>
                        <p className="text-[11px] text-gray-400">{opp.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-gray-500 dark:text-gray-400">
                    {opp.market === 'thai' ? '🇹🇭 Thai' : opp.market === 'sea' ? '🌏 SEA' : '🌐 Global'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-bold text-emerald-500">{opp.income}</span>
                  </td>
                  <td className="px-5 py-4">
                    <DiffDots level={opp.difficulty} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">{opp.budget.total}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[12px] text-gray-400">{opp.timeToROI}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${st.bg} ${st.text}`}>
                      {st.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
