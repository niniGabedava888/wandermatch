<template>
  <div class="bg-white border border-gray-200 rounded-2xl p-4">
    <div class="flex items-start justify-between gap-4">
      <!-- User info -->
      <div class="flex items-center gap-3">
        <div
          v-if="!interest.receiver?.profilePhoto"
          class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shrink-0"
        >
          {{ interest.receiver?.name?.[0]?.toUpperCase() }}
        </div>
        <img
          v-else
          :src="interest.receiver.profilePhoto"
          class="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div>
          <p class="text-sm font-semibold text-gray-800">{{ interest.receiver?.name }}</p>
          <p class="text-xs text-gray-400 capitalize">
            {{ interest.receiver?.travelStyle ?? 'Traveller' }}
          </p>
        </div>
      </div>

      <!-- Status badge -->
      <div class="shrink-0">
        <span
          v-if="interest.status === 'pending'"
          class="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-600 border border-yellow-200"
        >
          <font-awesome-icon icon="hourglass-half" />
          Pending
        </span>

        <RouterLink
          v-else-if="interest.status === 'accepted'"
          :to="`/chat/${interest.id}`"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition"
        >
          <font-awesome-icon icon="check-circle" /> Chat <font-awesome-icon icon="arrow-right" />
        </RouterLink>

        <span
          v-else-if="interest.status === 'rejected'"
          class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-400 border border-gray-200"
        >
          <font-awesome-icon icon="x" /> Not interested
        </span>
      </div>
    </div>
    <div
      v-if="interest.trip"
      class="flex items-center gap-1.5 mt-3 bg-gray-50 rounded-lg px-3 py-2"
    >
      <span class="text-xs">
        <font-awesome-icon icon="map-location-dot" />
      </span>
      <span class="text-xs font-medium text-gray-600">
        {{ interest.trip.city }}, {{ interest.trip.country }}
      </span>
      <span class="text-xs text-gray-300 mx-1">·</span>
      <span class="text-xs text-gray-400">
        {{ interest.trip.startDate }} → {{ interest.trip.endDate }}
      </span>
    </div>

    <!-- Bio snippet -->
    <p
      v-if="interest.receiver?.bio"
      class="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed"
    >
      {{ interest.receiver.bio }}
    </p>

    <!-- Sent date -->
    <p class="text-xs text-gray-300 mt-2">Sent {{ formatDate(interest.createdAt) }}</p>
  </div>
</template>

<script setup lang="ts">
import { type Interest } from '../../stores/interests.store'

defineProps<{ interest: Interest }>()

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
