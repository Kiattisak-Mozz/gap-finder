import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { opportunities } from '../data/opportunities'
import { useLang } from '../i18n/LanguageContext'
import PageHeader from '../components/ui/PageHeader'
import DecisionChip from '../components/ui/DecisionChip'

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const roiMap = { 'high-2': 92, 'high-3': 78, 'high-4': 63, 'med-2': 55, 'med-3': 42, 'med-4': 35 }
const scoreMap = { 2: 4.8, 3: 4.4, 4: 4.0, 5: 3.5 }
const marketCount = { thai: 32, sea: 15, global: 8 }
const EMOJIS = ['👩', '👨', '🧑']

const filterDefs = [
  { key: 'filter.all',     match: () => true },
  { key: 'filter.thai',    match: o => o.market === 'thai' },
  { key: 'filter.sea',     match: o => o.market === 'sea' },
  { key: 'filter.global',  match: o => o.market === 'global' },
  { key: 'filter.passive', match: o => o.type === 'passive' },
  { key: 'filter.hybrid',  match: o => o.type === 'hybrid' },
]

export default function Opportunities() {
  const [active, setActive] = useState('filter.all')
  const ref = useRef(null)
  const { t, lang, localize } = useLang()

  useEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { y: 16, opacity: 0, duration: 0.45, ease: 'expo.out', clearProps: 'opacity,transform' })
    }, ref)
    return () => ctx.revert()
  }, [])

  const filtered = opportunities.filter(filterDefs.find(f => f.key === active)?.match || (() => true))
  const headers = ['th.opportunity', 'th.market', 'th.roi', 'th.budget', 'th.time', 'th.score', 'th.status']

  return (
    <div ref={ref} className="page-enter px-5 sm:px-8 pb-10">
      <PageHeader title={t('nav.opportunities')} subtitle={t('opps.page.sub')} />

      {/* Filter chips */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {filterDefs.map(f => {
          const on = active === f.key
          return (
            <button key={f.key} onClick={() => setActive(f.key)}
              className="tap-44 text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-colors"
              style={on
                ? { background: 'var(--primary)', color: 'var(--on-primary)', borderColor: 'transparent' }
                : { background: 'transparent', color: 'var(--muted)', borderColor: 'var(--border-2)' }}>
              {t(f.key)}
            </button>
          )
        })}
        <span className="ml-auto text-[12px]" style={{ color: 'var(--muted)' }}>{t('opps.results', { n: filtered.length })}</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 720 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {headers.map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap"
                    style={{ color: 'var(--muted)' }}>{t(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(opp => {
                const roiPct = roiMap[`${opp.roi}-${opp.difficulty}`] ?? 50
                const score = scoreMap[opp.difficulty] ?? 3.5
                const count = marketCount[opp.market] ?? 8
                return (
                  <tr key={opp.id} className="transition-colors cursor-pointer hover:bg-[var(--surface-2)]"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg grid place-items-center text-base flex-shrink-0" style={{ background: opp.iconBg }}>{opp.icon}</span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{lang === 'en' ? opp.titleEn : opp.title}</p>
                          <p className="text-[11px]" style={{ color: 'var(--muted)' }}>{localize(opp.subtitle, 'subtitle')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5">
                          {EMOJIS.map((e, i) => (
                            <span key={i} className="w-6 h-6 rounded-full grid place-items-center text-xs"
                              style={{ background: 'var(--surface-2)', border: '2px solid var(--surface)' }}>{e}</span>
                          ))}
                        </div>
                        <span className="text-[12px] tnum" style={{ color: 'var(--muted)' }}>+{count}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                          <div className="h-full rounded-full" style={{ width: `${roiPct}%`, background: 'var(--primary)' }} />
                        </div>
                        <span className="text-[11px] font-semibold tnum" style={{ color: 'var(--text-2)' }}>{roiPct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[12px] font-medium tnum" style={{ color: 'var(--text-2)' }}>{opp.budget.total}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[12px] tnum" style={{ color: 'var(--muted)' }}>{localize(opp.timeToROI, 'time')}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13px] font-bold tnum" style={{ color: 'var(--text-2)' }}>★ {score}</span>
                    </td>
                    <td className="px-5 py-4"><DecisionChip type={opp.statusType} size="sm" /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
