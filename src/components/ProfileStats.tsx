import type { ReactNode } from 'react'

interface Stat {
  label: string
  value: ReactNode
  icon?: ReactNode
}

export function ProfileStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="surface rounded-xl p-4">
          <div className="flex items-center gap-2 text-signal-400">{stat.icon}</div>
          <p className="mt-2 font-display text-xl font-bold text-white sm:text-2xl">{stat.value}</p>
          <p className="mt-1 text-xs text-mist-500">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
