import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { plugins } from '../data/opportunities'
import { Plus } from 'lucide-react'

export default function PluginBar() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { y: 16, opacity: 0, duration: 0.45, ease: 'power3.out', delay: 0.4 })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={ref}
      className="flex items-center gap-4 px-5 py-4 mb-6 rounded-2xl
        bg-white dark:bg-[#13131F]
        border border-dashed border-gray-200 dark:border-white/8"
    >
      <span className="text-xl">🧩</span>
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400">Plugin Slots</p>
        <p className="text-[12px] text-gray-400 mt-0.5">เชื่อมต่อ Scout Agent, Trend Watcher, หรือ Data Source เพิ่มเติม</p>
      </div>
      <div className="flex gap-2">
        {plugins.map((p, i) => (
          <button
            key={i}
            title={p.label}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base border transition-all duration-150
              ${p.connected
                ? 'border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400'
                : p.isAdd
                  ? 'border-gray-200 dark:border-white/10 text-gray-400 hover:border-emerald-300 hover:text-emerald-500'
                  : 'border-gray-200 dark:border-white/10 text-gray-400 hover:border-violet-300 hover:text-violet-500'
              }`}
          >
            {p.isAdd ? <Plus size={15} /> : p.icon}
          </button>
        ))}
      </div>
    </div>
  )
}
