<template>
  <div
    :class="[
      'bg-white border rounded-2xl p-4 transition',
      interest.status === 'rejected' ? 'opacity-50 border-gray-100' : 'border-gray-200',
    ]"
  >
    <div class="flex items-start justify-between gap-4">
      <!-- User info -->
      <div class="flex items-center gap-3">
        <div
          v-if="!interest.sender?.profilePhoto"
          class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0"
        >
          {{ interest.sender?.name?.[0]?.toUpperCase() }}
        </div>
        <img
          v-else
          :src="interest.sender.profilePhoto"
          class="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div>
          <p class="text-sm font-semibold text-gray-800">{{ interest.sender?.name }}</p>
          <p class="text-xs text-gray-400 capitalize">
            {{ interest.sender?.travelStyle ?? 'Traveller' }}
          </p>
        </div>
      </div>

      <!-- add this below the user info, above bio -->
      <div
        v-if="interest.trip"
        class="flex items-center gap-1.5 mt-3 bg-gray-50 rounded-lg px-3 py-2"
      >
        <span class="text-xs">📍</span>
        <span class="text-xs font-medium text-gray-600">
          {{ interest.trip.city }}, {{ interest.trip.country }}
        </span>
        <span class="text-xs text-gray-300 mx-1">·</span>
        <span class="text-xs text-gray-400">
          {{ interest.trip.startDate }} → {{ interest.trip.endDate }}
        </span>
      </div>

      <!-- Status / Actions -->
      <div class="shrink-0">
        <!-- Pending — show accept/reject -->
        <div v-if="interest.status === 'pending'" class="flex gap-2">
          <button
            @click="handleRespond('rejected')"
            :disabled="responding"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 disabled:opacity-50 transition"
          >
            ✕ Reject
          </button>
          <button
            @click="handleRespond('accepted')"
            :disabled="responding"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition"
          >
            {{ responding ? '...' : '✓ Accept' }}
          </button>
        </div>

        <!-- Accepted — go to chat -->
        <RouterLink
          v-else-if="interest.status === 'accepted'"
          :to="`/chat/${interest.id}`"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition"
        >
          Chat →
        </RouterLink>

        <!-- Rejected -->
        <span v-else-if="interest.status === 'rejected'" class="text-xs text-gray-400 font-medium">
          Rejected
        </span>
      </div>
    </div>

    <!-- Bio snippet -->
    <p v-if="interest.sender?.bio" class="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">
      {{ interest.sender.bio }}
    </p>

    <!-- Interests tags -->
    <div v-if="interest.sender?.interests?.length" class="flex flex-wrap gap-1.5 mt-3">
      <span
        v-for="tag in interest.sender.interests.slice(0, 3)"
        :key="tag"
        class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-red-500 text-xs mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInterestsStore, type Interest } from '../../stores/interests.store'

const props = defineProps<{ interest: Interest }>()
const store = useInterestsStore()

const responding = ref(false)
const error = ref<string | null>(null)

async function handleRespond(status: 'accepted' | 'rejected') {
  responding.value = true
  error.value = null
  try {
    await store.respond(props.interest.id, status)
  } catch (err: any) {
    error.value = err.message
  } finally {
    responding.value = false
  }
}
</script>
