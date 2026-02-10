import { useState } from 'react'
import type { Command } from './commands'

export function useCommandMenu() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)

  return {
    open,
    setOpen,
    query,
    setQuery,
    index,
    setIndex,
  }
}
