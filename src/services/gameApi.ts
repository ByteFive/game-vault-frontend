import { ApiError } from './ApiError'
import type { BackendGameDetail, Game } from '@/types/Game'

const GAME_FIELDS = 'id name description released rating metacritic cover genres platforms developers'
const GENERIC_ERROR = 'Não foi possível carregar os jogos.'

function mapBackendGameToGame(detail: BackendGameDetail): Game {
  return {
    id: String(detail.id),
    nome: detail.name,
    capa: detail.cover || '',
    banner: detail.cover || '',
    descricao: detail.description || 'Sem descrição disponível.',
    dataLancamento: detail.released || '',
    generos: detail.genres || [],
    plataformas: detail.platforms || [],
    desenvolvedora: detail.developers?.[0] || 'Não informado',
    publicadora: 'Não informado',
    notaApi: detail.rating ?? 0,
    numeroAvaliacoes: 0,
    tags: [],
  }
}

export async function getAllGames(): Promise<Game[]> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `query Games { games { ${GAME_FIELDS} } }` }),
  })
  const { data, errors } = await res.json()
  if (errors?.length) throw new ApiError(GENERIC_ERROR)
  return (data.games as BackendGameDetail[]).map(mapBackendGameToGame)
}

export async function getGameById(id: string): Promise<Game | undefined> {
  try {
    const res = await fetch('/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query Game($id: Int!) { game(id: $id) { ${GAME_FIELDS} } }`,
        variables: { id: Number(id) },
      }),
    })
    const { data, errors } = await res.json()
    if (errors?.length || !data?.game) return undefined
    return mapBackendGameToGame(data.game)
  } catch {
    return undefined
  }
}

export interface GameFilters {
  busca?: string
  genero?: string
  plataforma?: string
  ano?: string
  notaMinima?: number
  ordenarPor?: 'relevancia' | 'nota' | 'nome' | 'lancamento'
}

export async function searchGames(filters: GameFilters): Promise<Game[]> {
  let results = await getAllGames()

  if (filters.busca) {
    const term = filters.busca.toLowerCase()
    results = results.filter((g) => g.nome.toLowerCase().includes(term))
  }
  if (filters.genero) {
    results = results.filter((g) => g.generos.includes(filters.genero!))
  }
  if (filters.plataforma) {
    results = results.filter((g) => g.plataformas.includes(filters.plataforma!))
  }
  if (filters.ano) {
    results = results.filter((g) => g.dataLancamento.startsWith(filters.ano!))
  }
  if (filters.notaMinima) {
    results = results.filter((g) => g.notaApi >= filters.notaMinima!)
  }

  switch (filters.ordenarPor) {
    case 'nota':
      results.sort((a, b) => b.notaApi - a.notaApi)
      break
    case 'nome':
      results.sort((a, b) => a.nome.localeCompare(b.nome))
      break
    case 'lancamento':
      results.sort((a, b) => (a.dataLancamento < b.dataLancamento ? 1 : -1))
      break
    default:
      results.sort((a, b) => b.numeroAvaliacoes - a.numeroAvaliacoes)
  }

  return results
}

export async function getPopularGames(limit = 10): Promise<Game[]> {
  const all = await getAllGames()
  return [...all].sort((a, b) => b.notaApi - a.notaApi).slice(0, limit)
}

export async function getAvailableGenres(): Promise<string[]> {
  const all = await getAllGames()
  return Array.from(new Set(all.flatMap((g) => g.generos))).sort()
}

export async function getAvailablePlatforms(): Promise<string[]> {
  const all = await getAllGames()
  return Array.from(new Set(all.flatMap((g) => g.plataformas))).sort()
}

export async function getAvailableYears(): Promise<string[]> {
  const all = await getAllGames()
  return Array.from(new Set(all.map((g) => g.dataLancamento.slice(0, 4)).filter(Boolean))).sort(
    (a, b) => Number(b) - Number(a)
  )
}

export async function getGamesByIds(ids: number[]): Promise<Map<number, Game>> {
  const uniqueIds = Array.from(new Set(ids))
  const results = await Promise.all(uniqueIds.map((id) => getGameById(String(id))))
  const map = new Map<number, Game>()
  uniqueIds.forEach((id, i) => {
    const game = results[i]
    if (game) map.set(id, game)
  })
  return map
}
