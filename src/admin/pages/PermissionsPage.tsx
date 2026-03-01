import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { Permission } from '../types'
import { fetchPermissions, createPermission, updatePermission, deletePermission } from '../api'

export function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPerm, setEditingPerm] = useState<Permission | null>(null)
  const [form] = Form.useForm<{ name: string; description: string }>()
  const [saving, setSaving] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      const data = await fetchPermissions()
      setPermissions(data)
    } catch {
      message.error('Erro ao carregar permissões')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function openCreate() {
    setEditingPerm(null)
    form.resetFields()
    setModalOpen(true)
  }

  function openEdit(perm: Permission) {
    setEditingPerm(perm)
    form.setFieldsValue({ name: perm.name, description: perm.description ?? '' })
    setModalOpen(true)
  }

  async function handleSave() {
    try {
      const values = await form.validateFields()
      setSaving(true)
      if (editingPerm) {
        await updatePermission(editingPerm.id, values)
        message.success('Permissão atualizada')
      } else {
        await createPermission(values)
        message.success('Permissão criada')
      }
      setModalOpen(false)
      await loadData()
    } catch {
      if (saving) message.error('Erro ao salvar permissão')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletePermission(id)
      message.success('Permissão removida')
      await loadData()
    } catch {
      message.error('Erro ao remover permissão')
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
      title: 'Criado em',
      key: 'createdAt',
      render: (_: unknown, record: Permission) =>
        new Date(record.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Atualizado em',
      key: 'updatedAt',
      render: (_: unknown, record: Permission) =>
        new Date(record.updatedAt).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: unknown, record: Permission) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>
            Editar
          </Button>
          <Popconfirm
            title="Remover esta permissão?"
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
        <h2>Gerenciar Permissões</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Nova Permissão
        </Button>
      </div>

      <Table
        dataSource={permissions}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingPerm ? 'Editar Permissão' : 'Nova Permissão'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
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
    </>
  )
}
