import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import {
  LayoutDashboard, ScanSearch, TrendingUp,
  Globe, FolderOpen, Puzzle, X,
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',      badge: null, active: true },
  { icon: ScanSearch,      label: 'Gap Scanner',    badge: null, active: false },
  { icon: TrendingUp,      label: 'Passive Income', badge: '9',  active: false },
  { icon: Globe,           label: 'Global Trends',  badge: null, active: false },
  { icon: FolderOpen,      label: 'My Projects',    badge: null, active: false },
  { icon: Puzzle,          label: 'Plugins',        badge: null, active: false },
]

const marketFilters = ['🇹🇭 Thai', '🌏 SEA', '🌐 Global', '🇺🇸 US']
const typeFilters   = ['💤 Passive', '⚡ Active', '🔁 Hybrid']

export default function Sidebar({ filters, setFilters, open, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.innerWidth >= 1024) {
        gsap.from(ref.current, { opacity: 0, y: 8, duration: 0.45, ease: 'power3.out', delay: 0.05 })
      }
    })
    return () => ctx.revert()
  }, [])

  const toggle = (group, val) =>
    setFilters(prev => ({ ...prev, [group]: prev[group] === val ? null : val }))

  return (
    <aside
      ref={ref}
      className={`
        flex-shrink-0 flex flex-col gap-5 py-6 overflow-y-auto
        bg-white dark:bg-[#0E0E16]
        border-r border-black/5 dark:border-white/5
        w-[240px]
        fixed top-0 left-0 h-full z-40
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0 lg:h-auto lg:z-auto lg:transition-none
      `}
    >
      {/* Mobile close button */}
      <div className="flex items-center justify-between px-4 lg:hidden">
        <div className="flex items-center gap-0.5">
          <span className="text-[18px] font-extrabold text-gray-900 dark:text-white">Gap</span>
          <span className="text-[18px] font-extrabold text-emerald-500">Finder.</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/6 transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Nav */}
      <div className="px-3">
        <p className="text-[11px] font-semibold text-gray-400 px-3 mb-2 uppercase tracking-wider">Menu</p>
        {navItems.map(({ icon: Icon, label, badge, active }) => (
          <div
            key={label}
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2.5 rounded-2xl cursor-pointer mb-0.5 transition-all duration-150
              ${active
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[13px] font-medium">{label}</span>
            </div>
            {badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                ${active
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'}`}>
                {badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Market filter */}
      <div className="px-4">
        <p className="text-[11px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">Market</p>
        <div className="flex flex-wrap gap-1.5">
          {marketFilters.map(f => (
            <button
              key={f}
              onClick={() => toggle('market', f)}
              className={`text-[12px] font-medium px-3 py-1 rounded-full border transition-all duration-150
                ${filters.market === f
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                  : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-white/30'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Type filter */}
      <div className="px-4">
        <p className="text-[11px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">Type</p>
        <div className="flex flex-wrap gap-1.5">
          {typeFilters.map(f => (
            <button
              key={f}
              onClick={() => toggle('type', f)}
              className={`text-[12px] font-medium px-3 py-1 rounded-full border transition-all duration-150
                ${filters.type === f
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                  : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-white/30'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Last scan */}
      <div className="px-4 mt-auto">
        <div className="bg-gray-50 dark:bg-white/4 rounded-2xl p-3.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Last Scan</p>
          </div>
          <p className="text-[13px] font-bold text-gray-800 dark:text-gray-200">Jun 1, 2026</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Auto-scan ทุก 7 วัน</p>
        </div>
      </div>
    </aside>
  )
}
