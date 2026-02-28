import type { ReactNode } from 'react'
import { ThemeToggle } from './ThemeToggle'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-lg bg-bg-container p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-text-primary">
          note-to-me
        </h1>
        {children}
      </div>
    </div>
  )
}
