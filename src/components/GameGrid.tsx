import type { Game } from '@/types/Game'
import { GameCard } from './GameCard'

export function GameGrid({ games, emptyMessage = 'Nenhum jogo encontrado.' }: { games: Game[]; emptyMessage?: string }) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-16 text-center">
        <p className="text-mist-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {games.map((game, i) => (
        <div key={game.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}>
          <GameCard game={game} />
        </div>
      ))}
    </div>
  )
}
