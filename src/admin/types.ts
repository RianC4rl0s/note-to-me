export type Permission = {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export type Role = {
  id: number
  name: string
  description?: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

export type UserWithRoles = {
  id: string
  name: string
  email: string
  phone?: string
  birthDate?: string
  roles: string[]
  planName?: string
  active?: boolean
  createdAt: string
  updatedAt: string
}

export type CreateUserRequest = {
  name: string
  email: string
  password: string
  phone?: string
  birthDate?: string
  roleIds?: number[]
}

export type Plan = {
  id: number
  name: string
  description?: string
  maxProjects: number
  maxPagesPerProject: number
  builtIn: boolean
  createdAt: string
  updatedAt: string
}

export type CreatePlanRequest = {
  name: string
  description?: string
  maxProjects: number
  maxPagesPerProject: number
}

export type UpdatePlanRequest = Partial<CreatePlanRequest>

export type PageResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
