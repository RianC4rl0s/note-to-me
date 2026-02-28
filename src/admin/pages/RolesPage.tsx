import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Tag, Transfer, message, Space, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { Role, Permission } from '../types'
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  fetchPermissions,
  setRolePermissions,
} from '../api'

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  // CRUD modal
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [form] = Form.useForm<{ name: string; description: string }>()
  const [saving, setSaving] = useState(false)

  // Permissions modal
  const [permModalOpen, setPermModalOpen] = useState(false)
  const [permRole, setPermRole] = useState<Role | null>(null)
  const [targetKeys, setTargetKeys] = useState<string[]>([])

  async function loadData() {
    setLoading(true)
    try {
      const [rolesData, permsData] = await Promise.all([fetchRoles(), fetchPermissions()])
      setRoles(rolesData)
      setPermissions(permsData)
    } catch {
      message.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function openCreate() {
    setEditingRole(null)
    form.resetFields()
    setFormModalOpen(true)
  }

  function openEdit(role: Role) {
    setEditingRole(role)
    form.setFieldsValue({ name: role.name, description: role.description ?? '' })
    setFormModalOpen(true)
  }

  async function handleSave() {
    try {
      const values = await form.validateFields()
      setSaving(true)
      if (editingRole) {
        await updateRole(editingRole.id, values)
        message.success('Role atualizada')
      } else {
        await createRole(values)
        message.success('Role criada')
      }
      setFormModalOpen(false)
      await loadData()
    } catch {
      if (saving) message.error('Erro ao salvar role')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteRole(id)
      message.success('Role removida')
      await loadData()
    } catch {
      message.error('Erro ao remover role')
    }
  }

  function openPermissions(role: Role) {
    setPermRole(role)
    setTargetKeys(role.permissions.map((p) => String(p.id)))
    setPermModalOpen(true)
  }

  async function handleSavePermissions() {
    if (!permRole) return
    setSaving(true)
    try {
      await setRolePermissions(permRole.id, targetKeys.map(Number))
      message.success('Permissões atualizadas')
      setPermModalOpen(false)
      await loadData()
    } catch {
      message.error('Erro ao atualizar permissões')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Permissões',
      key: 'permissions',
      render: (_: unknown, record: Role) => (
        <Space size={[0, 4]} wrap>
          {record.permissions.map((p) => (
            <Tag key={p.id}>{p.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: unknown, record: Role) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>
            Editar
          </Button>
          <Button size="small" onClick={() => openPermissions(record)}>
            Permissões
          </Button>
          <Popconfirm
            title="Remover esta role?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger>
              Remover
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Gerenciar Roles</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Nova Role
        </Button>
      </div>

      <Table
        dataSource={roles}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRole ? 'Editar Role' : 'Nova Role'}
        open={formModalOpen}
        onOk={handleSave}
        onCancel={() => setFormModalOpen(false)}
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'Nome obrigatório' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descrição">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Permissões de ${permRole?.name ?? ''}`}
        open={permModalOpen}
        onOk={handleSavePermissions}
        onCancel={() => setPermModalOpen(false)}
        confirmLoading={saving}
        width={600}
      >
        <Transfer
          dataSource={permissions.map((p) => ({
            key: String(p.id),
            title: p.name,
            description: p.description ?? '',
          }))}
          targetKeys={targetKeys}
          onChange={(keys) => setTargetKeys(keys.map(String))}
          render={(item) => item.title}
          titles={['Disponíveis', 'Atribuídas']}
          listStyle={{ width: 240, height: 300 }}
        />
      </Modal>
    </>
  )
}
