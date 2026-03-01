import type { ReactNode } from 'react'
import { FiEdit3 } from 'react-icons/fi'
import { ThemeToggle } from './ThemeToggle'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-lg bg-bg-container p-8 shadow-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <FiEdit3 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Note To Me
          </h1>
        </div>
        {children}
      </div>
    </div>
  )
}
