<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <nav v-if="auth.isLoggedIn" class="bg-white shadow-sm border-b border-gray-200 shrink-0">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span class="text-orange-500 font-bold text-lg">WanderMatch</span>
        <div class="flex gap-6 text-sm font-medium text-gray-600">
          <RouterLink to="/discover" class="hover:text-orange-500 transition">Discover</RouterLink>
          <RouterLink to="/trips" class="hover:text-orange-500 transition">My Trips</RouterLink>
          <RouterLink to="/interests" class="hover:text-orange-500 transition"
            >Interests</RouterLink
          >
          <RouterLink to="/chat" class="hover:text-orange-500 transition">Chat</RouterLink>
          <RouterLink to="/profile" class="hover:text-orange-500 transition">Profile</RouterLink>
        </div>
        <button
          @click="handleLogout"
          class="text-sm text-red-400 hover:text-red-600 font-medium transition"
        >
          Logout
        </button>
      </div>
    </nav>

    <!-- This fills remaining height and clips overflow -->
    <div class="flex-1 overflow-hidden">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth.store'

const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (auth.token) {
    await auth.fetchCurrentUser()
  }
})

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
