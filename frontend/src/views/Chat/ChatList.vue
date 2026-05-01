<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-2xl mx-auto px-6 py-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Messages</h1>

      <!-- Loading -->
      <div v-if="chatStore.loading" class="flex flex-col gap-2">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse flex items-center gap-3"
        >
          <div class="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
          <div class="flex-1">
            <div class="h-3 bg-gray-200 rounded w-32 mb-2" />
            <div class="h-2.5 bg-gray-100 rounded w-20" />
          </div>
        </div>
      </div>

      <!-- Chat list -->
      <div v-else-if="chatStore.chats.length > 0" class="flex flex-col gap-2">
        <ChatCard
          v-for="chat in chatStore.chats"
          :key="chat.id"
          :chat="chat"
          :otherUser="getOtherUser(chat)"
          @click="openChat(chat.id)"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20">
        <p class="text-4xl mb-4">💬</p>
        <p class="text-gray-700 font-semibold mb-1">No conversations yet</p>
        <p class="text-sm text-gray-400 mb-6">Accept an interest to start chatting</p>
        <RouterLink
          to="/discover"
          class="inline-block bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-700 transition"
        >
          Go to Discover
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore, type Chat } from '@/stores/chat.store'
import { useAuthStore } from '@/stores/auth.store'
import ChatCard from '@/components/chat/ChatCard.vue'

const chatStore = useChatStore()
const auth = useAuthStore()
const router = useRouter()

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
