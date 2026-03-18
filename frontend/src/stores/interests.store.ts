import api from '@/api/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type InterestStatus = 'accepted' | 'pending' | 'rejected'

export interface InterestUser {
  id: number
  name: string
  bio: string
  travelStyle: string
  profilePhoto: string | null
  interests: string[]
}

export interface Interest {
  id: number
  status: InterestStatus
  createdAt: string
  sender?: InterestUser
  receiver?: InterestUser
  trip?: {
    id: number
    city: string
    country: string
    startDate: string
    endDate: string
  }
}

export const useInterestsStore = defineStore('interests', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const received = ref<Interest[]>([])
  const sent = ref<Interest[]>([])

  async function fetchReceived() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/interests/received')
      received.value = res.data
    } catch (err: any) {
      error.value = err.response?.data?.message ?? 'Failed to load'
    } finally {
      loading.value = false
    }
  }

  async function fetchSent() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/interests/sent')
      sent.value = res.data
    } catch (err: any) {
      error.value = err.response?.data?.message ?? 'Failed to load'
    } finally {
      loading.value = false
    }
  }

  async function respond(interestId: number, status: InterestStatus) {
    error.value = null
    try {
      await api.patch(`/interests/${interestId}/respond`, { status })
      received.value = received.value.map((i) => (i.id === interestId ? { ...i, status } : i))
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load'
    }
  }

  const pendingCount = computed(() => received.value.map((i) => i.status === 'pending').length)

  return { received, sent, loading, error, pendingCount, fetchReceived, fetchSent, respond }
})
