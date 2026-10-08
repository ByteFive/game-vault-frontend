import { ApiError } from './ApiError'
import type { LibraryEntry, StatusJogo } from '@/types/Game'

const GENERIC_ERROR = 'Não foi possível concluir a operação. Tente novamente.'
const EMPTY_LIBRARY_MESSAGE = 'Biblioteca não encontrada'

export async function getLibrary(): Promise<LibraryEntry[]> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `query Library { library { games { gameId status } } }` }),
  })
  const { data, errors } = await res.json()
  if (errors?.length) {
    if (errors[0].message === EMPTY_LIBRARY_MESSAGE) return []
    throw new ApiError(GENERIC_ERROR)
  }
  return (data.library.games as { gameId: number; status: string }[]).map((g) => ({
    gameId: g.gameId,
    status: (g.status === 'dropped' ? 'abandoned' : g.status) as StatusJogo,
  }))
}

export async function addGame(gameId: number): Promise<void> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation AddGame($gameId: Int!) { addGameToLibrary(gameId: $gameId) { id } }`,
      variables: { gameId },
    }),
  })
  const { errors } = await res.json()
  if (errors?.length) throw new ApiError(GENERIC_ERROR)
}

export async function updateGameStatus(gameId: number, status: StatusJogo): Promise<void> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation UpdateGame($gameId: Int!, $status: LibraryGameStatus!) {
        updateLibraryGame(gameId: $gameId, status: $status) { message }
      }`,
      variables: { gameId, status },
    }),
  })
  const { errors } = await res.json()
  if (errors?.length) throw new ApiError(GENERIC_ERROR)
}

export async function removeGame(gameId: number): Promise<void> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation RemoveGame($gameId: Int!) { removeGameFromLibrary(gameId: $gameId) { message } }`,
      variables: { gameId },
    }),
  })
  const { errors } = await res.json()
  if (errors?.length) throw new ApiError(GENERIC_ERROR)
}
