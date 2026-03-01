import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { updateProfile } from '../auth/api'

export function SettingsPage() {
  const { user, refreshUser } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      await updateProfile({ name, phone, birthDate })
      await refreshUser()
      setSuccess('Perfil atualizado com sucesso')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl py-4">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">Configurações</h1>

      <div className="rounded-lg border border-border bg-bg-container p-6">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Perfil</h2>

        <div className="mb-6 space-y-3 rounded border border-border-secondary bg-bg-page p-4">
          <div>
            <span className="text-sm text-text-tertiary">Email</span>
            <p className="text-text-primary">{user?.email}</p>
          </div>
          <div>
            <span className="text-sm text-text-tertiary">Plano</span>
            <p>
              <span className={`inline-block rounded px-2 py-0.5 text-sm font-medium ${
                user?.planName
                  ? 'bg-primary-bg text-primary'
                  : 'bg-bg-spotlight text-text-secondary'
              }`}>
                {user?.planName ?? 'Sem plano'}
              </span>
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded bg-error-bg p-3 text-sm text-error">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded bg-primary-bg p-3 text-sm text-primary">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Nome
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-border bg-bg-container px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Telefone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+5511999999999"
              className="w-full rounded border border-border bg-bg-container px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Data de nascimento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded border border-border bg-bg-container px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-primary px-6 py-2 text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {submitting ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  )
}
