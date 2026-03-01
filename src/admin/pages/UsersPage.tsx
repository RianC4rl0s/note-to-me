import { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Select, message, Space } from 'antd'
import { LoginOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { UserWithRoles, Role, Plan } from '../types'
import { fetchUsers, fetchRoles, assignUserRoles, fetchPlans, assignUserPlan } from '../api'
import { useAuth } from '../../auth/AuthContext'

export function UsersPage() {
  const [users, setUsers] = useState<UserWithRoles[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null)
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [planUser, setPlanUser] = useState<UserWithRoles | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const { impersonate } = useAuth()
  const navigate = useNavigate()

  async function loadData() {
    setLoading(true)
    try {
      const [usersData, rolesData, plansData] = await Promise.all([
        fetchUsers(),
        fetchRoles(),
        fetchPlans(),
      ])
      setUsers(usersData)
      setRoles(rolesData)
      setPlans(plansData)
    } catch {
      message.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function openRoleModal(user: UserWithRoles) {
    setSelectedUser(user)
    // Map user role names to role IDs from the admin roles list
    const ids = roles
      .filter((r) => user.roles.includes(r.name))
      .map((r) => r.id)
    setSelectedRoleIds(ids)
    setRoleModalOpen(true)
  }

  async function handleAssignRoles() {
    if (!selectedUser) return
    setSaving(true)
    try {
      await assignUserRoles(selectedUser.id, selectedRoleIds)
      message.success('Roles atualizadas')
      setRoleModalOpen(false)
      await loadData()
    } catch {
      message.error('Erro ao atualizar roles')
    } finally {
      setSaving(false)
    }
  }

  function openPlanModal(user: UserWithRoles) {
    setPlanUser(user)
    const currentPlan = plans.find((p) => p.name === user.planName)
    setSelectedPlanId(currentPlan?.id ?? null)
    setPlanModalOpen(true)
  }

  async function handleAssignPlan() {
    if (!planUser || selectedPlanId === null) return
    setSaving(true)
    try {
      await assignUserPlan(planUser.id, selectedPlanId)
      message.success('Plano atualizado')
      setPlanModalOpen(false)
      await loadData()
    } catch {
      message.error('Erro ao atualizar plano')
    } finally {
      setSaving(false)
    }
  }

  async function handleImpersonate(userId: string) {
    try {
      await impersonate(userId)
      navigate('/')
    } catch {
      message.error('Erro ao representar usuário')
    }
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Roles',
      key: 'roles',
      render: (_: unknown, record: UserWithRoles) => (
        <Space size={[0, 4]} wrap>
          {record.roles.map((role) => (
            <Tag
              color={role === 'SUPER_ADMIN' || role === 'ADMIN' ? 'red' : 'blue'}
              key={role}
            >
              {role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Plano',
      key: 'planName',
      render: (_: unknown, record: UserWithRoles) => (
        record.planName ? <Tag color="purple">{record.planName}</Tag> : <span style={{ color: '#999' }}>—</span>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: unknown, record: UserWithRoles) => (
        <Space>
          <Button size="small" onClick={() => openRoleModal(record)}>
            Roles
          </Button>
          <Button size="small" onClick={() => openPlanModal(record)}>
            Plano
          </Button>
          <Button
            size="small"
            icon={<LoginOutlined />}
            onClick={() => handleImpersonate(record.id)}
          >
            Representar
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <h2 style={{ marginBottom: 16 }}>Gerenciar Usuários</h2>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={`Roles de ${selectedUser?.name ?? ''}`}
        open={roleModalOpen}
        onOk={handleAssignRoles}
        onCancel={() => setRoleModalOpen(false)}
        confirmLoading={saving}
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Selecione as roles"
          value={selectedRoleIds}
          onChange={setSelectedRoleIds}
          options={roles.map((r) => ({ label: r.name, value: r.id }))}
        />
      </Modal>

      <Modal
        title={`Plano de ${planUser?.name ?? ''}`}
        open={planModalOpen}
        onOk={handleAssignPlan}
        onCancel={() => setPlanModalOpen(false)}
        confirmLoading={saving}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Selecione um plano"
          value={selectedPlanId}
          onChange={setSelectedPlanId}
          options={plans.map((p) => ({ label: `${p.name} (${p.maxProjects} proj / ${p.maxPagesPerProject} pág)`, value: p.id }))}
        />
      </Modal>
    </>
  )
}
