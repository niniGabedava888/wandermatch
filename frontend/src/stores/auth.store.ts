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
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const ready = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  async function register(name: string, email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/auth/sign-up', { name, email, password })
      token.value = res.data.accessToken
      await fetchCurrentUser()
      ready.value = true
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
      token.value = res.data.accessToken
      await fetchCurrentUser()
      ready.value = true
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
    } catch (err: any) {
      if (err.response?.status === 401) {
        await logout()
      }
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch {}
    token.value = null
    user.value = null
    ready.value = false
  }

  return {
    token,
    user,
    loading,
    error,
    isLoggedIn,
    register,
    login,
    logout,
    fetchCurrentUser,
    ready,
  }
})
