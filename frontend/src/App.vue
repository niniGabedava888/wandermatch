<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <nav
      v-if="auth.isLoggedIn && auth.ready"
      class="bg-white shadow-sm border-b border-gray-200 shrink-0"
    >
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <RouterLink to="/discover" class="text-orange-500 font-bold text-lg"
          >WanderMatch</RouterLink
        >
        <div class="flex gap-6 text-sm font-medium text-gray-600">
          <RouterLink to="/discover" class="hover:text-orange-500 transition">Discover</RouterLink>
          <RouterLink to="/trips" class="hover:text-orange-500 transition">My Trips</RouterLink>
          <RouterLink to="/interests" class="hover:text-orange-500 transition"
            >Interests
            <span
              v-if="interestsStore.pendingCount > 0"
              class="ml-1.5 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5"
            >
              {{ interestsStore.pendingCount }}
            </span>
          </RouterLink>
          <RouterLink to="/chat" class="hover:text-orange-500 transition"
            >Chat
            <span
              v-if="chatStore.myChatsCount > 0"
              class="ml-1.5 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5"
            >
              {{ chatStore.myChatsCount }}
            </span>
          </RouterLink>
          <RouterLink to="/profile" class="hover:text-orange-500 transition">Profile</RouterLink>
        </div>
        <div class="flex justify-center w-24 h-8 bg-orange-400 rounded-md">
          <button
            @click="handleLogout"
            class="text-sm text-black hover:text-white font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- This fills remaining height and clips overflow -->
    <div class="flex-1 overflow-auto">
      <RouterView v-if="auth.ready" />
    </div>
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useAuthStore } from './stores/auth.store'
import api from './api/axios'
import { useSocket } from './composables/useSocket'
import { useNotificationStore } from './stores/notification.store'
import NotificationToast from './components/NotificationToast.vue'
import { useRoute } from 'vue-router'
import { useInterestsStore } from './stores/interests.store.ts'
import { useChatStore } from './stores/chat.store.ts'

const auth = useAuthStore()
const socket = useSocket()
const route = useRoute()
const interestsStore = useInterestsStore()
const chatStore = useChatStore()

const notificationStore = useNotificationStore()

onMounted(async () => {
  try {
    const res = await api.post('/auth/refresh')
    auth.token = res.data.accessToken
    await auth.fetchCurrentUser()
    if (auth.isLoggedIn) {
      await setupSocket()
    }
  } catch {
    // not logged in
  } finally {
    auth.ready = true
  }
})

watch(
  () => auth.isLoggedIn,
  async (isLoggedIn) => {
    if (isLoggedIn) {
      await setupSocket()
    } else {
      socket.disconnect()
    }
  },
)

async function handleLogout() {
  socket.disconnect()
  try {
    await auth.logout()
    window.location.href = '/login'
  } catch (err) {
    console.error(err)
  }
}

async function setupSocket() {
  await interestsStore.fetchReceived()
  await chatStore.getMyChats()
  setTimeout(() => {
    if (socket.isConnected()) {
      socket.off('newMessageInChat')
      socket.off('newInterestNotification')
      registerListeners()
      return
    }
    socket.connect()
    registerListeners()
  }, 500)
}

function registerListeners() {
  socket.off('newMessageInChat')
  socket.off('newInterestNotification')

  socket.on('newMessageInChat', (data) => {
    if (route.fullPath !== `/chat/${data.interestId}`) {
      notificationStore.add({
        type: 'message',
        title: data.senderName,
        body: 'Sent you a message',
        link: `/chat/${data.interestId}`,
        profilePhoto: data.profilePhoto ?? null,
      })
    }
  })

  socket.on('newInterestNotification', (data) => {
    interestsStore.received.push({
      id: data.interestId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      sender: {
        id: data.senderId,
        name: data.senderName,
        profilePhoto: data.profilePhoto ?? null,
        bio: data.bio ?? null,
        travelStyle: data.travelStyle ?? null,
        interests: data.interests ?? null,
      },
    })
    if (route.path !== '/interests') {
      notificationStore.add({
        type: 'interest',
        title: data.senderName,
        body: 'Is interested in travelling with you!',
        link: '/interests',
        profilePhoto: data.profilePhoto ?? null,
      })
    }
  })
}
</script>
