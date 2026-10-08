import { Link } from 'react-router-dom'
import { Compass, ListOrdered, UserPlus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import type { Game } from '@/types/Game'

export function GameHero({ game }: { game: Game }) {
  const { status } = useAuth()

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/5">
      <img src={game.banner} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/70 to-void-950/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-void-950/90 via-void-950/40 to-transparent" />

      <div className="relative flex flex-col gap-6 px-6 py-16 sm:px-10 sm:py-24 lg:max-w-2xl">
        <span className="label-eyebrow">Sua identidade como jogador</span>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Cada jogo que você avalia <span className="text-signal-400">revela quem você é.</span>
        </h1>
        <p className="max-w-md text-mist-300">
          Registre, avalie e organize os jogos que você joga. Construa seu Top 5, descubra seu
          Game DNA e encontre seu próximo jogo favorito com base no seu próprio gosto.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link to="/explorar" className="btn-primary">
            <Compass size={16} /> Explorar Jogos
          </Link>
          {status === 'authenticated' ? (
            <Link to="/meu-top-5" className="btn-ghost">
              <ListOrdered size={16} /> Meu Top 5
            </Link>
          ) : (
            <Link to="/registrar" className="btn-ghost">
              <UserPlus size={16} /> Criar conta
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
