/**
 * RadarGlobe — cinematic scroll-camera intro for the Landing page.
 *
 * A real Three.js globe that the camera flies into as the user scrolls:
 * whole earth → SEA → Thailand cluster → BUILD verdict. Driven by a scrubbed,
 * pinned GSAP ScrollTrigger. HTML overlay cards carry real opportunity data and
 * fade in stage-by-stage.
 *
 * Theme (Option C): NIGHT earth in dark mode, DAY earth in light mode. The scene
 * is built ONCE and the theme is applied by mutating existing materials/lights —
 * no re-init — so toggling theme never flickers and both textures stay cached.
 *
 * Responsive: the camera distance is fit to the viewport aspect every resize, so
 * the FULL globe is visible at stage 0 on any screen size.
 *
 * Landing scrolls in the WINDOW (not the <main#app-scroll> shell), so ScrollTrigger
 * uses the default window scroller here. Reduced-motion / WebGL-failure fall back
 * to a static, fully-readable composition.
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ChevronRight, Radar, Search } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import { opportunities } from '../data/opportunities'
import DecisionChip from './ui/DecisionChip'

gsap.registerPlugin(ScrollTrigger)

const rm = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}

/* lat/lon → unit-sphere position (equirectangular texture orientation) */
function latLon(lat, lon, r = 1) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ]
}

const oppById = id => opportunities.find(o => o.id === id)
const CITIES = [
  { name: 'Bangkok',    nameTh: 'กรุงเทพฯ',  lat: 13.75, lon: 100.52, opp: oppById(1) },
  { name: 'Chiang Mai', nameTh: 'เชียงใหม่', lat: 18.79, lon: 98.99,  opp: oppById(3) },
  { name: 'Phuket',     nameTh: 'ภูเก็ต',    lat: 7.88,  lon: 98.39,  opp: oppById(5) },
  { name: 'Jakarta',    nameTh: 'จาการ์ตา',  lat: -6.20, lon: 106.85, opp: oppById(6) },
].filter(c => c.opp)

const STAGE_COPY = {
  th: [
    'Scout กำลังสแกนตลาดทั่วโลก…',
    '🌏 ล็อกเป้า SEA · เจาะตลาดเอเชียตะวันออกเฉียงใต้',
    '🇹🇭 ตลาดไทย · พบสัญญาณโอกาสหลายจุด',
    '✅ Synthesizer สรุป: พร้อม BUILD',
  ],
  en: [
    'Scout is scanning markets worldwide…',
    '🌏 Locking onto SEA · narrowing the region',
    '🇹🇭 Thai market · multiple opportunity signals',
    '✅ Synthesizer verdict: ready to BUILD',
  ],
}

export default function RadarGlobe() {
  const { lang } = useLang()
  const { isDark } = useTheme()
  const isTh = lang === 'th'

  /* Text painted directly on the globe stays light-on-dark in BOTH themes
     (space backdrop is dark either way). Cards use design tokens and adapt. */
  const onGlobe = {
    text: 'oklch(0.965 0.008 262)',
    text2: 'oklch(0.840 0.014 262)',
    muted: 'oklch(0.720 0.018 262)',
    accent: 'oklch(0.820 0.130 205)',
  }

  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)      // mutable scene handles for theme-swap
  const isDarkRef = useRef(isDark)
  isDarkRef.current = isDark

  const [stage, setStage] = useState(0)
  const [fallback, setFallback] = useState(false)
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const h = e => setIsNarrow(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  const counts = {
    build: opportunities.filter(o => o.statusType === 'ready').length,
    scoped: opportunities.filter(o => o.statusType === 'build').length,
    research: opportunities.filter(o => o.statusType === 'research').length,
  }
  const total = opportunities.length
  const featured = CITIES.find(c => c.opp.statusType === 'ready')?.opp || opportunities[0]

  /* ── Build the scene ONCE ──────────────────────────────────── */
  useEffect(() => {
    if (rm() || !hasWebGL()) { setFallback(true); return }

    let running = true
    let rafId, st, renderer, scene, ro
    const stageGuard = { v: -1 }
    const setStageOnce = v => { if (stageGuard.v !== v) { stageGuard.v = v; if (running) setStage(v) } }

    const run = async () => {
      let T
      try { T = await import('three') } catch { setFallback(true); return }
      if (!running) return

      const {
        Scene, PerspectiveCamera, WebGLRenderer, Group, Color,
        SphereGeometry, MeshStandardMaterial, MeshBasicMaterial, Mesh,
        RingGeometry, DoubleSide, BackSide, AdditiveBlending,
        AmbientLight, DirectionalLight, TextureLoader, SRGBColorSpace,
        ShaderMaterial, BufferGeometry, BufferAttribute, Points, PointsMaterial,
        Vector3, Clock,
      } = T

      scene = new Scene()
      const R = 1

      const camera = new PerspectiveCamera(40, 1, 0.1, 100)
      camera.position.set(0, 0, 3.5)
      const camTarget = new Vector3(0, 0, 0)

      renderer = new WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: false })
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

      /* fit the full globe to the viewport on resize (responsive) */
      let fitZ = 3.5
      const resize = () => {
        const el = canvasRef.current
        if (!el) return
        const w = el.clientWidth, h = el.clientHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        const vFov = camera.fov * Math.PI / 180
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect)
        const half = Math.min(vFov, hFov) / 2
        fitZ = (R / Math.sin(half)) * 1.18   // 1.18 → full globe with margin
      }
      resize()
      ro = new ResizeObserver(resize)
      if (canvasRef.current) ro.observe(canvasRef.current)

      /* globe group (rotates) */
      const globe = new Group()
      globe.rotation.y = 2.30
      scene.add(globe)

      const earthMat = new MeshStandardMaterial({ roughness: 1, metalness: 0 })
      const earth = new Mesh(new SphereGeometry(R, 96, 96), earthMat)
      globe.add(earth)

      const loader = new TextureLoader()
      const onTex = t => { t.colorSpace = SRGBColorSpace; earthMat.needsUpdate = true }
      const nightTex = loader.load('/textures/earth-night.jpg', onTex); nightTex.colorSpace = SRGBColorSpace

      /* atmosphere rim glow */
      const atmMat = new ShaderMaterial({
        transparent: true, side: BackSide, blending: AdditiveBlending, depthWrite: false,
        uniforms: { glow: { value: new Color(0x36c6e6) }, power: { value: 3.0 }, strength: { value: 0.9 } },
        vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'varying vec3 vN; uniform vec3 glow; uniform float power; uniform float strength; void main(){ float i = pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), power); gl_FragColor = vec4(glow, 1.0) * i * strength; }',
      })
      const atm = new Mesh(new SphereGeometry(R, 64, 64), atmMat)
      atm.scale.setScalar(1.16)
      scene.add(atm)

      /* lights */
      const ambient = new AmbientLight(0xffffff, 0.55)
      scene.add(ambient)
      const sun = new DirectionalLight(0xfff4e0, 0.7)
      sun.position.set(0.4, 0.35, 1)
      scene.add(sun)

      /* starfield */
      const starCount = 900
      const sp = new Float32Array(starCount * 3)
      for (let i = 0; i < starCount; i++) {
        const r = 14 + Math.random() * 26
        const t = Math.random() * Math.PI * 2
        const p = Math.acos(2 * Math.random() - 1)
        sp[i * 3] = r * Math.sin(p) * Math.cos(t)
        sp[i * 3 + 1] = r * Math.sin(p) * Math.sin(t)
        sp[i * 3 + 2] = r * Math.cos(p)
      }
      const starGeo = new BufferGeometry()
      starGeo.setAttribute('position', new BufferAttribute(sp, 3))
      const starMat = new PointsMaterial({ color: 0x9fb2d8, size: 0.06, sizeAttenuation: true, transparent: true, opacity: 0.7 })
      const stars = new Points(starGeo, starMat)
      scene.add(stars)

      /* city markers (children of globe) */
      const markers = CITIES.map(c => {
        const [x, y, z] = latLon(c.lat, c.lon, R * 1.005)
        const pos = new Vector3(x, y, z)
        const col = new Color(c.opp.statusType === 'ready' ? 0x36c6e6 : 0x5b73ff)
        const dot = new Mesh(new SphereGeometry(0.013, 16, 16), new MeshBasicMaterial({ color: col }))
        dot.position.copy(pos)
        globe.add(dot)
        const ping = new Mesh(
          new RingGeometry(0.02, 0.026, 32),
          new MeshBasicMaterial({ color: col, side: DoubleSide, transparent: true, opacity: 0, blending: AdditiveBlending })
        )
        ping.position.copy(pos)
        ping.lookAt(pos.clone().multiplyScalar(2))
        globe.add(ping)
        return { ping }
      })

      /* ── Theme application (mutates existing objects, no rebuild) ──
         The globe stays the NIGHT map in both themes (a dark "window to space").
         Theme still drives the overlay cards (var tokens), just not the earth. */
      const applyTheme = () => {
        earthMat.map = nightTex
        earthMat.emissiveMap = nightTex
        earthMat.emissive = new Color(0xffe0b0)
        earthMat.emissiveIntensity = 1.3
        earthMat.color = new Color(0x8aa0c8)
        ambient.intensity = 0.5
        sun.intensity = 0.55
        atmMat.uniforms.glow.value = new Color(0x36c6e6)
        atmMat.uniforms.power.value = 3.0
        atmMat.uniforms.strength.value = 0.95
        starMat.color = new Color(0x9fb2d8); starMat.opacity = 0.7
        renderer.setClearColor(new Color(0x0a0e1a), 1)
        earthMat.needsUpdate = true
      }
      applyTheme()

      /* ── Scrubbed view state (normalized zoom → responsive) ── */
      const view = { zoom: 1.0, rotY: 2.30, tx: 0, ty: 0 }
      const tl = gsap.timeline({ paused: true })
      tl.to(view, { zoom: 0.82, rotY: 2.78, duration: 1, ease: 'power1.inOut' }, 0)
      tl.to(view, { zoom: 0.62, rotY: 2.96, tx: 0.10, ty: 0.15, duration: 1, ease: 'power1.inOut' }, 1)
      tl.to(view, { zoom: 0.50, tx: 0.15, ty: 0.20, duration: 1, ease: 'power2.inOut' }, 2)

      /* ── RAF ── */
      const clock = new Clock()
      let scrollProg = 0
      const tick = () => {
        if (!running) return
        rafId = requestAnimationFrame(tick)
        const t = clock.getElapsedTime()
        globe.rotation.y = view.rotY
        camera.position.z = fitZ * view.zoom
        camTarget.set(view.tx, view.ty, 0)
        stars.rotation.y += 0.0002
        const active = scrollProg > 0.45
        markers.forEach((m, i) => {
          const k = (t * 0.9 + i * 0.4) % 1
          m.ping.scale.setScalar(1 + k * 2.4)
          m.ping.material.opacity = active ? (1 - k) * 0.65 : 0
        })
        camera.lookAt(camTarget)
        renderer.render(scene, camera)
      }
      tick()

      /* ── ScrollTrigger (window scroller) ── */
      st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: '+=320%',
        scrub: 0.6,
        pin: true,
        pinSpacing: true,
        pinType: 'transform', // play nice with Lenis smooth scroll; avoids the
                              // fixed↔static repaint flicker at pin release
        onUpdate: self => {
          scrollProg = self.progress
          tl.progress(self.progress)
          const s = self.progress < 0.28 ? 0
            : self.progress < 0.55 ? 1
            : self.progress < 0.82 ? 2 : 3
          setStageOnce(s)
        },
      })
      ScrollTrigger.refresh()

      sceneRef.current = { applyTheme }
    }

    run()

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      sceneRef.current = null
      try { ro?.disconnect() } catch {}
      try { st?.kill() } catch {}
      try {
        scene?.traverse(o => {
          o.geometry?.dispose?.()
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose?.())
          else o.material?.dispose?.()
        })
      } catch {}
      try { renderer?.dispose() } catch {}
    }
  }, []) // build once

  /* ── Apply theme on toggle (no rebuild → no flicker) ── */
  useEffect(() => {
    sceneRef.current?.applyTheme()
  }, [isDark])

  /* ───────────────────────── render ───────────────────────── */

  const caption = STAGE_COPY[isTh ? 'th' : 'en'][fallback ? 2 : stage]
  const panelVisible = isNarrow ? (stage === 1 || stage === 2) : (stage >= 1)

  const cardShadow = '0 18px 50px oklch(0 0 0 / 0.35)'

  const MarketPanel = (
    <div
      style={{
        width: 'min(300px, 80vw)',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 16, boxShadow: cardShadow,
      }}
    >
      <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
        <Search size={14} style={{ color: 'var(--primary)' }} />
        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)' }}>
          {isTh ? 'ภาพรวมตลาด' : 'Market overview'}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: 'var(--muted)' }}>TH · SEA</span>
      </div>
      <div className="flex items-end gap-2" style={{ marginBottom: 12 }}>
        <span className="tnum" style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{total}</span>
        <span style={{ fontSize: 11, color: 'var(--muted)', paddingBottom: 4 }}>{isTh ? 'โอกาสที่กำลังติดตาม' : 'gaps tracked'}</span>
      </div>
      <div className="flex flex-col gap-2">
        {[
          { t: 'ready',    n: counts.build,    l: isTh ? 'พร้อม BUILD' : 'BUILD-ready' },
          { t: 'build',    n: counts.scoped,   l: isTh ? 'อยู่ในแผน' : 'In scope' },
          { t: 'research', n: counts.research, l: isTh ? 'ต้องหาข้อมูล' : 'Needs research' },
        ].map(r => (
          <div key={r.t} className="flex items-center gap-2.5">
            <DecisionChip type={r.t} size="sm" />
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{r.l}</span>
            <span className="tnum" style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{r.n}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const SpotlightCard = ({ city }) => {
    const o = city.opp
    return (
      <div
        style={{
          width: 'min(290px, 84vw)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 14, boxShadow: cardShadow,
          }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--build)', boxShadow: '0 0 8px var(--build)' }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)' }}>{isTh ? city.nameTh : city.name}</span>
          <span style={{ marginLeft: 'auto' }}><DecisionChip type={o.statusType} size="sm" /></span>
        </div>
        <div className="flex items-start gap-2.5">
          <span style={{ fontSize: 22, lineHeight: 1 }}>{o.icon}</span>
          <div className="min-w-0">
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
              {isTh ? o.title : o.titleEn}
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--muted)' }}>{isTh ? 'ช่องว่าง: ' : 'Gap: '}</span>
              {isTh ? o.gap : o.gapEn}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2" style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)' }}>{isTh ? 'งบเริ่ม' : 'Budget'}</div>
            <div className="tnum" style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text)' }}>{o.budget.total}</div>
          </div>
          <div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)' }}>{isTh ? 'รายได้คาด' : 'Est. income'}</div>
            <div className="tnum" style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--primary)' }}>{o.income}</div>
          </div>
        </div>
      </div>
    )
  }

  /* ── Fallback (reduced-motion / no WebGL) ── */
  if (fallback) {
    return (
      <section
        ref={wrapRef}
        className="relative overflow-hidden"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
        aria-label={isTh ? 'ภาพรวมตลาด' : 'Market overview'}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/textures/earth-night.jpg)',
            backgroundSize: 'cover', backgroundPosition: '72% 38%',
            opacity: isDark ? 0.55 : 0.4,
            maskImage: 'radial-gradient(circle at 60% 45%, #000 30%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(circle at 60% 45%, #000 30%, transparent 78%)',
          }}
        />
        <div className="px-4 sm:px-6 relative" style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 24px' }}>
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2" style={{ minHeight: 32, padding: '0 12px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 12, fontWeight: 700, color: 'var(--text-2)' }}>
                <Radar size={14} style={{ color: 'var(--primary)' }} />
                {isTh ? 'สแกนตลาด TH · SEA' : 'Scanning TH · SEA markets'}
              </div>
              <h2 style={{ margin: '16px 0 0', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text)', lineHeight: 1.08, maxWidth: '18ch' }}>
                {isTh ? 'เห็นช่องว่างตลาด แล้วลงมือก่อนใคร' : 'See the gap. Move first.'}
              </h2>
              <div style={{ marginTop: 22, maxWidth: 300 }}><SpotlightCard city={CITIES[0]} /></div>
            </div>
            {MarketPanel}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={wrapRef}
      className="relative overflow-hidden"
      style={{ height: '100vh', background: 'oklch(0.09 0.015 262)' }}
      aria-label={isTh ? 'ทัวร์ตลาดแบบ 3 มิติ' : '3D market tour'}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" aria-hidden="true" />

      {/* Space-tone scrim: frames the globe and guarantees text contrast over
          both the night and day textures, in both themes. Also blends the
          section edges into the (dark) hero that follows. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, oklch(0.09 0.015 262) 0%, transparent 19%, transparent 70%, oklch(0.09 0.015 262) 100%)' }}
      />

      {/* top-left status */}
      <div className="absolute left-4 sm:left-6 top-5 flex items-center gap-2 pointer-events-none">
        <div className="inline-flex items-center gap-2" style={{ minHeight: 30, padding: '0 12px', borderRadius: 999, border: '1px solid oklch(1 0 0 / 0.22)', background: 'oklch(1 0 0 / 0.10)', fontSize: 11.5, fontWeight: 700, color: onGlobe.text2 }}>
          <Radar size={13} style={{ color: onGlobe.accent }} />
          {isTh ? 'Scout · เรียลไทม์' : 'Scout · live scan'}
        </div>
      </div>

      {/* headline — fades as we zoom in */}
      <div
        className="absolute left-4 sm:left-6 pointer-events-none"
        style={{
          top: '18%', maxWidth: 'min(440px, 78vw)',
          opacity: stage <= 1 ? 1 : 0,
          transform: stage <= 1 ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'opacity .5s ease, transform .5s ease',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 'clamp(1.9rem, 4.6vw, 3.4rem)', fontWeight: 800, letterSpacing: '-0.03em', color: onGlobe.text, lineHeight: 1.04, whiteSpace: 'pre-line', textShadow: '0 2px 24px oklch(0.12 0.02 262 / 0.6)' }}>
          {isTh ? 'เห็นช่องว่าง\nแล้วลงมือก่อนใคร' : 'See the gap.\nMove first.'}
        </h2>
        <p style={{ margin: '14px 0 0', fontSize: 15, lineHeight: 1.65, color: onGlobe.text2, maxWidth: '34ch', textShadow: '0 1px 16px oklch(0.12 0.02 262 / 0.5)' }}>
          {isTh
            ? 'AI สแกนตลาดไทยและ SEA แบบเรียลไทม์ แล้วชี้โอกาสที่พร้อมลงมือ'
            : 'AI scans Thai & SEA markets in real time and surfaces what is ready to build.'}
        </p>
      </div>

      {/* market overview panel */}
      <div
        className="absolute pointer-events-none left-4 right-4 top-[42%] flex justify-center sm:left-auto sm:right-6 sm:top-[16%] sm:block"
        style={{
          opacity: panelVisible ? 1 : 0,
          transform: panelVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity .55s ease, transform .55s ease',
        }}
      >
        {MarketPanel}
      </div>

      {/* spotlight cards — Thailand zoom (stage 2), desktop only */}
      <div
        className="absolute pointer-events-none hidden sm:block"
        style={{
          left: '4%', top: '24%',
          opacity: stage === 2 ? 1 : 0,
          transform: stage === 2 ? 'scale(1)' : 'scale(0.96)',
          transition: 'opacity .5s ease, transform .5s ease',
        }}
      >
        <SpotlightCard city={CITIES[0]} />
      </div>
      <div
        className="absolute pointer-events-none hidden md:block"
        style={{
          left: '12%', top: '54%',
          opacity: stage === 2 ? 1 : 0,
          transform: stage === 2 ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity .55s ease .06s, transform .55s ease .06s',
        }}
      >
        <SpotlightCard city={CITIES[1] || CITIES[0]} />
      </div>

      {/* verdict + CTA — final zoom (stage 3) */}
      <div
        className="absolute inset-x-0 flex justify-center px-4 pointer-events-none"
        style={{
          bottom: '14%',
          opacity: stage === 3 ? 1 : 0,
          transform: stage === 3 ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity .55s ease, transform .55s ease',
        }}
      >
        <div
          className="pointer-events-auto"
          style={{
            width: 'min(440px, 90vw)', textAlign: 'center',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 18, padding: '20px 22px', boxShadow: cardShadow,
              }}
        >
          <div className="flex items-center justify-center gap-2" style={{ marginBottom: 8 }}>
            <DecisionChip type="ready" />
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{isTh ? 'คำแนะนำจาก Synthesizer' : 'Synthesizer verdict'}</span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {isTh ? featured.title : featured.titleEn}
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap" style={{ marginTop: 16 }}>
            <Link to="/dashboard" className="inline-flex items-center gap-2 focus-ring"
              style={{ minHeight: 44, padding: '0 18px', borderRadius: 11, background: 'var(--primary)', color: 'var(--on-primary)', textDecoration: 'none', fontSize: 14, fontWeight: 800 }}>
              {isTh ? 'เปิดแดชบอร์ด' : 'Open dashboard'}
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
            <Link to="/opportunities" className="inline-flex items-center gap-2 focus-ring"
              style={{ minHeight: 44, padding: '0 16px', borderRadius: 11, border: '1px solid var(--border)', color: 'var(--text-2)', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
              {isTh ? 'ดูโอกาสทั้งหมด' : 'Browse gaps'}
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* stage caption — kept clear of the globe at the very bottom */}
      <div className="absolute inset-x-0 flex flex-col items-center gap-2 pointer-events-none" style={{ bottom: '4%' }}>
        <p key={stage} style={{ fontSize: 13, fontWeight: 700, textAlign: 'center', padding: '0 24px', color: stage === 3 ? onGlobe.accent : onGlobe.text2, textShadow: '0 1px 14px oklch(0.10 0.02 262 / 0.7)', animation: 'page-enter .4s ease both' }}>
          {caption}
        </p>
        {stage < 3 && (
          <p style={{ fontSize: 11, color: onGlobe.muted, opacity: 0.8, textShadow: '0 1px 10px oklch(0.10 0.02 262 / 0.6)' }}>
            {isTh ? 'เลื่อนเพื่อซูมเข้า' : 'scroll to zoom in'}
          </p>
        )}
      </div>
    </section>
  )
}
