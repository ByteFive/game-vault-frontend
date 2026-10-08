import { SlidersHorizontal } from 'lucide-react'
import type { GameFilters } from '@/services/gameApi'

interface FilterPanelProps {
  filters: GameFilters
  onChange: (filters: GameFilters) => void
  genres: string[]
  platforms: string[]
  years: string[]
}

const selectClass =
  'w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-mist-100 transition-colors focus:border-signal-500/60'

export function FilterPanel({ filters, onChange, genres, platforms, years }: FilterPanelProps) {
  const set = (patch: Partial<GameFilters>) => onChange({ ...filters, ...patch })

  return (
    <div className="surface flex flex-col gap-4 rounded-xl p-4">
      <div className="flex items-center gap-2 text-mist-300">
        <SlidersHorizontal size={16} className="text-signal-400" />
        <span className="label-eyebrow">Filtros</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        <select className={selectClass} value={filters.genero || ''} onChange={(e) => set({ genero: e.target.value || undefined })}>
          <option value="">Todos os gêneros</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>

        <select className={selectClass} value={filters.plataforma || ''} onChange={(e) => set({ plataforma: e.target.value || undefined })}>
          <option value="">Todas as plataformas</option>
          {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select className={selectClass} value={filters.ano || ''} onChange={(e) => set({ ano: e.target.value || undefined })}>
          <option value="">Todos os anos</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        <select className={selectClass} value={filters.notaMinima || ''} onChange={(e) => set({ notaMinima: e.target.value ? Number(e.target.value) : undefined })}>
          <option value="">Qualquer nota</option>
          <option value="4.5">4.5+</option>
          <option value="4">4.0+</option>
          <option value="3.5">3.5+</option>
          <option value="3">3.0+</option>
        </select>

        <select className={selectClass} value={filters.ordenarPor || 'relevancia'} onChange={(e) => set({ ordenarPor: e.target.value as GameFilters['ordenarPor'] })}>
          <option value="relevancia">Relevância</option>
          <option value="nota">Melhor nota</option>
          <option value="lancamento">Mais recentes</option>
          <option value="nome">Nome (A-Z)</option>
        </select>
      </div>
    </div>
  )
}
