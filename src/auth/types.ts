export type User = {
  id: string
  name: string
  email: string
  phone?: string
  birthDate?: string
  roles?: string[]
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  name: string
  email: string
  password: string
  phone: string
  birthDate: string
}
