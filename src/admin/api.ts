import type { Role, Permission, UserWithRoles, PageResponse, Plan, CreatePlanRequest, UpdatePlanRequest } from './types'
import type { AuthTokens } from '../auth/types'
import api from '../lib/axios'

// Users
export async function fetchUsers(): Promise<UserWithRoles[]> {
  const res = await api.get<PageResponse<UserWithRoles>>('/api/users')
  return res.data.content
}

// Roles CRUD
export async function fetchRoles(): Promise<Role[]> {
  const res = await api.get<Role[]>('/api/admin/roles')
  return res.data
}

export async function createRole(data: { name: string; description?: string }): Promise<Role> {
  const res = await api.post<Role>('/api/admin/roles', data)
  return res.data
}

export async function updateRole(id: number, data: { name: string; description?: string }): Promise<Role> {
  const res = await api.put<Role>(`/api/admin/roles/${id}`, data)
  return res.data
}

export async function deleteRole(id: number): Promise<void> {
  await api.delete(`/api/admin/roles/${id}`)
}

export async function setRolePermissions(roleId: number, permissionIds: number[]): Promise<void> {
  await api.put(`/api/admin/roles/${roleId}/permissions`, { permissionIds })
}

// Permissions CRUD
export async function fetchPermissions(): Promise<Permission[]> {
  const res = await api.get<Permission[]>('/api/admin/permissions')
  return res.data
}

export async function createPermission(data: { name: string; description?: string }): Promise<Permission> {
  const res = await api.post<Permission>('/api/admin/permissions', data)
  return res.data
}

export async function updatePermission(id: number, data: { name: string; description?: string }): Promise<Permission> {
  const res = await api.put<Permission>(`/api/admin/permissions/${id}`, data)
  return res.data
}

export async function deletePermission(id: number): Promise<void> {
  await api.delete(`/api/admin/permissions/${id}`)
}

// User role assignment
export async function assignUserRoles(userId: string, roleIds: number[]): Promise<void> {
  await api.put(`/api/admin/users/${userId}/roles`, { roleIds })
}

// Plans CRUD
export async function fetchPlans(): Promise<Plan[]> {
  const res = await api.get<Plan[]>('/api/admin/plans')
  return res.data
}

export async function createPlan(data: CreatePlanRequest): Promise<Plan> {
  const res = await api.post<Plan>('/api/admin/plans', data)
  return res.data
}

export async function updatePlan(id: number, data: UpdatePlanRequest): Promise<Plan> {
  const res = await api.put<Plan>(`/api/admin/plans/${id}`, data)
  return res.data
}

export async function deletePlan(id: number): Promise<void> {
  await api.delete(`/api/admin/plans/${id}`)
}

export async function assignUserPlan(userId: string, planId: number): Promise<void> {
  await api.put(`/api/admin/users/${userId}/plan`, { planId })
}

// Impersonation
export async function impersonateUser(targetUserId: string): Promise<AuthTokens> {
  const res = await api.post<AuthTokens>('/api/admin/impersonate', { targetUserId })
  return res.data
}
