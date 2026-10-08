import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, placeholder = 'Buscar jogos...', className = '' }: SearchBarProps) {
  return (
    <div className={`group relative flex items-center ${className}`}>
      <Search size={16} className="pointer-events-none absolute left-3 text-mist-500 group-focus-within:text-signal-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-mist-100 placeholder:text-mist-700 transition-colors focus:border-signal-500/60 focus:bg-white/[0.06]"
      />
    </div>
  )
}
