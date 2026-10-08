import { ApiError } from './ApiError'
import type { Review } from '@/types/Game'

const GENERIC_ERROR = 'Não foi possível concluir a operação. Tente novamente.'
const RATING_FIELDS = 'id userId gameId rating comment createdAt updatedAt'

interface BackendRating {
  id: string
  userId: string
  gameId: number
  rating: number
  comment: string | null
  createdAt: string
  updatedAt: string
}

function mapRating(r: BackendRating): Review {
  return {
    _id: r.id,
    userId: r.userId,
    gameId: r.gameId,
    rating: r.rating,
    review: r.comment,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }
}

export async function getMyReviews(): Promise<Review[]> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `query Ratings { ratings { ${RATING_FIELDS} } }` }),
  })
  const { data, errors } = await res.json()
  if (errors?.length) throw new ApiError(GENERIC_ERROR)
  return (data.ratings as BackendRating[]).map(mapRating)
}

export async function getReviewsForGame(gameId: number): Promise<Review[]> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query RatingsByGame($gameId: Int!) { ratingsByGame(gameId: $gameId) { ${RATING_FIELDS} } }`,
      variables: { gameId },
    }),
  })
  const { data, errors } = await res.json()
  if (errors?.length) throw new ApiError(GENERIC_ERROR)
  return (data.ratingsByGame as BackendRating[]).map(mapRating)
}

export async function createReview(gameId: number, rating: number, review?: string): Promise<Review> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation CreateRating($gameId: Int!, $rating: Int!, $comment: String) {
        createRating(gameId: $gameId, rating: $rating, comment: $comment) { ${RATING_FIELDS} }
      }`,
      variables: { gameId, rating, comment: review ?? null },
    }),
  })
  const { data, errors } = await res.json()
  if (errors?.length) throw new ApiError('Não foi possível salvar sua avaliação.')
  return mapRating(data.createRating)
}

export async function updateReview(reviewId: string, rating: number, review?: string): Promise<Review> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation UpdateRating($id: ID!, $rating: Int!, $comment: String) {
        updateRating(id: $id, rating: $rating, comment: $comment) { ${RATING_FIELDS} }
      }`,
      variables: { id: reviewId, rating, comment: review ?? null },
    }),
  })
  const { data, errors } = await res.json()
  if (errors?.length) throw new ApiError('Não foi possível salvar sua avaliação.')
  return mapRating(data.updateRating)
}

export async function deleteReview(reviewId: string): Promise<void> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation DeleteRating($id: ID!) { deleteRating(id: $id) { message } }`,
      variables: { id: reviewId },
    }),
  })
  const { errors } = await res.json()
  if (errors?.length) throw new ApiError(GENERIC_ERROR)
}
