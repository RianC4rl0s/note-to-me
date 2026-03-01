import { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Select, Form, Input, DatePicker, Dropdown, message, Popconfirm } from 'antd'
import { PlusOutlined, MoreOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { UserWithRoles, Role, Plan } from '../types'
import {
  fetchUsers,
  fetchRoles,
  assignUserRoles,
  fetchPlans,
  assignUserPlan,
  createUser,
  toggleUserActive,
  deleteUser,
} from '../api'
import { useAuth } from '../../auth/AuthContext'

type CreateUserForm = {
  name: string
  email: string
  password: string
  phone?: string
  birthDate?: unknown
  roleIds?: number[]
}

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
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createForm] = Form.useForm<CreateUserForm>()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
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

  function openCreateModal() {
    createForm.resetFields()
    setCreateModalOpen(true)
  }

  async function handleCreateUser() {
    try {
      const values = await createForm.validateFields()
      setSaving(true)
      const birthDate = values.birthDate
        ? (values.birthDate as { format: (f: string) => string }).format('YYYY-MM-DD')
        : undefined
      await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
        birthDate,
        roleIds: values.roleIds,
      })
      message.success('Usuário criado')
      setCreateModalOpen(false)
      await loadData()
    } catch {
      if (saving) message.error('Erro ao criar usuário')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(userId: string) {
    try {
      await toggleUserActive(userId)
      message.success('Status atualizado')
      await loadData()
    } catch {
      message.error('Erro ao alterar status do usuário')
    }
  }

  async function handleDelete(userId: string) {
    try {
      await deleteUser(userId)
      message.success('Usuário removido')
      await loadData()
    } catch {
      message.error('Erro ao remover usuário')
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
        <span>
          {record.roles.map((role) => (
            <Tag
              color={role === 'SUPER_ADMIN' || role === 'ADMIN' ? 'red' : 'blue'}
              key={role}
            >
              {role}
            </Tag>
          ))}
        </span>
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
      title: 'Status',
      key: 'active',
      render: (_: unknown, record: UserWithRoles) => (
        record.active !== false
          ? <Tag color="green">Ativo</Tag>
          : <Tag color="red">Inativo</Tag>
      ),
    },
    {
      title: 'Criado em',
      key: 'createdAt',
      render: (_: unknown, record: UserWithRoles) =>
        new Date(record.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Atualizado em',
      key: 'updatedAt',
      render: (_: unknown, record: UserWithRoles) =>
        new Date(record.updatedAt).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: unknown, record: UserWithRoles) => {
        const isTargetAdmin = record.roles.some((r) => r === 'SUPER_ADMIN' || r === 'ADMIN')
        return (
          <Popconfirm
            title="Remover este usuário?"
            open={deleteConfirmId === record.id}
            onConfirm={() => {
              setDeleteConfirmId(null)
              handleDelete(record.id)
            }}
            onCancel={() => setDeleteConfirmId(null)}
          >
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'roles',
                    label: 'Roles',
                    onClick: () => openRoleModal(record),
                  },
                  {
                    key: 'plan',
                    label: 'Plano',
                    onClick: () => openPlanModal(record),
                  },
                  {
                    key: 'toggle-active',
                    label: record.active !== false ? 'Desativar' : 'Ativar',
                    disabled: isTargetAdmin,
                    onClick: () => handleToggleActive(record.id),
                  },
                  {
                    key: 'impersonate',
                    label: 'Representar',
                    disabled: isTargetAdmin,
                    onClick: () => handleImpersonate(record.id),
                  },
                  { type: 'divider' },
                  {
                    key: 'delete',
                    label: 'Remover',
                    danger: true,
                    disabled: isTargetAdmin,
                    onClick: () => setDeleteConfirmId(record.id),
                  },
                ],
              }}
              trigger={['click']}
            >
              <Button size="small" icon={<MoreOutlined />} />
            </Dropdown>
          </Popconfirm>
        )
      },
    },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Gerenciar Usuários</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Novo Usuário
        </Button>
      </div>

      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Novo Usuário"
        open={createModalOpen}
        onOk={handleCreateUser}
        onCancel={() => setCreateModalOpen(false)}
        confirmLoading={saving}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'Nome obrigatório' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email válido obrigatório' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Senha" rules={[{ required: true, min: 8, message: 'Mínimo 8 caracteres' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="phone" label="Telefone">
            <Input />
          </Form.Item>
          <Form.Item name="birthDate" label="Data de nascimento">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="roleIds" label="Roles">
            <Select
              mode="multiple"
              placeholder="Selecione as roles"
              options={roles.map((r) => ({ label: r.name, value: r.id }))}
            />
          </Form.Item>
        </Form>
      </Modal>

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
