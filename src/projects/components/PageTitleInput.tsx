import { useState, useRef, useEffect, useCallback } from 'react'
import { updatePage } from '../api'

type PageTitleInputProps = {
  projectId: string
  pageId: string
  initialTitle: string
}

const DEBOUNCE_MS = 800

export function PageTitleInput({ projectId, pageId, initialTitle }: PageTitleInputProps) {
  const [title, setTitle] = useState(initialTitle)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setTitle(initialTitle)
  }, [initialTitle])

  const saveTitle = useCallback(
    (value: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(async () => {
        try {
          await updatePage(projectId, pageId, { title: value })
          window.dispatchEvent(
            new CustomEvent('page-title-changed', {
              detail: { pageId, title: value },
            }),
          )
        } catch (err) {
          console.error('Failed to save title:', err)
        }
      }, DEBOUNCE_MS)
    },
    [projectId, pageId],
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <input
      type="text"
      value={title}
      onChange={e => {
        setTitle(e.target.value)
        saveTitle(e.target.value)
      }}
      placeholder="Sem título"
      className="w-full border-none bg-transparent px-4 pt-6 pb-2 text-3xl font-bold text-text-primary outline-none placeholder:text-text-tertiary"
    />
  )
}
