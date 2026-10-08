import { useEffect, useMemo, useState } from 'react'
import { Swords, Users, Loader2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { getAllGames } from '@/services/gameApi'
import { mockUsers } from '@/data/mockUsers'
import { ComparisonCard } from '@/components/ComparisonCard'
import type { Game } from '@/types/Game'

function seedIndex(seed: string, max: number, offset: number): number {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return (hash + offset * 7) % max
}

export function CompareTopFive() {
  const { topFive } = useApp()
  const { localProfile } = useAuth()
  const [allGames, setAllGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState(mockUsers[0].id)
  const selectedUser = mockUsers.find((u) => u.id === selectedUserId)!

  useEffect(() => {
    getAllGames().then((games) => {
      setAllGames(games)
      setLoading(false)
    })
  }, [])

  const myTopGames = useMemo(() => {
    const sorted = [...topFive].sort((a, b) => a.position - b.position)
    return sorted.map((entry) => allGames.find((g) => Number(g.id) === entry.gameId))
  }, [topFive, allGames])

  const fictionalTopGames = useMemo(() => {
    if (allGames.length < 5) return []
    const usedIndexes = new Set<number>()
    const picks: Game[] = []
    let offset = 0
    while (picks.length < 5 && offset < allGames.length * 2) {
      const idx = seedIndex(selectedUser.id, allGames.length, offset)
      if (!usedIndexes.has(idx)) {
        usedIndexes.add(idx)
        picks.push(allGames[idx])
      }
      offset++
    }
    return picks
  }, [selectedUser, allGames])

  if (loading) {
    return <div className="flex items-center gap-2 py-20 justify-center text-mist-500"><Loader2 size={20} className="animate-spin" /> Carregando jogos...</div>
  }

  const rows = Array.from({ length: 5 }, (_, i) => ({
    posicao: i + 1,
    meu: myTopGames[i],
    dele: fictionalTopGames[i],
  }))

  const myIds = myTopGames.filter(Boolean).map((g) => g!.id)
  const theirIds = fictionalTopGames.map((g) => g.id)
  const comuns = myIds.filter((id) => theirIds.includes(id))
  const exclusivosMeus = myIds.filter((id) => !theirIds.includes(id))
  const exclusivosDele = theirIds.filter((id) => !myIds.includes(id))
  const meuMelhorComum = comuns.length ? comuns.reduce((best, id) => (myIds.indexOf(id) < myIds.indexOf(best) ? id : best), comuns[0]) : null
  const posicoesDiferentes = comuns.filter((id) => myIds.indexOf(id) !== theirIds.indexOf(id)).length
  const hasMyTopFive = myIds.length > 0

  const findGame = (id: string) => allGames.find((g) => g.id === id)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Swords size={26} className="text-signal-400" />
        <div>
          <p className="label-eyebrow">Batalha de gostos</p>
          <h1 className="text-3xl font-bold">Comparar Top 5</h1>
        </div>
      </div>

      <div className="rounded-lg border border-signal-500/15 bg-signal-500/5 px-4 py-2.5 text-xs text-mist-500">
        Os Top 5 de João, Marina e Lucas são demonstrativos.
      </div>

      <div className="surface flex flex-wrap items-center gap-3 rounded-xl p-4">
        <Users size={16} className="text-mist-500" />
        <span className="text-sm text-mist-400">Comparar com:</span>
        <div className="flex flex-wrap gap-2">
          {mockUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUserId(u.id)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                u.id === selectedUserId
                  ? 'border-signal-500/60 bg-signal-500/10 text-signal-300'
                  : 'border-white/10 text-mist-400 hover:border-white/20'
              }`}
            >
              <img src={u.avatar} alt="" className="h-5 w-5 rounded-full object-cover" /> {u.nome}
            </button>
          ))}
        </div>
      </div>

      {!hasMyTopFive ? (
        <div className="surface rounded-xl p-10 text-center text-mist-400">
          Monte seu Top 5 primeiro para comparar com outros jogadores.
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-signal-500/20 bg-gradient-to-br from-signal-500/10 via-void-900 to-void-900 p-6 text-center sm:p-10">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              <span className="text-signal-300">{localProfile.nome}</span> VS <span className="text-white">{selectedUser.nome}</span>
            </h2>
            <p className="mt-3 text-mist-300">
              Vocês possuem <span className="font-semibold text-signal-400">{comuns.length} jogo{comuns.length !== 1 ? 's' : ''}</span> em comum no Top 5.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="surface rounded-xl p-4 text-center">
              <p className="font-display text-2xl font-bold text-signal-400">{comuns.length}</p>
              <p className="text-xs text-mist-500">jogos em comum</p>
            </div>
            <div className="surface rounded-xl p-4 text-center">
              <p className="font-display text-2xl font-bold text-signal-400">{posicoesDiferentes}</p>
              <p className="text-xs text-mist-500">posições diferentes</p>
            </div>
            <div className="surface rounded-xl p-4 text-center">
              <p className="line-clamp-1 font-display text-sm font-bold text-signal-400">
                {meuMelhorComum ? findGame(meuMelhorComum)?.nome : '—'}
              </p>
              <p className="text-xs text-mist-500">jogo mais bem colocado em comum</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-mist-500">
                  <th className="w-14 px-2">Pos.</th>
                  <th className="px-2">{localProfile.nome}</th>
                  <th className="px-2">{selectedUser.nome}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.posicao}>
                    <td className="px-2 font-display text-lg font-bold text-signal-500/60">#{row.posicao}</td>
                    <td className="px-2 py-1">
                      <ComparisonCard game={row.meu} highlighted={row.meu ? comuns.includes(row.meu.id) : false} />
                    </td>
                    <td className="px-2 py-1">
                      <ComparisonCard game={row.dele} highlighted={row.dele ? comuns.includes(row.dele.id) : false} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="surface rounded-xl p-4">
              <p className="label-eyebrow mb-3">Jogos em comum</p>
              {comuns.length === 0 ? (
                <p className="text-sm text-mist-600">Nenhum jogo em comum ainda.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {comuns.map((id) => <ComparisonCard key={id} game={findGame(id)} highlighted />)}
                </div>
              )}
            </div>
            <div className="surface rounded-xl p-4">
              <p className="label-eyebrow mb-3">Diferenças</p>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="mb-1.5 text-xs text-mist-500">Só no seu Top 5</p>
                  <div className="flex flex-col gap-2">
                    {exclusivosMeus.length === 0 ? <p className="text-xs text-mist-700">—</p> : exclusivosMeus.map((id) => <ComparisonCard key={id} game={findGame(id)} />)}
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-xs text-mist-500">Só no Top 5 de {selectedUser.nome}</p>
                  <div className="flex flex-col gap-2">
                    {exclusivosDele.length === 0 ? <p className="text-xs text-mist-700">—</p> : exclusivosDele.map((id) => <ComparisonCard key={id} game={findGame(id)} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
