export type Permission = {
  id: number
  name: string
  description?: string
}

export type Role = {
  id: number
  name: string
  description?: string
  permissions: Permission[]
}

export type UserWithRoles = {
  id: string
  name: string
  email: string
  phone?: string
  birthDate?: string
  roles: string[]
}

export type PageResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
