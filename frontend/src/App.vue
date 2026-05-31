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
            >Interests</RouterLink
          >
          <RouterLink to="/chat" class="hover:text-orange-500 transition">Chat</RouterLink>
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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth.store'
import api from './api/axios'

const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  try {
    const res = await api.post('/auth/refresh')
    auth.token = res.data.accessToken
    await auth.fetchCurrentUser()
  } catch {
    // not logged in — router guard handles redirect
  } finally {
    auth.ready = true
  }
})

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>
