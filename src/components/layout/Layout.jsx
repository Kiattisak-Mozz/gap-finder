import { useState, useEffect, useRef } from 'react'
import { Bell, Mail, Search, X } from 'lucide-react'
import { useTheme } from '../../theme/ThemeContext'
import { useLang } from '../../i18n/LanguageContext'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const { isDark, toggle } = useTheme()
  const { lang, toggle: toggleLang, t } = useLang()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef(null)

  // Focus the field when the mobile search sheet opens; close on Escape
  useEffect(() => {
    if (!searchOpen) return
    searchInputRef.current?.focus()
    const onKey = e => { if (e.key === 'Escape') setSearchOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen])

  return (
    <div className="flex h-[100dvh] overflow-hidden gap-2 sm:gap-3 p-2 sm:p-3" style={{
      background: 'var(--bg)', color: 'var(--text)',
      paddingTop: 'max(0.5rem, env(safe-area-inset-top))',
      paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      paddingLeft: 'max(0.5rem, env(safe-area-inset-left))',
      paddingRight: 'max(0.5rem, env(safe-area-inset-right))',
    }}>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop sidebar — floating card */}
      <div className="hidden lg:flex flex-shrink-0 h-full w-[230px] rounded-3xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-3 left-3 bottom-3 w-[230px] z-40 rounded-3xl overflow-hidden transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
        <Sidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* Mobile full-screen search sheet */}
      <div role="dialog" aria-modal="true" aria-label={t('search.open')}
        className={`search-sheet sm:hidden fixed inset-0 z-[1300] flex flex-col ${searchOpen ? 'is-open' : 'pointer-events-none'}`}
        style={{
          background: 'var(--surface)',
          paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
          opacity: searchOpen ? 1 : 0,
          transform: searchOpen ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.18s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)',
        }}>
        <div className="flex items-center gap-2 px-4 h-[60px] flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <label className="flex items-center gap-2 rounded-xl px-3.5 h-11 flex-1 min-w-0"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <Search size={15} style={{ color: 'var(--muted)' }} />
            <span className="sr-only">{t('search.placeholder')}</span>
            <input ref={searchInputRef} type="text" placeholder={t('search.placeholder')}
              className="bg-transparent text-[15px] outline-none flex-1 min-w-0" style={{ color: 'var(--text)' }} />
          </label>
          <button onClick={() => setSearchOpen(false)} aria-label={t('search.cancel')}
            className="focus-ring w-11 h-11 flex-shrink-0 grid place-items-center rounded-xl"
            style={{ color: 'var(--muted)' }}>
            <X size={20} />
          </button>
        </div>
        <p className="px-5 py-4 text-[13px]" style={{ color: 'var(--muted)' }}>{t('search.hint')}</p>
      </div>

      {/* Right side — floating card */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden rounded-3xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>

        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center gap-2 sm:gap-3 px-4 sm:px-6 h-[60px] sm:h-[64px]"
          style={{ borderBottom: '1px solid var(--border)' }}>

          <button onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="focus-ring lg:hidden w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl text-sm"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            ☰
          </button>

          {/* Search — inline on sm+, icon → full-screen sheet on mobile */}
          <label className="hidden sm:flex items-center gap-2 rounded-xl px-3.5 h-11 flex-1 min-w-0 max-w-[280px]"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <Search size={13} style={{ color: 'var(--muted)' }} />
            <span className="sr-only">{t('search.placeholder')}</span>
            <input type="text" placeholder={t('search.placeholder')}
              className="bg-transparent text-[13px] outline-none flex-1 min-w-0"
              style={{ color: 'var(--text)' }}
            />
            <kbd className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              ⌘F
            </kbd>
          </label>

          {/* Mobile: spacer pushes icons right, search becomes a button */}
          <div className="flex-1 sm:hidden" />
          <button onClick={() => setSearchOpen(true)} aria-label={t('search.open')}
            className="focus-ring sm:hidden w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            <Search size={17} />
          </button>

          {/* Right icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto">
            <button aria-label="Open messages" className="focus-ring hidden sm:flex w-11 h-11 items-center justify-center rounded-xl transition-colors"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
              <Mail size={15} />
            </button>
            <button aria-label="Open notifications" className="focus-ring relative w-11 h-11 flex items-center justify-center rounded-xl transition-colors"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: 'var(--primary)', border: '2px solid var(--bg)' }} />
            </button>

            {/* Language toggle */}
            <button onClick={toggleLang}
              aria-label={lang === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
              className="focus-ring h-11 px-3 flex items-center justify-center rounded-xl text-[12px] font-bold tracking-wide transition-colors"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
              <span style={{ color: lang === 'th' ? 'var(--primary)' : 'var(--muted)' }}>TH</span>
              <span style={{ color: 'var(--border-2)', margin: '0 5px' }}>/</span>
              <span style={{ color: lang === 'en' ? 'var(--primary)' : 'var(--muted)' }}>EN</span>
            </button>

            {/* Theme toggle */}
            <button onClick={toggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="focus-ring w-11 h-11 flex items-center justify-center rounded-xl text-sm transition-colors"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* User — pill on sm+, avatar-only on mobile */}
            <button className="focus-ring flex items-center gap-2.5 rounded-xl p-0 sm:px-3 sm:py-1.5 cursor-pointer sm:ml-1 sm:border"
              aria-label="Open account menu"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="display w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}>G</div>
              <div className="hidden sm:block text-left">
                <p className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--text)' }}>Gap User</p>
                <p className="text-[10px] leading-tight" style={{ color: 'var(--muted)' }}>finder@gap.ai</p>
              </div>
            </button>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
