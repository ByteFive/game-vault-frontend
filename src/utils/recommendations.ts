import type { Game, Recommendation, Review } from '@/types/Game'

export function generateRecommendations(
  reviews: Review[],
  gamesById: Map<number, Game>,
  candidates: Game[],
  limit = 6
): Recommendation[] {
  const lovedReviews = reviews.filter((r) => r.rating >= 4)
  const reviewedIds = new Set(reviews.map((r) => r.gameId))

  if (lovedReviews.length === 0) return []

  const lovedGames = lovedReviews
    .map((r) => gamesById.get(r.gameId))
    .filter((g): g is Game => Boolean(g))

  const generoFreq: Record<string, number> = {}
  const tagFreq: Record<string, number> = {}
  const plataformaFreq: Record<string, number> = {}

  lovedGames.forEach((g) => {
    g.generos.forEach((genero) => (generoFreq[genero] = (generoFreq[genero] || 0) + 1))
    g.tags.forEach((tag) => (tagFreq[tag] = (tagFreq[tag] || 0) + 1))
    g.plataformas.forEach((p) => (plataformaFreq[p] = (plataformaFreq[p] || 0) + 1))
  })

  const pool = candidates.filter((g) => !reviewedIds.has(Number(g.id)))

  const scored: Recommendation[] = pool.map((game) => {
    let score = 0
    const motivosGenero: string[] = []
    const motivosTag: string[] = []

    game.generos.forEach((genero) => {
      if (generoFreq[genero]) {
        score += generoFreq[genero] * 12
        motivosGenero.push(genero)
      }
    })
    game.tags.forEach((tag) => {
      if (tagFreq[tag]) {
        score += tagFreq[tag] * 8
        motivosTag.push(tag)
      }
    })
    game.plataformas.forEach((p) => {
      if (plataformaFreq[p]) score += plataformaFreq[p] * 2
    })
    if (game.notaApi >= 4.5) score += 10
    else if (game.notaApi >= 4) score += 5

    return {
      game,
      compatibilidade: Math.max(0, Math.min(99, Math.round(score))),
      motivos: [...motivosGenero, ...motivosTag].slice(0, 4),
    }
  })

  return scored
    .filter((r) => r.compatibilidade > 0)
    .sort((a, b) => b.compatibilidade - a.compatibilidade)
    .slice(0, limit)
}
