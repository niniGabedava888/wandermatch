<template>
  <div class="min-h-screen bg-gray-50 flex items-start justify-center p-8">
    <div class="w-full max-w-4xl flex gap-6">

      <!-- Sidebar -->
      <div class="w-56 shrink-0">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Profile</p>
        <nav class="flex flex-col gap-1">
          <button
            v-for="item in sidebar"
            :key="item.key"
            @click="active = item.key"
            :class="[
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-left',
              active === item.key
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            ]"
          >
            <span>{{ item.icon }}</span>
            {{ item.label }}
          </button>
        </nav>
      </div>

      <!-- Content -->
      <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <PersonalInfo v-if="active === 'personal'" />
        <TripsSection v-if="active === 'trips'" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PersonalInfo from '../../components/profile/PersonalInfo.vue'
import TripsSection from '../../components/profile/TripsSection.vue'

const active = ref('personal')

const sidebar = [
  { key: 'personal', label: 'Personal Info', icon: '👤' },
  { key: 'trips', label: 'Trips', icon: '✈️' },
]
</script>