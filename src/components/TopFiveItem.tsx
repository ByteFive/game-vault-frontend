import { Link } from 'react-router-dom'
import { ChevronUp, ChevronDown, X } from 'lucide-react'
import type { Game } from '@/types/Game'

interface TopFiveItemProps {
  posicao: number
  game: Game
  notaPessoal?: number
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

export function TopFiveItem({ posicao, game, notaPessoal, onRemove, onMoveUp, onMoveDown, isFirst, isLast }: TopFiveItemProps) {
  return (
    <div className="surface flex items-center gap-4 rounded-xl p-3 transition-all hover:border-signal-500/30 sm:p-4">
      <span className="font-display text-3xl font-bold text-signal-500/50 w-10 shrink-0 text-center">
        #{posicao}
      </span>
      <Link to={`/jogo/${game.id}`} className="shrink-0">
        <img src={game.capa} alt={game.nome} className="h-24 w-16 rounded-md object-cover sm:h-28 sm:w-20" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link to={`/jogo/${game.id}`} className="line-clamp-1 font-display text-base font-semibold text-white hover:text-signal-300">
          {game.nome}
        </Link>
        <p className="mt-0.5 text-sm text-mist-500">{game.dataLancamento.slice(0, 4)} · {game.generos[0]}</p>
        {notaPessoal !== undefined && (
          <p className="mt-1 font-mono text-xs text-signal-400">Sua nota: {notaPessoal}/5</p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="rounded-md border border-white/10 p-1.5 text-mist-300 transition-colors hover:border-signal-500/50 hover:text-signal-300 disabled:opacity-20"
          aria-label="Subir posição"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="rounded-md border border-white/10 p-1.5 text-mist-300 transition-colors hover:border-signal-500/50 hover:text-signal-300 disabled:opacity-20"
          aria-label="Descer posição"
        >
          <ChevronDown size={16} />
        </button>
        <button
          onClick={onRemove}
          className="mt-1 rounded-md border border-white/10 p-1.5 text-mist-500 transition-colors hover:border-rose-500/50 hover:text-rose-300"
          aria-label="Remover do Top 5"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
