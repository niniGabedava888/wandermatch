<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
      <button @click="router.push('/chat')" class="text-gray-400 hover:text-gray-600 transition">
        ←
      </button>
      <div v-if="otherUser" class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0"
        >
          {{ otherUser.name?.[0]?.toUpperCase() }}
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-800">{{ otherUser.name }}</p>
          <p class="text-xs text-gray-400 capitalize">{{ otherUser.travelStyle ?? 'Traveller' }}</p>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
      <!-- Loading -->
      <div v-if="chatStore.loading" class="flex justify-center py-8">
        <p class="text-sm text-gray-400">Loading messages...</p>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="chatStore.messages.length === 0"
        class="flex flex-col items-center justify-center flex-1 py-16"
      >
        <p class="text-3xl mb-3">👋</p>
        <p class="text-sm text-gray-500">Say hello to {{ otherUser?.name }}!</p>
      </div>

      <!-- Message list -->
      <template v-else>
        <div
          v-for="message in chatStore.messages"
          :key="message.id"
          :class="['flex', message.senderId === auth.user?.id ? 'justify-end' : 'justify-start']"
        >
          <div
            :class="[
              'max-w-xs px-4 py-2.5 rounded-2xl text-sm',
              message.senderId === auth.user?.id
                ? 'bg-gray-900 text-white rounded-br-sm'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm',
            ]"
          >
            <p>{{ message.content }}</p>
            <p
              :class="[
                'text-xs mt-1',
                message.senderId === auth.user?.id ? 'text-gray-400' : 'text-gray-300',
              ]"
            >
              {{ formatTime(message.createdAt) }}
            </p>
          </div>
        </div>
      </template>

      <!-- Auto scroll anchor -->
      <div ref="bottomRef" />
    </div>

    <!-- Input -->
    <div class="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Type a message..."
        class="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <button
        @click="sendMessage"
        :disabled="!newMessage.trim()"
        class="w-10 h-10 bg-gray-900 hover:bg-gray-700 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition"
      >
        →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSocket } from '@/composables/useSocket'
import { useAuthStore } from '@/stores/auth.store'
import { useChatStore } from '@/stores/chat.store'
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const chatStore = useChatStore()
const socket = useSocket()
const auth = useAuthStore()
const router = useRouter()

const interestId = ref<number>()
const newMessage = ref('')
const bottomRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  interestId.value = Number(route.params.interestId)
  if (chatStore.chats.length === 0) {
    await chatStore.getMyChats()
  }
  await chatStore.getMessages(interestId.value)
  socket.connect()
  socket.on('newMessage', (message) => {
    chatStore.addMessage(message)
  })
  socket.emit('joinRoom', interestId.value)
})

onUnmounted(() => {
  socket.emit('leaveRoom', interestId.value)
  socket.disconnect()
  chatStore.clearMessages()
})

const otherUser = computed(() => {
  const chat = chatStore.chats.find((c) => c.id === interestId.value)
  if (!chat) return null
  return auth.user?.id === chat.senderId ? chat.receiver : chat.sender
})

function sendMessage() {
  if (!newMessage.value.trim()) return
  const content = newMessage.value.trim()

  const tempMessage = {
    id: Date.now(),
    content,
    senderId: auth.user?.id,
    interestId: interestId.value,
    createdAt: new Date(),
    isTemp: true,
  }

  chatStore.addMessage(tempMessage)

  socket.emit('sendMessage', {
    interestId: interestId.value,
    content,
  })
  newMessage.value = ''
}

watch(
  () => chatStore.messages,
  async () => {
    await nextTick()
    bottomRef.value?.scrollIntoView({ behavior: 'smooth' })
  },
  { deep: true },
)

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
