import { useState, useEffect, useCallback } from 'react'
import type { Page } from '../types'
import {
  fetchPages as apiFetchPages,
  createPage as apiCreatePage,
  updatePage as apiUpdatePage,
  deletePage as apiDeletePage,
} from '../api'

export function usePages(projectId: string) {
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPages = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiFetchPages(projectId)
      setPages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar páginas')
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    loadPages()
  }, [loadPages])

  const addPage = useCallback(async (title: string) => {
    const page = await apiCreatePage(projectId, { title })
    setPages(prev => [...prev, page])
    return page
  }, [projectId])

  const renamePage = useCallback(async (pageId: string, title: string) => {
    const updated = await apiUpdatePage(projectId, pageId, { title })
    setPages(prev => prev.map(p => (p.id === pageId ? updated : p)))
    return updated
  }, [projectId])

  const removePage = useCallback(async (pageId: string) => {
    await apiDeletePage(projectId, pageId)
    setPages(prev => prev.filter(p => p.id !== pageId))
  }, [projectId])

  return {
    pages,
    setPages,
    isLoading,
    error,
    addPage,
    renamePage,
    removePage,
    refresh: loadPages,
  }
}
