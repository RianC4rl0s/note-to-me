import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { ThemeMode, ColorScheme } from './themeConfig'

const STORAGE_KEY = 'note-to-me-theme'

type ThemeState = { mode: ThemeMode; colorScheme: ColorScheme }

type ThemeContextValue = {
  mode: ThemeMode
  colorScheme: ColorScheme
  toggleMode: () => void
  setColorScheme: (scheme: ColorScheme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialTheme(): ThemeState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as ThemeState
  } catch { /* ignore */ }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return { mode: prefersDark ? 'dark' : 'light', colorScheme: 'blue' }
}

function applyToDOM(state: ThemeState) {
  const root = document.documentElement
  root.classList.toggle('dark', state.mode === 'dark')
  root.setAttribute('data-color-scheme', state.colorScheme)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeState>(getInitialTheme)

  useEffect(() => {
    applyToDOM(theme)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
  }, [theme])

  const toggleMode = useCallback(() => {
    setTheme((prev) => ({ ...prev, mode: prev.mode === 'light' ? 'dark' : 'light' }))
  }, [])

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setTheme((prev) => ({ ...prev, colorScheme: scheme }))
  }, [])

  return (
    <ThemeContext.Provider value={{ mode: theme.mode, colorScheme: theme.colorScheme, toggleMode, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
