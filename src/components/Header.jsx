import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Sun, Moon, Bell, Search } from 'lucide-react'

export default function Header({ isDark, toggleTheme }) {
  const headerRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    gsap.from(headerRef.current, { y: -60, opacity: 0, duration: 0.7, ease: 'power3.out' })
    gsap.to(dotRef.current, {
      scale: 1.4,
      opacity: 0.4,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, [])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5
        bg-white/80 dark:bg-[#0E0E16]/80 backdrop-blur-md
        border-b border-gray-100 dark:border-white/5"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <div
            ref={dotRef}
            className="w-2.5 h-2.5 rounded-full bg-accent-green"
          />
        </div>
        <span className="font-mono font-bold text-lg tracking-tight text-gray-900 dark:text-white">
          GAP<span className="text-accent-green">.</span>FINDER
        </span>
        <span className="ml-1 text-[10px] font-mono bg-accent-purple/10 text-accent-purple px-2 py-0.5 rounded-full">
          BETA v0.1
        </span>
      </div>

      {/* Search bar */}
      <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-white/5 rounded-xl px-4 py-2 w-64">
        <Search size={14} className="text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาโอกาส... / Search gaps..."
          className="bg-transparent text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bell size={18} className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-white transition-colors" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-orange rounded-full" />
        </div>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center
            bg-gray-100 dark:bg-white/8 hover:bg-gray-200 dark:hover:bg-white/12
            text-gray-600 dark:text-gray-300 transition-all duration-200"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-green flex items-center justify-center text-white text-xs font-bold">
          G
        </div>
      </div>
    </header>
  )
}
