export type User = {
  id: string
  name: string
  email: string
  phone?: string
  birthDate?: string
  avatarUrl?: string
  roles?: string[]
  planName?: string
}

export type UpdateProfileRequest = {
  name?: string
  phone?: string
  birthDate?: string
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
