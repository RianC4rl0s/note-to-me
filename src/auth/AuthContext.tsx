import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User, LoginRequest } from './types'
import {
  loginApi,
  fetchCurrentUser,
  getStoredTokens,
  setStoredTokens,
  clearStoredTokens,
  getAdminBackupTokens,
  setAdminBackupTokens,
  clearAdminBackupTokens,
} from './api'
import { impersonateUser as impersonateApi } from '../admin/api'

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
  isImpersonating: boolean
  login: (data: LoginRequest) => Promise<User>
  logout: () => void
  refreshUser: () => Promise<void>
  impersonate: (targetUserId: string) => Promise<void>
  stopImpersonating: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const tokens = getStoredTokens()
    if (!tokens) {
      setIsLoading(false)
      return
    }

    fetchCurrentUser()
      .then(setUser)
      .catch(() => {
        clearStoredTokens()
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (data: LoginRequest): Promise<User> => {
    const tokens = await loginApi(data)
    setStoredTokens(tokens)
    const currentUser = await fetchCurrentUser()
    setUser(currentUser)
    return currentUser
  }, [])

  const refreshUser = useCallback(async () => {
    const currentUser = await fetchCurrentUser()
    setUser(currentUser)
  }, [])

  const logout = useCallback(() => {
    clearStoredTokens()
    clearAdminBackupTokens()
    setUser(null)
  }, [])

  const impersonate = useCallback(async (targetUserId: string) => {
    const currentTokens = getStoredTokens()
    if (!currentTokens) return

    setAdminBackupTokens(currentTokens)
    const newTokens = await impersonateApi(targetUserId)
    setStoredTokens(newTokens)
    const impersonatedUser = await fetchCurrentUser()
    setUser(impersonatedUser)
  }, [])

  const stopImpersonating = useCallback(async () => {
    const backupTokens = getAdminBackupTokens()
    if (!backupTokens) return

    clearAdminBackupTokens()
    setStoredTokens(backupTokens)
    const adminUser = await fetchCurrentUser()
    setUser(adminUser)
  }, [])

  const isAdmin = user?.roles?.some((r) => r === 'SUPER_ADMIN' || r === 'ADMIN') ?? false
  const isImpersonating = getAdminBackupTokens() !== null

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        isAdmin,
        isImpersonating,
        login,
        logout,
        refreshUser,
        impersonate,
        stopImpersonating,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
