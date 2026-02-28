import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth_tokens')
  if (raw) {
    try {
      const tokens = JSON.parse(raw) as { accessToken: string }
      config.headers.Authorization = `Bearer ${tokens.accessToken}`
    } catch {
      // ignore malformed data
    }
  }
  return config
})

// Response interceptor — refresh on 401
let refreshPromise: Promise<string | null> | null = null

const AUTH_PATHS = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh']

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const requestUrl = originalRequest?.url ?? ''

    // Never intercept auth endpoints — let errors propagate to the caller
    if (AUTH_PATHS.some((p) => requestUrl.includes(p))) {
      return Promise.reject(error)
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const newAccessToken = await tryRefresh()
    if (!newAccessToken) {
      localStorage.removeItem('auth_tokens')
      return Promise.reject(error)
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
    return api(originalRequest)
  },
)

async function tryRefresh(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const raw = localStorage.getItem('auth_tokens')
    if (!raw) return null

    try {
      const tokens = JSON.parse(raw) as { refreshToken: string }
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
        { refreshToken: tokens.refreshToken },
      )
      const newTokens = res.data
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens))
      return newTokens.accessToken as string
    } catch {
      localStorage.removeItem('auth_tokens')
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export default api
