import { Link } from 'react-router-dom'
import type { Recommendation } from '@/types/Game'

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const { game, compatibilidade, motivos } = recommendation

  return (
    <Link
      to={`/jogo/${game.id}`}
      className="group flex gap-3 rounded-xl border border-white/5 bg-void-800/60 p-3 transition-all hover:border-signal-500/40 hover:shadow-glow"
    >
      <img src={game.capa} alt={game.nome} className="h-24 w-16 shrink-0 rounded-md object-cover" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <h4 className="line-clamp-1 font-display text-sm font-semibold text-white">{game.nome}</h4>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-helix-gradient" style={{ width: `${compatibilidade}%` }} />
          </div>
          <span className="font-mono text-xs font-semibold text-signal-400">{compatibilidade}%</span>
        </div>
        <p className="text-[11px] text-mist-500">
          Porque você gosta de{' '}
          <span className="text-mist-300">{motivos.slice(0, 3).join(', ') || 'jogos parecidos'}</span>
        </p>
      </div>
    </Link>
  )
}
