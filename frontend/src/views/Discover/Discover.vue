<template>
  <div class="min-h-screen bg-gray-50">
    <SearchFilters />

    <div class="max-w-5xl mx-auto px-6 py-6">

      <!-- Result count -->
      <div v-if="discover.searched && !discover.loading" class="flex items-center justify-between mb-5">
       <p class="text-sm text-gray-500">
  <span class="font-semibold text-gray-800">{{ discover.meta?.total ?? 0 }} travellers</span> found
  <span v-if="discover.meta && discover.meta.totalPages > 1" class="text-gray-400">
    — page {{ discover.meta.page }} of {{ discover.meta.totalPages }}
  </span>
</p>
      </div>

      <!-- Loading skeletons -->
      <div v-if="discover.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="bg-white border border-gray-200 rounded-2xl p-4 animate-pulse">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-gray-200" />
            <div class="flex-1">
              <div class="h-3 bg-gray-200 rounded w-24 mb-1.5" />
              <div class="h-2.5 bg-gray-100 rounded w-16" />
            </div>
          </div>
          <div class="h-2.5 bg-gray-100 rounded w-full mb-2" />
          <div class="h-2.5 bg-gray-100 rounded w-3/4 mb-3" />
          <div class="h-2.5 bg-gray-100 rounded w-1/2" />
        </div>
      </div>

      <!-- Results -->
      <div v-else-if="discover.results.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UserCard
          v-for="user in discover.results"
          :key="user.id"
          :user="user"
          @click="selectedUser = { ...user }"
        />
      </div>

      <!-- No results -->
      <div v-else-if="discover.searched" class="text-center py-20">
        <p class="text-4xl mb-4">🌍</p>
        <p class="text-gray-700 font-semibold mb-1">No travellers found</p>
        <p class="text-sm text-gray-400">Try a different city or remove some filters</p>
      </div>

      <!-- Initial state -->
      <div v-else class="text-center py-20">
        <p class="text-4xl mb-4">✈️</p>
        <p class="text-gray-700 font-semibold mb-1">Find your travel companion</p>
        <p class="text-sm text-gray-400">Search by city to discover solo travellers going to the same place</p>
      </div>
    </div>

    <UserDetailModal :user="selectedUser" @close="selectedUser = null" />
  </div>

  <Pagination
  v-if="discover.meta"
  :meta="discover.meta"
  @change="handlePageChange"
/>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useDiscoverStore, type DiscoverResult } from '../../stores/discover.store'
import SearchFilters from '../../components/discover/SearchFilters.vue'
import UserCard from '../../components/discover/UserCard.vue'
import UserDetailModal from '../../components/discover/UserDetailModal.vue'
import Pagination from '../../components/discover/Pagination.vue'

async function handlePageChange(page: number) {
  await discover.goToPage(page)
  // scroll back to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const discover = useDiscoverStore()
const selectedUser = ref<DiscoverResult | null>(null)

// clear results when leaving the page
onUnmounted(() => discover.reset())
</script>