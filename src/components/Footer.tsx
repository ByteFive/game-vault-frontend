import { Dna } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center sm:px-6">
        <div className="flex items-center gap-2 font-display text-sm font-semibold text-white">
          <Dna size={16} className="text-signal-400" />
          GameDNA
        </div>
        <p className="max-w-md text-xs text-mist-500">
          Plataforma de tracking e descoberta de jogos.
        </p>
      </div>
    </footer>
  )
}
