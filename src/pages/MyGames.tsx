import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Library, Loader2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { getGamesByIds } from '@/services/gameApi'
import { ApiError } from '@/services/ApiError'
import { GameStatusBadge, STATUS_OPTIONS } from '@/components/GameStatusBadge'
import { StarRating } from '@/components/StarRating'
import type { Game, StatusJogo } from '@/types/Game'

export function MyGames() {
  const { library, getReview, setGameStatus, removeFromLibrary } = useApp()
  const [statusFilter, setStatusFilter] = useState<StatusJogo | ''>('')
  const [genreFilter, setGenreFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
  const [gamesById, setGamesById] = useState<Map<number, Game>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (library.length === 0) {
      setGamesById(new Map())
      setLoading(false)
      return
    }
    setLoading(true)
    getGamesByIds(library.map((e) => e.gameId)).then((map) => {
      setGamesById(map)
      setLoading(false)
    })
  }, [library])

  const genres = useMemo(() => Array.from(new Set(Array.from(gamesById.values()).flatMap((g) => g.generos))).sort(), [gamesById])
  const platforms = useMemo(() => Array.from(new Set(Array.from(gamesById.values()).flatMap((g) => g.plataformas))).sort(), [gamesById])

  const entries = useMemo(() => {
    return library
      .map((entry) => ({ entry, game: gamesById.get(entry.gameId) }))
      .filter((row): row is { entry: typeof row.entry; game: Game } => Boolean(row.game))
      .filter((row) => !statusFilter || row.entry.status === statusFilter)
      .filter((row) => !genreFilter || row.game.generos.includes(genreFilter))
      .filter((row) => !platformFilter || row.game.plataformas.includes(platformFilter))
  }, [library, gamesById, statusFilter, genreFilter, platformFilter])

  const selectClass = 'rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-mist-100'

  const handleStatusChange = async (gameId: number, status: StatusJogo) => {
    try {
      await setGameStatus(String(gameId), status)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível atualizar o status.')
    }
  }

  const handleRemove = async (gameId: number) => {
    try {
      await removeFromLibrary(String(gameId))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível remover o jogo.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Library size={26} className="text-signal-400" />
        <div>
          <p className="label-eyebrow">Sua biblioteca</p>
          <h1 className="text-3xl font-bold">Meus Jogos</h1>
        </div>
      </div>

      {error && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

      <div className="surface flex flex-wrap gap-3 rounded-xl p-4">
        <select className={selectClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusJogo | '')}>
          <option value="">Todos os status</option>
          {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select className={selectClass} value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
          <option value="">Todos os gêneros</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select className={selectClass} value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
          <option value="">Todas as plataformas</option>
          {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-10 text-mist-500"><Loader2 size={18} className="animate-spin" /> Carregando...</div>
      ) : entries.length === 0 ? (
        <div className="surface rounded-xl p-10 text-center text-mist-400">
          Nenhum jogo na sua biblioteca ainda.{' '}
          <Link to="/explorar" className="text-signal-400 hover:underline">Explorar jogos →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map(({ entry, game }) => {
            const review = getReview(String(entry.gameId))
            return (
              <div key={entry.gameId} className="surface flex flex-wrap items-center gap-4 rounded-xl p-3 sm:p-4">
                <Link to={`/jogo/${entry.gameId}`}>
                  <img src={game.capa} alt={game.nome} className="h-20 w-14 rounded-md object-cover" />
                </Link>
                <div className="min-w-[140px] flex-1">
                  <Link to={`/jogo/${entry.gameId}`} className="font-display text-sm font-semibold text-white hover:text-signal-300">
                    {game.nome}
                  </Link>
                  <p className="text-xs text-mist-500">{game.generos.join(', ')}</p>
                  {review && <div className="mt-1"><StarRating value={review.rating} readOnly size={13} /></div>}
                </div>
                <GameStatusBadge status={entry.status} />
                <select
                  value={entry.status}
                  onChange={(e) => handleStatusChange(entry.gameId, e.target.value as StatusJogo)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-mist-100"
                >
                  {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <button onClick={() => handleRemove(entry.gameId)} className="text-xs text-mist-600 hover:text-rose-300">
                  Remover
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
