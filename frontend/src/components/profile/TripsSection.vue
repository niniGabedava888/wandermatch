<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-800">My Trips</h2>
      <button
        @click="showForm = !showForm"
        class="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition font-medium"
      >
        {{ showForm ? 'Cancel' : '+ Add Trip' }}
      </button>
    </div>

    <!-- Add Trip Form -->
    <div v-if="showForm" class="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50">
      <p class="text-sm font-semibold text-gray-700 mb-4">New Trip</p>
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">City</label>
          <input v-model="form.city" placeholder="e.g. Barcelona" class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Country</label>
          <input v-model="form.country" placeholder="e.g. Spain" class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Start Date</label>
          <input v-model="form.startDate" type="date" class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">End Date</label>
          <input v-model="form.endDate" type="date" class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-xs font-medium text-gray-600 mb-1.5">Description (optional)</label>
        <input v-model="form.description" placeholder="What are you planning?" class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
      </div>
      <div v-if="formError" class="text-red-500 text-xs mb-3">{{ formError }}</div>
      <button @click="addTrip" :disabled="adding" class="bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition">
        {{ adding ? 'Adding...' : 'Add Trip' }}
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="trips.length === 0 && !loading" class="text-center py-12 text-gray-400">
      <p class="text-4xl mb-3">✈️</p>
      <p class="text-sm">No trips yet. Add your first trip!</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8 text-gray-400 text-sm">Loading trips...</div>

    <!-- Trip list -->
    <div class="flex flex-col gap-3">
      <div
        v-for="trip in trips"
        :key="trip.id"
        class="border border-gray-200 rounded-xl p-4 flex items-start justify-between hover:border-gray-300 transition"
      >
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm font-semibold text-gray-800">{{ trip.city }}, {{ trip.country }}</span>
            <span class="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Upcoming</span>
          </div>
          <p class="text-xs text-gray-400 mb-1">{{ trip.startDate }} → {{ trip.endDate }}</p>
          <p v-if="trip.description" class="text-xs text-gray-500">{{ trip.description }}</p>
        </div>
        <button @click="deleteTrip(trip.id)" class="text-gray-300 hover:text-red-400 transition text-lg leading-none ml-4">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../api/axios'

interface Trip {
  id: number
  city: string
  country: string
  startDate: string
  endDate: string
  description?: string
}

const trips = ref<Trip[]>([])
const loading = ref(false)
const adding = ref(false)
const showForm = ref(false)
const formError = ref<string | null>(null)

const form = ref({ city: '', country: '', startDate: '', endDate: '', description: '' })

onMounted(async () => {
  loading.value = true
  try {
    const res = await api.get('/trips/my')
    trips.value = res.data
  } finally {
    loading.value = false
  }
})

async function addTrip() {
  formError.value = null
  if (!form.value.city || !form.value.country || !form.value.startDate || !form.value.endDate) {
    formError.value = 'Please fill in all required fields'
    return
  }
  adding.value = true
  try {
    const res = await api.post('/trips', form.value)
    trips.value.push(res.data)
    form.value = { city: '', country: '', startDate: '', endDate: '', description: '' }
    showForm.value = false
  } catch (err: any) {
    formError.value = err.response?.data?.message || 'Failed to add trip'
  } finally {
    adding.value = false
  }
}

async function deleteTrip(id: number) {
  try {
    await api.delete(`/trips/${id}`)
    trips.value = trips.value.filter(t => t.id !== id)
  } catch {
    // silently fail or show toast later
  }
}
</script>