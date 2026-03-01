export type Project = {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export type Page = {
  id: string
  projectId: string
  title: string
  pageData: string
  position: number
  createdAt: string
  updatedAt: string
}

export type CreateProjectRequest = {
  name: string
  description?: string
}

export type UpdateProjectRequest = {
  name?: string
  description?: string
}

export type CreatePageRequest = {
  title: string
  pageData?: string
  position?: number
}

export type UpdatePageRequest = {
  title?: string
  pageData?: string
  position?: number
}

export type PaginatedResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
