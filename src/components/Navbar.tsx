import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Dna, Menu, X, Search, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const ALL_LINKS = [
  { to: '/', label: 'Home', private: false },
  { to: '/explorar', label: 'Explorar', private: false },
  { to: '/meu-top-5', label: 'Meu Top 5', private: true },
  { to: '/meus-jogos', label: 'Meus Jogos', private: true },
  { to: '/avaliacoes', label: 'Avaliações', private: true },
  { to: '/game-dna', label: 'Game DNA', private: true },
  { to: '/comparar', label: 'Comparar', private: true },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { status, localProfile, logout } = useAuth()
  const navigate = useNavigate()
  const LINKS = ALL_LINKS.filter((link) => !link.private || status === 'authenticated')

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(query.trim())}`)
      setOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-void-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-display text-lg font-bold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-helix-gradient">
            <Dna size={17} className="text-white" />
          </span>
          Game<span className="text-signal-400">DNA</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-signal-500/10 text-signal-300' : 'text-mist-300 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <form onSubmit={submitSearch} className="relative">
          </form>
          {status === 'authenticated' ? (
            <div className="flex items-center gap-2">
              <Link to="/perfil" className="shrink-0">
                <img src={localProfile.avatar} alt={localProfile.nome} className="h-9 w-9 rounded-full border border-white/10 object-cover hover:border-signal-500/60 transition-colors" />
              </Link>
              <button onClick={handleLogout} className="text-mist-500 hover:text-rose-300" aria-label="Sair" title="Sair">
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-ghost px-3.5 py-2 text-xs">
              <LogIn size={14} /> Entrar
            </Link>
          )}
        </div>

        <button className="lg:hidden text-mist-300" onClick={() => setOpen((v) => !v)} aria-label="Abrir menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-void-950 px-4 pb-4 pt-2 lg:hidden">
          <form onSubmit={submitSearch} className="relative mb-3">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar jogos..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-8 pr-3 text-sm placeholder:text-mist-700"
            />
          </form>
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-signal-500/10 text-signal-300' : 'text-mist-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {status === 'authenticated' ? (
              <>
                <Link to="/perfil" onClick={() => setOpen(false)} className="mt-2 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-mist-300">
                  <img src={localProfile.avatar} alt="Avatar" className="h-6 w-6 rounded-full object-cover" />
                  Meu perfil
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium text-rose-300">
                  <LogOut size={16} /> Sair
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="mt-2 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-signal-300">
                <LogIn size={16} /> Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
