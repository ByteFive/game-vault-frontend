import type { Game } from '@/types/Game'

export function ComparisonCard({ game, highlighted }: { game?: Game; highlighted?: boolean }) {
  if (!game) {
    return (
      <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-white/10 text-xs text-mist-700">
        vazio
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border p-2 transition-colors ${
        highlighted ? 'border-signal-500/50 bg-signal-500/10' : 'border-white/5 bg-white/[0.02]'
      }`}
    >
      <img src={game.capa} alt={game.nome} className="h-14 w-10 shrink-0 rounded object-cover" />
      <div className="min-w-0">
        <p className="line-clamp-1 text-xs font-semibold text-white sm:text-sm">{game.nome}</p>
        <p className="text-[10px] text-mist-500">{game.dataLancamento.slice(0, 4)}</p>
      </div>
    </div>
  )
}
