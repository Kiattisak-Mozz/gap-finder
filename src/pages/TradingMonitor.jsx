import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { Link2, Link2Off, Terminal, X } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import PageHeader from '../components/ui/PageHeader'

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ── Simulation seed data ───────────────────────────────────────────
const SIM_PAIRS = [
  { symbol: 'BTCUSDT',  price: 119464,  rsi: 79.5, ema_trend: 'mixed',   daily_trend: 'sideways',  signal: 'hold' },
  { symbol: 'ETHUSDT',  price: 4183,    rsi: 43.6, ema_trend: 'bearish', daily_trend: 'downtrend', signal: 'hold' },
  { symbol: 'SOLUSDT',  price: 43.57,   rsi: null, ema_trend: 'bearish', daily_trend: 'downtrend', signal: 'hold' },
  { symbol: 'BNBUSDT',  price: 568.2,   rsi: 55.1, ema_trend: 'bullish', daily_trend: 'sideways',  signal: 'hold' },
  { symbol: 'ADAUSDT',  price: 0.1831,  rsi: 50,   ema_trend: 'bearish', daily_trend: 'downtrend', signal: 'hold' },
]

// ── Helpers ────────────────────────────────────────────────────────
function fmtPrice(n) {
  if (n == null || isNaN(n)) return '—'
  const v = Number(n)
  return v > 100 ? v.toFixed(0) : v > 1 ? v.toFixed(2) : v.toFixed(4)
}

function logAccent(type) {
  return { info: 'var(--muted)', warn: 'var(--warning)', err: 'var(--kill)', success: 'var(--primary)' }[type] ?? 'var(--muted)'
}
function logText(type) {
  return { info: 'var(--text-2)', warn: 'var(--warning)', err: 'var(--kill)', success: 'var(--primary)' }[type] ?? 'var(--text-2)'
}

// ── Signal Pill ────────────────────────────────────────────────────
function SignalPill({ signal }) {
  const cfg = {
    buy:  { bg: 'var(--primary-soft)', color: 'var(--primary-press)', border: 'var(--primary-soft)' },
    sell: { bg: 'var(--kill-soft)',    color: 'var(--kill-ink)',       border: 'var(--kill-soft)'    },
    hold: { bg: 'var(--surface-2)',    color: 'var(--muted)',          border: 'var(--border)'       },
  }[signal ?? 'hold'] ?? { bg: 'var(--surface-2)', color: 'var(--muted)', border: 'var(--border)' }
  return (
    <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded tracking-wider"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {(signal ?? 'hold').toUpperCase()}
    </span>
  )
}

// ── Log Drawer ─────────────────────────────────────────────────────
const FILTER_OPTS = [
  { key: 'all',     label: 'All'  },
  { key: 'success', label: 'OK'   },
  { key: 'warn',    label: 'Warn' },
  { key: 'err',     label: 'Error'},
  { key: 'info',    label: 'Info' },
]

function LogDrawer({ logs, open, onClose }) {
  const panelRef    = useRef(null)
  const backdropRef = useRef(null)
  const logBodyRef  = useRef(null)
  const [filter,  setFilter]  = useState('all')
  const [mounted, setMounted] = useState(false)

  // Mount on open
  useEffect(() => { if (open) setMounted(true) }, [open])

  // GSAP animate in / out
  useEffect(() => {
    if (!mounted) return
    const panel    = panelRef.current
    const backdrop = backdropRef.current
    if (!panel) return
    const rm = reduceMotion()

    if (open) {
      if (rm) {
        gsap.set(panel,    { x: 0 })
        gsap.set(backdrop, { opacity: 1 })
      } else {
        gsap.set(panel, { x: '100%' })
        gsap.to(panel,    { x: 0,  duration: 0.38, ease: 'expo.out' })
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' })
      }
    } else {
      const done = () => setMounted(false)
      if (rm) { done() } else {
        gsap.to(panel,    { x: '100%', duration: 0.26, ease: 'expo.in', onComplete: done })
        gsap.to(backdrop, { opacity: 0, duration: 0.18 })
      }
    }
  }, [open, mounted])

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && open) onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  // Auto-scroll to newest
  useEffect(() => {
    if (logBodyRef.current && open) {
      logBodyRef.current.scrollTop = logBodyRef.current.scrollHeight
    }
  }, [logs.length, open])

  if (!mounted) return null

  const filtered = filter === 'all' ? logs : logs.filter(e => e.type === filter)
  const counts   = FILTER_OPTS.reduce((acc, { key }) => ({
    ...acc,
    [key]: key === 'all' ? logs.length : logs.filter(e => e.type === key).length,
  }), {})

  return (
    <>
      {/* Backdrop */}
      <div ref={backdropRef}
        className="fixed inset-0"
        style={{ background: 'oklch(0 0 0 / 0.5)', zIndex: 'var(--z-backdrop)', cursor: 'pointer' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside ref={panelRef}
        role="dialog" aria-label="Activity Log" aria-modal="true"
        className="fixed top-0 right-0 h-full flex flex-col"
        style={{
          width: 'min(440px, 100vw)',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-12px 0 48px oklch(0 0 0 / 0.28)',
          zIndex: 'var(--z-modal)',
        }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Terminal size={15} strokeWidth={2} style={{ color: 'var(--primary)' }} />
            <span className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>Activity Log</span>
            <span className="tnum text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
              {logs.length}
            </span>
          </div>
          <button onClick={onClose} className="tap-44 flex items-center justify-center rounded-xl"
            aria-label="Close" style={{ color: 'var(--muted)' }}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 px-4 pb-3 flex-shrink-0">
          {FILTER_OPTS.map(({ key, label }) => {
            const active = filter === key
            const count  = counts[key]
            return (
              <button key={key} onClick={() => setFilter(key)}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: active ? 'var(--primary-soft)' : 'transparent',
                  color:      active ? 'var(--primary-press)' : 'var(--muted)',
                }}>
                {label}
                {count > 0 && (
                  <span className="tnum text-[10px]"
                    style={{ color: active ? 'var(--primary-press)' : 'var(--muted)', opacity: 0.75 }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="mx-4 mb-2 h-px flex-shrink-0" style={{ background: 'var(--border)' }} />

        {/* Entries */}
        <div ref={logBodyRef} className="flex-1 overflow-y-auto px-3 py-1">
          {filtered.length === 0
            ? <p className="text-[12px] text-center py-12" style={{ color: 'var(--muted)' }}>
                No {filter !== 'all' ? filter : ''} entries yet
              </p>
            : <div className="flex flex-col gap-px">
                {filtered.map((entry, i) => (
                  <div key={entry.id ?? i}
                    className="group flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                    {/* Type dot */}
                    <span className="flex-shrink-0 w-[6px] h-[6px] rounded-full mt-[5px]"
                      style={{ background: logAccent(entry.type) }} />
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="tnum text-[10px] flex-shrink-0" style={{ color: 'var(--muted)' }}>
                          {entry.time}
                        </span>
                        <span className="text-[12px] leading-relaxed break-words"
                          style={{ color: logText(entry.type) }}>
                          {entry.msg}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[10px]" style={{ color: 'var(--muted)' }}>
            {filtered.length} of {logs.length} entries shown
          </p>
        </div>
      </aside>
    </>
  )
}

// ── Metric Strip ───────────────────────────────────────────────────
function MetricStrip({ balance, available, dailyPnl, pnlPct, openCount, riskLevel }) {
  const pnlPos    = dailyPnl >= 0
  const pnlColor  = pnlPos ? 'var(--primary)' : 'var(--kill)'
  const riskColor = { LOW: 'var(--build)', MEDIUM: 'var(--warning)', HIGH: 'var(--kill)' }[riskLevel] ?? 'var(--kill)'
  const riskFill  = { LOW: 1, MEDIUM: 2, HIGH: 3 }[riskLevel] ?? 3

  return (
    <div className="mon-strip rounded-2xl overflow-hidden mb-4"
      style={{ border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', background: 'var(--border)' }}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px">

        {/* Balance */}
        <div className="px-4 sm:px-6 py-4 sm:py-5" style={{ background: 'var(--surface)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Balance</p>
          <p className="tnum text-[20px] sm:text-[24px] font-bold leading-none mb-1.5" style={{ color: 'var(--primary)' }}>
            ${balance.toFixed(2)}
          </p>
          <p className="tnum text-[11px]" style={{ color: 'var(--muted)' }}>Avail ${available.toFixed(2)}</p>
        </div>

        {/* Daily PnL */}
        <div className="px-4 sm:px-6 py-4 sm:py-5" style={{ background: 'var(--surface)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Daily PnL</p>
          <p className="tnum text-[20px] sm:text-[24px] font-bold leading-none mb-1.5" style={{ color: pnlColor }}>
            {pnlPos ? '+' : ''}${dailyPnl.toFixed(2)}
          </p>
          <p className="tnum text-[11px]" style={{ color: pnlColor, opacity: 0.7 }}>
            {pnlPos ? '+' : ''}{pnlPct.toFixed(3)}%
          </p>
        </div>

        {/* Open Positions */}
        <div className="px-4 sm:px-6 py-4 sm:py-5" style={{ background: 'var(--surface)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Positions</p>
          <p className="tnum text-[20px] sm:text-[24px] font-bold leading-none mb-1.5" style={{ color: 'var(--warning)' }}>
            {openCount}
            <span className="text-[14px] sm:text-[16px] font-normal" style={{ color: 'var(--muted)' }}> / 3</span>
          </p>
          <p className="text-[11px]" style={{ color: 'var(--muted)' }}>open now</p>
        </div>

        {/* Risk */}
        <div className="px-4 sm:px-6 py-4 sm:py-5" style={{ background: 'var(--surface)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Risk</p>
          <p className="text-[18px] sm:text-[20px] font-bold leading-none mb-2" style={{ color: riskColor }}>
            {riskLevel}
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[3px] flex-1 sm:w-8 sm:flex-none rounded-full transition-colors duration-500"
                style={{ background: i <= riskFill ? riskColor : 'var(--border)' }} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Live Feed Hook ─────────────────────────────────────────────────
function useBotFeed(url) {
  const [data, setData]         = useState(null)
  const [connected, setConn]    = useState(false)

  useEffect(() => {
    if (!url) { setConn(false); setData(null); return }
    let cancelled = false

    const poll = async () => {
      try {
        const ctrl  = new AbortController()
        const timer = setTimeout(() => ctrl.abort(), 5000)
        const res   = await fetch(`${url}/state`, { signal: ctrl.signal })
        clearTimeout(timer)
        if (!res.ok) throw new Error()
        const json  = await res.json()
        if (!cancelled) { setData(json); setConn(true) }
      } catch { if (!cancelled) setConn(false) }
    }

    poll()
    const id = setInterval(poll, 15000)
    return () => { cancelled = true; clearInterval(id) }
  }, [url])

  return { data, connected }
}

// ── Page ───────────────────────────────────────────────────────────
export default function TradingMonitor() {
  const ref    = useRef(null)
  const { t }  = useLang()

  const DEFAULT_URL = 'http://45.76.146.229:8080'
  const [botUrl,     setBotUrl]     = useState(() => localStorage.getItem('bot-url') || DEFAULT_URL)
  const [urlInput,   setUrlInput]   = useState(() => localStorage.getItem('bot-url') || DEFAULT_URL)
  const [showUrl,    setShowUrl]    = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab,  setActiveTab]  = useState('scanner')

  const applyUrl = useCallback(() => {
    let v = urlInput.trim().replace(/\/$/, '')
    if (v && !/^https?:\/\//i.test(v)) v = 'http://' + v
    setBotUrl(v)
    localStorage.setItem('bot-url', v)
  }, [urlInput])

  const { data: live, connected } = useBotFeed(botUrl)

  // ── Simulation (fallback when offline) ────────────────────────────
  const [simPairs, setSimPairs] = useState(() => SIM_PAIRS.map(p => ({ ...p })))
  const [simCycle, setSimCycle] = useState(18)
  const [simBal,   setSimBal]   = useState(199.82)
  const [simPnl,   setSimPnl]   = useState(0)
  const [simCd,    setSimCd]    = useState(33)
  const [simLogs,  setSimLogs]  = useState([
    { id: 0, time: '--:--:--', msg: 'Demo mode — click DEMO to enter your Bot URL', type: 'info' },
  ])

  const addSimLog = useCallback((msg, type = 'info') => {
    const time = new Date().toTimeString().slice(0, 8)
    setSimLogs(prev => [...prev.slice(-99), { id: Date.now() + Math.random(), time, msg, type }])
  }, [])

  useEffect(() => {
    if (connected) return
    const s = { cd: 33, cycle: 18, bal: 199.82, pairs: SIM_PAIRS.map(p => ({ ...p })) }
    const tick = setInterval(() => {
      s.cd--
      if (s.cd <= 0) {
        s.cycle++
        const j = (Math.random() - 0.5) * 0.1
        s.bal   = Math.max(0, s.bal + j)
        s.pairs = s.pairs.map(p => ({
          ...p,
          price: p.price * (1 + (Math.random() - 0.5) * 0.001),
          rsi:   p.rsi != null ? Math.max(0, Math.min(100, p.rsi + (Math.random() - 0.5) * 2)) : null,
        }))
        setSimCycle(s.cycle); setSimBal(s.bal); setSimPnl(j); setSimPairs([...s.pairs])
        const msgs = [
          ['Fetching market data...', 'info'],
          [`BTCUSDT RSI=${(s.pairs[0].rsi ?? 0).toFixed(1)} — HOLD`, 'warn'],
          ['AI Agent analyzing...', 'info'],
          ['HTTP 200 OK — Claude responded', 'success'],
          ['Risk: HIGH — no new orders this cycle', 'warn'],
          [`Cycle #${s.cycle} done (DEMO)`, 'success'],
        ]
        msgs.forEach(([msg, type], i) => setTimeout(() => addSimLog(msg, type), i * 420))
        s.cd = 60
      }
      setSimCd(s.cd)
    }, 1000)
    return () => clearInterval(tick)
  }, [connected, addSimLog])

  // ── Mount animation ────────────────────────────────────────────────
  useEffect(() => {
    if (reduceMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.mon-strip', {
        y: 12, opacity: 0, duration: 0.42, ease: 'expo.out',
        clearProps: 'opacity,transform',
      })
      gsap.from('.mon-panel', {
        y: 16, opacity: 0, duration: 0.5, stagger: 0.09, ease: 'expo.out', delay: 0.12,
        clearProps: 'opacity,transform',
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  // ── Unified data ────────────────────────────────────────────────────
  const isLive    = connected && !!live
  const balance   = isLive ? (live.balance              ?? 0)     : simBal
  const available = isLive ? (live.available            ?? 0)     : simBal
  const dailyPnl  = isLive ? (live.daily_pnl            ?? 0)     : simPnl
  const pnlPct    = isLive ? (live.daily_pnl_pct        ?? 0)     : (simPnl / 200 * 100)
  const cycle     = isLive ? (live.cycle                ?? 0)     : simCycle
  const riskLevel = isLive ? (live.risk_level           ?? 'HIGH'): 'HIGH'
  const openCount = isLive ? (live.open_positions_count ?? 0)     : 0
  const pairs     = isLive ? (live.pairs                ?? [])    : simPairs
  const positions = isLive ? (live.positions            ?? [])    : []
  const logs      = isLive ? (live.logs                 ?? [])    : simLogs
  const countdown = isLive ? (live.countdown            ?? simCd) : simCd
  const interval  = isLive ? (live.scan_interval        ?? 900)   : 60
  const summary   = isLive ? (live.market_summary       ?? '')    : ''
  const trades    = isLive ? (live.trades               ?? [])    : []
  const progress  = Math.min(100, (interval - countdown) / interval * 100)

  return (
    <div ref={ref} className="page-enter px-5 sm:px-8 pb-12">

      <PageHeader title={t('mon.title')} subtitle={t('mon.subtitle')}>
        <div className="flex items-center gap-2">

          {/* Log drawer trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
            style={{
              background: 'var(--surface-2)', color: 'var(--text-2)',
              border: '1px solid var(--border)',
            }}>
            <Terminal size={11} strokeWidth={2.5} />
            Log
            {logs.length > 0 && (
              <span className="tnum ml-0.5" style={{ color: 'var(--muted)' }}>{logs.length}</span>
            )}
          </button>

          {/* Connection badge */}
          <button
            onClick={() => setShowUrl(v => !v)}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors"
            style={{
              background: isLive ? 'var(--primary-soft)' : 'var(--surface-2)',
              color:      isLive ? 'var(--primary-press)' : 'var(--muted)',
              border:     `1px solid ${isLive ? 'var(--primary-soft)' : 'var(--border)'}`,
            }}>
            {isLive ? (
              <>
                <span className="pulse-ring relative inline-block w-1.5 h-1.5" style={{ color: 'var(--primary)' }}>
                  <span className="block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
                </span>
                LIVE
              </>
            ) : (
              <>
                <Link2Off size={10} strokeWidth={2.5} />
                DEMO
              </>
            )}
          </button>

        </div>
      </PageHeader>

      {/* ── URL bar (collapsible) ───────────────────────────────────── */}
      {showUrl && (
        <div className="mon-panel mb-4 rounded-2xl px-5 py-3.5 flex items-center gap-3 flex-wrap"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <Link2 size={13} strokeWidth={2} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input
            className="flex-1 min-w-[160px] text-[12px] bg-transparent outline-none px-3 py-1.5 rounded-xl"
            style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--surface-2)' }}
            placeholder="http://VPS_IP:8080"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyUrl()}
          />
          <button onClick={applyUrl}
            className="flex-shrink-0 text-[11px] font-bold px-4 py-1.5 rounded-xl"
            style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}>
            Connect
          </button>
          <span className="text-[10px] font-semibold flex-shrink-0"
            style={{ color: connected ? 'var(--primary)' : botUrl ? 'var(--kill)' : 'var(--muted)' }}>
            {connected ? '● Online' : botUrl ? '● Offline' : '● Not set'}
          </span>
        </div>
      )}

      {/* ── Metric strip ────────────────────────────────────────────── */}
      <MetricStrip
        balance={balance}   available={available}
        dailyPnl={dailyPnl} pnlPct={pnlPct}
        openCount={openCount} riskLevel={riskLevel}
      />

      {/* ── Market Scanner + History tabs ─────────────────────────── */}
      <section className="mon-panel rounded-2xl overflow-hidden mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>

        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b"
          style={{ borderColor: 'var(--border)' }}>
          {/* Tabs */}
          <div className="flex gap-1">
            {[
              { key: 'scanner', label: t('mon.scanner') },
              { key: 'history', label: t('mon.history') },
            ].map(({ key, label }) => {
              const active = activeTab === key
              return (
                <button key={key} onClick={() => setActiveTab(key)}
                  className="text-[12px] font-bold px-3.5 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: active ? 'var(--primary-soft)' : 'transparent',
                    color:      active ? 'var(--primary-press)' : 'var(--muted)',
                  }}>
                  {label}
                  {key === 'history' && trades.length > 0 && (
                    <span className="tnum ml-1.5 text-[10px]"
                      style={{ color: active ? 'var(--primary-press)' : 'var(--muted)', opacity: 0.7 }}>
                      {trades.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-3">
            {isLive && <span className="hidden sm:inline text-[11px]" style={{ color: 'var(--muted)' }}>live feed</span>}
            {activeTab === 'scanner' && (
              <span className="tnum text-[12px] font-bold" style={{ color: 'var(--primary)' }}>
                Cycle #{cycle}
              </span>
            )}
          </div>
        </div>

        {/* Scanner tab */}
        {activeTab === 'scanner' && <><div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[300px] sm:min-w-[560px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {[
                  { label: 'Pair',   cls: 'pl-4 sm:pl-6 pr-2 sm:pr-4 py-3 text-left' },
                  { label: 'Price',  cls: 'px-2 sm:px-4 py-3 text-right' },
                  { label: 'RSI',    cls: 'px-2 sm:px-4 py-3 text-right' },
                  { label: 'Trend',  cls: 'hidden sm:table-cell px-4 py-3 text-left' },
                  { label: 'Daily',  cls: 'hidden sm:table-cell px-4 py-3 text-center' },
                  { label: 'Signal', cls: 'pl-2 sm:pl-4 pr-4 sm:pr-6 py-3 text-left' },
                ].map(({ label, cls }) => (
                  <th key={label} className={`${cls} text-[10px] uppercase tracking-widest font-bold`}
                    style={{ color: 'var(--muted)' }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pairs.map((p, i) => {
                const sym    = p.symbol || p.s || ''
                const price  = p.price  || p.p  || 0
                const rsi    = p.rsi != null && !isNaN(p.rsi) ? Number(p.rsi) : null
                const trend  = p.ema_trend  || p.trend || 'mixed'
                const daily  = p.daily_trend || 'sideways'
                const signal = p.signal || 'hold'

                const rsiColor  = rsi == null ? 'var(--muted)' : rsi > 70 ? 'var(--kill)' : rsi < 30 ? 'var(--primary)' : 'var(--text-2)'
                const trendColor = trend === 'bullish' ? 'var(--primary)' : trend === 'bearish' ? 'var(--kill)' : 'var(--warning)'
                const dailyArrow = daily === 'uptrend' ? '↑' : daily === 'downtrend' ? '↓' : '→'
                const dailyColor = daily === 'uptrend' ? 'var(--primary)' : daily === 'downtrend' ? 'var(--kill)' : 'var(--muted)'

                return (
                  <tr key={sym}
                    className="transition-colors"
                    style={{
                      borderBottom: i < pairs.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '' }}>

                    <td className="pl-4 sm:pl-6 pr-2 sm:pr-4 py-3.5">
                      <span className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>
                        {sym.replace('USDT', '')}
                      </span>
                      <span className="text-[12px]" style={{ color: 'var(--muted)' }}>/USDT</span>
                    </td>

                    <td className="px-2 sm:px-4 py-3.5 text-right">
                      <span className="tnum text-[13px]" style={{ color: 'var(--text-2)' }}>
                        ${fmtPrice(price)}
                      </span>
                    </td>

                    <td className="px-2 sm:px-4 py-3.5 text-right">
                      <span className="tnum text-[13px] font-semibold" style={{ color: rsiColor }}>
                        {rsi == null ? '—' : rsi.toFixed(1)}
                      </span>
                      {rsi != null && rsi > 70 && (
                        <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: 'var(--kill-soft)', color: 'var(--kill-ink)' }}>OB</span>
                      )}
                      {rsi != null && rsi < 30 && (
                        <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: 'var(--primary-soft)', color: 'var(--primary-press)' }}>OS</span>
                      )}
                    </td>

                    <td className="hidden sm:table-cell px-4 py-3.5">
                      <span className="text-[12px] font-medium" style={{ color: trendColor }}>{trend}</span>
                    </td>

                    <td className="hidden sm:table-cell px-4 py-3.5 text-center">
                      <span className="text-[16px] font-bold tnum" style={{ color: dailyColor }}>
                        {dailyArrow}
                      </span>
                    </td>

                    <td className="pl-2 sm:pl-4 pr-4 sm:pr-6 py-3.5">
                      <SignalPill signal={signal} />
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* AI market summary */}
        {summary && (
          <div className="px-4 sm:px-6 py-3.5 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: '80ch' }}>
              <span className="font-bold mr-2" style={{ color: 'var(--secondary)' }}>AI</span>
              {summary.length > 240 ? summary.slice(0, 240) + '…' : summary}
            </p>
          </div>
        )}
        </>}

        {/* History tab */}
        {activeTab === 'history' && (
          trades.length === 0
            ? <div className="px-6 py-10 flex flex-col items-center gap-3">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <rect x="12" y="10" width="40" height="44" rx="5" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1.5"/>
                  <rect x="20" y="20" width="16" height="2.5" rx="1.25" fill="var(--border-2)"/>
                  <rect x="20" y="27" width="24" height="2.5" rx="1.25" fill="var(--border-2)"/>
                  <rect x="20" y="34" width="20" height="2.5" rx="1.25" fill="var(--border-2)"/>
                  <rect x="20" y="41" width="12" height="2.5" rx="1.25" fill="var(--border-2)"/>
                  <circle cx="46" cy="46" r="10" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5"/>
                  <path d="M46 41v5.5l3 3" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="text-center">
                  <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--text-2)' }}>{t('mon.noTrades')}</p>
                  <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                    {isLive ? 'ประวัติจะปรากฏหลังปิด position แรก' : 'เชื่อมต่อบอทเพื่อดูประวัติจริง'}
                  </p>
                </div>
              </div>
            : <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[240px] sm:min-w-[600px]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {[
                        { h: 'Time',   cls: 'hidden sm:table-cell' },
                        { h: 'Symbol', cls: '' },
                        { h: 'Side',   cls: '' },
                        { h: 'Entry',  cls: 'hidden sm:table-cell' },
                        { h: 'Close',  cls: 'hidden sm:table-cell' },
                        { h: 'PnL',    cls: '' },
                      ].map(({ h, cls }) => (
                        <th key={h} className={`text-left px-3 sm:px-5 py-2.5 text-[10px] uppercase tracking-widest font-bold ${cls}`}
                          style={{ color: 'var(--muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((tr, i) => {
                      const pos = tr.pnl >= 0
                      return (
                        <tr key={i}
                          style={{ borderBottom: i < trades.length - 1 ? '1px solid var(--border)' : 'none' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '' }}>
                          <td className="hidden sm:table-cell px-3 sm:px-5 py-3 tnum text-[11px]" style={{ color: 'var(--muted)' }}>{tr.time}</td>
                          <td className="px-3 sm:px-5 py-3 text-[13px] font-bold" style={{ color: 'var(--text)' }}>
                            {tr.symbol.replace('USDT', '')}<span style={{ color: 'var(--muted)', fontWeight: 400 }}>/USDT</span>
                          </td>
                          <td className="px-3 sm:px-5 py-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                              style={{
                                background: tr.side === 'Buy' ? 'var(--primary-soft)' : 'var(--kill-soft)',
                                color:      tr.side === 'Buy' ? 'var(--primary-press)' : 'var(--kill-ink)',
                              }}>
                              {tr.side === 'Buy' ? 'LONG' : 'SHORT'}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell px-3 sm:px-5 py-3 tnum text-[12px]" style={{ color: 'var(--text-2)' }}>
                            ${fmtPrice(tr.entry_price)}
                          </td>
                          <td className="hidden sm:table-cell px-3 sm:px-5 py-3 tnum text-[12px]" style={{ color: 'var(--text-2)' }}>
                            ${fmtPrice(tr.close_price)}
                          </td>
                          <td className="px-3 sm:px-5 py-3">
                            <div>
                              <span className="tnum text-[13px] font-bold"
                                style={{ color: pos ? 'var(--primary)' : 'var(--kill)' }}>
                                {pos ? '+' : ''}${tr.pnl.toFixed(4)}
                              </span>
                              <span className="tnum text-[10px] ml-2"
                                style={{ color: pos ? 'var(--primary)' : 'var(--kill)', opacity: 0.7 }}>
                                {pos ? '+' : ''}{(tr.pnl_pct ?? 0).toFixed(2)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
        )}

      </section>

      {/* ── Open Positions ──────────────────────────────────────────── */}
      <section className="mon-panel rounded-2xl overflow-hidden mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>

        <div className="px-4 sm:px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>
              {t('mon.openPositions')}
            </span>
            {positions.length > 0 && (
              <span className="tnum text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--warning)', color: 'oklch(0.15 0.02 70)' }}>
                {positions.length} open
              </span>
            )}
          </div>
        </div>

        {positions.length === 0
          ? <div className="px-6 py-10 flex flex-col items-center gap-3">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                {/* Candle chart */}
                <rect x="10" y="28" width="8" height="22" rx="2" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1.5"/>
                <line x1="14" y1="22" x2="14" y2="28" stroke="var(--border-2)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="14" y1="50" x2="14" y2="54" stroke="var(--border-2)" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="28" y="18" width="8" height="18" rx="2" fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="1.5" opacity="0.7"/>
                <line x1="32" y1="12" x2="32" y2="18" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                <line x1="32" y1="36" x2="32" y2="42" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                <rect x="46" y="32" width="8" height="14" rx="2" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1.5"/>
                <line x1="50" y1="26" x2="50" y2="32" stroke="var(--border-2)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="50" y1="46" x2="50" y2="50" stroke="var(--border-2)" strokeWidth="1.5" strokeLinecap="round"/>
                {/* Floor line */}
                <line x1="8" y1="56" x2="56" y2="56" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2"/>
              </svg>
              <div className="text-center">
                <p className="text-[13px] font-semibold mb-1" style={{ color: 'var(--text-2)' }}>{t('mon.noPositions')}</p>
                <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                  Claude จะเปิด position เมื่อ signal แม่นพอ
                </p>
              </div>
            </div>
          : <div className="p-3 flex flex-col gap-2">
              {positions.map((pos, i) => {
                const pnlPos2 = (pos.pnl ?? 0) >= 0
                return (
                  <div key={i}
                    className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl"
                    style={{ background: 'var(--surface-2)' }}>
                    <div>
                      <p className="text-[14px] font-bold mb-1" style={{ color: 'var(--text)' }}>{pos.symbol}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{
                          background: pos.side === 'Buy' ? 'var(--primary-soft)' : 'var(--kill-soft)',
                          color:      pos.side === 'Buy' ? 'var(--primary-press)' : 'var(--kill-ink)',
                        }}>
                        {pos.side === 'Buy' ? 'LONG' : 'SHORT'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="tnum text-[17px] font-bold" style={{ color: pnlPos2 ? 'var(--primary)' : 'var(--kill)' }}>
                        {pnlPos2 ? '+' : ''}${Number(pos.pnl ?? 0).toFixed(2)}
                      </p>
                      <p className="tnum text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>
                        {Number(pos.pnl_percent ?? 0).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
        }
      </section>

      {/* ── Cycle progress ──────────────────────────────────────────── */}
      <div className="mon-panel rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
        <div className="px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-5">
          <div className="flex-shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--muted)' }}>
              {t('mon.nextScan')}
            </p>
            <p className="tnum text-[22px] font-bold leading-none" style={{ color: 'var(--primary)' }}>
              {String(Math.floor(countdown / 60)).padStart(2,'0')}
              <span style={{ color: 'var(--muted)', opacity: 0.6 }}>:</span>
              {String(countdown % 60).padStart(2,'0')}
            </p>
          </div>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
            <div className="h-full rounded-full transition-[width] duration-1000 ease-linear"
              style={{ width: `${progress}%`, background: 'var(--primary)' }} />
          </div>
          <p className="tnum text-[11px] flex-shrink-0" style={{ color: 'var(--muted)' }}>
            {interval >= 60 ? `${Math.floor(interval / 60)}m` : `${interval}s`} cycle
          </p>
        </div>
      </div>

      {/* ── Log Drawer ──────────────────────────────────────────────── */}
      <LogDrawer logs={logs} open={drawerOpen} onClose={() => setDrawerOpen(false)} />

    </div>
  )
}
