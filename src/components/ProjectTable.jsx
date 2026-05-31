import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { opportunities } from '../data/opportunities'

const statusStyles = {
  ready: 'bg-accent-green/10 text-accent-green',
  build: 'bg-accent-purple/10 text-accent-purple',
  research: 'bg-accent-yellow/10 text-accent-yellow',
}

const statusLabels = {
  ready: '✓ BUILD NOW',
  build: '⚙ IN SCOPE',
  research: '🔬 RESEARCH',
}

function DifficultyDots({ level }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i <= level ? 'bg-accent-purple' : 'bg-gray-200 dark:bg-white/10'}`}
        />
      ))}
    </div>
  )
}

export default function ProjectTable() {
  const tableRef = useRef(null)

  useEffect(() => {
    gsap.from(tableRef.current, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out', delay: 0.6 })
  }, [])

  return (
    <div ref={tableRef} className="bg-white dark:bg-[#13131F] rounded-2xl border border-gray-100 dark:border-white/6 overflow-hidden">
      {/* Table header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/6 bg-gray-50 dark:bg-white/2">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
        <h2 className="text-[13px] font-mono font-bold text-gray-800 dark:text-white">💤 PASSIVE INCOME PROJECT LIST</h2>
        <span className="ml-auto text-[10px] font-mono text-gray-400">อัปเดต Jun 2026</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5">
              {['PROJECT', 'MARKET', 'INCOME/MO', 'DIFFICULTY', 'BUDGET START', 'ROI TIME', 'STATUS'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-mono text-gray-400 tracking-widest uppercase whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opp, i) => (
              <tr
                key={opp.id}
                className="border-b border-gray-50 dark:border-white/4 hover:bg-gray-50 dark:hover:bg-white/2 cursor-pointer transition-colors duration-150 group"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{opp.icon}</span>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100 leading-tight">{opp.title}</p>
                      <p className="text-[10px] font-mono text-gray-400">{opp.subtitle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[12px]">
                    {opp.market === 'thai' ? '🇹🇭 Thai' : opp.market === 'sea' ? '🌏 SEA' : '🌐 Global'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-mono text-[12px] font-bold text-accent-green">{opp.income}</span>
                </td>
                <td className="px-4 py-3.5">
                  <DifficultyDots level={opp.difficulty} />
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-mono text-[12px] text-gray-700 dark:text-gray-300">{opp.budget.total}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">{opp.timeToROI}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${statusStyles[opp.statusType]}`}>
                    {statusLabels[opp.statusType]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
