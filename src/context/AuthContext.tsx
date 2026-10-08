import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as authApi from '@/services/authApi'
import { ApiError } from '@/services/ApiError'
import type { LocalProfileInfo, User } from '@/types/User'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  status: AuthStatus
  user: User | null
  localProfile: LocalProfileInfo
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateLocalProfile: (partial: Partial<LocalProfileInfo>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const DEFAULT_LOCAL_PROFILE: LocalProfileInfo = {
  nome: 'Jogador',
  descricao: 'Explorando mundos, um save por vez.',
  avatar: 'https://placehold.co/200x200/1B1824/C4A9FF?text=GV&font=raleway',
}

function profileKey(userId: string) {
  return `gamedna:localprofile:${userId}`
}

function loadLocalProfile(user: User): LocalProfileInfo {
  const base: LocalProfileInfo = {
    ...DEFAULT_LOCAL_PROFILE,
    nome: user.name,
    avatar: user.avatar || DEFAULT_LOCAL_PROFILE.avatar,
  }
  try {
    const raw = window.localStorage.getItem(profileKey(user.id))
    if (raw) return { ...base, ...JSON.parse(raw) }
  } catch {
    return base
  }
  return base
}

function saveLocalProfile(userId: string, profile: LocalProfileInfo) {
  window.localStorage.setItem(profileKey(userId), JSON.stringify(profile))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<User | null>(null)
  const [localProfile, setLocalProfile] = useState<LocalProfileInfo>(DEFAULT_LOCAL_PROFILE)

  const applyUser = (me: User | null) => {
    setUser(me)
    setStatus(me ? 'authenticated' : 'unauthenticated')
    if (me) setLocalProfile(loadLocalProfile(me))
  }

  useEffect(() => {
    authApi
      .getMe()
      .then(applyUser)
      .catch(() => applyUser(null))
  }, [])

  const login = async (email: string, password: string) => {
    await authApi.login({ email, password })
    const me = await authApi.getMe()
    if (!me) throw new ApiError('Não foi possível entrar. Tente novamente.')
    applyUser(me)
  }

  const register = async (name: string, email: string, password: string) => {
    await authApi.register({ name, email, password })
    await login(email, password)
  }

  const logout = () => applyUser(null)

  const updateLocalProfile = (partial: Partial<LocalProfileInfo>) => {
    if (!user) return
    setLocalProfile((prev) => {
      const next = { ...prev, ...partial }
      saveLocalProfile(user.id, next)
      return next
    })
  }

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, localProfile, login, register, logout, updateLocalProfile }),
    [status, user, localProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  return ctx
}
