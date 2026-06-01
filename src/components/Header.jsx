import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Sun, Moon, Bell, Search, Menu, X } from 'lucide-react'

const navLinks = ['Dashboard', 'Scanner', 'Passive Income', 'Trends']

export default function Header({ isDark, toggleTheme, onMenuClick }) {
  const ref = useRef(null)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { y: -50, opacity: 0, duration: 0.6, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [])

  return (
    <header
      ref={ref}
      className="sticky top-0 z-50 h-[60px] flex items-center justify-between px-4 sm:px-7
        bg-white/90 dark:bg-[#0D1610]/90 backdrop-blur-xl
        border-b border-[#E4EDE8] dark:border-[#14532D]/60"
    >
      {/* Left — hamburger (mobile) + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/6 transition-colors"
        >
          <Menu size={19} className="text-gray-600 dark:text-gray-400" />
        </button>

        <div className="flex items-center gap-0">
          <span className="text-[20px] font-extrabold text-gray-900 dark:text-white tracking-tight">Gap</span>
          <span className="text-[20px] font-extrabold text-[#22C55E] tracking-tight">Finder</span>
        </div>
      </div>

      {/* Center nav — desktop only */}
      <nav className="hidden lg:flex items-center gap-1">
        {navLinks.map((link, i) => (
          <a
            key={link}
            href="#"
            className={`px-4 py-1.5 rounded-full text-[13.5px] font-medium transition-all duration-150
              ${i === 0
                ? 'bg-[#22C55E] text-white shadow-sm shadow-green-200 dark:shadow-green-900/40'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/6'
              }`}
          >
            {link}
          </a>
        ))}
      </nav>

      {/* Right */}
      <div className="flex items-center gap-1 sm:gap-2">

        {/* Search — expandable on mobile */}
        {searchOpen ? (
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/6 rounded-full px-4 py-2 w-44 sm:w-52">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              className="bg-transparent text-[13px] text-gray-600 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
            />
            <button onClick={() => setSearchOpen(false)}>
              <X size={13} className="text-gray-400" />
            </button>
          </div>
        ) : (
          <>
            {/* Desktop search */}
            <div
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-white/6 rounded-full px-4 py-2 w-48 cursor-text"
            >
              <Search size={13} className="text-gray-400 flex-shrink-0" />
              <span className="text-[13px] text-gray-400 select-none">Search...</span>
            </div>
            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/6 transition-colors"
            >
              <Search size={17} className="text-gray-500 dark:text-gray-400" />
            </button>
          </>
        )}

        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/6 transition-colors">
          <Bell size={17} className="text-gray-500 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#22C55E] rounded-full" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/6 transition-colors"
        >
          {isDark
            ? <Sun size={17} className="text-gray-400" />
            : <Moon size={17} className="text-gray-500" />}
        </button>

        {/* Login — hidden on very small screens */}
        <button className="hidden xs:block ml-1 bg-[#22C55E] hover:bg-[#16A34A] text-white text-[13px] font-semibold px-4 py-1.5 rounded-full transition-colors shadow-sm shadow-green-200 dark:shadow-green-900/30">
          Login
        </button>
      </div>
    </header>
  )
}
