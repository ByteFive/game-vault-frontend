import { ApiError } from './ApiError'
import type { LoginInput, RegisterInput, User } from '@/types/User'

const KNOWN_ERRORS = [
  'Email ou senha inválidos',
  'Email e senha são obrigatórios',
  'Email já cadastrado',
  'Nome, email e senha são obrigatórios',
]

function toApiError(message: string | undefined): ApiError {
  return new ApiError(message && KNOWN_ERRORS.includes(message) ? message : 'Não foi possível concluir a operação. Tente novamente.')
}

export async function register(input: RegisterInput): Promise<void> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation Register($name: String!, $email: String!, $password: String!) {
        register(name: $name, email: $email, password: $password) { message }
      }`,
      variables: input,
    }),
  })
  const { errors } = await res.json()
  if (errors?.length) throw toApiError(errors[0].message)
}

export async function login(input: LoginInput): Promise<void> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) { message }
      }`,
      variables: input,
    }),
  })
  const { errors } = await res.json()
  if (errors?.length) throw toApiError(errors[0].message)
}

export async function getMe(): Promise<User | null> {
  const res = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `query Me { me { id name email avatar } }` }),
  })
  const { data, errors } = await res.json()
  if (errors?.length) return null
  return data.me
}
