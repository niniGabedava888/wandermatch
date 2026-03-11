import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

export interface DiscoverResult {
  id: number
  name: string
  bio: string
  travelStyle: string
  interests: string[]
  languages: string[]
  profilePhoto: string | null
  matchingTrip: {
    city: string
    country: string
    startDate: string
    endDate: string
  }
  interestStatus: 'pending' | 'accepted' | 'rejected' | null
}

export interface SearchFilters {
  city: string
  country?: string
  startDate?: string
  endDate?: string
  travelStyle?: string
}

interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export const useDiscoverStore = defineStore('discover', () => {
  const results = ref<DiscoverResult[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searched = ref(false)
  const meta = ref<PaginationMeta | null>(null)
  const currentFilters = ref<SearchFilters>({} as SearchFilters)

  async function search(filters: SearchFilters, page = 1) {
    loading.value = true
    error.value = null
    currentFilters.value = filters
    try {
      const params = {
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '' && v !== undefined)
        ),
        page,
        limit: 12,
      }
      const res = await api.get('/discover', { params })
      results.value = res.data.data
      meta.value = res.data.meta
      searched.value = true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Search failed'
    } finally {
      loading.value = false
    }
  }

  async function goToPage(page: number) {
    await search(currentFilters.value, page)
  }

  async function sendInterest(receiverId: number) {
    try {
      await api.post('/interests', { receiverId })
      results.value = results.value.map(r =>
        r.id === receiverId ? { ...r, interestStatus: 'pending' as const } : r
      )
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to send interest')
    }
  }

  function reset() {
    results.value = []
    searched.value = false
    error.value = null
    meta.value = null
  }

  return { results, loading, error, searched, meta, search, goToPage, sendInterest, reset }
})