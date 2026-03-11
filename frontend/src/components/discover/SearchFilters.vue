<template>
  <div class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center gap-3 flex-wrap">

        <!-- City -->
        <div class="relative flex-1 min-w-48">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            v-model="filters.city"
            @keydown.enter="handleSearch"
            placeholder="Search city..."
            class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50"
          />
        </div>

        <!-- Country -->
        <input
          v-model="filters.country"
          placeholder="Country (optional)"
          class="w-40 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50"
        />

        <!-- Start date -->
        <div class="border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
          <input
            v-model="filters.startDate"
            type="date"
            class="text-xs text-gray-600 bg-transparent focus:outline-none w-28"
          />
        </div>

        <!-- End date -->
        <div class="border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
          <input
            v-model="filters.endDate"
            type="date"
            class="text-xs text-gray-600 bg-transparent focus:outline-none w-28"
          />
        </div>

        <!-- Travel style -->
        <select
          v-model="filters.travelStyle"
          class="border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">All styles</option>
          <option v-for="style in travelStyles" :key="style" :value="style">
            {{ style.charAt(0).toUpperCase() + style.slice(1) }}
          </option>
        </select>

        <!-- Clear filters -->
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap"
        >
          Clear filters
        </button>

        <!-- Search button -->
        <button
          @click="handleSearch"
          :disabled="!filters.city || discover.loading"
          class="bg-gray-900 hover:bg-gray-700 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition whitespace-nowrap"
        >
          {{ discover.loading ? 'Searching...' : 'Search' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useDiscoverStore } from '../../stores/discover.store'

const discover = useDiscoverStore()

const travelStyles = ['adventurous', 'relaxed', 'cultural', 'budget', 'luxury']

const filters = reactive({
  city: '',
  country: '',
  startDate: '',
  endDate: '',
  travelStyle: '',
})

const hasActiveFilters = computed(() =>
  filters.startDate || filters.endDate || filters.travelStyle
)

function clearFilters() {
  filters.startDate = ''
  filters.endDate = ''
  filters.travelStyle = ''
}

function handleSearch() {
  if (!filters.city) return
  discover.search({ ...filters })
}
</script>