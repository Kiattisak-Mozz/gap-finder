import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Plus, Check } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import PageHeader from '../components/ui/PageHeader'

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const pluginList = [
  { icon: '🔍', name: 'Scout Agent',   descKey: 'plugin.scout',   connected: true },
  { icon: '📈', name: 'Trend Watcher', descKey: 'plugin.trend',   connected: true },
  { icon: '⚔️', name: 'Skeptic',       descKey: 'plugin.skeptic', connected: false },
  { icon: '📊', name: 'Data Source',   descKey: 'plugin.data',    connected: false },
  { icon: '🤖', name: 'AI Analyst',    descKey: 'plugin.analyst', connected: false },
  { icon: '📣', name: 'Market Radar',  descKey: 'plugin.radar',   connected: false },
]

export default function Plugins() {
  const ref = useRef(null)
  const { t } = useLang()

  useEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.plugin-card', { y: 20, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'expo.out', delay: 0.1, clearProps: 'opacity,transform' })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="page-enter px-5 sm:px-8 pb-10">
      <PageHeader title={t('nav.plugins')} subtitle={t('plugins.sub')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {pluginList.map(p => (
          <div key={p.name} className="plugin-card rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl grid place-items-center text-xl flex-shrink-0" style={{ background: 'var(--surface-2)' }}>
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{p.name}</h3>
                <p className="text-[12px] mt-0.5 leading-snug" style={{ color: 'var(--muted)' }}>{t(p.descKey)}</p>
              </div>
            </div>

            <button
              className="tap-44 inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-[12px] font-semibold transition-colors mt-auto"
              style={p.connected
                ? { background: 'var(--build-soft)', color: 'var(--build-ink)' }
                : { background: 'var(--primary)', color: 'var(--on-primary)' }}>
              {p.connected
                ? <><Check size={13} strokeWidth={2.6} /> {t('plugins.connected')}</>
                : <><Plus size={13} strokeWidth={2.6} /> {t('plugins.connect')}</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
