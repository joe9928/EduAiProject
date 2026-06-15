// src/lib/api/client.ts
import axios from 'axios'
import { useAuthStore }  from '@/store/auth.store'
import { IS_DEV_MODE }   from '@/mocks/devUser'

const api = axios.create({
  baseURL:         process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor ──────────────────────────────
api.interceptors.request.use((config) => {
  // Dev mode: no real token to attach — skip silently
  if (IS_DEV_MODE) return config

  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor ─────────────────────────────
let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject:  (err: unknown)  => void
}> = []

const processQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  pendingQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Dev mode: no refresh logic needed
    if (IS_DEV_MODE) return Promise.reject(error)

    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    originalRequest._retry = true
    isRefreshing           = true

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/auth/refresh`,
        {},
        { withCredentials: true }
      )

      const newToken = data.data.accessToken
      const user     = useAuthStore.getState().user

      useAuthStore.getState().setAuth(user!, newToken)
      processQueue(null, newToken)

      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return api(originalRequest)

    } catch (refreshError) {
      processQueue(refreshError, null)
      useAuthStore.getState().clearAuth()
      return Promise.reject(refreshError)

    } finally {
      isRefreshing = false
    }
  }
)

export default api;