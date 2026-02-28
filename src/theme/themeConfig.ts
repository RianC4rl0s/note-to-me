import { theme } from 'antd'
import type { ThemeConfig } from 'antd'

export type ThemeMode = 'light' | 'dark'
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'rose' | 'teal'

export const COLOR_SCHEMES: { value: ColorScheme; label: string; color: string }[] = [
  { value: 'blue', label: 'Azul', color: '#2563eb' },
  { value: 'green', label: 'Verde', color: '#16a34a' },
  { value: 'purple', label: 'Roxo', color: '#9333ea' },
  { value: 'orange', label: 'Laranja', color: '#ea580c' },
  { value: 'rose', label: 'Rosa', color: '#e11d48' },
  { value: 'teal', label: 'Ciano', color: '#0d9488' },
]

const SCHEME_PRIMARIES: Record<ColorScheme, string> = {
  blue: '#2563eb',
  green: '#16a34a',
  purple: '#9333ea',
  orange: '#ea580c',
  rose: '#e11d48',
  teal: '#0d9488',
}

export function buildAntdTheme(mode: ThemeMode, colorScheme: ColorScheme): ThemeConfig {
  return {
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: SCHEME_PRIMARIES[colorScheme],
    },
  }
}
