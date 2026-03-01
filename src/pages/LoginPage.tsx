import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AuthLayout } from '../components/AuthLayout'

function isUserAdmin(roles?: string[]): boolean {
  return roles?.some((r) => r === 'SUPER_ADMIN' || r === 'ADMIN') ?? false
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const user = await login({ email, password })
      if (isUserAdmin(user.roles)) {
        navigate('/admin/users', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login')
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
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-primary py-2 text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-center text-sm text-text-secondary">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
