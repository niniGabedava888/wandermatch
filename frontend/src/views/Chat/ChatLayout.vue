<template>
  <div class="flex h-full overflow-hidden bg-white">
    <!-- Sidebar -->
    <div class="w-72 flex flex-col shrink-0 border-r border-gray-200" style="background: #fafafa">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-gray-200">
        <h2 class="text-base font-bold text-gray-800">Messages</h2>
      </div>

      <!-- Loading skeletons -->
      <div v-if="chatStore.loading" class="flex flex-col gap-1 p-3">
        <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-3 rounded-xl animate-pulse">
          <div class="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
          <div class="flex-1">
            <div class="h-3 bg-gray-200 rounded w-24 mb-2" />
            <div class="h-2.5 bg-gray-100 rounded w-32" />
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="chatStore.chats.length === 0" class="text-center py-12 px-4">
        <p class="text-2xl mb-2">💬</p>
        <p class="text-xs text-gray-400 mb-2">No conversations yet</p>
        <RouterLink to="/interests" class="text-xs font-medium" style="color: #d97706">
          Check interests →
        </RouterLink>
      </div>

      <!-- Chat list -->
      <div v-else class="flex-1 overflow-y-auto py-2">
        <ChatCard
          v-for="chat in chatStore.chats"
          :key="chat.id"
          :chat="chat"
          :otherUser="getOtherUser(chat)"
          :active="activeInterestId === chat.id"
          @click="openChat(chat.id)"
        />
      </div>
    </div>

    <!-- Right panel -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- No chat selected -->
      <div
        v-if="!activeInterestId"
        class="flex-1 flex flex-col items-center justify-center"
        style="background: #fafafa"
      >
        <p class="text-4xl mb-3">✈️</p>
        <p class="text-gray-700 font-semibold mb-1">Select a conversation</p>
        <p class="text-sm text-gray-400">Choose a chat from the left to start messaging</p>
      </div>

      <!-- Chat window -->
      <RouterView v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChatStore, type Chat } from '@/stores/chat.store'
import { useAuthStore } from '@/stores/auth.store'
import ChatCard from '@/components/chat/ChatCard.vue'

const chatStore = useChatStore()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const activeInterestId = computed(() =>
  route.params.interestId ? Number(route.params.interestId) : null,
)

onMounted(async () => {
  await chatStore.getMyChats()
})

function getOtherUser(chat: Chat) {
  return auth.user?.id === chat.senderId ? chat.receiver : chat.sender
}

function openChat(chatId: number) {
  router.push(`/chat/${chatId}`)
}
</script>
