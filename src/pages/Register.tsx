import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dna, UserPlus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/services/ApiError'

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register(name, email, password)
      navigate('/perfil', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar sua conta. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 py-10">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-helix-gradient">
        <Dna size={24} className="text-white" />
      </span>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="mt-1 text-sm text-mist-500">Comece a construir seu perfil de jogador</p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs text-mist-500">Nome</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-mist-100 focus:border-signal-500/60"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-mist-500">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-mist-100 focus:border-signal-500/60"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-mist-500">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-mist-100 focus:border-signal-500/60"
          />
        </div>

        {error && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          <UserPlus size={16} /> {submitting ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="text-sm text-mist-500">
        Já tem conta?{' '}
        <Link to="/login" className="text-signal-400 hover:underline">Entrar</Link>
      </p>
    </div>
  )
}
