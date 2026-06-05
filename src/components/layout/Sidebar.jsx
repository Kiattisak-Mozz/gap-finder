import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, ListTodo, ScanSearch,
  BarChart2, FolderOpen, Bot, Settings, HelpCircle, LogOut, Download,
} from 'lucide-react'
import { useLang } from '../../i18n/LanguageContext'
import Logo from '../ui/Logo'

const menu = [
  { to: '/dashboard',     icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { to: '/opportunities', icon: ListTodo,        labelKey: 'nav.opportunities', badge: '6' },
  { to: '/scanner',       icon: ScanSearch,      labelKey: 'nav.scanner' },
  { to: '/trends',        icon: BarChart2,       labelKey: 'nav.analytics' },
  { to: '/projects',      icon: FolderOpen,      labelKey: 'nav.projects' },
  { to: '/monitor',       icon: Bot,             labelKey: 'nav.monitor' },
]
const general = [
  { to: '/plugins', icon: Settings,   labelKey: 'nav.plugins' },
  { to: '#',        icon: HelpCircle, labelKey: 'nav.help' },
  { to: '#',        icon: LogOut,     labelKey: 'nav.logout', danger: true },
]

export default function Sidebar({ onClose }) {
  const ref = useRef(null)
  const { t } = useLang()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { x: -24, opacity: 0, duration: 0.45, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [])

  const Item = ({ to, icon: Icon, labelKey, badge, danger }) => {
    const isRoute = to !== '#'   // '#' items (Help, Log out) are actions, never "active"
    return (
    <NavLink to={to} end={to === '/'} onClick={onClose}
      className="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] transition-all duration-150 group"
      style={({ isActive }) => {
        const on = isActive && isRoute
        return {
          background: on ? 'var(--menu-active)' : 'transparent',
          color: on ? 'var(--text)' : danger ? '#E57373' : 'var(--muted)',
          fontWeight: on ? 700 : 500,
        }
      }}
    >
      {({ isActive }) => {
        const on = isActive && isRoute
        return (
        <>
          {on && (
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-[3.5px] h-6 rounded-r-full"
              style={{ background: 'var(--primary)' }} />
          )}
          <Icon size={17} strokeWidth={on ? 2.4 : 1.9} className="flex-shrink-0"
            style={{ color: on ? 'var(--primary)' : danger ? '#E57373' : 'var(--muted)' }} />
          <span className="flex-1 truncate">{t(labelKey)}</span>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{ background: 'var(--primary)', color: '#fff' }}>
              {badge}+
            </span>
          )}
        </>
        )
      }}
    </NavLink>
    )
  }

  return (
    <aside ref={ref} className="flex flex-col w-full h-full"
      style={{ background: 'var(--surface)' }}>

      {/* Logo */}
      <div className="flex items-center px-5 h-[64px] flex-shrink-0">
        <Link to="/" onClick={onClose}>
          <Logo size={32} variant="full" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--muted)' }}>
            {t('nav.section.menu')}
          </p>
          <div className="flex flex-col gap-0.5">
            {menu.map(item => <Item key={item.to} {...item} />)}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--muted)' }}>
            {t('nav.section.general')}
          </p>
          <div className="flex flex-col gap-0.5">
            {general.map(item => <Item key={item.labelKey} {...item} />)}
          </div>
        </div>
      </div>

      {/* Mobile app card */}
      <div className="p-3 flex-shrink-0">
        <div className="rounded-2xl p-4 relative overflow-hidden"
          style={{ background: 'var(--hero-grad)' }}>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-10"
            style={{ background: 'var(--on-hero)' }} />
          <p className="text-[12px] font-bold mb-0.5" style={{ color: 'var(--on-hero)' }}>{t('app.title')}</p>
          <p className="text-[10px] mb-3" style={{ color: 'var(--on-hero)', opacity: 0.6 }}>{t('app.sub')}</p>
          <button className="tap-44 w-full inline-flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold rounded-lg transition-transform hover:scale-[1.02]"
            style={{ background: 'var(--on-primary)', color: 'var(--primary-press)' }}>
            <Download size={12} strokeWidth={2.5} /> {t('app.download')}
          </button>
        </div>
      </div>
    </aside>
  )
}
