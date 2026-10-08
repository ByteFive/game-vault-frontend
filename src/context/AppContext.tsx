import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import * as libraryApi from '@/services/libraryApi'
import * as ratingApi from '@/services/ratingApi'
import * as top5Api from '@/services/top5Api'
import type { LibraryEntry, Review, StatusJogo, TopFiveEntry } from '@/types/Game'

interface AppContextValue {
  loading: boolean

  reviews: Review[]
  rateGame: (gameId: string, nota: number) => Promise<void>
  getReview: (gameId: string) => Review | undefined

  library: LibraryEntry[]
  setGameStatus: (gameId: string, status: StatusJogo) => Promise<void>
  removeFromLibrary: (gameId: string) => Promise<void>
  getLibraryEntry: (gameId: string) => LibraryEntry | undefined

  topFive: TopFiveEntry[]
  addToTopFive: (gameId: string) => Promise<{ ok: boolean; message?: string }>
  removeFromTopFive: (gameId: string) => Promise<void>
  moveTopFive: (gameId: string, direction: 'up' | 'down') => Promise<void>
  isInTopFive: (gameId: string) => boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [library, setLibrary] = useState<LibraryEntry[]>([])
  const [topFive, setTopFive] = useState<TopFiveEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      refreshAll()
    } else if (status === 'unauthenticated') {
      setReviews([])
      setLibrary([])
      setTopFive([])
    }
  }, [status])

  const refreshAll = async () => {
    setLoading(true)
    try {
      const [libraryData, topFiveData, reviewsData] = await Promise.all([
        libraryApi.getLibrary(),
        top5Api.getTopFive(),
        ratingApi.getMyReviews().catch(() => []),
      ])
      setLibrary(libraryData)
      setTopFive(topFiveData)
      setReviews(reviewsData)
    } finally {
      setLoading(false)
    }
  }

  const getReview = (gameId: string) => reviews.find((r) => r.gameId === Number(gameId))

  const rateGame = async (gameId: string, nota: number) => {
    const existing = getReview(gameId)
    if (existing?._id) {
      const updated = await ratingApi.updateReview(existing._id, nota)
      setReviews((prev) => prev.map((r) => (r.gameId === Number(gameId) ? updated : r)))
    } else {
      const created = await ratingApi.createReview(Number(gameId), nota)
      setReviews((prev) => [...prev, created])
    }
  }

  const getLibraryEntry = (gameId: string) => library.find((e) => e.gameId === Number(gameId))

  const setGameStatus = async (gameId: string, status: StatusJogo) => {
    const existing = getLibraryEntry(gameId)
    if (existing) {
      await libraryApi.updateGameStatus(Number(gameId), status)
    } else {
      await libraryApi.addGame(Number(gameId))
      if (status !== 'want_to_play') {
        await libraryApi.updateGameStatus(Number(gameId), status)
      }
    }
    const fresh = await libraryApi.getLibrary()
    setLibrary(fresh)
  }

  const removeFromLibrary = async (gameId: string) => {
    await libraryApi.removeGame(Number(gameId))
    setLibrary((prev) => prev.filter((e) => e.gameId !== Number(gameId)))
  }

  const isInTopFive = (gameId: string) => topFive.some((t) => t.gameId === Number(gameId))

  const addToTopFive = async (gameId: string): Promise<{ ok: boolean; message?: string }> => {
    if (isInTopFive(gameId)) {
      return { ok: false, message: 'Este jogo já está no seu Top 5.' }
    }
    if (topFive.length >= 5) {
      return { ok: false, message: 'Seu Top 5 já está completo.' }
    }
    const occupied = new Set(topFive.map((t) => t.position))
    const freePosition = [1, 2, 3, 4, 5].find((p) => !occupied.has(p))
    if (!freePosition) {
      return { ok: false, message: 'Seu Top 5 já está completo.' }
    }
    const created = await top5Api.addToPosition(Number(gameId), freePosition)
    setTopFive((prev) => [...prev, created])
    return { ok: true }
  }

  const removeFromTopFive = async (gameId: string) => {
    const entry = topFive.find((t) => t.gameId === Number(gameId))
    if (!entry) return
    await top5Api.removeFromPosition(entry.position)
    setTopFive((prev) => prev.filter((t) => t.gameId !== Number(gameId)))
  }

  const moveTopFive = async (gameId: string, direction: 'up' | 'down') => {
    const sorted = [...topFive].sort((a, b) => a.position - b.position)
    const idx = sorted.findIndex((t) => t.gameId === Number(gameId))
    if (idx === -1) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const fromEntry = sorted[idx]
    const toEntry = sorted[swapIdx]
    await top5Api.swapPositions(fromEntry, toEntry, toEntry.position)
    const fresh = await top5Api.getTopFive()
    setTopFive(fresh)
  }

  const value = useMemo<AppContextValue>(
    () => ({
      loading,
      reviews,
      rateGame,
      getReview,
      library,
      setGameStatus,
      removeFromLibrary,
      getLibraryEntry,
      topFive,
      addToTopFive,
      removeFromTopFive,
      moveTopFive,
      isInTopFive,
    }),
    [loading, reviews, library, topFive]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de um AppProvider')
  return ctx
}
