import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/axios'

export enum TravelStyle {
  ADVENTUROUS = 'adventurous',
  RELAXED = 'relaxed',
  CULTURAL = 'cultural',
  BUDGET = 'budget',
  LUXURY = 'luxury',
}

interface User {
  id: number
  email: string
  name: string
  profilePhoto: string
  age: number
  gender: string
  travelStyle: TravelStyle
  interests: string[]
  nationality: string
  bio: string
  languages: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  async function register(name: string, email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/auth/sign-up', { name, email, password })
      token.value = res.data.token
      localStorage.setItem('token', res.data.token)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/auth/sign-in', { email, password })
      token.value = res.data.token
      localStorage.setItem('token', res.data.token)
      await fetchCurrentUser()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    try {
      const res = await api.get('/users/me')
      user.value = res.data
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, loading, error, isLoggedIn, register, login, logout, fetchCurrentUser }
})
