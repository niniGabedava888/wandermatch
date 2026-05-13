import { useAuthStore } from '@/stores/auth.store'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const auth = useAuthStore()
    const originalRequest = error.config

    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await api.post('/auth/refresh')
        auth.token = res.data.accessToken
        originalRequest.headers.Authorization = `Bearer ${auth.token}`
        return api(originalRequest)
      } catch {
        await auth.logout()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api
