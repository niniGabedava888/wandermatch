<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex" style="height: 580px">

      <!-- Left: Form -->
      <div class="flex flex-col justify-center w-full md:w-1/2 px-8 py-10 overflow-y-auto">
        <div class="max-w-sm mx-auto w-full">

          <!-- Tabs -->
          <div class="flex gap-4 mb-8 border-b border-gray-100 pb-4">
            <RouterLink to="/login" class="text-sm font-medium text-gray-400 hover:text-gray-600 transition pb-1">Login</RouterLink>
            <span class="text-sm font-semibold text-gray-900 border-b-2 border-gray-900 pb-1 cursor-default">Sign Up</span>
          </div>

          <h1 class="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
          <p class="text-gray-400 text-sm mb-6">Join WanderMatch and find your travel companion.</p>

          <!-- Error -->
          <div v-if="error" class="bg-red-50 text-red-500 text-xs rounded-lg px-4 py-3 mb-4">
            {{ error }}
          </div>

          <form @submit.prevent="handleRegister" class="flex flex-col gap-3.5">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
              <input
                v-model="name"
                type="text"
                placeholder="John Doe"
                required
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-300"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Email address</label>
              <input
                v-model="email"
                type="email"
                placeholder="you@example.com"
                required
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-300"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="At least 6 characters"
                  required
                  class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 pr-12 placeholder-gray-300"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-gray-600"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Confirm Password</label>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                :class="[
                  'w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 placeholder-gray-300',
                  passwordMismatch
                    ? 'border-red-300 focus:ring-red-300'
                    : 'border-gray-200 focus:ring-gray-900'
                ]"
              />
              <p v-if="passwordMismatch" class="text-red-400 text-xs mt-1">Passwords do not match</p>
            </div>

            <button
              type="submit"
              :disabled="auth.loading || passwordMismatch"
              class="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white font-semibold py-2.5 rounded-lg transition text-sm mt-1"
            >
              {{ auth.loading ? 'Creating account...' : 'Create Account' }}
            </button>

            <div class="flex items-center gap-3">
              <div class="flex-1 h-px bg-gray-100" />
              <span class="text-xs text-gray-400">or</span>
              <div class="flex-1 h-px bg-gray-100" />
            </div>

            <p class="text-center text-xs text-gray-400">
              Already have an account?
              <RouterLink to="/login" class="text-gray-900 font-semibold hover:underline">Sign in</RouterLink>
            </p>
          </form>
        </div>
      </div>

      <!-- Right: Image Panel -->
      <AuthImagePanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'
import AuthImagePanel from '../../components/AuthImagePanel.vue'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

const error = computed(() => auth.error)
const passwordMismatch = computed(() =>
  confirmPassword.value.length > 0 && password.value !== confirmPassword.value
)

async function handleRegister() {
  if (passwordMismatch.value) return
  try {
    await auth.register(name.value, email.value, password.value)
    router.push('/discover')
  } catch {
    // error displayed from store
  }
}
</script>