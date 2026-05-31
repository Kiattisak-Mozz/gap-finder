import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { plugins } from '../data/opportunities'
import { Plus } from 'lucide-react'

export default function PluginBar() {
  const barRef = useRef(null)

  useEffect(() => {
    gsap.from(barRef.current, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out', delay: 0.5 })
  }, [])

  return (
    <div
      ref={barRef}
      className="flex items-center gap-4 p-4 mb-6 rounded-2xl
        bg-white dark:bg-[#13131F]
        border border-dashed border-gray-200 dark:border-white/10"
    >
      <div className="text-2xl">🧩</div>
      <div className="flex-1">
        <p className="text-xs font-mono font-bold text-accent-purple">PLUGIN SLOTS — เชื่อมต่อ Agent เพิ่มเติม</p>
        <p className="text-[11px] text-gray-400 mt-0.5">กด + เพื่อเพิ่ม Scout Agent / Trend Watcher / Skeptic หรือ Data Source ใหม่</p>
      </div>
      <div className="flex gap-2">
        {plugins.map((p, i) => (
          <button
            key={i}
            title={p.label}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base border transition-all duration-200
              ${p.connected
                ? 'border-accent-purple/40 bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20'
                : p.isAdd
                  ? 'border-gray-200 dark:border-white/10 text-gray-400 hover:border-accent-green hover:text-accent-green'
                  : 'border-gray-200 dark:border-white/10 text-gray-400 hover:border-accent-purple hover:text-accent-purple'
              }`}
          >
            {p.isAdd ? <Plus size={16} /> : p.icon}
          </button>
        ))}
      </div>
    </div>
  )
}
