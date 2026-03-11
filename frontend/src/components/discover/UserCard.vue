<template>
  <div
    @click="$emit('click')"
    class="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md hover:border-gray-300 transition cursor-pointer"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-3">
        <img
          v-if="user.profilePhoto"
          :src="user.profilePhoto"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div
          v-else
          class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0"
        >
          {{ user.name?.[0]?.toUpperCase() }}
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-800">{{ user.name }}</p>
          <p class="text-xs text-gray-400 capitalize">{{ user.travelStyle }}</p>
        </div>
      </div>

      <!-- Interest button -->
      <div @click.stop>
        <button
          v-if="interestStatus === 'accepted'"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-600 border border-green-200"
        >
          ✓ Connected
        </button>
        <button
          v-else-if="interestStatus === 'pending'"
          disabled
          class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
        >
          ✓ Sent
        </button>
        <button
          v-else
          @click="handleInterest"
          :disabled="sending"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition"
        >
          {{ sending ? '...' : '+ Interested' }}
        </button>
      </div>
    </div>

    <!-- Bio -->
    <p class="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{{ user.bio }}</p>

    <!-- Trip info -->
    <div class="flex items-center gap-1.5 mb-3">
      <span class="text-xs">📍</span>
      <span class="text-xs font-medium text-gray-600">{{ user.matchingTrip.city }}, {{ user.matchingTrip.country }}</span>
      <span class="text-xs text-gray-300 mx-1">·</span>
      <span class="text-xs text-gray-400">{{ user.matchingTrip.startDate }} → {{ user.matchingTrip.endDate }}</span>
    </div>

    <!-- Interest tags -->
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="interest in user.interests.slice(0, 3)"
        :key="interest"
        class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize"
      >
        {{ interest }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDiscoverStore, type DiscoverResult } from '../../stores/discover.store';

const props = defineProps<{ user: DiscoverResult }>()
const interestStatus = ref(props.user.interestStatus)

watch(
  () => props.user.interestStatus,
  (newVal) => {
    interestStatus.value = newVal
  }
)
defineEmits(['click'])

const discover = useDiscoverStore()
const sending = ref(false)
const interestError = ref<string | null>(null)
  
async function handleInterest() {
  sending.value = true
  interestError.value = null
  try {
    await discover.sendInterest(props.user.id)
  } catch (err: any) {
    interestError.value = err.message
  } finally {
    sending.value = false
  }
}
</script>