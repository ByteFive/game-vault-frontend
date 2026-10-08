import { ApiError } from './ApiError'
import type { TopFiveEntry } from '@/types/Game'

const GENERIC_ERROR = 'Não foi possível concluir a operação. Tente novamente.'

interface BackendTop5 {
  id: string
  userId: string
  gameId: number
  position: number
}

function mapTop5(t: BackendTop5): TopFiveEntry {
  return { _id: t.id, userId: t.userId, gameId: t.gameId, position: t.position }
}

export async function getTopFive(): Promise<TopFiveEntry[]> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `query Top5 { top5 { id userId gameId position } }` }),
  })
  const { data, errors } = await res.json()
  if (errors?.length) throw new ApiError(GENERIC_ERROR)
  return (data.top5 as BackendTop5[]).map(mapTop5)
}

export async function addToPosition(gameId: number, position: number): Promise<TopFiveEntry> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation CreateTop5($gameId: Int!, $position: Int!) {
        createTop5(gameId: $gameId, position: $position) { id userId gameId position }
      }`,
      variables: { gameId, position },
    }),
  })
  const { data, errors } = await res.json()
  if (errors?.length) throw new ApiError('Não foi possível adicionar ao Top 5.')
  return mapTop5(data.createTop5)
}

export async function removeFromPosition(position: number): Promise<void> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation RemoveTop5($position: Int!) { removeTop5(position: $position) { message } }`,
      variables: { position },
    }),
  })
  const { errors } = await res.json()
  if (errors?.length) throw new ApiError('Não foi possível remover do Top 5.')
}

export async function swapPositions(
  fromEntry: TopFiveEntry,
  _toEntry: TopFiveEntry | undefined,
  toPosition: number
): Promise<void> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation UpdateTop5($position: Int!, $newPosition: Int!) {
        updateTop5(position: $position, newPosition: $newPosition) { message }
      }`,
      variables: { position: fromEntry.position, newPosition: toPosition },
    }),
  })
  const { errors } = await res.json()
  if (errors?.length) throw new ApiError('Não foi possível reorganizar o Top 5.')
}
