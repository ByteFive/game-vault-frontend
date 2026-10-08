import { useEffect, useState } from 'react'
import { Dna, TrendingUp, Sparkles, Loader2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { getGamesByIds, getAllGames } from '@/services/gameApi'
import { calculateDNA, calculateMultiplayerAffinity, calculateTasteEvolution, generateTextProfile } from '@/utils/dna'
import { generateRecommendations } from '@/utils/recommendations'
import { DNAChart } from '@/components/DNAChart'
import { RecommendationCard } from '@/components/RecommendationCard'
import type { Game } from '@/types/Game'

export function GameDNAPage() {
  const { reviews } = useApp()
  const [gamesById, setGamesById] = useState<Map<number, Game>>(new Map())
  const [candidates, setCandidates] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      reviews.length > 0 ? getGamesByIds(reviews.map((r) => r.gameId)) : Promise.resolve(new Map<number, Game>()),
      getAllGames(),
    ]).then(([games, all]) => {
      setGamesById(games)
      setCandidates(all)
      setLoading(false)
    })
  }, [reviews])

  if (loading) {
    return <div className="flex items-center gap-2 py-20 justify-center text-mist-500"><Loader2 size={20} className="animate-spin" /> Calculando seu Game DNA...</div>
  }

  const traits = calculateDNA(reviews, gamesById)
  const generoTraits = traits.filter((t) => t.kind === 'genero')
  const tagTraits = traits.filter((t) => t.kind === 'tag')
  const affinity = calculateMultiplayerAffinity(reviews, gamesById)
  const profileText = generateTextProfile(traits, reviews.length)
  const evolution = calculateTasteEvolution(reviews, gamesById)
  const recommendations = generateRecommendations(reviews, gamesById, candidates, 6)

  const hasEnoughData = reviews.length >= 3

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-helix-gradient animate-pulseglow">
          <Dna size={22} className="text-white" />
        </span>
        <div>
          <p className="label-eyebrow">Exclusivo GameDNA</p>
          <h1 className="text-3xl font-bold">Seu Game DNA</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-signal-500/20 bg-void-800/50 p-6 sm:p-8">
        <p className="max-w-2xl leading-relaxed text-mist-200">{profileText}</p>
        {!hasEnoughData && (
          <p className="mt-3 text-xs text-mist-600">{reviews.length}/3 avaliações necessárias para um perfil mais preciso.</p>
        )}
      </div>

      {traits.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {generoTraits.length > 0 && (
            <div className="surface rounded-xl p-6">
              <p className="label-eyebrow mb-4">Gêneros</p>
              <DNAChart traits={generoTraits} />
            </div>
          )}
          {tagTraits.length > 0 && (
            <div className="surface rounded-xl p-6">
              <p className="label-eyebrow mb-4">Estilos & Tags</p>
              <DNAChart traits={tagTraits} />
            </div>
          )}
        </div>
      )}

      {reviews.length > 0 && tagTraits.length > 0 && (
        <div className="surface rounded-xl p-6">
          <p className="label-eyebrow mb-4">Single-player vs. Multiplayer</p>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5">
            <div className="h-full bg-helix-gradient transition-all duration-700" style={{ width: `${affinity.single}%` }} />
            <div className="h-full bg-mist-700 transition-all duration-700" style={{ width: `${affinity.multi}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-mist-500">
            <span>Single-player {affinity.single}%</span>
            <span>Multiplayer {affinity.multi}%</span>
          </div>
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-signal-400" />
          <h2 className="text-xl font-bold">Como seu gosto evoluiu?</h2>
        </div>
        <div className="flex flex-col gap-0 sm:flex-row sm:gap-4">
          {evolution.map((snap, i) => (
            <div key={snap.ano} className="relative flex flex-1 items-center gap-3 sm:flex-col sm:items-start sm:gap-2 sm:border-l sm:border-white/10 sm:pl-4">
              <span className="font-mono text-xs text-signal-400">{snap.ano}</span>
              <span className="font-display text-sm font-semibold text-white">{snap.destaque}</span>
              {i < evolution.length - 1 && <div className="hidden h-px flex-1 bg-white/10 sm:block" />}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-signal-400" />
          <h2 className="text-xl font-bold">Recomendações baseadas no seu DNA</h2>
        </div>
        {recommendations.length === 0 ? (
          <div className="surface rounded-xl p-6 text-center text-mist-500">
            Avalie jogos com 4 ou 5 estrelas para receber recomendações personalizadas.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((rec) => <RecommendationCard key={rec.game.id} recommendation={rec} />)}
          </div>
        )}
      </div>
    </div>
  )
}
