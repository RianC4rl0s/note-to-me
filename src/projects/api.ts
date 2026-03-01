import api from '../lib/axios'
import type {
  Project,
  Page,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreatePageRequest,
  UpdatePageRequest,
  PaginatedResponse,
} from './types'

// ---- Projects ----

export async function fetchProjects(): Promise<Project[]> {
  const res = await api.get<PaginatedResponse<Project>>('/api/projects')
  return res.data.content
}

export async function fetchProject(projectId: string): Promise<Project> {
  const res = await api.get<Project>(`/api/projects/${projectId}`)
  return res.data
}

export async function createProject(data: CreateProjectRequest): Promise<Project> {
  const res = await api.post<Project>('/api/projects', data)
  return res.data
}

export async function updateProject(projectId: string, data: UpdateProjectRequest): Promise<Project> {
  const res = await api.put<Project>(`/api/projects/${projectId}`, data)
  return res.data
}

export async function deleteProject(projectId: string): Promise<void> {
  await api.delete(`/api/projects/${projectId}`)
}

// ---- Pages ----

export async function fetchPages(projectId: string): Promise<Page[]> {
  const res = await api.get<Page[]>(`/api/projects/${projectId}/pages`)
  return res.data
}

export async function fetchPage(projectId: string, pageId: string): Promise<Page> {
  const res = await api.get<Page>(`/api/projects/${projectId}/pages/${pageId}`)
  return res.data
}

export async function createPage(projectId: string, data: CreatePageRequest): Promise<Page> {
  const res = await api.post<Page>(`/api/projects/${projectId}/pages`, data)
  return res.data
}

export async function updatePage(projectId: string, pageId: string, data: UpdatePageRequest): Promise<Page> {
  const res = await api.put<Page>(`/api/projects/${projectId}/pages/${pageId}`, data)
  return res.data
}

export async function deletePage(projectId: string, pageId: string): Promise<void> {
  await api.delete(`/api/projects/${projectId}/pages/${pageId}`)
}
