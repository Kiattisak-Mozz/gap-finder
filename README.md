# 🔍 Gap Finder — AI Opportunity Dashboard

Dashboard สำหรับหาช่องว่างทางธุรกิจด้วย AI เน้น Passive Income ทั้งตลาดไทยและต่างประเทศ

## Tech Stack

- **React + Vite** — Frontend framework
- **GSAP** — Animations (float, count-up, stagger entrance, hover)
- **Tailwind CSS** — Styling + Dark mode
- **Lucide React** — Icons

## Getting Started

```bash
npm install
npm run dev
```

เปิดที่ http://localhost:5173

## Features (Phase 1)

- ✅ Dashboard overview stats พร้อม count-up animation
- ✅ Opportunity cards พร้อม 3D float effect
- ✅ Budget breakdown bars แต่ละโปรเจค
- ✅ Passive income project table
- ✅ Filter sidebar (Market / Budget / Type)
- ✅ Dark / Light mode toggle
- ✅ Plugin slots bar (เผื่อต่อยอด)

## Roadmap (Phase 2)

- [ ] Live news scanning agent
- [ ] Supabase backend + real data
- [ ] Skeptic agent วิเคราะห์ความเป็นไปได้
- [ ] Email/LINE alerts เมื่อพบโอกาสใหม่
- [ ] Deploy to Vercel

## Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── StatsRow.jsx
│   ├── OpportunityCard.jsx
│   ├── ProjectTable.jsx
│   └── PluginBar.jsx
├── data/
│   └── opportunities.js
├── hooks/
│   └── useTheme.js
├── App.jsx
├── main.jsx
└── index.css
```
