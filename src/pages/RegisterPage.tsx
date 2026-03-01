import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerApi } from '../auth/api'
import { AuthLayout } from '../components/AuthLayout'

export function RegisterPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await registerApi({ name, email, password, phone, birthDate })
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no cadastro')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded bg-error-bg p-3 text-sm text-error">
            {error}
          </div>
        )}
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
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-border bg-bg-container px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Senha
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-border bg-bg-container px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Telefone
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded border border-border bg-bg-container px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
            placeholder="+5511999999999"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Data de nascimento
          </label>
          <input
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded border border-border bg-bg-container px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-primary py-2 text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {submitting ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        <p className="text-center text-sm text-text-secondary">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
