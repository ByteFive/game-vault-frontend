import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { searchGames, getAvailableGenres, getAvailablePlatforms, getAvailableYears, type GameFilters } from '@/services/gameApi'
import { SearchBar } from '@/components/SearchBar'
import { FilterPanel } from '@/components/FilterPanel'
import { GameGrid } from '@/components/GameGrid'
import type { Game } from '@/types/Game'

export function Explore() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState<GameFilters>({ ordenarPor: 'relevancia' })
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [genres, setGenres] = useState<string[]>([])
  const [platforms, setPlatforms] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])

  useEffect(() => {
    getAvailableGenres().then(setGenres)
    getAvailablePlatforms().then(setPlatforms)
    getAvailableYears().then(setYears)
  }, [])

  useEffect(() => {
    setLoading(true)
    const debounce = setTimeout(() => {
      searchGames({ ...filters, busca: query }).then((results) => {
        setGames(results)
        setLoading(false)
      })
    }, 200)
    return () => clearTimeout(debounce)
  }, [query, filters])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="label-eyebrow">Descoberta</p>
        <h1 className="text-3xl font-bold">Explorar Jogos</h1>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder="Buscar por título..." />
      <FilterPanel filters={filters} onChange={setFilters} genres={genres} platforms={platforms} years={years} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-mist-500">
          {loading ? (
            <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Buscando...</span>
          ) : (
            `${games.length} jogo${games.length !== 1 ? 's' : ''} encontrado${games.length !== 1 ? 's' : ''}`
          )}
        </p>
      </div>

      <GameGrid games={games} emptyMessage="Nenhum jogo corresponde aos filtros selecionados." />
    </div>
  )
}
