<template>
  <div
    @click="emit('click')"
    class="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all mx-2 rounded-xl mb-0.5"
    :style="
      active
        ? 'background: #fff7ed; border-left: 3px solid #f59e0b;'
        : 'background: transparent; border-left: 3px solid transparent;'
    "
  >
    <!-- Avatar -->
    <div class="relative shrink-0">
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold overflow-hidden"
        style="background: linear-gradient(135deg, #f59e0b, #d97706)"
      >
        <img
          v-if="otherUser.profilePhoto"
          :src="otherUser.profilePhoto"
          class="w-full h-full object-cover"
        />
        <span v-else>{{ otherUser.name.charAt(0).toUpperCase() }}</span>
      </div>
      <div
        class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-green-400"
      />
    </div>

    <!-- Text -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between mb-0.5">
        <p
          class="text-sm font-semibold truncate"
          :style="active ? 'color: #d97706' : 'color: #1f2937'"
        >
          {{ otherUser.name }}
        </p>
      </div>
      <p class="text-xs text-gray-400 truncate capitalize">
        {{ otherUser.travelStyle ?? 'Traveller' }}
        <span v-if="chat.trip?.city"> · {{ chat.trip.city }}</span>
      </p>
    </div>

    <!-- Arrow -->
    <span class="text-gray-300 text-lg shrink-0">›</span>
  </div>
</template>

<script setup lang="ts">
import type { Chat, ChatUser } from '@/stores/chat.store'

defineProps<{
  chat: Chat
  otherUser: ChatUser
  active?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>
