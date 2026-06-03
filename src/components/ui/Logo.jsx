export default function Logo({ variant = 'full', size = 32, className = '', onDark = false }) {
  const textSize = Math.round(size * 0.53)

  // When placed on a dark backdrop (e.g. transparent nav over the globe hero),
  // override --text locally so the var(--text) glyph + "Gap" wordmark stay light.
  const tone = onDark ? { '--text': 'oklch(0.965 0.008 262)' } : undefined

  return (
    <div className={`flex items-center gap-2.5 ${className}`} role="img" aria-label="Gap Finder" style={tone}>
      <svg
        width={size} height={size}
        viewBox="0 0 500 500" fill="none"
        aria-hidden="true" style={{ flexShrink: 0 }}
      >
        <path fill="var(--primary)" fillRule="evenodd" clipRule="evenodd" d="M 240.0 29.0 L 78.0 122.0 L 76.0 353.0 L 254.0 462.0 L 257.0 419.0 L 232.0 400.0 L 359.0 321.0 L 359.0 241.0 L 322.0 241.0 L 322.0 295.0 L 193.0 376.0 L 116.0 331.0 L 116.0 150.0 L 209.0 95.0 L 217.0 119.0 L 250.0 105.0 Z M 142.0 238.0 L 142.0 275.0 L 214.0 276.0 L 213.0 237.0 Z"/>
        <path fill="var(--text)" fillRule="evenodd" clipRule="evenodd" d="M 190.0 212.0 L 217.0 212.0 L 354.0 124.0 L 399.0 148.0 L 401.0 170.0 L 438.0 170.0 L 438.0 123.0 L 274.0 29.0 L 274.0 99.0 L 297.0 88.0 L 315.0 102.0 L 190.0 179.0 Z M 322.0 203.0 L 323.0 240.0 L 438.0 241.0 L 438.0 203.0 Z M 318.0 369.0 L 271.0 397.0 L 271.0 460.0 L 273.0 462.0 L 277.0 462.0 L 315.0 437.0 L 318.0 433.0 Z M 176.0 277.0 L 176.0 316.0 L 218.0 342.0 L 254.0 321.0 L 252.0 317.0 L 214.0 294.0 L 214.0 277.0 Z"/>
        <path fill="var(--secondary)" fillRule="evenodd" clipRule="evenodd" d="M 262.0 209.0 L 251.0 213.0 L 241.0 222.0 L 235.0 233.0 L 234.0 251.0 L 244.0 274.0 L 265.0 307.0 L 268.0 308.0 L 299.0 258.0 L 301.0 238.0 L 296.0 225.0 L 288.0 216.0 L 276.0 210.0 Z M 263.0 229.0 L 271.0 229.0 L 272.0 230.0 L 274.0 230.0 L 278.0 233.0 L 282.0 240.0 L 282.0 247.0 L 280.0 252.0 L 275.0 257.0 L 270.0 259.0 L 264.0 259.0 L 260.0 257.0 L 255.0 252.0 L 253.0 248.0 L 253.0 239.0 L 255.0 235.0 L 258.0 232.0 Z"/>
      </svg>

      {variant === 'full' && (
        <span
          className="display font-bold tracking-tight leading-none select-none"
          style={{ fontSize: textSize }}
        >
          <span style={{ color: 'var(--text)' }}>Gap</span>
          <span style={{ color: 'var(--primary)' }}>Finder</span>
        </span>
      )}
    </div>
  )
}
