import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
  readOnly?: boolean
  showNumber?: boolean
}

export function StarRating({ value, onChange, size = 20, readOnly = false, showNumber = false }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const display = hovered ?? value

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onClick={() => !readOnly && onChange?.(star)}
            className={`transition-transform ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
            aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              className={
                star <= display
                  ? 'fill-signal-400 text-signal-400 drop-shadow-[0_0_6px_rgba(139,92,246,0.5)]'
                  : 'fill-transparent text-mist-700'
              }
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      {showNumber && (
        <span className="font-mono text-sm text-mist-300">{value > 0 ? `${value}/5` : '—/5'}</span>
      )}
    </div>
  )
}
