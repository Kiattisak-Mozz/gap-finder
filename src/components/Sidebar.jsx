import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { LayoutDashboard, ScanSearch, TrendingUp, Globe, FolderOpen, Puzzle } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', labelTh: 'หน้าหลัก', active: true },
  { icon: ScanSearch, label: 'Gap Scanner', labelTh: 'สแกนช่องว่าง', active: false },
  { icon: TrendingUp, label: 'Passive Income', labelTh: 'รายได้ Passive', active: false },
  { icon: Globe, label: 'Global Trends', labelTh: 'เทรนด์โลก', active: false },
  { icon: FolderOpen, label: 'My Projects', labelTh: 'โปรเจคของฉัน', active: false },
  { icon: Puzzle, label: 'Plugins', labelTh: 'ปลั๊กอิน', active: false },
]

const marketFilters = ['🇹🇭 Thai', '🌏 SEA', '🌐 Global', '🇺🇸 US']
const budgetFilters = ['฿0–5K', '฿5K–50K', '฿50K+']
const typeFilters = ['💤 Passive', '⚡ Active', '🔁 Hybrid']

export default function Sidebar({ filters, setFilters }) {
  const sidebarRef = useRef(null)

  useEffect(() => {
    gsap.from(sidebarRef.current, { x: -40, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 })
  }, [])

  const toggleFilter = (group, val) => {
    setFilters(prev => ({
      ...prev,
      [group]: prev[group] === val ? null : val,
    }))
  }

  return (
    <aside
      ref={sidebarRef}
      className="w-56 flex-shrink-0 flex flex-col gap-6 py-6 overflow-y-auto
        bg-white dark:bg-[#0E0E16]
        border-r border-gray-100 dark:border-white/5"
    >
      {/* Nav */}
      <div className="px-4">
        <p className="text-[10px] font-mono text-gray-400 tracking-widest mb-3 uppercase">Navigation</p>
        {navItems.map(({ icon: Icon, label, labelTh, active }) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer mb-1 transition-all duration-200
              ${active
                ? 'bg-accent-green/10 text-accent-green border-l-2 border-accent-green'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <Icon size={15} />
            <div>
              <p className="text-[12px] font-semibold leading-tight">{labelTh}</p>
              <p className="text-[9px] opacity-60 font-mono">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Market */}
      <div className="px-4">
        <p className="text-[10px] font-mono text-gray-400 tracking-widest mb-3 uppercase">Market</p>
        <div className="flex flex-wrap gap-1.5">
          {marketFilters.map(f => (
            <button
              key={f}
              onClick={() => toggleFilter('market', f)}
              className={`text-[11px] px-3 py-1 rounded-full border transition-all duration-200 font-mono
                ${filters.market === f
                  ? 'bg-accent-green text-black border-accent-green font-bold'
                  : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-accent-green hover:text-accent-green'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="px-4">
        <p className="text-[10px] font-mono text-gray-400 tracking-widest mb-3 uppercase">Budget</p>
        <div className="flex flex-wrap gap-1.5">
          {budgetFilters.map(f => (
            <button
              key={f}
              onClick={() => toggleFilter('budget', f)}
              className={`text-[11px] px-3 py-1 rounded-full border transition-all duration-200 font-mono
                ${filters.budget === f
                  ? 'bg-accent-green text-black border-accent-green font-bold'
                  : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-accent-green hover:text-accent-green'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div className="px-4">
        <p className="text-[10px] font-mono text-gray-400 tracking-widest mb-3 uppercase">Type</p>
        <div className="flex flex-wrap gap-1.5">
          {typeFilters.map(f => (
            <button
              key={f}
              onClick={() => toggleFilter('type', f)}
              className={`text-[11px] px-3 py-1 rounded-full border transition-all duration-200 font-mono
                ${filters.type === f
                  ? 'bg-accent-green text-black border-accent-green font-bold'
                  : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-accent-green hover:text-accent-green'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Last scan */}
      <div className="px-4 mt-auto">
        <div className="bg-gray-50 dark:bg-white/4 rounded-xl p-3 border border-gray-100 dark:border-white/8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400">LAST SCAN</p>
          </div>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Jun 1, 2026</p>
          <p className="text-[10px] text-gray-400 mt-0.5">สแกนอัตโนมัติทุก 7 วัน</p>
        </div>
      </div>
    </aside>
  )
}
