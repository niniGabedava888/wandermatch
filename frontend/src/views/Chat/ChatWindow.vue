<template>
  <div class="flex flex-col h-full bg-white">
    <!-- Header -->
    <div class="px-6 py-3 flex items-center gap-3 shrink-0 border-b border-gray-200 bg-white">
      <div class="relative shrink-0">
        <div
          class="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold overflow-hidden"
          style="background: linear-gradient(135deg, #f59e0b, #d97706)"
        >
          <img
            v-if="otherUser?.profilePhoto"
            :src="otherUser.profilePhoto"
            class="w-full h-full object-cover"
          />
          <span v-else>{{ otherUser?.name?.[0]?.toUpperCase() }}</span>
        </div>
        <div
          class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-green-400"
        />
      </div>
      <div v-if="otherUser">
        <p class="text-sm font-semibold text-gray-800">{{ otherUser.name }}</p>
        <p class="text-xs text-gray-400 capitalize">{{ otherUser.travelStyle ?? 'Traveller' }}</p>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3" style="background: #fafafa">
      <div v-if="chatStore.loading" class="flex justify-center py-8">
        <p class="text-sm text-gray-400">Loading messages...</p>
      </div>

      <div
        v-else-if="chatStore.messages.length === 0"
        class="flex flex-col items-center justify-center h-full"
      >
        <p class="text-4xl mb-3">👋</p>
        <p class="text-sm font-medium text-gray-600">Say hello to {{ otherUser?.name }}!</p>
        <p class="text-xs text-gray-400 mt-1">Start the conversation</p>
      </div>

      <template v-else>
        <div
          v-for="message in chatStore.messages"
          :key="message.id"
          class="flex items-end gap-2"
          :class="message.senderId === auth.user?.id ? 'justify-end' : 'justify-start'"
        >
          <!-- Other user avatar -->
          <div
            v-if="message.senderId !== auth.user?.id"
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style="background: linear-gradient(135deg, #f59e0b, #d97706)"
          >
            {{ otherUser?.name?.[0]?.toUpperCase() }}
          </div>

          <!-- Bubble -->
          <div
            class="max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm"
            :style="
              message.senderId === auth.user?.id
                ? 'background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border-bottom-right-radius: 4px;'
                : 'background: white; color: #1f2937; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);'
            "
          >
            <p class="leading-relaxed">{{ message.content }}</p>
            <p
              class="text-xs mt-1"
              :style="
                message.senderId === auth.user?.id
                  ? 'color: rgba(255,255,255,0.6)'
                  : 'color: #9ca3af'
              "
            >
              {{ formatTime(message.createdAt) }}
            </p>
          </div>
        </div>
      </template>

      <div ref="bottomRef" />
    </div>

    <!-- Input -->
    <div class="px-6 py-3 flex items-center gap-3 shrink-0 border-t border-gray-200 bg-white">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Type a message..."
        class="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2"
        style="--tw-ring-color: #f59e0b"
      />
      <button
        @click="sendMessage"
        :disabled="!newMessage.trim()"
        class="w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 text-white disabled:opacity-40"
        style="background: linear-gradient(135deg, #f59e0b, #d97706)"
      >
        →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chat.store'
import { useAuthStore } from '@/stores/auth.store'
import { useSocket } from '@/composables/useSocket'

const route = useRoute()
const chatStore = useChatStore()
const auth = useAuthStore()
const socket = useSocket()

const interestId = ref<number>()
const newMessage = ref('')
const bottomRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  interestId.value = Number(route.params.interestId)
  if (chatStore.chats.length === 0) await chatStore.getMyChats()
  await chatStore.getMessages(interestId.value)
  socket.connect()
  socket.on('newMessage', (message) => chatStore.addMessage(message))
  socket.emit('joinRoom', { interestId: interestId.value })
})

onUnmounted(() => {
  socket.emit('leaveRoom', { interestId: interestId.value })
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
  if (!auth.user) return

  const content = newMessage.value.trim()
  chatStore.addMessage({
    id: Date.now(),
    content,
    senderId: auth.user.id,
    interestId: interestId.value!,
    createdAt: new Date(),
    isTemp: true,
  })
  socket.emit('sendMessage', { interestId: interestId.value, content })
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
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
</script>
