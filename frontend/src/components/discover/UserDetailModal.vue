<template>
  <Teleport to="body">
    <div
      v-if="user"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      @click="$emit('close')"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" @click.stop>
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <img
              v-if="user.profilePhoto"
              :src="user.profilePhoto"
              class="w-14 h-14 rounded-full object-cover"
            />
            <div
              v-else
              class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold shrink-0"
            >
              {{ user.name?.[0]?.toUpperCase() }}
            </div>
            <div>
              <p class="font-semibold text-gray-800">{{ user.name }}</p>
              <p class="text-xs text-gray-400 capitalize">{{ user.travelStyle }} traveller</p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-300 hover:text-gray-500 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <!-- Bio -->
        <p class="text-sm text-gray-600 mb-4 leading-relaxed">{{ user.bio }}</p>

        <!-- Trip -->
        <div class="bg-gray-50 rounded-xl p-3 mb-4">
          <p class="text-xs font-semibold text-gray-500 mb-1">Trip</p>
          <p class="text-sm font-medium text-gray-800">
            <font-awesome-icon icon="location-dot" />
            {{ user.matchingTrip.city }}, {{ user.matchingTrip.country }}
          </p>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ user.matchingTrip.startDate }} → {{ user.matchingTrip.endDate }}
          </p>
        </div>

        <!-- Languages -->
        <div class="mb-4" v-if="user.languages?.length">
          <p class="text-xs font-semibold text-gray-500 mb-2">Languages</p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="lang in user.languages"
              :key="lang"
              class="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full"
              >{{ lang }}</span
            >
          </div>
        </div>

        <!-- Interests -->
        <div class="mb-5">
          <p class="text-xs font-semibold text-gray-500 mb-2">Interests</p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="i in user.interests"
              :key="i"
              class="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize"
              >{{ i }}</span
            >
          </div>
        </div>

        <!-- Action button -->
        <button
          v-if="interestStatus === 'accepted'"
          class="w-full py-2.5 rounded-xl text-sm font-semibold bg-green-50 text-green-600 border border-green-200"
        >
          <font-awesome-icon icon="check-circle" /> Already Connected — Go to Chat
        </button>
        <button
          v-else-if="interestStatus === 'pending'"
          disabled
          class="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          <font-awesome-icon icon="check-circle" /> Interest Sent
        </button>
        <button
          v-else
          @click="handleInterest"
          :disabled="sending"
          class="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition"
        >
          {{ sending ? 'Sending...' : "I'm Interested" }}
        </button>

        <p v-if="error" class="text-red-500 text-xs text-center mt-2">{{ error }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDiscoverStore, type DiscoverResult } from '../../stores/discover.store'

const props = defineProps<{ user: DiscoverResult | null }>()
defineEmits(['close'])

const discover = useDiscoverStore()
const sending = ref(false)
const error = ref<string | null>(null)

const interestStatus = ref(props.user?.interestStatus ?? null)

watch(
  () => props.user?.interestStatus,
  (newVal) => {
    interestStatus.value = newVal ?? null
  },
)

async function handleInterest() {
  if (!props.user) return
  sending.value = true
  try {
    await discover.sendInterest(props.user.id, props.user.matchingTrip.id)
  } catch (err: any) {
    error.value = err.message
  } finally {
    sending.value = false
  }
}
</script>
