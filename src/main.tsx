import { StrictMode, useMemo } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import { ThemeProvider, useTheme } from './theme/ThemeContext'
import { buildAntdTheme } from './theme/themeConfig'
import { AuthProvider } from './auth/AuthContext'
import './theme/theme.css'
import './index.css'
import App from './App.tsx'

function AntdThemeWrapper({ children }: { children: ReactNode }) {
  const { mode, colorScheme } = useTheme()
  const antdTheme = useMemo(() => buildAntdTheme(mode, colorScheme), [mode, colorScheme])

  return (
    <ConfigProvider theme={antdTheme}>
      {children}
    </ConfigProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <StyleProvider layer>
        <ThemeProvider>
          <AntdThemeWrapper>
            <AuthProvider>
              <App />
            </AuthProvider>
          </AntdThemeWrapper>
        </ThemeProvider>
      </StyleProvider>
    </BrowserRouter>
  </StrictMode>,
)
