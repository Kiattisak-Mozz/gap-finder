import { ArrowUpRight } from 'lucide-react'

export default function Card({ children, title, info, action, className = '', noPad = false }) {
  return (
    <div className={`bg-white dark:bg-[#1B1F2A] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-gray-800 dark:text-white">{title}</h3>
            {info && (
              <span className="w-4 h-4 rounded-full bg-gray-100 dark:bg-white/10 text-gray-400 text-[9px] flex items-center justify-center font-bold cursor-help">i</span>
            )}
          </div>
          {action ?? (
            <button className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/6 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors">
              <ArrowUpRight size={13} className="text-gray-400" />
            </button>
          )}
        </div>
      )}
      <div className={noPad ? '' : 'px-5 pb-5'}>
        {children}
      </div>
    </div>
  )
}
