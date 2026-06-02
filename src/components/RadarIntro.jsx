/**
 * RadarIntro — 3D radar scan sequence driven by GSAP + ScrollTrigger.
 * Three.js scene (lazy-imported to avoid loading on repeat visits).
 * Session-gated: caller checks sessionStorage before rendering.
 * Reduced-motion: calls onComplete() immediately.
 * WebGL failure: calls onComplete() and degrades gracefully.
 */

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const rm = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Copy per beat, bilingual */
const BEATS = {
  th: [
    'สแกนหาช่องว่างตลาด...',
    '🇹🇭 ตลาดไทย · พบ 32 โอกาส',
    '🌏 SEA · เจาะอีก 15 ช่อง',
    '🔵 TOP SIGNAL · AI Chatbot สำหรับ LINE OA',
  ],
  en: [
    'Scanning market gaps...',
    '🇹🇭 Thai market · 32 gaps found',
    '🌏 SEA · 15 more gaps',
    '🔵 TOP SIGNAL · AI Chatbot for LINE OA',
  ],
}

export default function RadarIntro({ onComplete }) {
  const wrapRef  = useRef(null)
  const canvasRef = useRef(null)
  const [beat, setBeat] = useState(0)
  const { lang } = useLang()

  useEffect(() => {
    if (rm()) { onComplete?.(); return }

    let animRunning = true
    let rafId, st, renderer

    const run = async () => {
      /* Lazy-load Three.js — only executed on first-session visit */
      let T
      try { T = await import('three') } catch { onComplete?.(); return }
      if (!animRunning) return

      const {
        Scene, PerspectiveCamera, WebGLRenderer, Group,
        RingGeometry, MeshBasicMaterial, Mesh, DoubleSide,
        BufferGeometry, Line, LineBasicMaterial, Vector3,
        SphereGeometry, AdditiveBlending, Clock,
      } = T

      /* ── Scene ────────────────────────────────── */
      const scene = new Scene()
      const camera = new PerspectiveCamera(52, 1, 0.1, 100)
      camera.position.set(0, 4.8, 3.6)
      const camLook = new Vector3(0, 0, 0) // tweened by GSAP

      /* Renderer */
      renderer = new WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      })
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)

      const resize = () => {
        const el = canvasRef.current
        if (!el) return
        const w = el.clientWidth, h = el.clientHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      if (canvasRef.current) ro.observe(canvasRef.current)

      /* ── Outer ring ──────────────────────────── */
      const addRing = (inner, outer, color, opacity) => {
        const g = new RingGeometry(inner, outer, 128)
        const m = new MeshBasicMaterial({ color, side: DoubleSide, transparent: true, opacity })
        const mesh = new Mesh(g, m)
        mesh.rotation.x = -Math.PI / 2
        scene.add(mesh)
        return mesh
      }
      addRing(1.88, 1.92, 0x4860ea, 0.55)
      addRing(0.93, 0.96, 0x1fa1c4, 0.30)

      /* ── Cross-hairs ─────────────────────────── */
      const line2 = (ax, ay, az, bx, by, bz, color = 0x4860ea, opacity = 0.14) => {
        const g = new BufferGeometry().setFromPoints([new Vector3(ax, ay, az), new Vector3(bx, by, bz)])
        const m = new LineBasicMaterial({ color, transparent: true, opacity })
        return scene.add(new Line(g, m))
      }
      line2(-2.2, 0, 0, 2.2, 0, 0)
      line2(0, 0, -2.2, 0, 0, 2.2)
      line2(-2.2, 0, -2.2, 2.2, 0, 2.2, 0x4860ea, 0.06)
      line2(-2.2, 0, 2.2, 2.2, 0, -2.2, 0x4860ea, 0.06)

      /* ── Sweep group (rotates every frame) ───── */
      const sweep = new Group()
      scene.add(sweep)

      const sweepPts = [new Vector3(0, 0, 0), new Vector3(1.92, 0, 0)]
      const sweepGeo = new BufferGeometry().setFromPoints(sweepPts)
      const sweepMat = new LineBasicMaterial({ color: 0x3bbedc, transparent: true, opacity: 0.9, blending: AdditiveBlending })
      sweep.add(new Line(sweepGeo, sweepMat))

      /* Fading trail behind sweep */
      for (let i = 1; i <= 10; i++) {
        const tg = new BufferGeometry().setFromPoints(sweepPts)
        const tm = new LineBasicMaterial({
          color: 0x3bbedc, transparent: true,
          opacity: 0.10 * (1 - i / 11),
          blending: AdditiveBlending,
        })
        const t = new Line(tg, tm)
        t.rotation.y = -i * 0.16
        sweep.add(t)
      }

      /* ── Market nodes ────────────────────────── */
      const nodePositions = [
        { pos: new Vector3(1.3, 0, -1.3),  color: 0x4860ea }, // Thai
        { pos: new Vector3(-1.6, 0, 0.55), color: 0x1fa1c4 }, // SEA
        { pos: new Vector3(0.45, 0, 1.75), color: 0x6f86f7 }, // Global
      ]

      const nodes = nodePositions.map(({ pos, color }) => {
        /* Dot */
        const dg = new SphereGeometry(0.11, 16, 16)
        const dm = new MeshBasicMaterial({ color, transparent: true, opacity: 0 })
        const dot = new Mesh(dg, dm)
        dot.position.copy(pos)
        dot.scale.setScalar(0)
        scene.add(dot)

        /* Expanding ping ring */
        const pg = new RingGeometry(0.13, 0.155, 32)
        const pm = new MeshBasicMaterial({ color, side: DoubleSide, transparent: true, opacity: 0, blending: AdditiveBlending })
        const ping = new Mesh(pg, pm)
        ping.rotation.x = -Math.PI / 2
        ping.position.copy(pos)
        ping.scale.setScalar(0)
        scene.add(ping)

        return { dot, ping }
      })

      /* Top-signal highlight (bigger sphere, white) */
      const sigGeo = new SphereGeometry(0.17, 20, 20)
      const sigMat = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
      const sigMesh = new Mesh(sigGeo, sigMat)
      sigMesh.position.copy(nodePositions[0].pos)
      sigMesh.scale.setScalar(0)
      scene.add(sigMesh)

      /* ── RAF loop ────────────────────────────── */
      const clock = new Clock()
      const tick = () => {
        if (!animRunning) return
        rafId = requestAnimationFrame(tick)
        sweep.rotation.y += 0.022      // continuous sweep
        camera.lookAt(camLook)         // follow GSAP-tweened target
        renderer.render(scene, camera)
      }
      tick()

      /* ── GSAP timeline (scrubbed by ST) ──────── */
      const tl = gsap.timeline({ paused: true })

      /* Beat 1: Thai (progress 0.25) */
      tl.to(nodes[0].dot.material, { opacity: 1, duration: 0.18 }, 0.25)
        .to(nodes[0].dot.scale, { x: 1, y: 1, z: 1, duration: 0.28, ease: 'back.out(2.5)' }, 0.25)
        .to(nodes[0].ping.material, { opacity: 0.7, duration: 0.12 }, 0.28)
        .to(nodes[0].ping.scale, { x: 3.5, y: 3.5, z: 3.5, duration: 0.38, ease: 'power2.out' }, 0.28)
        .to(nodes[0].ping.material, { opacity: 0, duration: 0.18 }, 0.5)
        .call(() => { if (animRunning) setBeat(1) }, null, 0.25)
      tl.to(camera.position, { x: 0.6, z: 3.2, duration: 0.35, ease: 'power2.inOut' }, 0.25)

      /* Beat 2: SEA (progress 0.50) */
      tl.to(nodes[1].dot.material, { opacity: 1, duration: 0.18 }, 0.50)
        .to(nodes[1].dot.scale, { x: 1, y: 1, z: 1, duration: 0.28, ease: 'back.out(2.5)' }, 0.50)
        .to(nodes[1].ping.material, { opacity: 0.7, duration: 0.12 }, 0.53)
        .to(nodes[1].ping.scale, { x: 3.5, y: 3.5, z: 3.5, duration: 0.38, ease: 'power2.out' }, 0.53)
        .to(nodes[1].ping.material, { opacity: 0, duration: 0.18 }, 0.75)
        .call(() => { if (animRunning) setBeat(2) }, null, 0.50)
      tl.to(camera.position, { x: -0.4, z: 3.0, duration: 0.35, ease: 'power2.inOut' }, 0.50)

      /* Beat 3: Global + TOP SIGNAL (progress 0.75) */
      tl.to(nodes[2].dot.material, { opacity: 1, duration: 0.18 }, 0.75)
        .to(nodes[2].dot.scale, { x: 1, y: 1, z: 1, duration: 0.28, ease: 'back.out(2.5)' }, 0.75)
        .to(sigMesh.material, { opacity: 0.9, duration: 0.2 }, 0.84)
        .to(sigMesh.scale, { x: 1, y: 1, z: 1, duration: 0.35, ease: 'elastic.out(1.2, 0.5)' }, 0.84)
        .call(() => { if (animRunning) setBeat(3) }, null, 0.75)
      tl.to(camera.position, { x: 0, y: 3.5, z: 4.0, duration: 0.4, ease: 'power2.inOut' }, 0.75)

      /* ── ScrollTrigger ───────────────────────── */
      const scroller = document.getElementById('app-scroll')
      let completed = false
      const finish = () => { if (completed) return; completed = true; onComplete?.() }

      st = ScrollTrigger.create({
        trigger: wrapRef.current,
        scroller,
        pin: true,
        start: 'top top',
        end: '+=220%',
        scrub: 1.2,
        onUpdate: self => {
          tl.progress(self.progress)
          if (self.progress >= 0.98) finish()
        },
        onLeave: finish,
      })

      ScrollTrigger.refresh()
    }

    run()

    return () => {
      animRunning = false
      cancelAnimationFrame(rafId)
      // st.kill() already called by App.jsx handleDone() before React unmounts;
      // calling it again here (if not already killed) is safe but skipped if already dead.
      try { if (st && !st.vars) {} else st?.kill() } catch {}
      try { renderer?.dispose() } catch {}
    }
  }, []) // eslint-disable-line

  const copy = BEATS[lang]?.[beat] ?? BEATS.th[beat]

  return (
    <section
      ref={wrapRef}
      className="relative overflow-hidden"
      style={{ height: 'calc(100dvh - 64px)', background: 'var(--bg)' }}
      aria-label="Market scan intro"
    >
      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        aria-hidden="true"
      />

      {/* Skip button */}
      <button
        onClick={() => onComplete?.()}
        className="absolute top-4 right-4 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-100"
        style={{ color: 'var(--muted)', opacity: 0.5, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        {lang === 'en' ? 'Skip intro' : 'ข้ามไป'} →
      </button>

      {/* Beat copy overlay */}
      <div
        key={beat}
        className="absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-2 pointer-events-none"
        style={{ animation: 'beat-in 0.38s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        <p
          className="text-[13px] font-semibold tracking-wide text-center px-6"
          style={{ color: beat === 3 ? 'var(--primary)' : 'var(--muted)' }}
        >
          {copy}
        </p>
        {beat < 3 && (
          <p className="text-[11px]" style={{ color: 'var(--muted)', opacity: 0.55 }}>
            {lang === 'en' ? 'scroll to continue' : 'เลื่อนเพื่อดูต่อ'}
          </p>
        )}
      </div>

      {/* Scroll cue (beat 0 only) */}
      {beat === 0 && (
        <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ animation: 'cue-bounce 1.6s ease-in-out infinite' }}>
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none" aria-hidden="true">
            <rect x="6" y="1" width="8" height="14" rx="4" stroke="var(--muted)" strokeWidth="1.5" opacity=".5"/>
            <circle cx="10" cy="7" r="2.5" fill="var(--primary)" style={{ animation: 'cue-dot 1.6s ease-in-out infinite' }}/>
            <path d="M5 20 L10 26 L15 20" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".4"/>
          </svg>
        </div>
      )}
    </section>
  )
}
