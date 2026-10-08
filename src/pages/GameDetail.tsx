import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Calendar, Layers, Building2, ListPlus, ListChecks, CheckCircle2, Loader2 } from 'lucide-react'
import { getGameById } from '@/services/gameApi'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/services/ApiError'
import { StarRating } from '@/components/StarRating'
import { GameStatusBadge, STATUS_OPTIONS } from '@/components/GameStatusBadge'
import type { Game, StatusJogo } from '@/types/Game'

export function GameDetail() {
  const { id } = useParams<{ id: string }>()
  const [game, setGame] = useState<Game | null | undefined>(undefined)
  const [toast, setToast] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const { status: authStatus } = useAuth()
  const { getReview, rateGame, getLibraryEntry, setGameStatus, addToTopFive, isInTopFive } = useApp()

  useEffect(() => {
    if (!id) return
    setGame(undefined)
    getGameById(id).then((g) => setGame(g ?? null))
  }, [id])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const showError = (err: unknown, fallback: string) => {
    showToast(err instanceof ApiError ? err.message : fallback)
  }

  if (game === undefined) {
    return <div className="flex items-center gap-2 py-20 justify-center text-mist-500"><Loader2 size={20} className="animate-spin" /> Carregando...</div>
  }
  if (game === null) {
    return (
      <div className="surface rounded-xl p-10 text-center">
        <p className="text-mist-300">Jogo não encontrado.</p>
        <Link to="/explorar" className="btn-ghost mt-4 inline-flex">Voltar para Explorar</Link>
      </div>
    )
  }

  const review = getReview(game.id)
  const libraryEntry = getLibraryEntry(game.id)
  const inTopFive = isInTopFive(game.id)
  const isAuthenticated = authStatus === 'authenticated'

  const handleRate = async (nota: number) => {
    setBusy(true)
    try {
      await rateGame(game.id, nota)
      showToast(`Você avaliou ${game.nome} com ${nota}/5 ★`)
    } catch (err) {
      showError(err, 'Não foi possível salvar sua avaliação.')
    } finally {
      setBusy(false)
    }
  }

  const handleAddToTopFive = async () => {
    setBusy(true)
    try {
      const result = await addToTopFive(game.id)
      showToast(result.ok ? `${game.nome} foi adicionado ao seu Top 5!` : result.message!)
    } catch (err) {
      showError(err, 'Não foi possível adicionar ao Top 5.')
    } finally {
      setBusy(false)
    }
  }

  const handleAddToLibrary = async () => {
    setBusy(true)
    try {
      await setGameStatus(game.id, libraryEntry?.status || 'want_to_play')
      showToast(`${game.nome} adicionado aos seus jogos.`)
    } catch (err) {
      showError(err, 'Não foi possível adicionar à biblioteca.')
    } finally {
      setBusy(false)
    }
  }

  const handleStatusChange = async (newStatus: StatusJogo) => {
    setBusy(true)
    try {
      await setGameStatus(game.id, newStatus)
    } catch (err) {
      showError(err, 'Não foi possível atualizar o status.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="relative -mx-4 h-56 overflow-hidden rounded-none sm:mx-0 sm:h-72 sm:rounded-2xl">
        {game.banner && <img src={game.banner} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/50 to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-4">
          <img src={game.capa} alt={game.nome} className="w-40 rounded-xl border-2 border-void-950 shadow-2xl sm:w-full" />
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <button onClick={handleAddToLibrary} disabled={busy} className="btn-ghost w-full disabled:opacity-50">
                <ListPlus size={16} /> Adicionar aos meus jogos
              </button>
              <button onClick={handleAddToTopFive} disabled={busy || inTopFive} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40">
                {inTopFive ? <CheckCircle2 size={16} /> : <ListChecks size={16} />}
                {inTopFive ? 'No seu Top 5' : 'Adicionar ao Top 5'}
              </button>
              {libraryEntry && (
                <select
                  value={libraryEntry.status}
                  onChange={(e) => handleStatusChange(e.target.value as StatusJogo)}
                  disabled={busy}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-mist-100"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-ghost w-full text-center">Entre para avaliar e organizar</Link>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{game.nome}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-mist-500">
                {game.dataLancamento && (
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(game.dataLancamento).toLocaleDateString('pt-BR')}</span>
                )}
                <span className="flex items-center gap-1.5"><Building2 size={14} /> {game.desenvolvedora}</span>
                <span className="flex items-center gap-1.5"><Layers size={14} /> {game.publicadora}</span>
              </div>
            </div>
            {libraryEntry && <GameStatusBadge status={libraryEntry.status} />}
          </div>

          {(game.generos.length > 0 || game.plataformas.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {game.generos.map((g) => <span key={g} className="chip">{g}</span>)}
              {game.plataformas.map((p) => <span key={p} className="chip border-signal-500/20 text-signal-300">{p}</span>)}
            </div>
          )}

          <p className="max-w-3xl leading-relaxed text-mist-300">{game.descricao}</p>

          <div className="flex items-center gap-3">
            <Star size={20} className="fill-signal-400 text-signal-400" />
            <span className="font-mono text-lg font-semibold text-white">{game.notaApi.toFixed(1)}</span>
            {game.numeroAvaliacoes > 0 && (
              <span className="text-sm text-mist-500">({game.numeroAvaliacoes.toLocaleString('pt-BR')} avaliações)</span>
            )}
          </div>

          {game.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {game.tags.map((t) => <span key={t} className="chip">#{t}</span>)}
            </div>
          )}

          <div className="surface mt-2 rounded-xl p-5">
            <p className="label-eyebrow mb-3">Minha avaliação</p>
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-4">
                  <StarRating value={review?.rating || 0} onChange={handleRate} size={28} showNumber />
                </div>
                {review?.createdAt && (
                  <p className="mt-2 text-xs text-mist-500">
                    Avaliado em {new Date(review.createdAt).toLocaleDateString('pt-BR')} · você pode alterar sua nota a qualquer momento.
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-mist-500">
                <Link to="/login" className="text-signal-400 hover:underline">Entre na sua conta</Link> para avaliar este jogo.
              </p>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-rise rounded-lg border border-signal-500/40 bg-void-900 px-4 py-3 text-sm text-white shadow-glow max-w-[90vw]">
          {toast}
        </div>
      )}
    </div>
  )
}
