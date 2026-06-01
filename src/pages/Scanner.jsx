import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLang } from '../i18n/LanguageContext'
import PageHeader from '../components/ui/PageHeader'

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const scans = [
  { mkt: 'mkt.thai',   found: 8, new: 2, lastScan: '1 Jun 2026',  status: 'done' },
  { mkt: 'mkt.sea',    found: 6, new: 1, lastScan: '1 Jun 2026',  status: 'done' },
  { mkt: 'mkt.global', found: 5, new: 0, lastScan: '28 May 2026', status: 'done' },
  { mkt: 'mkt.us',     found: 5, new: 3, lastScan: null,          status: 'scanning' },
]

export default function Scanner() {
  const ref = useRef(null)
  const { t } = useLang()

  useEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.scan-row', { x: -16, opacity: 0, duration: 0.45, stagger: 0.08, ease: 'expo.out', delay: 0.1, clearProps: 'opacity,transform' })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="page-enter px-5 sm:px-8 pb-10">
      <PageHeader title={t('nav.scanner')} subtitle={t('scanner.sub')} />

      <section className="rounded-2xl p-5 sm:p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
        <h2 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>{t('scanner.statusTitle')}</h2>

        <div className="flex flex-col gap-2.5">
          {scans.map(s => (
            <div key={s.mkt} className="scan-row flex items-center justify-between gap-4 p-4 rounded-xl"
              style={{ background: 'var(--surface-2)' }}>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold truncate" style={{ color: 'var(--text)' }}>{t(s.mkt)}</p>
                <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--muted)' }}>
                  {s.status === 'scanning'
                    ? <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--primary)' }}>
                        <span className="pulse-ring relative inline-block w-1.5 h-1.5" style={{ color: 'var(--primary)' }}>
                          <span className="block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
                        </span>
                        {t('scanner.scanning')}…
                      </span>
                    : `${t('scanner.lastScan')}: ${s.lastScan}`}
                </p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="display text-[20px] font-bold tnum leading-none" style={{ color: 'var(--text)' }}>{s.found}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>{t('scanner.found')}</p>
                </div>
                {s.new > 0 && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: 'var(--build-soft)', color: 'var(--build-ink)' }}>
                    +{s.new} {t('scanner.new')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
          <p className="text-[12px]" style={{ color: 'var(--muted)' }}>{t('scanner.auto')}</p>
          <button className="tap-44 text-[12.5px] font-semibold inline-flex items-center gap-1" style={{ color: 'var(--primary)' }}>
            {t('scanner.run')} →
          </button>
        </div>
      </section>
    </div>
  )
}
