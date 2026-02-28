import type { AuthTokens, LoginRequest, RegisterRequest, User } from './types'
import api from '../lib/axios'
import axios from 'axios'

const TOKEN_KEY = 'auth_tokens'

export function getStoredTokens(): AuthTokens | null {
  const raw = localStorage.getItem(TOKEN_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthTokens
  } catch {
    return null
  }
}

export function setStoredTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
}

export function clearStoredTokens(): void {
  localStorage.removeItem(TOKEN_KEY)
}

const ADMIN_BACKUP_KEY = 'admin_tokens_backup'

export function getAdminBackupTokens(): AuthTokens | null {
  const raw = localStorage.getItem(ADMIN_BACKUP_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthTokens
  } catch {
    return null
  }
}

export function setAdminBackupTokens(tokens: AuthTokens): void {
  localStorage.setItem(ADMIN_BACKUP_KEY, JSON.stringify(tokens))
}

export function clearAdminBackupTokens(): void {
  localStorage.removeItem(ADMIN_BACKUP_KEY)
}

export async function loginApi(data: LoginRequest): Promise<AuthTokens> {
  try {
    const res = await api.post<AuthTokens>('/api/auth/login', data)
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message ?? 'Login failed')
    }
    throw err
  }
}

export async function registerApi(data: RegisterRequest): Promise<User> {
  try {
    const res = await api.post<User>('/api/auth/register', data)
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message ?? 'Registration failed')
    }
    throw err
  }
}

export async function fetchCurrentUser(): Promise<User> {
  const res = await api.get<User>('/api/users/me')
  return res.data
}
