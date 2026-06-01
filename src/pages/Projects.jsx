import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { opportunities } from '../data/opportunities'
import { useLang } from '../i18n/LanguageContext'
import PageHeader from '../components/ui/PageHeader'
import DecisionChip from '../components/ui/DecisionChip'

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Projects() {
  const ref = useRef(null)
  const { t, lang, localize } = useLang()

  useEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.proj-card', { y: 22, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'expo.out', delay: 0.1, clearProps: 'opacity,transform' })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="page-enter px-5 sm:px-8 pb-10">
      <PageHeader title={t('nav.projects')} subtitle={t('projects.sub')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {opportunities.map(opp => (
          <article key={opp.id}
            className="proj-card rounded-2xl p-5 cursor-pointer transition-shadow duration-200"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl grid place-items-center text-xl flex-shrink-0" style={{ background: opp.iconBg }}>
                {opp.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13.5px] font-semibold leading-snug" style={{ color: 'var(--text)' }}>
                  {lang === 'en' ? opp.titleEn : opp.title}
                </h3>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{localize(opp.subtitle, 'subtitle')}</p>
              </div>
            </div>

            <div className="flex items-end justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <div>
                <p className="text-[10px]" style={{ color: 'var(--muted)' }}>{t('projects.estIncome')}</p>
                <p className="text-[14px] font-bold tnum" style={{ color: 'var(--primary)' }}>{localize(opp.income, 'income')}</p>
              </div>
              <DecisionChip type={opp.statusType} size="sm" />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
