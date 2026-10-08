import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trophy, Loader2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { getGamesByIds } from '@/services/gameApi'
import { ApiError } from '@/services/ApiError'
import { TopFiveItem } from '@/components/TopFiveItem'
import type { Game } from '@/types/Game'

export function MyTopFive() {
  const { topFive, removeFromTopFive, moveTopFive, getReview } = useApp()
  const [gamesById, setGamesById] = useState<Map<number, Game>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (topFive.length === 0) {
      setGamesById(new Map())
      setLoading(false)
      return
    }
    setLoading(true)
    getGamesByIds(topFive.map((t) => t.gameId)).then((map) => {
      setGamesById(map)
      setLoading(false)
    })
  }, [topFive])

  const sorted = [...topFive].sort((a, b) => a.position - b.position)
  const slots = Array.from({ length: 5 }, (_, i) => sorted.find((t) => t.position === i + 1))

  const handleRemove = async (gameId: string) => {
    try {
      await removeFromTopFive(gameId)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível remover do Top 5.')
    }
  }

  const handleMove = async (gameId: string, direction: 'up' | 'down') => {
    try {
      setError(null)
      await moveTopFive(gameId, direction)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível reorganizar o Top 5.')
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Trophy size={26} className="text-signal-400" />
        <div>
          <p className="label-eyebrow">Sua identidade em 5 jogos</p>
          <h1 className="text-3xl font-bold">Meu Top 5</h1>
        </div>
      </div>

      {error && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 sm:max-w-2xl">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 py-10 text-mist-500"><Loader2 size={18} className="animate-spin" /> Carregando...</div>
      ) : (
        <div className="flex flex-col gap-3 sm:max-w-2xl">
          {slots.map((entry, idx) => {
            const posicao = idx + 1
            if (!entry) {
              return (
                <Link
                  key={posicao}
                  to="/explorar"
                  className="flex items-center gap-4 rounded-xl border border-dashed border-white/10 p-4 text-mist-600 transition-colors hover:border-signal-500/40 hover:text-signal-300"
                >
                  <span className="font-display text-3xl font-bold w-10 shrink-0 text-center opacity-50">#{posicao}</span>
                  <div className="flex flex-1 items-center gap-2 text-sm">
                    <Plus size={16} /> Adicionar jogo à posição #{posicao}
                  </div>
                </Link>
              )
            }
            const game = gamesById.get(entry.gameId)
            if (!game) return null
            const review = getReview(String(entry.gameId))
            return (
              <TopFiveItem
                key={entry.gameId}
                posicao={posicao}
                game={game}
                notaPessoal={review?.rating}
                onRemove={() => handleRemove(String(entry.gameId))}
                onMoveUp={() => handleMove(String(entry.gameId), 'up')}
                onMoveDown={() => handleMove(String(entry.gameId), 'down')}
                isFirst={posicao === sorted[0]?.position}
                isLast={posicao === sorted[sorted.length - 1]?.position}
              />
            )
          })}
        </div>
      )}

      {topFive.length >= 5 && (
        <p className="rounded-lg border border-signal-500/20 bg-signal-500/5 px-4 py-3 text-sm text-signal-300 sm:max-w-2xl">
          Seu Top 5 já está completo. Remova um jogo para adicionar outro.
        </p>
      )}

      <Link to="/comparar" className="btn-ghost self-start">
        Comparar meu Top 5 com outro jogador →
      </Link>
    </div>
  )
}
