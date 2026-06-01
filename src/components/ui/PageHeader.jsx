/* Page title block, consistent with the Dashboard header.
   Caller passes already-localised strings; `children` is the optional action slot (right). */
export default function PageHeader({ title, subtitle, children }) {
  return (
    <header className="flex items-end justify-between pt-7 pb-6 flex-wrap gap-4">
      <div>
        <h1 className="display text-[26px] sm:text-[30px] font-bold leading-none" style={{ color: 'var(--text)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13.5px] mt-2 max-w-[60ch]" style={{ color: 'var(--muted)' }}>{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2.5">{children}</div>}
    </header>
  )
}
