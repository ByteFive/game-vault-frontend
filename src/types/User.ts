export interface User {
  id: string
  name: string
  email: string
  avatar: string | null
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface LocalProfileInfo {
  nome: string
  descricao: string
  avatar: string
}

export interface FictionalUser {
  id: string
  nome: string
  avatar: string
  bio: string
}
