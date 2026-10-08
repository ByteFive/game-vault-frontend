import { Link } from 'react-router-dom'
import { Star, ArrowUpRight } from 'lucide-react'
import type { Game } from '@/types/Game'

export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      to={`/jogo/${game.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-void-800/60 transition-all duration-300 hover:-translate-y-1 hover:border-signal-500/40 hover:shadow-glow"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-void-700">
        <img
          src={game.capa}
          alt={game.nome}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void-950/95 via-void-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-3 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="line-clamp-3 text-xs text-mist-300">{game.descricao}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {game.generos.slice(0, 2).map((g) => (
              <span key={g} className="chip">{g}</span>
            ))}
          </div>
        </div>
        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-void-950/70 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <ArrowUpRight size={16} className="text-signal-300" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-1 font-display text-sm font-semibold text-white">{game.nome}</h3>
        <div className="flex items-center justify-between text-xs text-mist-500">
          <span>{game.dataLancamento.slice(0, 4)}</span>
          <span className="line-clamp-1">{game.generos[0]}</span>
        </div>
        <div className="flex items-center gap-1 pt-1">
          <Star size={13} className="fill-signal-400 text-signal-400" />
          <span className="font-mono text-xs text-mist-300">{game.notaApi.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  )
}
