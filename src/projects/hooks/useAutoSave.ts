import { useRef, useCallback, useEffect, useState } from 'react'
import { updatePage } from '../api'

const DEBOUNCE_MS = 1000

export function useAutoSave(projectId: string, pageId: string) {
  const [isSaving, setIsSaving] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingDataRef = useRef<string | null>(null)
  const projectIdRef = useRef(projectId)
  const pageIdRef = useRef(pageId)

  projectIdRef.current = projectId
  pageIdRef.current = pageId

  const flush = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (pendingDataRef.current !== null) {
      const data = pendingDataRef.current
      pendingDataRef.current = null
      setIsSaving(true)
      try {
        await updatePage(projectIdRef.current, pageIdRef.current, { pageData: data })
      } catch (err) {
        console.error('Auto-save failed:', err)
      } finally {
        setIsSaving(false)
      }
    }
  }, [])

  const save = useCallback((pageData: string) => {
    pendingDataRef.current = pageData
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      flush()
    }, DEBOUNCE_MS)
  }, [flush])

  useEffect(() => {
    return () => { flush() }
  }, [flush])

  return { save, isSaving }
}
