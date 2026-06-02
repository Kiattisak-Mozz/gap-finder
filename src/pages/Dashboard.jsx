import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUpRight, Plus, Zap, Clock, Hammer,
  TrendingUp, Pause, Square, Filter, ChevronRight,
} from 'lucide-react'
import { opportunities } from '../data/opportunities'
import { decision } from '../data/decision'
import DecisionChip from '../components/ui/DecisionChip'
import { useLang } from '../i18n/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const wkKeys = ['wk.mon', 'wk.tue', 'wk.wed', 'wk.thu', 'wk.fri', 'wk.sat', 'wk.sun']

/* ── Weekly discovery: daily new-gap counts (peak = Wed) ── */
const chartData = [
  { val: 4 },
  { val: 9 },
  { val: 14, peakLabel: '76%' },
  { val: 11 },
  { val: 6 },
  { val: 5 },
  { val: 3 },
]

/* Catmull-Rom → cubic Bézier for a smooth trend line */
function smoothPath(p) {
  if (p.length < 2) return ''
  let d = `M ${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

function DiscoveryChart() {
  const { t } = useLang()
  const wrapRef = useRef(null)
  const lineRef = useRef(null)
  const areaRef = useRef(null)
  const dotsRef = useRef([])
  const scanRef = useRef(null)
  const didAnim = useRef(false)
  const [w, setW] = useState(560)

  const H = 158, padT = 30, padB = 26, padX = 16
  const n = chartData.length
  const max = Math.max(...chartData.map(d => d.val)) * 1.12

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const innerW = Math.max(1, w - padX * 2)
  const pts = chartData.map((d, i) => ({
    d, i,
    x: padX + (n === 1 ? 0 : (innerW * i) / (n - 1)),
    y: padT + (1 - d.val / max) * (H - padT - padB),
  }))
  const linePath = smoothPath(pts)
  const baseY = H - padB
  const areaPath = `${linePath} L ${pts[n - 1].x.toFixed(1)} ${baseY} L ${pts[0].x.toFixed(1)} ${baseY} Z`
  const peak = pts.reduce((a, b) => (b.d.val > a.d.val ? b : a), pts[0])

  useEffect(() => {
    if (didAnim.current || reduceMotion() || !lineRef.current) return
    didAnim.current = true
    const len = lineRef.current.getTotalLength()
    gsap.fromTo(lineRef.current, { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 1.1, ease: 'expo.out' })
    if (areaRef.current) gsap.fromTo(areaRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7, delay: 0.25 })
    gsap.fromTo(dotsRef.current.filter(Boolean), { opacity: 0 },
      { opacity: 1, duration: 0.35, stagger: 0.07, delay: 0.5, ease: 'power2.out' })
    // radar scan-line sweeps across as the line draws, then fades
    if (scanRef.current) {
      gsap.set(scanRef.current, { opacity: 0.9 })
      gsap.fromTo(scanRef.current, { x: padX }, {
        x: w - padX, duration: 1.1, ease: 'power1.inOut',
        onComplete: () => gsap.to(scanRef.current, { opacity: 0, duration: 0.3 }),
      })
    }
  }, [w])

  return (
    <div ref={wrapRef} className="relative mt-4" style={{ height: H }}>
      <svg width={w} height={H} className="block overflow-visible" role="img"
        aria-label={t('weekly.sub')}>
        <defs>
          <linearGradient id="discFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* baseline */}
        <line x1={padX} y1={baseY} x2={w - padX} y2={baseY} stroke="var(--border)" strokeWidth="1" />

        <path ref={areaRef} d={areaPath} fill="url(#discFill)" />
        <path ref={lineRef} d={linePath} fill="none" stroke="var(--primary)"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* radar scan-line */}
        <line ref={scanRef} x1="0" y1={padT - 6} x2="0" y2={baseY} opacity="0"
          stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" />

        {pts.map((p, i) => {
          const isPeak = p.i === peak.i
          return (
            <circle key={i} ref={el => dotsRef.current[i] = el}
              cx={p.x} cy={p.y} r={isPeak ? 5 : 3.5}
              fill={isPeak ? 'var(--primary)' : 'var(--surface)'}
              stroke="var(--primary)" strokeWidth={isPeak ? 3 : 2} />
          )
        })}

        {/* weekday axis */}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H - 7} textAnchor="middle"
            fontSize="11" fill="var(--muted)" fontFamily="var(--font-sans)">{t(wkKeys[i])}</text>
        ))}
      </svg>

      {/* peak callout */}
      <span className="mono absolute text-[10px] font-bold px-1.5 py-0.5 rounded-md -translate-x-1/2 pointer-events-none"
        style={{ left: peak.x, top: peak.y - 26, background: 'var(--primary)', color: 'var(--on-primary)' }}>
        {peak.d.peakLabel || peak.d.val}
      </span>
    </div>
  )
}

/* ── Conversion gauge ── */
function Gauge({ percent }) {
  const { t } = useLang()
  const pathRef = useRef(null)
  const pctRef = useRef(null)
  const R = 54
  const half = Math.PI * R
  const arc = (a1, a2) => {
    const x1 = 72 + R * Math.cos(a1), y1 = 70 + R * Math.sin(a1)
    const x2 = 72 + R * Math.cos(a2), y2 = 70 + R * Math.sin(a2)
    return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`
  }
  useEffect(() => {
    if (reduceMotion()) {
      if (pathRef.current) pathRef.current.style.strokeDasharray = `${(percent / 100) * half} ${half}`
      if (pctRef.current) pctRef.current.textContent = percent + '%'
      return
    }
    if (pathRef.current) {
      gsap.fromTo(pathRef.current, { strokeDasharray: `0 ${half}` },
        { strokeDasharray: `${(percent / 100) * half} ${half}`, duration: 1.2, ease: 'expo.out', delay: 0.2 })
    }
    if (pctRef.current) {
      const o = { v: 0 }
      gsap.to(o, { v: percent, duration: 1.2, delay: 0.2, ease: 'expo.out',
        onUpdate: () => { if (pctRef.current) pctRef.current.textContent = Math.round(o.v) + '%' } })
    }
  }, [])
  return (
    <div className="flex flex-col items-center">
      <svg width={144} height={80} viewBox="0 0 144 80">
        <path d={arc(Math.PI, 2 * Math.PI)} fill="none" stroke="var(--surface-2)" strokeWidth={12} strokeLinecap="round" />
        <path ref={pathRef} d={arc(Math.PI, 2 * Math.PI)} fill="none" stroke="var(--primary)"
          strokeWidth={12} strokeLinecap="round" strokeDasharray={`0 ${half}`} />
      </svg>
      <div style={{ marginTop: -26, textAlign: 'center' }}>
        <p ref={pctRef} className="display text-[28px] font-bold tnum tracking-tight" style={{ color: 'var(--text)' }}>0%</p>
        <p className="text-[11px]" style={{ color: 'var(--muted)' }}>{t('rate.sub')}</p>
      </div>
    </div>
  )
}

/* ── Live build timer ── */
function Timer() {
  const [s, setS] = useState(5048)
  useEffect(() => {
    const t = setInterval(() => setS(x => x + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const hh = String(Math.floor(s / 3600)).padStart(2, '0')
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return (
    <span className="mono text-[28px] font-bold tracking-tight tnum" style={{ color: 'var(--on-hero)' }}>
      {hh}:{mm}:{sec}
    </span>
  )
}

/* ── Opportunity card ── */
function OpCard({ opp, index }) {
  const { t, lang, localize } = useLang()
  const ref = useRef(null)
  useEffect(() => {
    const card = ref.current
    // Entrance is handled by the page's ScrollTrigger.batch('.op-card'); here we own interaction only.

    // Game-card 3D tilt + glare (hover-capable, motion-on only)
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let cleanupTilt = () => {}
    if (fine && !reduceMotion()) {
      gsap.set(card, { transformPerspective: 800 })
      const rX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' })
      const rY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' })
      const y = gsap.quickTo(card, 'y', { duration: 0.4, ease: 'power3' })
      let raf = 0
      const move = e => {
        if (raf) return
        raf = requestAnimationFrame(() => {
          raf = 0
          const r = card.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width
          const py = (e.clientY - r.top) / r.height
          rX((0.5 - py) * 9)
          rY((px - 0.5) * 9)
          card.style.setProperty('--gx', `${px * 100}%`)
          card.style.setProperty('--gy', `${py * 100}%`)
        })
      }
      const enter = () => y(-6)
      const leave = () => { rX(0); rY(0); y(0) }
      card.addEventListener('pointermove', move)
      card.addEventListener('pointerenter', enter)
      card.addEventListener('pointerleave', leave)
      cleanupTilt = () => {
        card.removeEventListener('pointermove', move)
        card.removeEventListener('pointerenter', enter)
        card.removeEventListener('pointerleave', leave)
      }
    }
    return () => { cleanupTilt() }
  }, [])
  return (
    <article ref={ref} tabIndex={0} role="button"
      aria-label={`${lang === 'en' ? opp.titleEn : opp.title} — ${t('opp.detail')}`}
      className="op-card group tilt relative rounded-2xl p-5 cursor-pointer transition-shadow duration-200 outline-none flex flex-col gap-3 hover:shadow-lg"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--card-shadow)',
      }}>
      <span className="glare" aria-hidden="true" />
      {/* header — what it is + the verdict */}
      <div className="relative flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl grid place-items-center text-xl flex-shrink-0"
          style={{ background: opp.iconBg }}>{opp.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold leading-snug" style={{ color: 'var(--text)' }}>
            {lang === 'en' ? opp.titleEn : opp.title}
          </h3>
          <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{localize(opp.subtitle, 'subtitle')}</p>
        </div>
        <DecisionChip type={opp.statusType} size="sm" />
      </div>

      {/* the gap — the one reason worth scanning */}
      <p className="relative text-[12.5px] leading-snug line-clamp-2" style={{ color: 'var(--text-2)' }}>
        <span style={{ color: 'var(--muted)' }}>{t('opp.gap')}: </span>
        {lang === 'en' ? opp.gapEn : opp.gap}
      </p>

      {/* compact meta — secondary decision factors */}
      <div className="relative flex items-center gap-3 text-[11px]" style={{ color: 'var(--muted)' }}>
        <span className="tnum">{opp.budget.total}</span>
        <span className="inline-flex items-center gap-1"><Zap size={11} />{t(`diff.${opp.difficulty}`)}</span>
        <span className="inline-flex items-center gap-1"><Clock size={11} />{localize(opp.timeToROI, 'time')}</span>
      </div>

      {/* footer — the hook (income) + go to detail */}
      <div className="relative flex items-end justify-between pt-3 mt-auto" style={{ borderTop: '1px solid var(--border)' }}>
        <div>
          <p className="text-[10px]" style={{ color: 'var(--muted)' }}>{t('opp.income')}</p>
          <p className="text-[18px] font-bold tnum leading-none mt-1" style={{ color: 'var(--primary)' }}>{localize(opp.income, 'income')}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[12px] font-medium" style={{ color: 'var(--muted)' }}>
          <span className="hidden sm:inline group-hover:text-[color:var(--primary)] transition-colors">{t('opp.detail')}</span>
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--primary)' }} />
        </span>
      </div>
    </article>
  )
}

/* ══════════════════════════ DASHBOARD ══════════════════════════ */
export default function Dashboard() {
  const { t, lang, localize } = useLang()
  const pageRef = useRef(null)
  const stripRef = useRef(null)
  const bottomRef = useRef(null)
  const heroRef = useRef(null)

  const topOpp = opportunities.find(o => o.featured) || opportunities[0]
  const buildCount = opportunities.filter(o => o.statusType === 'ready').length
  const scopedCount = opportunities.filter(o => o.statusType === 'build').length
  const researchCount = opportunities.filter(o => o.statusType === 'research').length

  const signals = [
    { label: 'GAPS FOUND', th: t('sig.gaps'), value: 24, suffix: '', note: t('sig.gaps.note'), featured: true,
      spark: [8, 11, 9, 14, 12, 18, 24] },
    { label: 'READY TO BUILD', th: t('sig.ready'), value: 9, suffix: '', note: t('sig.ready.note') },
    { label: 'AVG ROI', th: t('sig.roi'), value: 340, suffix: '%', note: t('sig.roi.note') },
    { label: 'MIN BUDGET', th: t('sig.budget'), value: 0, prefix: '฿', suffix: '', note: t('sig.budget.note') },
  ]

  useEffect(() => {
    const rm = reduceMotion()
    const scroller = document.getElementById('app-scroll')
    // Lavish intro plays once per browser session; repeat visits go straight in.
    const lavish = !rm && sessionStorage.getItem('gap-intro-seen') !== '1'
    if (lavish) sessionStorage.setItem('gap-intro-seen', '1')
    let heroCleanup = () => {}
    const ctx = gsap.context(() => {
      // Above-the-fold intro: only on the first session visit
      if (lavish) {
        gsap.from('.gw', { y: 14, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'expo.out' })
        if (stripRef.current?.children?.length)
          gsap.from(stripRef.current.children, { y: 14, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'expo.out', delay: 0.1, clearProps: 'opacity,transform' })
      }

      // Count-up: scrubbed by intro on first visit, quick on repeat, instant for reduced-motion
      pageRef.current?.querySelectorAll('[data-count]').forEach(el => {
        const v = parseFloat(el.dataset.count)
        const render = n => el.textContent = (el.dataset.prefix || '') + Math.round(n) + (el.dataset.suffix || '')
        if (!v) { render(0); return }
        if (rm) { render(v); return }
        const o = { n: 0 }
        gsap.to(o, {
          n: v, duration: lavish ? 1.3 : 0.5, delay: lavish ? 0.2 : 0, ease: 'expo.out', onUpdate: () => render(o.n),
          onComplete: lavish ? () => gsap.fromTo(el, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }) : undefined,
        })
      })

      // Scroll-driven reveals below the fold (correct scroller = the scrolling <main>)
      if (!rm && scroller) {
        ScrollTrigger.batch('.op-card', {
          scroller, start: 'top 92%', once: true,
          onEnter: els => gsap.from(els, { y: 26, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'expo.out', clearProps: 'opacity,transform' }),
        })
        if (bottomRef.current?.children?.length)
          gsap.from(bottomRef.current.children, {
            y: 22, opacity: 0, duration: 0.55, stagger: 0.08, ease: 'expo.out', clearProps: 'opacity,transform',
            scrollTrigger: { trigger: bottomRef.current, scroller, start: 'top 90%', once: true },
          })
        requestAnimationFrame(() => ScrollTrigger.refresh())
      }

      // Hero: one-shot sheen + pointer-tracked glow (hover-capable only)
      const hero = heroRef.current
      if (hero && !rm && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        hero.classList.add('sheen-go')
        let raf = 0
        const move = e => {
          if (raf) return
          raf = requestAnimationFrame(() => {
            raf = 0
            const r = hero.getBoundingClientRect()
            hero.style.setProperty('--gx', `${e.clientX - r.left}px`)
            hero.style.setProperty('--gy', `${e.clientY - r.top}px`)
          })
        }
        hero.addEventListener('pointermove', move)
        heroCleanup = () => hero.removeEventListener('pointermove', move)
      }
    }, pageRef)
    return () => { ctx.revert(); heroCleanup(); ScrollTrigger.getAll().forEach(s => s.kill()) }
  }, [])

  return (
    <div ref={pageRef} className="page-enter px-5 sm:px-8 pb-10">

      {/* ── Header ── */}
      <header className="flex items-end justify-between pt-7 pb-6 flex-wrap gap-4">
        <div>
          <h1 className="display text-[28px] sm:text-[34px] font-bold leading-none tracking-tight" style={{ color: 'var(--text)' }}>
            {t('dash.title').split('').map((c, i) => <span key={i} className="gw inline-block">{c === ' ' ? ' ' : c}</span>)}
          </h1>
          <p className="text-[13px] mt-2 max-w-[60ch]" style={{ color: 'var(--muted)' }}>
            {t('dash.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="tap-44 text-[13px] font-medium px-4 py-2.5 rounded-xl transition-colors hover:bg-[var(--surface-2)]"
            style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}>
            {t('dash.import')}
          </button>
          <button className="btn-glow tap-44 inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2.5 rounded-xl"
            style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-press)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}>
            <Plus size={15} strokeWidth={2.6} /> {t('dash.addGap')}
          </button>
        </div>
      </header>

      {/* ── Signal strip (one panel, hairline-divided) ── */}
      <div ref={stripRef} className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden mb-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
        {signals.map((s, i) => (
          <div key={s.label}
            className={`relative p-5 sm:p-6 border-[var(--border)] ${
              // 2-col on mobile, 4-col on lg — dividers correct for both
              ['', 'border-l', 'border-t lg:border-t-0 lg:border-l', 'border-l border-t lg:border-t-0'][i]
            }`}
            style={{ background: s.featured ? 'var(--primary-soft)' : 'transparent' }}>
            <span className="lg:hidden" />
            <p className="mono text-[10px] font-semibold tracking-widest mb-3"
              style={{ color: s.featured ? 'var(--scoped-ink)' : 'var(--muted)' }}>{s.label}</p>
            <div className="flex items-end gap-2">
              <p data-count={s.value} data-prefix={s.prefix || ''} data-suffix={s.suffix}
                className="display text-[28px] sm:text-[34px] font-bold leading-none tnum tracking-tight"
                style={{ color: 'var(--text)' }}>{s.prefix || ''}0{s.suffix}</p>
              {s.spark && <Sparkline data={s.spark} />}
            </div>
            <p className="text-[12px] mt-2.5 font-medium" style={{ color: 'var(--text-2)' }}>{s.th}</p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>{s.note}</p>
          </div>
        ))}
      </div>

      {/* ── Middle: analytics + pipeline | top opportunity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 mb-5">

        <section className="rounded-2xl p-6 min-w-0"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>{t('weekly.title')}</h2>
              <p className="text-[12px] mt-0.5" style={{ color: 'var(--muted)' }}>{t('weekly.sub')}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold"
              style={{ color: 'var(--build)' }}><TrendingUp size={13} /> +18%</span>
          </div>
          <DiscoveryChart />

          {/* Decision pipeline — vertical list on phone, 3-up on sm+ */}
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-3 mt-6 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
            {[
              { k: 'ready', n: buildCount },
              { k: 'build', n: scopedCount },
              { k: 'research', n: researchCount },
            ].map(({ k, n }) => {
              const d = decision[k]; const { Icon } = d
              return (
                <div key={k}
                  className="rounded-xl px-3 py-2.5 sm:py-3 bg-[var(--surface-2)]
                    flex items-center gap-2.5 sm:flex-col sm:items-stretch sm:gap-0"
                  style={{ background: 'var(--surface-2)' }}>
                  {/* phone: leading icon */}
                  <Icon size={15} strokeWidth={2.4} className="flex-shrink-0 sm:hidden" style={{ color: d.fill }} />
                  {/* sm+: icon + code label row */}
                  <div className="hidden sm:flex items-center gap-1.5 mb-1.5">
                    <Icon size={13} strokeWidth={2.4} style={{ color: d.fill }} />
                    <span className="text-[10px] font-bold tracking-wide" style={{ color: d.ink }}>{d.label}</span>
                  </div>
                  {/* phone: stage name */}
                  <span className="flex-1 sm:hidden text-[12px] font-semibold" style={{ color: 'var(--text)' }}>{t(d.thKey)}</span>
                  <p className="display text-[18px] sm:text-[22px] font-bold tnum leading-none tracking-tight" style={{ color: 'var(--text)' }}>{n}</p>
                  {/* sm+: stage name below number */}
                  <p className="hidden sm:block text-[11px] mt-1" style={{ color: 'var(--muted)' }}>{t(d.thKey)}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Top opportunity hero */}
        <section ref={heroRef} className="group sheen-host rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
          style={{ background: 'var(--hero-grad)', minHeight: 300 }}>
          <span className="glow-blob" aria-hidden="true" />
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.08]" style={{ background: 'var(--on-hero)' }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="pulse-ring relative inline-block w-2 h-2" style={{ color: 'var(--secondary)' }}>
                <span className="block w-2 h-2 rounded-full" style={{ background: 'var(--secondary)' }} />
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--on-hero)', opacity: 0.7 }}>
                {t('top.rank')}
              </p>
            </div>
            <h2 className="display text-[18px] font-bold leading-snug mb-1.5" style={{ color: 'var(--on-hero)' }}>
              {lang === 'en' ? topOpp.titleEn : topOpp.title}
            </h2>
            <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'var(--on-hero)', opacity: 0.65 }}>
              {lang === 'en' ? topOpp.gapEn : topOpp.gap}
            </p>
            <div className="flex items-center gap-4 mb-1">
              <div>
                <p className="text-[10px]" style={{ color: 'var(--on-hero)', opacity: 0.55 }}>{t('top.income')}</p>
                <p className="text-[18px] font-bold tnum" style={{ color: 'var(--secondary)' }}>{localize(topOpp.income, 'income')}</p>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: 'var(--on-hero)', opacity: 0.55 }}>{t('top.payback')}</p>
                <p className="text-[18px] font-bold tnum" style={{ color: 'var(--on-hero)' }}>{localize(topOpp.timeToROI, 'time')}</p>
              </div>
            </div>
          </div>
          <button className="btn-glow relative mt-5 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold hover:scale-[1.02]"
            style={{ background: 'var(--on-primary)', color: 'var(--primary-press)' }}>
            <Hammer size={15} strokeWidth={2.5} /> {t('top.start')}
          </button>
        </section>
      </div>

      {/* ── Opportunity grid ── */}
      <section className="mb-5">
        <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="display text-[18px] font-bold" style={{ color: 'var(--text)' }}>{t('opps.title')}</h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--muted)' }}>{t('opps.sub', { n: opportunities.length })}</p>
          </div>
          <button className="tap-44 inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-2 rounded-lg transition-colors hover:bg-[var(--surface-2)]"
            style={{ color: 'var(--text-2)', border: '1px solid var(--border)' }}>
            <Filter size={13} /> {t('opps.filter')}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {opportunities.map((opp, i) => <OpCard key={opp.id} opp={opp} index={i} />)}
        </div>
      </section>

      {/* ── Bottom row ── */}
      <div ref={bottomRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Market activity */}
        <section className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <h3 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>{t('market.title')}</h3>
          <div className="flex flex-col gap-3.5">
            {opportunities.slice(0, 4).map(opp => (
              <div key={opp.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl grid place-items-center text-sm flex-shrink-0"
                  style={{ background: 'var(--surface-2)' }}>{opp.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium truncate" style={{ color: 'var(--text)' }}>{lang === 'en' ? opp.titleEn : opp.title}</p>
                  <p className="text-[11px] truncate" style={{ color: 'var(--muted)' }}>{localize(opp.subtitle, 'subtitle')}</p>
                </div>
                <DecisionChip type={opp.statusType} size="sm" />
              </div>
            ))}
          </div>
        </section>

        {/* Conversion gauge */}
        <section className="rounded-2xl p-6 flex flex-col" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <h3 className="text-[15px] font-semibold mb-2" style={{ color: 'var(--text)' }}>{t('rate.title')}</h3>
          <div className="flex-1 grid place-items-center"><Gauge percent={41} /></div>
          <div className="flex items-center justify-center gap-4 mt-3">
            {[{ l: 'Build', c: 'var(--build)' }, { l: 'Scoped', c: 'var(--primary)' }, { l: 'Research', c: 'var(--park)' }].map(s => (
              <div key={s.l} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.c }} />
                <span className="text-[11px]" style={{ color: 'var(--muted)' }}>{s.l}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Build timer */}
        <section className="rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
          style={{ background: 'var(--hero-grad)', minHeight: 190 }}>
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-[0.07]" style={{ background: 'var(--on-hero)' }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--on-hero)', opacity: 0.6 }}>
              {t('timer.title')}
            </p>
            <Timer />
            <p className="text-[11px] mt-1.5" style={{ color: 'var(--on-hero)', opacity: 0.45 }}>
              {t('timer.sub')}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-5">
            <button aria-label={t('timer.pause')}
              className="w-10 h-10 rounded-xl grid place-items-center transition-opacity hover:opacity-100"
              style={{ background: 'oklch(1 0 0 / 0.12)', color: 'var(--on-hero)', opacity: 0.8 }}>
              <Pause size={15} fill="currentColor" />
            </button>
            <button aria-label={t('timer.stop')}
              className="w-10 h-10 rounded-xl grid place-items-center transition-transform hover:scale-105"
              style={{ background: 'var(--kill)', color: 'oklch(0.99 0.01 25)' }}>
              <Square size={13} fill="currentColor" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

/* ── Tiny sparkline ── */
function Sparkline({ data }) {
  const max = Math.max(...data), min = Math.min(...data)
  const w = 56, h = 26
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * h
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mb-1.5 flex-shrink-0" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
