import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import StatsRow from './components/StatsRow'
import PluginBar from './components/PluginBar'
import OpportunityCard from './components/OpportunityCard'
import ProjectTable from './components/ProjectTable'
import { opportunities } from './data/opportunities'

export default function App() {
  const { isDark, toggle } = useTheme()
  const [filters, setFilters] = useState({ market: null, budget: null, type: null })

  const filtered = opportunities.filter(opp => {
    if (filters.market) {
      const m = filters.market.toLowerCase()
      if (m.includes('thai') && opp.market !== 'thai') return false
      if (m.includes('sea') && opp.market !== 'sea') return false
      if (m.includes('global') && opp.market !== 'global') return false
    }
    if (filters.type) {
      const t = filters.type.toLowerCase()
      if (t.includes('passive') && opp.type !== 'passive') return false
      if (t.includes('hybrid') && opp.type !== 'hybrid') return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090F] font-sans transition-colors duration-300">
      <Header isDark={isDark} toggleTheme={toggle} />

      <div className="flex" style={{ height: 'calc(100vh - 57px)' }}>
        <Sidebar filters={filters} setFilters={setFilters} />

        {/* Main scroll area */}
        <main className="flex-1 overflow-y-auto px-6 py-6">

          {/* Floating decorative orbs */}
          <div className="pointer-events-none fixed top-20 right-20 w-64 h-64 rounded-full bg-accent-purple/5 blur-3xl" />
          <div className="pointer-events-none fixed bottom-40 left-64 w-48 h-48 rounded-full bg-accent-green/5 blur-3xl" />

          {/* Stats */}
          <StatsRow />

          {/* Plugin bar */}
          <PluginBar />

          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-mono font-bold text-gray-800 dark:text-white">
              🎯 TOP GAP OPPORTUNITIES
              <span className="ml-2 text-[11px] text-gray-400 font-normal">
                ({filtered.length} รายการ)
              </span>
            </h2>
            <button className="text-[11px] text-accent-green font-mono hover:underline">
              ดูทั้งหมด 24 →
            </button>
          </div>

          {/* Cards bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {filtered.map((opp, i) => (
              <OpportunityCard key={opp.id} opp={opp} index={i} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-mono text-sm">ไม่พบโอกาสที่ตรงกับ filter</p>
              </div>
            )}
          </div>

          {/* Project table */}
          <ProjectTable />

          <div className="h-8" />
        </main>
      </div>
    </div>
  )
}
