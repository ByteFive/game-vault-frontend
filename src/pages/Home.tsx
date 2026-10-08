import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Clock, Loader2 } from 'lucide-react'
import { getPopularGames, getGamesByIds, getAllGames } from '@/services/gameApi'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { generateRecommendations } from '@/utils/recommendations'
import { GameHero } from '@/components/GameHero'
import { GameGrid } from '@/components/GameGrid'
import { RecommendationCard } from '@/components/RecommendationCard'
import { StarRating } from '@/components/StarRating'
import type { Game } from '@/types/Game'

export function Home() {
  const { status } = useAuth()
  const { reviews } = useApp()
  const [popular, setPopular] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewedGamesById, setReviewedGamesById] = useState<Map<number, Game>>(new Map())
  const [candidates, setCandidates] = useState<Game[]>([])

  useEffect(() => {
    getPopularGames(10).then((games) => {
      setPopular(games)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (status !== 'authenticated' || reviews.length === 0) {
      setReviewedGamesById(new Map())
      return
    }
    getGamesByIds(reviews.map((r) => r.gameId)).then(setReviewedGamesById)
    getAllGames().then(setCandidates)
  }, [status, reviews])

  const recentReviews = [...reviews]
    .sort((a, b) => ((a.createdAt || '') < (b.createdAt || '') ? 1 : -1))
    .slice(0, 5)
    .map((r) => ({ review: r, game: reviewedGamesById.get(r.gameId) }))
    .filter((r) => r.game)

  const recommendations = generateRecommendations(reviews, reviewedGamesById, candidates, 4)
  const heroGame = popular[2] || popular[0]

  return (
    <div className="flex flex-col gap-16">
      {heroGame && <GameHero game={heroGame} />}

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="label-eyebrow">Em alta</p>
            <h2 className="text-2xl font-bold">Jogos Populares</h2>
          </div>
          <Link to="/explorar" className="text-sm font-medium text-signal-400 hover:text-signal-300">
            Ver todos →
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-mist-500"><Loader2 size={16} className="animate-spin" /> Carregando jogos...</div>
        ) : (
          <GameGrid games={popular} />
        )}
      </section>

      {status === 'authenticated' && recentReviews.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-2">
            <Clock size={18} className="text-signal-400" />
            <h2 className="text-2xl font-bold">Recentemente Avaliados</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentReviews.map(({ review, game }) => (
              <Link
                key={review.gameId}
                to={`/jogo/${game!.id}`}
                className="surface flex items-center gap-3 rounded-xl p-3 transition-colors hover:border-signal-500/40"
              >
                <img src={game!.capa} alt={game!.nome} className="h-16 w-12 rounded-md object-cover" />
                <div>
                  <p className="line-clamp-1 text-sm font-semibold text-white">{game!.nome}</p>
                  <StarRating value={review.rating} readOnly size={14} showNumber />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {status === 'authenticated' && (
        <section>
          <div className="mb-5 flex items-center gap-2">
            <Sparkles size={18} className="text-signal-400" />
            <div>
              <h2 className="text-2xl font-bold">Baseado no seu gosto</h2>
              <p className="text-sm text-mist-500">Você provavelmente vai gostar de...</p>
            </div>
          </div>
          {recommendations.length === 0 ? (
            <div className="surface rounded-xl p-6 text-center text-mist-500">
              Avalie alguns jogos com 4 ou 5 estrelas para desbloquear recomendações personalizadas.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recommendations.map((rec) => (
                <RecommendationCard key={rec.game.id} recommendation={rec} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
