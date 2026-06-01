import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const LanguageContext = createContext()

const dict = {
  th: {
    /* Layout */
    'search.placeholder': 'ค้นหาโอกาส',
    'search.cancel': 'ยกเลิก',
    'search.open': 'เปิดการค้นหา',
    'search.hint': 'พิมพ์เพื่อค้นหาโอกาส ตลาด หรือคำสำคัญ',
    /* Sidebar */
    'nav.section.menu': 'เมนู',
    'nav.section.general': 'ทั่วไป',
    'nav.dashboard': 'แดชบอร์ด',
    'nav.opportunities': 'โอกาส',
    'nav.scanner': 'สแกนเนอร์',
    'nav.analytics': 'วิเคราะห์',
    'nav.projects': 'โปรเจกต์',
    'nav.plugins': 'ปลั๊กอิน',
    'nav.help': 'ช่วยเหลือ',
    'nav.logout': 'ออกจากระบบ',
    'app.title': 'แอปมือถือ',
    'app.sub': 'เช็กโอกาสได้ทุกที่',
    'app.download': 'ดาวน์โหลด',
    /* Dashboard header */
    'dash.title': 'แดชบอร์ด',
    'dash.subtitle': 'สแกนช่องว่างตลาด เทียบงบกับ ROI แล้วตัดสินใจว่าจะ build, park หรือ kill',
    'dash.import': 'นำเข้าข้อมูล',
    'dash.addGap': 'เพิ่มโอกาส',
    /* Signals */
    'sig.gaps': 'โอกาสทั้งหมด',
    'sig.gaps.note': '↑ 6 ใหม่สัปดาห์นี้',
    'sig.ready': 'พร้อมสร้างเลย',
    'sig.ready.note': 'งบ + ภาษาไทยพร้อม',
    'sig.roi': 'ROI เฉลี่ย',
    'sig.roi.note': 'ภายใน 12 เดือน',
    'sig.budget': 'งบขั้นต่ำ',
    'sig.budget.note': '3 โปรเจกต์เริ่มฟรี',
    /* Analytics + pipeline */
    'weekly.title': 'การค้นพบรายสัปดาห์',
    'weekly.sub': 'โอกาสใหม่ที่สแกนเจอในแต่ละวัน',
    'dec.ready.th': 'สร้างได้เลย',
    'dec.build.th': 'อยู่ในแผน',
    'dec.research.th': 'ต้องหาข้อมูล',
    /* Top opportunity */
    'top.rank': 'โอกาสอันดับ 1',
    'top.income': 'รายได้คาด',
    'top.payback': 'คืนทุน',
    'top.start': 'เริ่ม Build เลย',
    /* Opportunity grid */
    'opps.title': 'ช่องว่างที่พบ',
    'opps.sub': '{n} โอกาส · เรียงตามความพร้อม build',
    'opps.filter': 'ทั้งหมด',
    'opp.gap': 'ช่องว่าง',
    'opp.budgetStart': 'งบเริ่มต้น',
    'opp.income': 'รายได้คาด',
    /* Bottom */
    'market.title': 'ความเคลื่อนไหวตลาด',
    'rate.title': 'อัตราการตัดสินใจ',
    'rate.sub': 'โอกาสที่ประเมินแล้ว',
    'timer.title': 'เวลาที่ลงมือ build',
    'timer.sub': 'สะสมชั่วโมงสร้าง passive income',
    'timer.pause': 'หยุดชั่วคราว',
    'timer.stop': 'หยุด',
    /* Difficulty */
    'diff.1': 'ง่ายมาก', 'diff.2': 'ง่าย', 'diff.3': 'ปานกลาง', 'diff.4': 'ยาก', 'diff.5': 'ยากมาก',
    /* Weekday axis */
    'wk.mon': 'จ', 'wk.tue': 'อ', 'wk.wed': 'พ', 'wk.thu': 'พฤ', 'wk.fri': 'ศ', 'wk.sat': 'ส', 'wk.sun': 'อา',
    /* ── Other pages ── */
    'opps.page.sub': 'ทุกช่องว่างตลาดที่สแกนเจอ เรียง เปรียบเทียบ และตัดสินใจ',
    'scanner.sub': 'ตรวจจับช่องว่างตลาดอัตโนมัติรายตลาด',
    'projects.sub': 'ติดตามเส้นทางจากช่องว่างสู่โปรดักต์',
    'plugins.sub': 'เชื่อมต่อเอเจนต์และแหล่งข้อมูล',
    'filter.all': 'ทั้งหมด', 'filter.thai': '🇹🇭 ไทย', 'filter.sea': '🌏 SEA', 'filter.global': '🌐 Global', 'filter.passive': '💤 Passive', 'filter.hybrid': '🔁 Hybrid',
    'opps.results': '{n} รายการ',
    'th.opportunity': 'โอกาส', 'th.market': 'ตลาด', 'th.roi': 'ROI ที่เป็นไปได้', 'th.budget': 'งบ', 'th.time': 'เวลาคืนทุน', 'th.score': 'คะแนน', 'th.status': 'สถานะ',
    'scanner.statusTitle': 'สถานะการสแกน',
    'scanner.lastScan': 'สแกนล่าสุด', 'scanner.found': 'พบช่องว่าง', 'scanner.new': 'ใหม่', 'scanner.scanning': 'กำลังสแกน',
    'scanner.auto': 'สแกนอัตโนมัติทุก 7 วัน', 'scanner.run': 'สแกนเลยตอนนี้',
    'mkt.thai': '🇹🇭 ตลาดไทย', 'mkt.sea': '🌏 ตลาด SEA', 'mkt.global': '🌐 ตลาดโลก', 'mkt.us': '🇺🇸 ตลาดสหรัฐ',
    'projects.estIncome': 'รายได้คาด',
    'plugins.connect': 'เชื่อมต่อ', 'plugins.connected': 'เชื่อมต่อแล้ว',
    'plugin.scout': 'สแกนตลาดหาช่องว่างใหม่อัตโนมัติ',
    'plugin.trend': 'ติดตามหัวข้อและคีย์เวิร์ดที่กำลังมา',
    'plugin.skeptic': 'ตรวจสอบและทดสอบความเป็นไปได้ของไอเดีย',
    'plugin.data': 'เชื่อมต่อ API ข้อมูลภายนอก',
    'plugin.analyst': 'วิเคราะห์ความเป็นไปได้เชิงลึกด้วย AI',
    'plugin.radar': 'แจ้งเตือนความเคลื่อนไหวของคู่แข่ง',
  },
  en: {
    'search.placeholder': 'Search opportunities',
    'search.cancel': 'Cancel',
    'search.open': 'Open search',
    'search.hint': 'Type to search opportunities, markets, or keywords',
    'nav.section.menu': 'Menu',
    'nav.section.general': 'General',
    'nav.dashboard': 'Dashboard',
    'nav.opportunities': 'Opportunities',
    'nav.scanner': 'Scanner',
    'nav.analytics': 'Analytics',
    'nav.projects': 'Projects',
    'nav.plugins': 'Plugins',
    'nav.help': 'Help',
    'nav.logout': 'Log out',
    'app.title': 'Mobile app',
    'app.sub': 'Check gaps anywhere',
    'app.download': 'Download',
    'dash.title': 'Dashboard',
    'dash.subtitle': 'Scan market gaps, weigh budget against ROI, then decide build, park, or kill.',
    'dash.import': 'Import data',
    'dash.addGap': 'Add gap',
    'sig.gaps': 'Total gaps found',
    'sig.gaps.note': '↑ 6 new this week',
    'sig.ready': 'Ready to build',
    'sig.ready.note': 'Budget + Thai-ready',
    'sig.roi': 'Average ROI',
    'sig.roi.note': 'within 12 months',
    'sig.budget': 'Minimum budget',
    'sig.budget.note': '3 projects start free',
    'weekly.title': 'Weekly discovery',
    'weekly.sub': 'New gaps scanned each day',
    'dec.ready.th': 'Ready now',
    'dec.build.th': 'In scope',
    'dec.research.th': 'Needs research',
    'top.rank': 'Top opportunity',
    'top.income': 'Est. income',
    'top.payback': 'Payback',
    'top.start': 'Start building',
    'opps.title': 'Gaps found',
    'opps.sub': '{n} gaps · sorted by build-readiness',
    'opps.filter': 'All',
    'opp.gap': 'The gap',
    'opp.budgetStart': 'Starting budget',
    'opp.income': 'Est. income',
    'market.title': 'Market activity',
    'rate.title': 'Decision rate',
    'rate.sub': 'gaps evaluated',
    'timer.title': 'Time spent building',
    'timer.sub': 'hours building passive income',
    'timer.pause': 'Pause',
    'timer.stop': 'Stop',
    'diff.1': 'Very easy', 'diff.2': 'Easy', 'diff.3': 'Medium', 'diff.4': 'Hard', 'diff.5': 'Very hard',
    'wk.mon': 'Mon', 'wk.tue': 'Tue', 'wk.wed': 'Wed', 'wk.thu': 'Thu', 'wk.fri': 'Fri', 'wk.sat': 'Sat', 'wk.sun': 'Sun',
    'opps.page.sub': 'Every market gap found, sorted, compared, and ready to decide on',
    'scanner.sub': 'Automated market-gap detection per market',
    'projects.sub': 'Track the journey from gap to product',
    'plugins.sub': 'Connect agents and data sources',
    'filter.all': 'All', 'filter.thai': '🇹🇭 Thai', 'filter.sea': '🌏 SEA', 'filter.global': '🌐 Global', 'filter.passive': '💤 Passive', 'filter.hybrid': '🔁 Hybrid',
    'opps.results': '{n} results',
    'th.opportunity': 'Opportunity', 'th.market': 'Market', 'th.roi': 'ROI potential', 'th.budget': 'Budget', 'th.time': 'Time to ROI', 'th.score': 'Score', 'th.status': 'Status',
    'scanner.statusTitle': 'Scan status',
    'scanner.lastScan': 'Last scan', 'scanner.found': 'gaps found', 'scanner.new': 'new', 'scanner.scanning': 'Scanning',
    'scanner.auto': 'Auto-scan every 7 days', 'scanner.run': 'Run scan now',
    'mkt.thai': '🇹🇭 Thai market', 'mkt.sea': '🌏 SEA market', 'mkt.global': '🌐 Global market', 'mkt.us': '🇺🇸 US market',
    'projects.estIncome': 'Est. income',
    'plugins.connect': 'Connect', 'plugins.connected': 'Connected',
    'plugin.scout': 'Scans markets for new gaps automatically',
    'plugin.trend': 'Monitors trending topics and keywords',
    'plugin.skeptic': 'Validates and stress-tests opportunity ideas',
    'plugin.data': 'Connects to external data APIs',
    'plugin.analyst': 'Deep-dives into gap feasibility with AI',
    'plugin.radar': 'Alerts on competitor movement',
  },
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = typeof localStorage !== 'undefined' && localStorage.getItem('gap-lang')
    return saved === 'en' ? 'en' : 'th'
  })

  useEffect(() => {
    localStorage.setItem('gap-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback((key, vars) => {
    let s = (dict[lang] && dict[lang][key]) ?? dict.th[key] ?? key
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v)
    return s
  }, [lang])

  /* Localise a data record's Thai value to EN where mechanical */
  const localize = useCallback((value, field) => {
    if (lang !== 'en' || value == null) return value
    switch (field) {
      case 'subtitle': return value.replace('ไทย+SEA', 'Thai+SEA').replace('ไทย', 'Thailand')
      case 'income':   return value.replace('/เดือน', '/mo')
      case 'time':     return value.replace(' เดือน', ' mo').replace('เดือน', ' mo')
      default:         return value
    }
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle: () => setLang(p => (p === 'th' ? 'en' : 'th')), t, localize }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
