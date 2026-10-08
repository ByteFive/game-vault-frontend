import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Trophy, Gamepad2, Pencil, Dna, Mail } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { getGamesByIds } from '@/services/gameApi'
import { calculateDNA } from '@/utils/dna'
import { ProfileStats } from '@/components/ProfileStats'
import { StarRating } from '@/components/StarRating'
import { DNAChart } from '@/components/DNAChart'
import type { Game } from '@/types/Game'

export function Profile() {
  const { user, localProfile, updateLocalProfile } = useAuth()
  const { reviews, library, topFive } = useApp()
  const [editing, setEditing] = useState(false)
  const [draftNome, setDraftNome] = useState(localProfile.nome)
  const [draftDescricao, setDraftDescricao] = useState(localProfile.descricao)
  const [gamesById, setGamesById] = useState<Map<number, Game>>(new Map())

  useEffect(() => {
    setDraftNome(localProfile.nome)
    setDraftDescricao(localProfile.descricao)
  }, [localProfile])

  useEffect(() => {
    if (reviews.length === 0) {
      setGamesById(new Map())
      return
    }
    getGamesByIds(reviews.map((r) => r.gameId)).then(setGamesById)
  }, [reviews])

  const mediaAvaliacoes = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—'
  const zerados = library.filter((l) => l.status === 'completed').length
  const traits = calculateDNA(reviews, gamesById)
  const topTrait = traits.find((t) => t.kind === 'genero')

  const sortedTop = [...topFive].sort((a, b) => a.position - b.position)

  const saveEdit = () => {
    updateLocalProfile({ nome: draftNome, descricao: draftDescricao })
    setEditing(false)
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
        <img src={localProfile.avatar} alt={localProfile.nome} className="h-24 w-24 rounded-2xl border border-white/10 object-cover sm:h-28 sm:w-28" />
        <div className="flex-1">
          {editing ? (
            <div className="flex flex-col gap-2 sm:max-w-md">
              <input
                value={draftNome}
                onChange={(e) => setDraftNome(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-lg font-semibold text-white"
              />
              <textarea
                value={draftDescricao}
                onChange={(e) => setDraftDescricao(e.target.value)}
                rows={2}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-mist-300"
              />
              <div className="flex gap-2">
                <button onClick={saveEdit} className="btn-primary">Salvar</button>
                <button onClick={() => setEditing(false)} className="btn-ghost">Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-3xl font-bold">{localProfile.nome}</h1>
                <button onClick={() => setEditing(true)} className="text-mist-500 hover:text-signal-300" aria-label="Editar perfil">
                  <Pencil size={16} />
                </button>
              </div>
              <p className="mt-1 max-w-md text-mist-400">{localProfile.descricao}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {topTrait && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-500/30 bg-signal-500/10 px-3 py-1 text-xs font-medium text-signal-300">
                    <Dna size={12} /> {topTrait.label} Lover
                  </span>
                )}
                {user && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-mist-400">
                    <Mail size={12} /> {user.email}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <ProfileStats
        stats={[
          { label: 'jogos avaliados', value: reviews.length, icon: <Star size={16} /> },
          { label: 'média das notas', value: mediaAvaliacoes, icon: <Star size={16} /> },
          { label: 'jogos zerados', value: zerados, icon: <Trophy size={16} /> },
          { label: 'jogos na biblioteca', value: library.length, icon: <Gamepad2 size={16} /> },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="surface rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="label-eyebrow">Top 5</p>
            <Link to="/meu-top-5" className="text-xs text-signal-400 hover:underline">Editar →</Link>
          </div>
          {sortedTop.length === 0 ? (
            <p className="text-sm text-mist-600">Você ainda não montou seu Top 5.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {sortedTop.map((entry) => {
                const game = gamesById.get(entry.gameId)
                return (
                  <Link key={entry.gameId} to={`/jogo/${entry.gameId}`} className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-white/5">
                    <span className="w-6 font-display text-sm font-bold text-signal-500/60">#{entry.position}</span>
                    {game ? (
                      <>
                        <img src={game.capa} alt="" className="h-12 w-9 rounded object-cover" />
                        <span className="line-clamp-1 text-sm text-mist-200">{game.nome}</span>
                      </>
                    ) : (
                      <span className="text-sm text-mist-600">Jogo #{entry.gameId}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="surface rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="label-eyebrow">Game DNA resumido</p>
            <Link to="/game-dna" className="text-xs text-signal-400 hover:underline">Ver completo →</Link>
          </div>
          {traits.length === 0 ? (
            <p className="text-sm text-mist-600">Avalie jogos para revelar seu Game DNA.</p>
          ) : (
            <DNAChart traits={traits.slice(0, 4)} />
          )}
        </div>
      </div>

      <div>
        <p className="label-eyebrow mb-4">Avaliações recentes</p>
        {reviews.length === 0 ? (
          <p className="text-sm text-mist-600">Nenhuma avaliação ainda.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...reviews]
              .sort((a, b) => ((a.createdAt || '') < (b.createdAt || '') ? 1 : -1))
              .slice(0, 6)
              .map((r) => {
                const game = gamesById.get(r.gameId)
                return (
                  <Link key={r.gameId} to={`/jogo/${r.gameId}`} className="surface flex items-center gap-3 rounded-xl p-3 hover:border-signal-500/40">
                    {game && <img src={game.capa} alt="" className="h-14 w-10 rounded object-cover" />}
                    <div>
                      <p className="line-clamp-1 text-sm font-medium text-white">{game?.nome || `Jogo #${r.gameId}`}</p>
                      <StarRating value={r.rating} readOnly size={13} />
                    </div>
                  </Link>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
