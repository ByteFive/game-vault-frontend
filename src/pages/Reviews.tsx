import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Loader2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { getGamesByIds } from '@/services/gameApi'
import { StarRating } from '@/components/StarRating'
import type { Game } from '@/types/Game'

type SortOption = 'recentes' | 'melhores' | 'piores' | 'nome'

export function Reviews() {
  const { reviews } = useApp()
  const [sort, setSort] = useState<SortOption>('recentes')
  const [gamesById, setGamesById] = useState<Map<number, Game>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (reviews.length === 0) {
      setGamesById(new Map())
      setLoading(false)
      return
    }
    setLoading(true)
    getGamesByIds(reviews.map((r) => r.gameId)).then((map) => {
      setGamesById(map)
      setLoading(false)
    })
  }, [reviews])

  const rows = useMemo(() => {
    const withGames = reviews
      .map((r) => ({ review: r, game: gamesById.get(r.gameId) }))
      .filter((r): r is { review: typeof r.review; game: Game } => Boolean(r.game))

    switch (sort) {
      case 'melhores':
        return withGames.sort((a, b) => b.review.rating - a.review.rating)
      case 'piores':
        return withGames.sort((a, b) => a.review.rating - b.review.rating)
      case 'nome':
        return withGames.sort((a, b) => a.game.nome.localeCompare(b.game.nome))
      default:
        return withGames.sort((a, b) => ((a.review.createdAt || '') < (b.review.createdAt || '') ? 1 : -1))
    }
  }, [reviews, gamesById, sort])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Star size={26} className="text-signal-400" />
        <div>
          <p className="label-eyebrow">Seu histórico</p>
          <h1 className="text-3xl font-bold">Avaliações</h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {([
          ['recentes', 'Mais recentes'],
          ['melhores', 'Melhor avaliados'],
          ['piores', 'Pior avaliados'],
          ['nome', 'Nome'],
        ] as [SortOption, string][]).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setSort(value)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              sort === value ? 'border-signal-500/60 bg-signal-500/10 text-signal-300' : 'border-white/10 text-mist-400 hover:border-white/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-10 text-mist-500"><Loader2 size={18} className="animate-spin" /> Carregando...</div>
      ) : rows.length === 0 ? (
        <div className="surface rounded-xl p-10 text-center text-mist-400">
          Você ainda não avaliou nenhum jogo.{' '}
          <Link to="/explorar" className="text-signal-400 hover:underline">Explorar jogos →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map(({ review, game }) => (
            <Link
              key={review.gameId}
              to={`/jogo/${review.gameId}`}
              className="surface flex items-center gap-4 rounded-xl p-3 transition-colors hover:border-signal-500/40 sm:p-4"
            >
              <img src={game.capa} alt={game.nome} className="h-20 w-14 shrink-0 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 font-display text-sm font-semibold text-white">{game.nome}</p>
                <p className="text-xs text-mist-500">{game.generos.join(', ')}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StarRating value={review.rating} readOnly size={16} showNumber />
                {review.createdAt && <span className="text-xs text-mist-600">{new Date(review.createdAt).toLocaleDateString('pt-BR')}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
