import type { DNATrait, DNAYearSnapshot, Game, Review } from '@/types/Game'

interface WeightedCount {
  [label: string]: { peso: number }
}

export function calculateDNA(reviews: Review[], gamesById: Map<number, Game>): DNATrait[] {
  if (reviews.length === 0) return []

  const generoPesos: WeightedCount = {}
  const tagPesos: WeightedCount = {}

  reviews.forEach((review) => {
    const game = gamesById.get(review.gameId)
    if (!game) return
    const peso = review.rating / 5

    game.generos.forEach((g) => {
      if (!generoPesos[g]) generoPesos[g] = { peso: 0 }
      generoPesos[g].peso += peso
    })
    game.tags.forEach((t) => {
      if (!tagPesos[t]) tagPesos[t] = { peso: 0 }
      tagPesos[t].peso += peso
    })
  })

  const toTraits = (counts: WeightedCount, kind: DNATrait['kind']): DNATrait[] => {
    const maxPeso = Math.max(...Object.values(counts).map((c) => c.peso), 1)
    return Object.entries(counts)
      .map(([label, { peso }]) => ({ label, value: Math.round((peso / maxPeso) * 100), kind }))
      .sort((a, b) => b.value - a.value)
  }

  const generos = toTraits(generoPesos, 'genero')
  const tags = toTraits(tagPesos, 'tag')

  return [...generos.slice(0, 6), ...tags.slice(0, 6)]
}

export function calculateMultiplayerAffinity(reviews: Review[], gamesById: Map<number, Game>): { single: number; multi: number } {
  let single = 0
  let multi = 0
  reviews.forEach((review) => {
    const game = gamesById.get(review.gameId)
    if (!game) return
    const peso = review.rating / 5
    const isMulti = game.tags.some((t) => ['Multiplayer', 'Cooperativo', 'PvP'].includes(t))
    if (isMulti) multi += peso
    else single += peso
  })
  const total = single + multi || 1
  return { single: Math.round((single / total) * 100), multi: Math.round((multi / total) * 100) }
}

export function generateTextProfile(traits: DNATrait[], reviewCount: number): string {
  if (reviewCount === 0) {
    return 'Você ainda não avaliou jogos suficientes. Avalie alguns títulos para revelarmos o seu Game DNA.'
  }
  if (reviewCount < 3) {
    return 'Seu perfil ainda está sendo formado. Continue avaliando jogos para refinarmos as suas características de jogador.'
  }

  const generos = traits.filter((t) => t.kind === 'genero').slice(0, 2)
  const tags = traits.filter((t) => t.kind === 'tag').slice(0, 3)

  const generoTexto = generos.map((g) => g.label).join(' e ')
  const tagTexto = tags.map((t) => t.label.toLowerCase()).join(', ')

  const baixaMultiplayer = traits.find((t) => t.kind === 'tag' && t.label === 'Multiplayer' && t.value < 40)

  let frase = `Seu perfil indica uma forte preferência por ${generoTexto || 'experiências variadas'}${tagTexto ? `, com destaque para elementos de ${tagTexto}` : ''}.`

  if (baixaMultiplayer) {
    frase += ' Você demonstra menor interesse em experiências multiplayer, preferindo jogar em seu próprio ritmo.'
  } else {
    frase += ' Suas avaliações também mostram abertura para experiências sociais e multiplayer.'
  }

  return frase
}

export function calculateTasteEvolution(reviews: Review[], gamesById: Map<number, Game>): DNAYearSnapshot[] {
  const byYear: Record<string, Review[]> = {}
  reviews.forEach((r) => {
    if (!r.createdAt) return
    const year = r.createdAt.slice(0, 4)
    if (!byYear[year]) byYear[year] = []
    byYear[year].push(r)
  })

  const years = Object.keys(byYear).sort()

  if (years.length >= 2) {
    return years.map((year) => {
      const traits = calculateDNA(byYear[year], gamesById)
      const top = traits.filter((t) => t.kind === 'genero').slice(0, 2).map((t) => t.label)
      return { ano: year, destaque: top.join('/') || 'Explorando gêneros' }
    })
  }

  return [
    { ano: '2024', destaque: 'Ação/RPG' },
    { ano: '2025', destaque: 'RPG/Narrativa' },
    { ano: '2026', destaque: 'RPG/Indie' },
  ]
}

export function getTopRatedGame(reviews: Review[], gamesById: Map<number, Game>): { game: Game; nota: number } | null {
  if (reviews.length === 0) return null
  const best = [...reviews].sort((a, b) => b.rating - a.rating)[0]
  const game = gamesById.get(best.gameId)
  return game ? { game, nota: best.rating } : null
}

export function getLowestRatedGame(reviews: Review[], gamesById: Map<number, Game>): { game: Game; nota: number } | null {
  if (reviews.length === 0) return null
  const worst = [...reviews].sort((a, b) => a.rating - b.rating)[0]
  const game = gamesById.get(worst.gameId)
  return game ? { game, nota: worst.rating } : null
}
