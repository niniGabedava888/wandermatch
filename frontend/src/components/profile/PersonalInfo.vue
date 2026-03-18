<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Personal Information</h2>
      <span v-if="saving" class="text-xs text-blue-500 flex items-center gap-1.5">
        <svg class="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Saving changes
      </span>
      <span v-else-if="saved" class="text-xs text-green-500">✓ Saved</span>
    </div>

    <!-- Avatar -->
    <div class="flex items-center gap-4 mb-8">
      <div class="relative w-20 h-20">
        <img
          v-if="auth.user?.profilePhoto"
          :src="auth.user.profilePhoto"
          class="w-20 h-20 rounded-full object-cover"
        />
        <div
          v-else
          class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold"
        >
          {{ auth.user?.name?.[0]?.toUpperCase() ?? '?' }}
        </div>
        <label
          class="absolute bottom-0 right-0 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs hover:bg-gray-900 transition cursor-pointer"
        >
          ✎
          <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
        </label>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-700">{{ auth.user?.name }}</p>
        <p class="text-xs text-gray-400">{{ auth.user?.email }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSave">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
          <input
            v-model="form.name"
            class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Age</label>
          <input
            v-model.number="form.age"
            type="number"
            min="18"
            max="99"
            class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Gender</label>
          <select
            v-model="form.gender"
            class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Nationality</label>
          <input
            v-model="form.nationality"
            class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div class="col-span-2">
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Travel Style</label>
          <select
            v-model="form.travelStyle"
            class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white capitalize"
          >
            <option value="">Select style</option>
            <option v-for="style in travelStyles" :key="style" :value="style" class="capitalize">
              {{ style }}
            </option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-xs font-medium text-gray-600 mb-1.5">Bio</label>
        <textarea
          v-model="form.bio"
          rows="3"
          class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
        />
      </div>

      <div class="mb-4">
        <label class="block text-xs font-medium text-gray-600 mb-2">Interests</label>
        <TagSelector :options="interestOptions" v-model:selected="form.interests" />
      </div>

      <div class="mb-6">
        <label class="block text-xs font-medium text-gray-600 mb-2">Languages</label>
        <TagSelector :options="languageOptions" v-model:selected="form.languages" />
      </div>

      <div v-if="error" class="bg-red-50 text-red-500 text-xs rounded-lg px-4 py-3 mb-4">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="saving"
        class="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
      >
        Save Changes
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import api from '../../api/axios'
import TagSelector from './TagSelector.vue'

const auth = useAuthStore()

const saving = ref(false)
const saved = ref(false)
const error = ref<string | null>(null)

const travelStyles = ['adventurous', 'relaxed', 'cultural', 'budget', 'luxury']
const interestOptions = [
  'hiking',
  'food',
  'nightlife',
  'photography',
  'history',
  'art',
  'beach',
  'camping',
  'cycling',
  'museums',
]
const languageOptions = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Japanese',
  'Chinese',
  'Arabic',
  'Russian',
]

const form = ref({
  name: '',
  age: null as number | null,
  gender: '',
  nationality: '',
  bio: '',
  travelStyle: '',
  interests: [] as string[],
  languages: [] as string[],
})

// populate form from current user on mount
onMounted(() => {
  if (auth.user) {
    form.value = {
      name: auth.user.name ?? '',
      age: auth.user.age ?? null,
      gender: auth.user.gender ?? '',
      nationality: auth.user.nationality ?? '',
      bio: auth.user.bio ?? '',
      travelStyle: auth.user.travelStyle ?? '',
      interests: auth.user.interests ?? [],
      languages: auth.user.languages ?? [],
    }
  }
})

async function handleSave() {
  saving.value = true
  error.value = null
  try {
    const res = await api.patch('/users/me', form.value)
    auth.user = res.data // update store with fresh data
    saved.value = true
    setTimeout(() => (saved.value = false), 2000)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save'
  } finally {
    saving.value = false
  }
}

async function handleAvatarUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const formData = new FormData()
  formData.append('File', file)
  try {
    const res = await api.patch('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    auth.user = res.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to upload photo'
  }
}
</script>
