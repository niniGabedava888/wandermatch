<template>
  <div class="min-h-screen bg-gray-50 flex items-start justify-center p-8">
    <div class="w-full max-w-4xl flex gap-6">
      <!-- Content -->
      <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <TripsSection />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TripsSection from '../../components/profile/TripsSection.vue'
</script>
