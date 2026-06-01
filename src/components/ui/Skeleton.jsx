/* Reusable skeleton shimmer blocks */

export function SkeletonBox({ className = '' }) {
  return <div className={`skeleton-pulse ${className}`} />
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="bg-white dark:bg-[#1B1F2A] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
      <div className="px-5 py-5 border-b border-gray-50 dark:border-white/5">
        <SkeletonBox className="h-5 w-44 rounded-lg" />
      </div>
      {/* Table header */}
      <div className="flex gap-8 px-5 py-3 border-b border-gray-50 dark:border-white/5">
        {[140, 80, 120, 80, 60].map((w, i) => (
          <SkeletonBox key={i} className="h-3 rounded" style={{ width: w }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-8 px-5 py-4 border-b border-gray-50 dark:border-white/4">
          <SkeletonBox className="h-10 w-10 rounded-xl flex-shrink-0" style={{ borderRadius: 12 }} />
          <SkeletonBox className="h-4 flex-1 rounded" />
          <SkeletonBox className="h-4 w-20 rounded" />
          <SkeletonBox className="h-4 w-24 rounded" />
          <SkeletonBox className="h-4 w-14 rounded" />
          <SkeletonBox className="h-4 w-10 rounded" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '', lines = 3 }) {
  return (
    <div className={`bg-white dark:bg-[#1B1F2A] rounded-2xl border border-gray-100 dark:border-white/5 p-5 ${className}`}>
      <div className="flex justify-between mb-5">
        <SkeletonBox className="h-5 w-36 rounded-lg" />
        <SkeletonBox className="h-7 w-7 rounded-lg" />
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox key={i} className={`h-4 rounded mb-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function SkeletonDonut() {
  return (
    <div className="bg-white dark:bg-[#1B1F2A] rounded-2xl border border-gray-100 dark:border-white/5 p-5">
      <div className="flex justify-between mb-5">
        <SkeletonBox className="h-5 w-36 rounded-lg" />
        <SkeletonBox className="h-7 w-7 rounded-lg" />
      </div>
      <div className="flex items-center gap-6">
        <SkeletonBox className="w-36 h-36 rounded-full flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-3">
          {[80, 70, 90, 65].map((w, i) => (
            <SkeletonBox key={i} className="h-4 rounded" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
