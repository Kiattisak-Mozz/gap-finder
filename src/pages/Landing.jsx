import { useEffect, useRef, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import {
  AlertTriangle, ArrowRight, BarChart3, Brain,
  CalendarDays, CheckCircle2, ChevronRight, Clock,
  Gauge, Hammer, Lightbulb, MessageSquare,
  Puzzle, Radar, Search, Target,
  TrendingUp, Zap,
} from 'lucide-react'
import Logo from '../components/ui/Logo'
import { useLang } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import { opportunities } from '../data/opportunities'
import DecisionChip from '../components/ui/DecisionChip'
import RadarGlobe from '../components/RadarGlobe'

/* Dark surface palette (hero, debate, weekly sections) */
const dp = {
  bg:        'oklch(0.165 0.018 262)',
  surface:   'oklch(0.205 0.020 262)',
  surface2:  'oklch(0.245 0.022 262)',
  border:    'oklch(0.310 0.022 262)',
  text:      'oklch(0.950 0.008 262)',
  text2:     'oklch(0.795 0.012 262)',
  muted:     'oklch(0.660 0.016 262)',
  primary:   'oklch(0.680 0.155 262)',
  secondary: 'oklch(0.720 0.110 205)',
  build:     'oklch(0.700 0.110 195)',
  buildSoft: 'oklch(0.300 0.050 195)',
  buildInk:  'oklch(0.820 0.105 195)',
}

const sectionShell = {
  maxWidth: 1180,
  margin: '0 auto',
  padding: 'clamp(52px, 7vw, 88px) 24px',
}

const sectionTitle = {
  margin: 0,
  fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  lineHeight: 1.16,
  textWrap: 'balance',
}

const rm = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ─── Pipeline phases ─────────────────────────────────────── */
const PHASES = [
  {
    phase: 1, icon: Gauge, status: 'live',
    th: 'Decision Dashboard',
    en: 'Decision Dashboard',
    descTh: 'ดูโอกาส เปรียบเทียบ ตัดสินใจ BUILD/PARK',
    descEn: 'View gaps, compare, decide BUILD/PARK',
  },
  {
    phase: 2, icon: Radar, status: 'live',
    th: 'Scout + Gap Finder',
    en: 'Scout + Gap Finder',
    descTh: 'สแกน TechCrunch, YC, Reddit ทุกสัปดาห์',
    descEn: 'Scan TechCrunch, YC, Reddit each week',
  },
  {
    phase: 3, icon: MessageSquare, status: 'live',
    th: 'Brainstormer + Debate',
    en: 'Brainstormer + Debate',
    descTh: 'สร้าง 3-5 concept แล้วให้ Skeptic + Realist โจมตี',
    descEn: 'Generate 3–5 concepts, Skeptic + Realist push back',
  },
  {
    phase: 4, icon: Target, status: 'live',
    th: 'Synthesizer',
    en: 'Synthesizer',
    descTh: 'ตัดสินใจสุดท้าย + รายงานอัตโนมัติทุกจันทร์',
    descEn: 'Final verdict + auto Monday report',
  },
  {
    phase: 5, icon: TrendingUp, status: 'live',
    th: 'Trend Watcher',
    en: 'Trend Watcher',
    descTh: 'monitor ตลอดเวลา แจ้งเตือนเมื่อ signal แรงขึ้น',
    descEn: 'Background monitor, alert when weak signals spike',
  },
  {
    phase: 6, icon: Puzzle, status: 'live',
    th: 'Plugin System',
    en: 'Plugin System',
    descTh: 'เชื่อม agent ใหม่ได้เองผ่าน API',
    descEn: 'Connect new agents via open API',
  },
]

/* ─── TopNav ─────────────────────────────────────────────── */
function TopNav({ isTh, isDark, toggleLang, toggleTheme }) {
  return (
    <header
      style={{
        background: 'oklch(0.165 0.018 262)',
        borderBottom: '1px solid oklch(0.310 0.022 262)',
      }}
    >
      <div
        className="landing-top-nav flex items-center gap-2 px-4 sm:px-6"
        style={{ maxWidth: 1180, height: 64, margin: '0 auto' }}
      >
        <Link to="/" className="mr-auto" style={{ textDecoration: 'none' }}>
          <Logo size={32} onDark />
        </Link>

        {/* Dark nav in both themes → controls are always translucent light-glass. */}
        <button type="button" onClick={toggleLang}
          aria-label={isTh ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
          className="focus-ring landing-control landing-lang h-11 px-3 flex items-center justify-center rounded-xl text-[12px] font-bold tracking-wide transition-colors"
          style={{
            background: 'oklch(1 0 0 / 0.10)',
            border: '1px solid oklch(1 0 0 / 0.22)',
            color: 'oklch(0.95 0.01 262)',
          }}>
          <span style={{ color: isTh ? 'oklch(0.97 0.012 262)' : 'oklch(0.66 0.02 262)' }}>TH</span>
          <span className="landing-lang-separator" style={{ color: 'oklch(1 0 0 / 0.32)', margin: '0 5px' }}>/</span>
          <span className="landing-lang-alt" style={{ color: isTh ? 'oklch(0.66 0.02 262)' : 'oklch(0.97 0.012 262)' }}>EN</span>
        </button>

        <button type="button" onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="focus-ring landing-control landing-theme-toggle w-11 h-11 flex items-center justify-center rounded-xl text-sm transition-colors"
          style={{
            background: 'oklch(1 0 0 / 0.10)',
            border: '1px solid oklch(1 0 0 / 0.22)',
            color: 'oklch(0.95 0.01 262)',
          }}>
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}

/* ─── SignalBoard (hero right column) ────────────────────── */
function SignalBoard({ isTh }) {
  const ready = opportunities.filter(o => o.statusType === 'ready')
  const build = opportunities.filter(o => o.statusType === 'build')
  const research = opportunities.filter(o => o.statusType === 'research')
  const first = opportunities[0]

  const rows = [
    { label: isTh ? 'พร้อมเริ่ม' : 'Build queue',     value: ready.length,    color: dp.build },
    { label: isTh ? 'อยู่ในแผน' : 'In scope',         value: build.length,    color: dp.primary },
    { label: isTh ? 'ต้องหาข้อมูล' : 'Needs research', value: research.length, color: 'oklch(0.700 0.050 262)' },
  ]

  return (
    <aside aria-label={isTh ? 'สรุปโอกาสตลาด' : 'Market signal summary'}
      style={{ width: '100%', background: dp.surface, border: `1px solid ${dp.border}`, borderRadius: 16, color: dp.text, overflow: 'hidden' }}>

      <div className="flex items-center gap-2" style={{ minHeight: 48, padding: '0 16px', borderBottom: `1px solid ${dp.border}`, background: dp.surface2 }}>
        <Search size={15} style={{ color: dp.secondary }} />
        <span style={{ fontSize: 12, color: dp.text2, fontWeight: 700 }}>{isTh ? 'สรุปตลาดสัปดาห์นี้' : 'Market brief, this week'}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: dp.muted }}>TH + SEA + Global</span>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ border: `1px solid ${dp.border}`, borderRadius: 12, padding: 14, background: dp.bg }}>
          <div className="flex items-start gap-3">
            <span style={{ fontSize: 24, lineHeight: 1 }}>{first.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex gap-2 items-center flex-wrap" style={{ marginBottom: 6 }}>
                <strong style={{ fontSize: 15, lineHeight: 1.35, color: dp.text }}>
                  {isTh ? first.title : first.titleEn}
                </strong>
                <DecisionChip type={first.statusType} size="sm" />
              </div>
              <p style={{ margin: 0, color: dp.text2, fontSize: 13, lineHeight: 1.6 }}>
                {isTh ? first.gap : first.gapEn}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3" style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${dp.border}` }}>
            <div>
              <div style={{ color: dp.muted, fontSize: 10, marginBottom: 3 }}>{isTh ? 'งบเริ่ม' : 'Budget'}</div>
              <div style={{ color: dp.text, fontSize: 13, fontWeight: 800 }}>{first.budget.total}</div>
            </div>
            <div>
              <div style={{ color: dp.muted, fontSize: 10, marginBottom: 3 }}>{isTh ? 'คืนทุน' : 'Payback'}</div>
              <div style={{ color: dp.text, fontSize: 13, fontWeight: 800 }}>{first.timeToROI}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-2" style={{ marginTop: 12 }}>
          {rows.map(row => (
            <div key={row.label} className="grid items-center gap-3"
              style={{ gridTemplateColumns: '40px 1fr', border: `1px solid ${dp.border}`, borderRadius: 10, padding: '10px 12px', background: dp.bg }}>
              <span className="grid place-items-center" style={{ width: 32, height: 32, borderRadius: 8, color: row.color, background: 'oklch(1 0 0 / 0.045)', fontSize: 18, fontWeight: 800 }}>
                {row.value}
              </span>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: dp.text }}>
                {row.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

/* ─── OpCard (3D tilt, reused from Dashboard) ────────────── */
function OpCard({ opp, lang, localize }) {
  const ref = useRef(null)
  useEffect(() => {
    const card = ref.current
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let cleanup = () => {}
    if (fine && !rm()) {
      gsap.set(card, { transformPerspective: 800 })
      const rX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' })
      const rY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' })
      const y  = gsap.quickTo(card, 'y',          { duration: 0.4, ease: 'power3' })
      let raf = 0
      const move = e => {
        if (raf) return
        raf = requestAnimationFrame(() => {
          raf = 0
          const r = card.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width
          const py = (e.clientY - r.top)  / r.height
          rX((0.5 - py) * 9); rY((px - 0.5) * 9)
          card.style.setProperty('--gx', `${px * 100}%`)
          card.style.setProperty('--gy', `${py * 100}%`)
        })
      }
      const enter = () => y(-6)
      const leave = () => { rX(0); rY(0); y(0) }
      card.addEventListener('pointermove', move)
      card.addEventListener('pointerenter', enter)
      card.addEventListener('pointerleave', leave)
      cleanup = () => {
        card.removeEventListener('pointermove', move)
        card.removeEventListener('pointerenter', enter)
        card.removeEventListener('pointerleave', leave)
      }
    }
    return cleanup
  }, [])

  return (
    <article ref={ref} className="tilt group relative landing-card rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <span className="glare" aria-hidden="true" />
      <div className="relative flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl grid place-items-center text-xl flex-shrink-0" style={{ background: opp.iconBg }}>
          {opp.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold leading-snug" style={{ color: 'var(--text)' }}>
            {lang === 'en' ? opp.titleEn : opp.title}
          </h3>
          <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{opp.subtitle}</p>
        </div>
        <DecisionChip type={opp.statusType} size="sm" />
      </div>
      <p className="relative text-[12.5px] leading-snug line-clamp-2" style={{ color: 'var(--text-2)' }}>
        <span style={{ color: 'var(--muted)' }}>{lang === 'en' ? 'The gap' : 'ช่องว่าง'}: </span>
        {lang === 'en' ? opp.gapEn : opp.gap}
      </p>
      <div className="relative flex items-center gap-3 text-[11px]" style={{ color: 'var(--muted)' }}>
        <span className="tnum">{opp.budget.total}</span>
        <span className="inline-flex items-center gap-1">
          <Clock size={11} />{localize(opp.timeToROI, 'time')}
        </span>
      </div>
      <div className="relative flex items-end justify-between pt-3 mt-auto" style={{ borderTop: '1px solid var(--border)' }}>
        <div>
          <p className="text-[10px]" style={{ color: 'var(--muted)' }}>{lang === 'en' ? 'Est. income' : 'รายได้คาด'}</p>
          <p className="text-[18px] font-bold tnum leading-none mt-1" style={{ color: 'var(--primary)' }}>
            {localize(opp.income, 'income')}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[12px] font-medium transition-transform group-hover:translate-x-0.5"
          style={{ color: 'var(--primary)' }}>
          <ChevronRight size={16} />
        </span>
      </div>
    </article>
  )
}

/* ─── PipelineNode ───────────────────────────────────────── */
function PipelineNode({ phase, isTh }) {
  const { icon: Icon, th, en, descTh, descEn } = phase
  return (
    <div className="flex flex-col items-center text-center gap-2.5 pt-1" data-pipe-node>
      <div className="relative z-10 w-10 h-10 rounded-full grid place-items-center flex-shrink-0"
        style={{
          background: 'var(--primary)',
          border: '2px solid var(--primary)',
          color: 'var(--on-primary)',
          boxShadow: '0 0 0 4px var(--primary-soft)',
        }}>
        <Icon size={17} strokeWidth={2} />
      </div>
      <div>
        <p className="text-[13px] font-bold leading-snug" style={{ color: 'var(--text)' }}>
          {isTh ? th : en}
        </p>
        <p className="text-[11px] mt-1 leading-snug" style={{ color: 'var(--muted)', maxWidth: 140 }}>
          {isTh ? descTh : descEn}
        </p>
      </div>
    </div>
  )
}

/* ─── PipelineNodeMobile (vertical layout) ───────────────── */
function PipelineNodeMobile({ phase, isTh, isLast }) {
  const { icon: Icon, th, en, descTh, descEn } = phase
  return (
    <div className="flex gap-4 relative">
      {/* left track */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 40 }}>
        <div className="w-10 h-10 rounded-full grid place-items-center flex-shrink-0 z-10 relative"
          style={{
            background: 'var(--primary)',
            border: '2px solid var(--primary)',
            color: 'var(--on-primary)',
          }}>
          <Icon size={17} strokeWidth={2} />
        </div>
        {!isLast && (
          <div style={{ flex: 1, width: 1, minHeight: 20, background: 'var(--border)', marginTop: 4 }} />
        )}
      </div>
      {/* content */}
      <div style={{ paddingBottom: isLast ? 0 : 20, paddingTop: 8, flex: 1 }}>
        <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 4 }}>
          <p className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>
            {isTh ? th : en}
          </p>
        </div>
        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--muted)' }}>
          {isTh ? descTh : descEn}
        </p>
      </div>
    </div>
  )
}

/* ─── Landing ────────────────────────────────────────────── */
export default function Landing() {
  const { lang, toggle: toggleLang, localize } = useLang()
  const { isDark, toggle: toggleTheme } = useTheme()
  const isTh = lang === 'th'
  const pageRef = useRef(null)

  // Smooth scroll (Lenis), scoped to the Landing only — the app shell scrolls
  // inside its own container, so Landing is the only window-scrolled route.
  // Driven from gsap.ticker and wired to ScrollTrigger so the pinned globe
  // (and every other trigger) stays in sync and the pin engages/releases
  // smoothly instead of catching. Disabled under reduced-motion.
  useEffect(() => {
    if (rm()) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    const onTick = time => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()
    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(onTick)
      gsap.ticker.lagSmoothing(500, 33) // restore GSAP default
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const prev = document.title
    document.title = isTh
      ? 'Gap Finder | เลือกไอเดียที่จะ build ต่อ'
      : 'Gap Finder | Choose what to build next'
    return () => { document.title = prev }
  }, [isTh])

  useEffect(() => {
    if (rm()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-enter]', {
        y: 20, opacity: 0, duration: 0.55, stagger: 0.07, ease: 'expo.out',
        clearProps: 'opacity,transform',
      })
      gsap.from('[data-pipe-node]', {
        y: 16, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'expo.out',
        delay: 0.15, clearProps: 'opacity,transform',
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (rm()) return
    const root = pageRef.current
    if (!root) return
    const items = gsap.utils.toArray(root.querySelectorAll('[data-reveal]'))
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const children = el.querySelectorAll('[data-reveal-child]')
        gsap.from(children.length ? children : el, {
          y: 18,
          opacity: 0,
          duration: 0.42,
          stagger: 0.045,
          ease: 'expo.out',
          clearProps: 'opacity,transform',
        })
        obs.unobserve(el)
      })
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' })
    items.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const first = opportunities[0]
  const preview3 = opportunities.slice(0, 3)

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', overflowX: 'clip' }}>
      <TopNav isTh={isTh} isDark={isDark} toggleLang={toggleLang} toggleTheme={toggleTheme} />

      <main>

        {/* ══ §0 RADAR GLOBE (cinematic scroll-camera intro) ════ */}
        <RadarGlobe />

        {/* ══ §1 HERO ══════════════════════════════════════════ */}
        <section style={{ background: dp.bg, color: dp.text, borderBottom: `1px solid ${dp.border}`, overflowX: 'hidden' }}>
          <div className="landing-hero-grid px-4 sm:px-6"
            style={{ maxWidth: 1180, margin: '0 auto', paddingTop: 'clamp(52px, 8vw, 96px)', paddingBottom: 'clamp(36px, 7vw, 72px)' }}>

            {/* left: headline + CTAs */}
            <div data-enter style={{ minWidth: 0 }}>
              <div className="inline-flex items-center gap-2"
                style={{ minHeight: 34, padding: '0 12px', borderRadius: 999, border: `1px solid ${dp.border}`, background: dp.surface, fontSize: 12, fontWeight: 700, color: dp.text2 }}>
                <Radar size={14} style={{ color: dp.secondary }} />
                {isTh ? 'สำหรับ indie builder ที่ต้องเลือกงานต่อไป' : 'For indie builders choosing the next bet'}
              </div>

              <h1 style={{
                margin: '18px 0 0', color: dp.text,
                fontSize: 'clamp(2rem, 5vw, 4.2rem)', lineHeight: 1.04, fontWeight: 800,
                letterSpacing: '-0.025em', textWrap: 'balance',
              }}>
                {isTh
                  ? 'ทีม AI 8 ตัว ที่หาโปรเจคต่อไปให้คุณ'
                  : 'Eight AI agents finding your next project'}
              </h1>

              <p style={{
                margin: '20px 0 0', color: dp.text2, fontSize: 17, lineHeight: 1.75,
                maxWidth: '58ch',
              }}>
                {isTh
                  ? 'Scout สแกนตลาด Skeptic โจมตีทุกจุดอ่อน Realist เช็กว่าทำได้จริงไหม แล้ว Synthesizer ตัดสินใจให้คุณทุกสัปดาห์'
                  : 'Scout scans markets. Skeptic attacks every weak point. Realist checks what is actually buildable. Synthesizer decides every week, automatically.'}
              </p>

              <div className="flex flex-wrap gap-3" style={{ marginTop: 28 }}>
                <a href="#preview" className="inline-flex items-center gap-2 focus-ring btn-glow landing-action"
                  style={{ minHeight: 46, padding: '0 20px', borderRadius: 11, background: dp.primary, color: 'oklch(0.995 0.008 262)', textDecoration: 'none', fontSize: 15, fontWeight: 800 }}>
                  {isTh ? 'ดูโอกาสตลาด' : 'Browse market gaps'}
                  <ArrowRight size={16} strokeWidth={2.5} />
                </a>
                <Link to="/dashboard" className="inline-flex items-center gap-2 focus-ring landing-action"
                  style={{ minHeight: 46, padding: '0 18px', borderRadius: 11, border: `1px solid ${dp.border}`, color: dp.text2, background: dp.surface, textDecoration: 'none', fontSize: 15, fontWeight: 700 }}>
                  {isTh ? 'เปิดแดชบอร์ด' : 'Open dashboard'}
                  <ChevronRight size={15} />
                </Link>
              </div>

              {/* proof strip */}
              <div className="grid grid-cols-3" style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${dp.border}`, gap: '0 16px' }}>
                {[
                  { value: '6',     label: isTh ? 'โอกาสใน database' : 'gaps seeded' },
                  { value: '3',     label: isTh ? 'BUILD-ready' : 'BUILD-ready' },
                  { value: '~$13', label: isTh ? '/เดือน pipeline ครบ' : '/mo full pipeline' },
                ].map(s => (
                  <div key={s.label} className="min-w-0">
                    <div className="tnum" style={{ fontSize: 22, fontWeight: 800, color: dp.primary, letterSpacing: '-0.02em' }}>{s.value}</div>
                    <div style={{ marginTop: 2, fontSize: 11, color: dp.muted, overflowWrap: 'break-word' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* right: SignalBoard */}
            <div data-enter style={{ minWidth: 0 }}>
              <SignalBoard isTh={isTh} />
            </div>
          </div>
        </section>

        {/* ══ §2 PIPELINE ═══════════════════════════════════════ */}
        <section className="px-4 sm:px-6" data-reveal style={sectionShell}>
          <div data-reveal-child style={{ maxWidth: 660, marginBottom: 42 }}>
            <h2 style={{ ...sectionTitle, color: 'var(--text)' }}>
              {isTh ? 'ระบบ AI ที่ทำงานแทนคุณทุกสัปดาห์' : 'An AI pipeline that runs every week for you'}
            </h2>
            <p style={{ margin: '12px 0 0', fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)', maxWidth: '60ch' }}>
              {isTh
                ? 'แต่ละขั้นตอนเพิ่มชั้นการกรองและ challenge จนเหลือแต่ข้อมูลที่พร้อมตัดสินใจ ครบทั้ง 6 ระบบ'
                : 'Each step adds a layer of filtering and challenge until only decision-ready data remains. All 6 systems are running.'}
            </p>
          </div>

          {/* Tablet + Desktop pipeline (grid) */}
          <div className="relative hidden md:block" data-reveal-child>
            {/* connecting line — only meaningful when all 6 are in one row */}
            <div className="absolute hidden lg:block" style={{ top: 20, left: 20, right: 20, height: 1, background: 'var(--border)' }} />
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-4">
              {PHASES.map(p => <PipelineNode key={p.phase} phase={p} isTh={isTh} />)}
            </div>
          </div>

          {/* Mobile pipeline (vertical) */}
          <div className="md:hidden flex flex-col" data-reveal-child>
            {PHASES.map((p, i) => (
              <PipelineNodeMobile key={p.phase} phase={p} isTh={isTh} isLast={i === PHASES.length - 1} />
            ))}
          </div>
        </section>

        {/* ══ §3 DEBATE MOCKUP ══════════════════════════════════ */}
        <section data-reveal style={{ background: dp.bg, borderTop: `1px solid ${dp.border}`, borderBottom: `1px solid ${dp.border}` }}>
          <div className="px-4 sm:px-6" style={sectionShell}>

            <div data-reveal-child className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3" style={{ marginBottom: 32 }}>
              <div style={{ maxWidth: 560 }}>
                <h2 style={{ ...sectionTitle, color: dp.text }}>
                  {isTh ? 'ทุกไอเดียถูก challenge ก่อนถึงคุณ' : 'Every idea gets challenged before it reaches you'}
                </h2>
                <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.7, color: dp.text2 }}>
                  {isTh
                    ? 'Brainstormer สร้างแนวทาง Skeptic โจมตีจุดอ่อน Realist ประเมินว่าคนคนเดียวทำได้ไหม ก่อนที่ Synthesizer จะตัดสินใจ'
                    : 'Brainstormer proposes concepts. Skeptic attacks weak points. Realist checks solo feasibility. Synthesizer makes the call.'}
                </p>
              </div>
              <span style={{ fontSize: 12, color: dp.muted, flexShrink: 0 }}>
                {isTh ? `ตัวอย่าง: ${first.title}` : `Example: ${first.titleEn}`}
              </span>
            </div>

            {/* Three-panel debate */}
            <div data-reveal-child className="grid md:grid-cols-3 gap-px overflow-hidden rounded-xl landing-debate-grid"
              style={{ border: `1px solid ${dp.border}`, background: dp.border }}>

              {/* Panel 1: Brainstormer */}
              <div className="landing-debate-panel" style={{ background: dp.surface, padding: 20 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
                  <div className="grid place-items-center w-8 h-8 rounded-lg" style={{ background: dp.surface2, color: dp.secondary }}>
                    <Lightbulb size={15} strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: dp.text }}>Brainstormer</div>
                    <div style={{ fontSize: 10, color: dp.muted }}>Agent 3</div>
                  </div>
                </div>
                <div style={{ border: `1px solid ${dp.border}`, borderRadius: 10, padding: 14, background: dp.bg }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{first.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: dp.text }}>{isTh ? first.title : first.titleEn}</span>
                  </div>
                  {[
                    { label: isTh ? 'กลุ่มเป้าหมาย' : 'Target', value: isTh ? 'SME ไทย 4M+ ราย (LINE OA)' : 'Thai SME 4M+ (LINE OA)' },
                    { label: isTh ? 'รูปแบบรายได้' : 'Revenue', value: isTh ? 'Monthly subscription ฿299/เดือน' : 'Monthly subscription ฿299/mo' },
                    { label: isTh ? 'ใช้ AI ยังไง' : 'AI use', value: 'Claude API + LINE Messaging API' },
                    { label: isTh ? 'งบเริ่มต้น' : 'Budget', value: first.budget.total },
                  ].map(r => (
                    <div key={r.label} className="flex gap-2" style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: dp.muted, flexShrink: 0, minWidth: 70 }}>{r.label}</span>
                      <span style={{ fontSize: 12, color: dp.text2, fontWeight: 600 }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel 2: Skeptic */}
              <div className="landing-debate-panel" style={{ background: dp.surface, padding: 20 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
                  <div className="grid place-items-center w-8 h-8 rounded-lg" style={{ background: dp.surface2, color: 'oklch(0.660 0.160 25)' }}>
                    <AlertTriangle size={15} strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: dp.text }}>Skeptic</div>
                    <div style={{ fontSize: 10, color: dp.muted }}>Agent 4 · {isTh ? 'โจมตีจุดอ่อน' : 'attacks weaknesses'}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    isTh ? 'Manychat อาจเพิ่ม Thai support ใน 6–12 เดือน' : 'Manychat may add Thai support in 6–12 months',
                    isTh ? 'LINE อาจขึ้นราคา Bot API ในอนาคต' : 'LINE could raise Bot API pricing',
                    isTh ? 'SME ไทยชำระเงินออนไลน์ยังไม่คล่อง' : 'Thai SMEs still have low online payment adoption',
                  ].map((pt, i) => (
                    <div key={i} className="flex gap-2.5 items-start"
                      style={{ padding: '10px 12px', borderRadius: 8, background: dp.bg, border: `1px solid ${dp.border}` }}>
                      <AlertTriangle size={13} style={{ color: 'oklch(0.660 0.160 25)', flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 12, color: dp.text2, lineHeight: 1.55 }}>{pt}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 4, fontSize: 11, color: dp.muted }}>
                    {isTh ? 'Framework: TAM/SAM/SOM · Moat · Execution Risk' : 'Framework: TAM/SAM/SOM · Moat · Execution Risk'}
                  </div>
                </div>
              </div>

              {/* Panel 3: Realist */}
              <div className="landing-debate-panel" style={{ background: dp.surface, padding: 20 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
                  <div className="grid place-items-center w-8 h-8 rounded-lg" style={{ background: dp.surface2, color: dp.primary }}>
                    <BarChart3 size={15} strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: dp.text }}>Realist</div>
                    <div style={{ fontSize: 10, color: dp.muted }}>Agent 5 · {isTh ? 'ประเมินความเป็นไปได้' : 'feasibility check'}</div>
                  </div>
                </div>

                {/* Score bar */}
                <div style={{ padding: '14px 14px 10px', borderRadius: 10, background: dp.bg, border: `1px solid ${dp.border}`, marginBottom: 12 }}>
                  <div className="flex items-end justify-between" style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: dp.muted }}>{isTh ? 'คะแนนความเป็นไปได้' : 'Feasibility score'}</span>
                    <span className="tnum" style={{ fontSize: 22, fontWeight: 800, color: dp.primary, letterSpacing: '-0.02em' }}>7<span style={{ fontSize: 13, color: dp.muted }}>/10</span></span>
                  </div>
                  <div style={{ height: 6, borderRadius: 4, background: dp.surface2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '70%', borderRadius: 4, background: dp.primary }} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    { label: isTh ? 'คนเดียวทำได้' : 'Solo-buildable', ok: true },
                    { label: isTh ? 'งบพอดี' : 'Budget fits',         ok: true },
                    { label: isTh ? 'ทักษะที่ต้องเพิ่ม' : 'Skill gap',  ok: false, note: 'LINE API' },
                  ].map(r => (
                    <div key={r.label} className="flex items-center gap-2" style={{ fontSize: 12 }}>
                      <CheckCircle2 size={14} style={{ color: r.ok ? dp.build : dp.muted, flexShrink: 0 }} />
                      <span style={{ color: dp.text2 }}>{r.label}</span>
                      {r.note && <span style={{ fontSize: 10, color: dp.muted, marginLeft: 'auto' }}>{r.note}</span>}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 14, padding: '8px 12px', borderRadius: 8, background: dp.buildSoft, border: `1px solid ${dp.border}` }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: dp.buildInk }}>
                    → {isTh ? 'คำแนะนำ: BUILD' : 'Recommendation: BUILD'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ §4 OPPORTUNITY PREVIEW ════════════════════════════ */}
        <section id="preview" data-reveal style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          <div className="px-4 sm:px-6" style={sectionShell}>

            <div data-reveal-child className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" style={{ marginBottom: 28 }}>
              <div>
                <h2 style={{ ...sectionTitle, color: 'var(--text)' }}>
                  {isTh ? 'รายการที่ควรดูวันนี้' : 'What is worth checking today'}
                </h2>
                <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: '56ch' }}>
                  {isTh
                    ? 'รายละเอียดเต็มอยู่ในแดชบอร์ด'
                    : 'Full details are in the dashboard.'}
                </p>
              </div>
              <Link to="/opportunities" className="inline-flex items-center gap-2 focus-ring landing-action flex-shrink-0"
                style={{ minHeight: 42, padding: '0 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--primary)', textDecoration: 'none', fontSize: 13, fontWeight: 800 }}>
                {isTh ? 'ดูทั้งหมด 6 รายการ' : 'View all 6 gaps'}
                <ArrowRight size={14} />
              </Link>
            </div>

            <div data-reveal-child className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {preview3.map(opp => (
                <OpCard key={opp.id} opp={opp} lang={lang} localize={localize} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ §5 WEEKLY AUTOPILOT MOCKUP ════════════════════════ */}
        <section data-reveal style={{ background: dp.bg, borderBottom: `1px solid ${dp.border}` }}>
          <div className="px-4 sm:px-6" style={sectionShell}>

            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div data-reveal-child>
                <h2 style={{ ...sectionTitle, color: dp.text }}>
                  {isTh ? 'รายงานอัตโนมัติทุกต้นสัปดาห์' : 'Automated report every Monday'}
                </h2>
                <p style={{ margin: '12px 0 0', fontSize: 15, lineHeight: 1.75, color: dp.text2 }}>
                  {isTh
                    ? 'ไม่ต้องเปิด dashboard มาเช็กเอง Synthesizer ส่งรายงานสรุปการตัดสินใจของสัปดาห์มาให้ตรงๆ'
                    : 'No need to check manually. Synthesizer sends a decision summary directly to you each week.'}
                </p>
                <div className="flex flex-col gap-3" style={{ marginTop: 24 }}>
                  {[
                    { icon: Radar,        color: dp.secondary, label: isTh ? 'Scout สแกนหลายแหล่ง' : 'Scout scans multiple sources' },
                    { icon: MessageSquare, color: dp.primary,   label: isTh ? 'Debate agents กรองทุกไอเดีย' : 'Debate agents filter every idea' },
                    { icon: Target,       color: dp.build,     label: isTh ? 'Synthesizer ตัดสินใจ BUILD/PARK' : 'Synthesizer decides BUILD/PARK' },
                  ].map(s => {
                    const Icon = s.icon
                    return (
                      <div key={s.label} className="flex items-center gap-3">
                        <Icon size={16} style={{ color: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 14, color: dp.text2 }}>{s.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Mock weekly report card */}
              <div data-reveal-child className="landing-report-card" style={{ border: `1px solid ${dp.border}`, borderRadius: 14, background: dp.surface, overflow: 'hidden' }}>
                {/* header */}
                <div className="flex items-center gap-2" style={{ padding: '12px 16px', borderBottom: `1px solid ${dp.border}`, background: dp.surface2 }}>
                  <CalendarDays size={14} style={{ color: dp.secondary }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: dp.text2 }}>
                    {isTh ? 'รายงานประจำสัปดาห์ · 26 พ.ค. – 1 มิ.ย. 2026' : 'Weekly Report · 26 May – 1 Jun 2026'}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: dp.build, fontWeight: 700 }}>
                    {isTh ? 'ส่งแล้ว' : 'Delivered'}
                  </span>
                </div>

                {/* pipeline steps */}
                <div style={{ padding: '16px 16px 12px' }}>
                  {[
                    { icon: Radar,        color: dp.secondary, step: 'Scout',       detail: isTh ? 'พบ 18 signals จาก TechCrunch, YC, Reddit, Product Hunt' : '18 signals from TechCrunch, YC, Reddit, Product Hunt' },
                    { icon: Search,       color: dp.primary,   step: 'Gap Finder',  detail: isTh ? 'ระบุ 5 ช่องว่างในตลาดไทยและ SEA' : '5 gaps identified in Thai and SEA markets' },
                    { icon: Lightbulb,    color: 'oklch(0.780 0.130 70)', step: 'Brainstormer', detail: isTh ? 'สร้าง 12 concept' : '12 concepts generated' },
                    { icon: MessageSquare,color: 'oklch(0.660 0.160 25)', step: 'Debate',       detail: isTh ? 'Skeptic + Realist ประเมิน 12 concept' : 'Skeptic + Realist evaluated all 12' },
                    { icon: Target,       color: dp.build,     step: 'Synthesizer', detail: null, verdict: true },
                  ].map((s, i) => {
                    const Icon = s.icon
                    return (
                      <div key={s.step}>
                        <div className="landing-report-row flex items-start gap-3" style={{ padding: '8px 0' }}>
                          <div className="grid place-items-center w-6 h-6 rounded-md flex-shrink-0" style={{ background: dp.surface2, color: s.color, marginTop: 1 }}>
                            <Icon size={13} strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span style={{ fontSize: 12, fontWeight: 700, color: dp.text }}>{s.step}</span>
                            {s.detail && (
                              <span style={{ fontSize: 12, color: dp.text2, marginLeft: 6 }}>{s.detail}</span>
                            )}
                            {s.verdict && (
                              <div className="flex gap-2 flex-wrap" style={{ marginTop: 6 }}>
                                {[
                                  { label: 'BUILD',    n: 2, color: dp.build,     soft: dp.buildSoft, ink: dp.buildInk },
                                  { label: 'SCOPED',   n: 3, color: dp.primary,   soft: 'oklch(0.300 0.060 262)', ink: 'oklch(0.820 0.120 262)' },
                                  { label: 'RESEARCH', n: 7, color: 'oklch(0.700 0.050 262)', soft: 'oklch(0.290 0.025 262)', ink: 'oklch(0.830 0.045 262)' },
                                ].map(v => (
                                  <span key={v.label} className="tnum inline-flex items-center gap-1"
                                    style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: v.soft, color: v.ink }}>
                                    {v.n} {v.label}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {i < 4 && <div style={{ height: 1, background: dp.border, marginLeft: 36 }} />}
                      </div>
                    )
                  })}
                </div>

                <div style={{ padding: '10px 16px', borderTop: `1px solid ${dp.border}` }}>
                  <span style={{ fontSize: 11, color: dp.muted }}>
                    {isTh ? 'รายงานถัดไป: จ. 9 มิ.ย. 2026' : 'Next report: Mon 9 Jun 2026'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ §6 CTA ════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6" data-reveal style={sectionShell}>
          <div data-reveal-child className="landing-cta grid md:grid-cols-[0.9fr_1fr] gap-8 md:gap-12 items-center"
            style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--surface)', padding: 'clamp(24px, 4vw, 42px)' }}>
            <div>
              <h2 style={{ ...sectionTitle, color: 'var(--text)' }}>
                {isTh
                  ? 'เปิดแดชบอร์ด แล้วเลือกโปรเจคต่อไปให้จบในรอบเดียว'
                  : 'Open the dashboard and pick the next project in one pass'}
              </h2>
              <p style={{ margin: '12px 0 0', color: 'var(--text-2)', fontSize: 15, lineHeight: 1.7 }}>
                {isTh
                  ? 'เริ่มจากข้อมูลชุดแรกได้เลยตอนนี้ แล้วค่อยต่อยอดเป็น live pipeline เมื่อ flow การตัดสินใจนิ่งแล้ว'
                  : 'Start with the seeded data today. Add the live pipeline later, once the decision flow is already useful to you.'}
              </p>
            </div>
            <div className="flex flex-wrap md:justify-end gap-3">
              <Link to="/dashboard" className="inline-flex items-center gap-2 focus-ring btn-glow landing-action"
                style={{ minHeight: 46, padding: '0 20px', borderRadius: 11, background: 'var(--primary)', color: 'var(--on-primary)', textDecoration: 'none', fontSize: 15, fontWeight: 800 }}>
                {isTh ? 'เปิดแดชบอร์ด' : 'Open dashboard'}
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link to="/opportunities" className="inline-flex items-center gap-2 focus-ring landing-action"
                style={{ minHeight: 46, padding: '0 18px', borderRadius: 11, border: '1px solid var(--border)', color: 'var(--text-2)', background: 'var(--surface-2)', textDecoration: 'none', fontSize: 15, fontWeight: 700 }}>
                {isTh ? 'ดูรายการโอกาส' : 'Browse gaps'}
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
