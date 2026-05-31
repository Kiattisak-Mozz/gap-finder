# Gap Finder — Project Context
> สำหรับใช้ใน Claude Code เพื่อทำงานต่อจาก Claude.ai

---

## Project Overview

**เป้าหมาย:** Web Dashboard ที่เป็นศูนย์กลาง AI หาโอกาสทำ Passive Income  
**เจ้าของ:** Frontend JS Developer (ถนัด React, GSAP)  
**สถานะ:** Phase 1 เสร็จแล้ว — พร้อมต่อยอด Phase 2

---

## Tech Stack

| Layer | Tech | หมายเหตุ |
|---|---|---|
| Frontend | React + Vite | เลือกแล้ว |
| Animation | GSAP | ถนัดอยู่แล้ว, gsap-skills ติดตั้งได้ |
| Styling | Tailwind CSS + Dark mode | class-based dark mode |
| Icons | Lucide React | |
| Hosting | Vercel | ฟรี tier |
| Database (Phase 2) | Supabase | ฟรี tier |
| AI API (Phase 2) | Anthropic Claude API | |

**GSAP Skills (ติดตั้งใน Claude Code):**
```bash
npx skills add https://github.com/greensock/gsap-skills
```

---

## Phase 1 — เสร็จแล้ว ✅

### ไฟล์ที่มี
```
gap-finder/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/
    │   └── opportunities.js       ← hardcode data (6 โปรเจค)
    ├── components/
    │   ├── Header.jsx              ← logo, search, theme toggle, bell
    │   ├── Sidebar.jsx             ← nav + filter (market/budget/type)
    │   ├── StatsRow.jsx            ← 4 stat cards + GSAP count-up
    │   ├── OpportunityCard.jsx     ← bento cards + float animation
    │   ├── ProjectTable.jsx        ← passive income table
    │   └── PluginBar.jsx           ← plugin slots UI
    └── hooks/
        └── useTheme.js             ← dark/light toggle + localStorage
```

### Features ที่มีแล้ว
- GSAP animations: float icons, count-up stats, stagger card entrance, hover lift
- Dark / Light mode toggle (จำค่าใน localStorage)
- Filter sidebar: Market / Budget / Type
- 6 Opportunity cards พร้อม budget breakdown + ROI badge + gap insight
- Project table ครบ columns
- Plugin bar เผื่อต่อ agent

---

## Data Structure (opportunities.js)

แต่ละ opportunity มี field ดังนี้:
```js
{
  id, icon, iconBg,
  title,          // ภาษาไทย
  titleEn,        // ภาษาอังกฤษ
  subtitle,
  description,    // ภาษาไทย
  descriptionEn,  // ภาษาอังกฤษ
  tags, tagTypes,
  market,         // 'thai' | 'sea' | 'global'
  type,           // 'passive' | 'active' | 'hybrid'
  featured,       // boolean
  budget: {
    total,        // string เช่น '฿8,000–25,000'
    breakdown: [{ label, color, pct }]
  },
  income,         // string เช่น '฿20K–80K/เดือน'
  roi,            // 'high' | 'med'
  difficulty,     // 1–5
  timeToROI,      // string เช่น '3–4 เดือน'
  status,         // string label
  statusType,     // 'ready' | 'build' | 'research'
  competition,    // string
  gap,            // string — จุดได้เปรียบ
}
```

---

## Design Reference

**Style:** Light mode หลัก + Dark mode toggle  
**Ref จาก Dribbble:** Booking Adventures UI + Finance Dashboard  
**Vibe:**
- 3D floating objects/emoji (animate float up-down ด้วย GSAP)
- Clean white cards, corners มน, shadow เบาๆ
- Bold typography, accent สี (green #00E96A, orange #FF6B35, purple #7C5CFC, yellow #FFD700)
- Bento grid layout
- Modal: smooth scale + fade (ยังไม่ได้ทำ)

---

## Phase 2 — Roadmap (ทำต่อ)

### Priority สูง
- [ ] **Opportunity Detail Modal** — กดการ์ดแล้วเปิด modal ดูรายละเอียดเต็ม (competition, risk, gap analysis)
- [ ] **Supabase integration** — ย้าย hardcode data ขึ้น DB
- [ ] **Live Agent scan** — scrape ข่าว → ส่งให้ Claude API วิเคราะห์ → เก็บผลใน DB (รัน weekly cron)

### Priority กลาง
- [ ] **Skeptic Agent panel** — แสดงผล devil's advocate ต่อแต่ละโปรเจค
- [ ] **Budget Calculator** — interactive คำนวณ ROI / breakeven
- [ ] **Project Status Board** — kanban สำหรับ track โปรเจคที่กำลังทำ

### Priority ต่ำ / Future
- [ ] **Plugin system จริง** — API สำหรับ connect agent ใหม่
- [ ] **Alert system** — notify เมื่อพบ gap ใหม่
- [ ] **Vercel deploy** — CI/CD pipeline

---

## Agent Architecture — Full Plan

### Diagram

```
┌─────────────────────────────────────────────────────┐
│                  GAP FINDER SYSTEM                  │
├─────────────────────────────────────────────────────┤
│  LAYER 1: INTELLIGENCE    LAYER 2: GENERATION       │
│  ┌─────────────┐          ┌─────────────┐           │
│  │   Scout     │ ──────►  │ Brainstormer│           │
│  │  Agent 1    │          │   Agent 3   │           │
│  └─────────────┘          └──────┬──────┘           │
│  ┌─────────────┐                 │                  │
│  │ Gap Finder  │ ──────►─────────┘                  │
│  │  Agent 2    │                                    │
│  └─────────────┘                                    │
│                    LAYER 3: DEBATE                  │
│              ┌──────────────────────┐               │
│              │  Skeptic   Realist   │               │
│              │  Agent 4   Agent 5   │               │
│              └──────────┬───────────┘               │
│                         │                           │
│                  LAYER 4: DECISION                  │
│              ┌──────────▼───────────┐               │
│              │   Synthesizer        │               │
│              │     Agent 6          │               │
│              └──────────────────────┘               │
│                                                     │
│  SUPPORT: Thailand Lens (7) · Trend Watcher (8)     │
└─────────────────────────────────────────────────────┘
```

---

### Agent 1 — Scout (นักสอดแนม)
**หน้าที่:** สแกนข่าว/สัญญาณอ่อนจากโลก  
**Input:** ไม่มี (รันเอง)  
**Output:** Weak Signals 20–30 ข้อ/สัปดาห์  
**แหล่งข้อมูล:** TechCrunch, Y Combinator, Product Hunt, Reddit, X/Twitter, USPTO, LinkedIn job trends  
**รันเมื่อ:** Cron job ทุก 7 วัน  
**งบ:** ฟรี (scraping) + ~$0.50/รัน (Claude API)  
**สถานะ:** 🔲 ยังไม่ได้สร้าง

---

### Agent 2 — Gap Finder (นักหาช่องว่าง)
**หน้าที่:** รับ Signal → เปรียบกับ landscape ปัจจุบัน → หาช่องว่าง  
**Input:** Output จาก Scout  
**Output:** Gap opportunities + เหตุผลว่าทำไมถึงเป็นช่องว่าง  
**Logic:** มีใครทำแล้วไหม? ถ้ามี — ราคา/ภาษา/niche ยังขาดอะไร?  
**โฟกัส:** ไทย + SEA ก่อน, Global ถ้าน่าสนใจมาก  
**งบ:** ~$0.50–1/รัน  
**สถานะ:** 🔲 ยังไม่ได้สร้าง (UI พร้อมแล้ว)

---

### Agent 3 — Brainstormer (นักระดมสมอง)
**หน้าที่:** รับ Gap → สร้าง Business Concept 3–5 แนวทาง  
**Input:** Output จาก Gap Finder  
**Output:** แต่ละ concept มี: กลุ่มเป้าหมาย / วิธีทำเงิน / ทำด้วย AI ยังไง / งบเริ่มต้น  
**หลักการ:** ยิงมาหมด ไม่กรองตัวเอง  
**งบ:** ~$0.30/รัน  
**สถานะ:** 🔲 ยังไม่ได้สร้าง

---

### Agent 4 — Skeptic (นักสงสัย / ฝ่ายค้าน)
**หน้าที่:** โจมตีทุกจุดอ่อนของ concept  
**Input:** Output จาก Brainstormer  
**Output:** "ทำไมมันจะล้มเหลว" + คู่แข่งจริง + ความเสี่ยง  
**Framework:** TAM/SAM/SOM, Moat Analysis, Execution Risk  
**งบ:** ~$0.30/รัน  
**สถานะ:** 🔲 ยังไม่ได้สร้าง

---

### Agent 5 — Realist (นักประเมินความเป็นจริง)
**หน้าที่:** ประเมินว่าทำได้จริงไหมด้วยทรัพยากรที่มี  
**Input:** Output จาก Brainstormer + Skeptic  
**Output:** Feasibility score 1–10 + เหตุผล + timeline จริง  
**ประเมิน:** คนเดียวทำได้ไหม? ต้องการทักษะอะไรเพิ่ม? งบพอไหม?  
**งบ:** ~$0.30/รัน  
**สถานะ:** 🔲 ยังไม่ได้สร้าง

---

### Agent 6 — Synthesizer (นักสังเคราะห์)
**หน้าที่:** รับผลทั้งหมด → ตัดสินใจสุดท้าย  
**Input:** Output จาก Skeptic + Realist  
**Output:** BUILD / PARK / KILL + ถ้า Build → MVP Spec เบื้องต้น  
**Logic PARK:** ตั้ง trigger ว่า "ถ้าตลาดเปลี่ยนแบบไหน ค่อยกลับมา"  
**งบ:** ~$0.50/รัน  
**สถานะ:** 🔲 ยังไม่ได้สร้าง

---

### Agent 7 — Thailand Lens (เลนส์ไทย)
**หน้าที่:** Filter ทุก idea ผ่านบริบทไทย  
**ทำงานร่วมกับ:** Agent 2, 3, 6 (inject เป็น system prompt)  
**ตรวจสอบ:** กฎหมาย / พฤติกรรมผู้บริโภค / payment (PromptPay/TrueMoney) / ภาษา / วัฒนธรรม  
**งบ:** ไม่มีต้นทุนเพิ่ม (รวมกับ agent อื่น)  
**สถานะ:** 🔲 ยังไม่ได้สร้าง

---

### Agent 8 — Trend Watcher (นาฬิกาเทรนด์)
**หน้าที่:** Monitor background ตลอดเวลา  
**ติดตาม:** Google Trends, Exploding Topics, VC investment themes, Product Hunt  
**Alert เมื่อ:** Signal อ่อนกลายเป็น Signal แรง  
**รันเมื่อ:** ทุกวัน (lightweight)  
**งบ:** ~$0.10/วัน (~$3/เดือน)  
**สถานะ:** 🔲 ยังไม่ได้สร้าง

---

### Cost Summary

| รายการ | ความถี่ | ต้นทุน/เดือน |
|---|---|---|
| Scout + Gap Finder | สัปดาห์ละครั้ง | ~$4 |
| Brainstormer + Skeptic + Realist + Synthesizer | สัปดาห์ละครั้ง | ~$6 |
| Trend Watcher | ทุกวัน | ~$3 |
| **รวม** | | **~$13/เดือน** |

> ถ้า passive income project แรกทำเงินได้ — ค่า agent คืนทุนใน 1 วัน

---

### Build Order

```
Phase 1 ✅  Dashboard UI
Phase 2     Scout + Gap Finder (data จริง)
Phase 3     Brainstormer + Skeptic + Realist
Phase 4     Synthesizer + auto weekly report
Phase 5     Trend Watcher + alert system
Phase 6     Plugin system (เชื่อม agent ใหม่ได้)
```

---

## Business Context

**งบ:** เริ่มต้น $0 — ใช้ free tiers ทั้งหมดก่อน  
**เป้าหมาย:** Passive Income  
**โมเดลรายได้ที่สนใจ:** SaaS (subscription) + Affiliate  
**ตลาดเป้าหมาย:** ไทย (หลัก) + SEA + Global (ถ้าโอกาสดี)

---

## คำสั่งที่ใช้บ่อย

```bash
npm run dev      # start dev server
npm run build    # build production
npm run preview  # preview build
```

---

## หมายเหตุสำหรับ Claude Code

1. ใช้ GSAP สำหรับ animation ทั้งหมด — ห้ามใช้ Framer Motion
2. Tailwind dark mode ใช้ `dark:` prefix (class-based)
3. Component ใหม่ให้วางไว้ใน `src/components/`
4. Data เพิ่มใน `src/data/opportunities.js`
5. ติดตั้ง gsap-skills เพื่อ Claude Code จะใช้ GSAP ได้ถูกต้อง: `npx skills add https://github.com/greensock/gsap-skills`
