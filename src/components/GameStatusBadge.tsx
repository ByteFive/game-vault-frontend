import { STATUS_LABELS, type StatusJogo } from '@/types/Game'
import { CircleDashed, Gamepad2, Trophy, XCircle } from 'lucide-react'

const STATUS_ICON: Record<StatusJogo, typeof Trophy> = {
  want_to_play: CircleDashed,
  playing: Gamepad2,
  completed: Trophy,
  abandoned: XCircle,
}

const STATUS_CLASS: Record<StatusJogo, string> = {
  want_to_play: 'text-mist-300 bg-white/5 border-white/10',
  playing: 'text-signal-300 bg-signal-500/10 border-signal-500/30',
  completed: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  abandoned: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
}

export function GameStatusBadge({ status }: { status: StatusJogo }) {
  const Icon = STATUS_ICON[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_CLASS[status]}`}>
      <Icon size={12} />
      {STATUS_LABELS[status]}
    </span>
  )
}

export const STATUS_OPTIONS: { value: StatusJogo; label: string }[] = [
  { value: 'want_to_play', label: STATUS_LABELS.want_to_play },
  { value: 'playing', label: STATUS_LABELS.playing },
  { value: 'completed', label: STATUS_LABELS.completed },
  { value: 'abandoned', label: STATUS_LABELS.abandoned },
]
