import { useState, useEffect, useCallback } from 'react'
import type { Project } from '../types'
import {
  fetchProjects as apiFetchProjects,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
} from '../api'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiFetchProjects()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const addProject = useCallback(async (name: string) => {
    const project = await apiCreateProject({ name })
    setProjects(prev => [...prev, project])
    return project
  }, [])

  const renameProject = useCallback(async (id: string, name: string) => {
    const updated = await apiUpdateProject(id, { name })
    setProjects(prev => prev.map(p => (p.id === id ? updated : p)))
    return updated
  }, [])

  const removeProject = useCallback(async (id: string) => {
    await apiDeleteProject(id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  return {
    projects,
    isLoading,
    error,
    addProject,
    renameProject,
    removeProject,
    refresh: loadProjects,
  }
}
