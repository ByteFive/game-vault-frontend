
export interface Game {
  id: string 
  nome: string
  capa: string
  banner: string
  descricao: string
  dataLancamento: string
  generos: string[]
  plataformas: string[]
  desenvolvedora: string
  publicadora: string
  notaApi: number
  numeroAvaliacoes: number
  tags: string[]
}

export type StatusJogo = 'want_to_play' | 'playing' | 'completed' | 'abandoned'

export const STATUS_LABELS: Record<StatusJogo, string> = {
  want_to_play: 'Quero jogar',
  playing: 'Jogando',
  completed: 'Zerei',
  abandoned: 'Abandonei',
}

export interface LibraryEntry {
  gameId: number
  status: StatusJogo
}

export interface Review {
  _id?: string
  userId?: string
  gameId: number
  rating: number
  review?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface TopFiveEntry {
  _id?: string
  userId?: string
  gameId: number
  position: number
}

export interface DNATrait {
  label: string
  value: number
  kind: 'genero' | 'estilo' | 'tag'
}

export interface DNAYearSnapshot {
  ano: string
  destaque: string
}

export interface Recommendation {
  game: Game
  compatibilidade: number
  motivos: string[]
}

export interface BackendGameDetail {
  id: number
  name: string
  description: string | null
  released: string | null
  rating: number
  metacritic: number | null
  cover: string | null
  genres: string[]
  platforms: string[]
  developers: string[]
}
