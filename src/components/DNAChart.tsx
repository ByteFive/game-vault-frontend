import type { DNATrait } from '@/types/Game'

const KIND_LABEL: Record<DNATrait['kind'], string> = {
  genero: 'Gênero',
  tag: 'Estilo',
  estilo: 'Estilo',
}

export function DNAChart({ traits }: { traits: DNATrait[] }) {
  if (traits.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {traits.map((trait, i) => (
        <div key={trait.label} className="group">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-sm font-medium text-mist-100">{trait.label}</span>
            <span className="font-mono text-xs text-signal-400">{trait.value}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-helix-gradient transition-[width] duration-700 ease-out"
              style={{ width: `${trait.value}%`, transitionDelay: `${i * 60}ms` }}
            />
          </div>
          <span className="mt-1 block text-[10px] uppercase tracking-wider text-mist-700">
            {KIND_LABEL[trait.kind]}
          </span>
        </div>
      ))}
    </div>
  )
}
