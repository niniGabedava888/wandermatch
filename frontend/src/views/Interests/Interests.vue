<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-6 py-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Interests</h1>

      <!-- Tabs -->
      <div class="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        <button
          @click="activeTab = 'received'"
          :class="[
            'px-5 py-2 rounded-lg text-sm font-medium transition',
            activeTab === 'received'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Received
          <span
            v-if="store.pendingCount > 0"
            class="ml-1.5 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5"
          >
            {{ store.pendingCount }}
          </span>
        </button>
        <button
          @click="activeTab = 'sent'"
          :class="[
            'px-5 py-2 rounded-lg text-sm font-medium transition',
            activeTab === 'sent'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Sent
        </button>
      </div>

      <!-- Loading -->
      <div v-if="store.loading" class="flex flex-col gap-3">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-gray-200" />
            <div class="flex-1">
              <div class="h-3 bg-gray-200 rounded w-32 mb-2" />
              <div class="h-2.5 bg-gray-100 rounded w-20" />
            </div>
          </div>
          <div class="h-8 bg-gray-100 rounded-lg" />
        </div>
      </div>

      <!-- Received Tab -->
      <div v-else-if="activeTab === 'received'">
        <div v-if="store.received.length === 0" class="text-center py-16">
          <p class="text-4xl mb-3">💌</p>
          <p class="text-gray-700 font-semibold mb-1">No interests yet</p>
          <p class="text-sm text-gray-400">
            When someone is interested in travelling with you, they'll appear here
          </p>
        </div>
        <div v-else class="flex flex-col gap-3">
          <ReceivedCard
            v-for="interest in store.received"
            :key="interest.id"
            :interest="interest"
          />
        </div>
      </div>

      <!-- Sent Tab -->
      <div v-else-if="activeTab === 'sent'">
        <div v-if="store.sent.length === 0" class="text-center py-16">
          <p class="text-4xl mb-3">✈️</p>
          <p class="text-gray-700 font-semibold mb-1">No interests sent yet</p>
          <p class="text-sm text-gray-400">Go to Discover to find your travel companion</p>
          <RouterLink
            to="/discover"
            class="inline-block mt-4 text-sm text-blue-600 font-medium hover:underline"
          >
            Go to Discover →
          </RouterLink>
        </div>
        <div v-else class="flex flex-col gap-3">
          <SentCard v-for="interest in store.sent" :key="interest.id" :interest="interest" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInterestsStore } from '../../stores/interests.store'
import ReceivedCard from '../../components/interests/ReceivedCard.vue'
import SentCard from '../../components/interests/SentCard.vue'

const store = useInterestsStore()
const activeTab = ref<'received' | 'sent'>('received')

onMounted(async () => {
  await Promise.all([store.fetchReceived(), store.fetchSent()])
})
</script>
