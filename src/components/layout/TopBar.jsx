import { useState } from 'react'
import { Search, Share2, Menu } from 'lucide-react'

export default function TopBar({ title, subtitle, onMenuClick }) {
  const [query, setQuery] = useState('')

  return (
    <div className="flex items-start justify-between px-6 sm:px-8 pt-7 pb-5 flex-wrap gap-4">
      {/* Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-white/8 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/12 transition-colors shadow-sm"
        >
          <Menu size={17} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-gray-900 dark:text-white leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 bg-white dark:bg-white/6 rounded-xl px-3.5 py-2.5
          border border-gray-100 dark:border-white/5 shadow-sm w-[220px] sm:w-[260px]">
          <Search size={13} className="text-gray-400 flex-shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            type="text"
            placeholder="Search for data / people..."
            className="bg-transparent text-[13px] text-gray-600 dark:text-gray-300 placeholder-gray-400 outline-none flex-1 min-w-0"
          />
          <kbd className="hidden sm:block text-[10px] text-gray-300 dark:text-white/20 font-medium bg-gray-50 dark:bg-white/8 px-1.5 py-0.5 rounded flex-shrink-0">
            ⌘K
          </kbd>
        </div>

        <button className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl
          bg-white dark:bg-white/6 border border-gray-100 dark:border-white/5
          text-[13px] font-medium text-gray-600 dark:text-gray-300
          hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm">
          <Share2 size={13} />
          Share
        </button>
      </div>
    </div>
  )
}
