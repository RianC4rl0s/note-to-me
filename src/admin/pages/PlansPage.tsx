import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, Tag, message, Space, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { Plan } from '../types'
import { fetchPlans, createPlan, updatePlan, deletePlan } from '../api'

export function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [form] = Form.useForm<{
    name: string
    description: string
    maxProjects: number
    maxPagesPerProject: number
  }>()
  const [saving, setSaving] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      const data = await fetchPlans()
      setPlans(data)
    } catch {
      message.error('Erro ao carregar planos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function openCreate() {
    setEditingPlan(null)
    form.resetFields()
    setModalOpen(true)
  }

  function openEdit(plan: Plan) {
    setEditingPlan(plan)
    form.setFieldsValue({
      name: plan.name,
      description: plan.description ?? '',
      maxProjects: plan.maxProjects,
      maxPagesPerProject: plan.maxPagesPerProject,
    })
    setModalOpen(true)
  }

  async function handleSave() {
    try {
      const values = await form.validateFields()
      setSaving(true)
      if (editingPlan) {
        await updatePlan(editingPlan.id, values)
        message.success('Plano atualizado')
      } else {
        await createPlan(values)
        message.success('Plano criado')
      }
      setModalOpen(false)
      await loadData()
    } catch {
      if (saving) message.error('Erro ao salvar plano')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletePlan(id)
      message.success('Plano removido')
      await loadData()
    } catch {
      message.error('Erro ao remover plano')
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
      title: 'Max Projetos',
      dataIndex: 'maxProjects',
      key: 'maxProjects',
    },
    {
      title: 'Max Páginas',
      dataIndex: 'maxPagesPerProject',
      key: 'maxPagesPerProject',
    },
    {
      title: 'Built-in',
      key: 'builtIn',
      render: (_: unknown, record: Plan) => (
        <Tag color={record.builtIn ? 'green' : 'default'}>
          {record.builtIn ? 'Sim' : 'Não'}
        </Tag>
      ),
    },
    {
      title: 'Criado em',
      key: 'createdAt',
      render: (_: unknown, record: Plan) =>
        new Date(record.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Atualizado em',
      key: 'updatedAt',
      render: (_: unknown, record: Plan) =>
        new Date(record.updatedAt).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: unknown, record: Plan) => (
        <Space>
          <Button
            size="small"
            onClick={() => openEdit(record)}
            disabled={record.builtIn}
          >
            Editar
          </Button>
          <Popconfirm
            title="Remover este plano?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger disabled={record.builtIn}>
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
        <h2>Gerenciar Planos</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Novo Plano
        </Button>
      </div>

      <Table
        dataSource={plans}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingPlan ? 'Editar Plano' : 'Novo Plano'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Nome obrigatório' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descrição">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="maxProjects"
            label="Máximo de Projetos"
            rules={[{ required: true, message: 'Campo obrigatório' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="maxPagesPerProject"
            label="Máximo de Páginas por Projeto"
            rules={[{ required: true, message: 'Campo obrigatório' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
