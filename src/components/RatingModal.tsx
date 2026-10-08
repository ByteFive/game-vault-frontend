import { useState } from 'react'
import { X } from 'lucide-react'
import { StarRating } from './StarRating'
import type { Game } from '@/types/Game'

interface RatingModalProps {
  game: Game
  initialValue: number
  onClose: () => void
  onSave: (nota: number) => void
}

export function RatingModal({ game, initialValue, onClose, onSave }: RatingModalProps) {
  const [nota, setNota] = useState(initialValue)

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-t-2xl border border-white/10 bg-void-900 p-6 shadow-glow sm:rounded-2xl animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="label-eyebrow">Avaliar</p>
            <h3 className="font-display text-lg font-semibold text-white">{game.nome}</h3>
          </div>
          <button onClick={onClose} className="text-mist-500 hover:text-white" aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3 py-4">
          <StarRating value={nota} onChange={setNota} size={32} />
          <span className="font-mono text-2xl font-bold text-signal-400">{nota > 0 ? `${nota}/5` : '—/5'}</span>
        </div>
        <button
          onClick={() => { onSave(nota); onClose() }}
          disabled={nota === 0}
          className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-40"
        >
          Salvar avaliação
        </button>
      </div>
    </div>
  )
}
