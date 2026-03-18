<template>
  <div v-if="meta && meta.totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
    <!-- Prev -->
    <button
      @click="emit('change', meta.page - 1)"
      :disabled="!meta.hasPrevPage"
      class="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-sm text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
    >
      ‹
    </button>

    <!-- Page numbers -->
    <template v-for="p in pages" :key="p">
      <span
        v-if="p === '...'"
        class="w-9 h-9 flex items-center justify-center text-gray-300 text-sm"
        >…</span
      >
      <button
        v-else
        @click="emit('change', Number(p))"
        :class="[
          'w-9 h-9 rounded-lg border text-sm font-medium transition',
          p === meta.page
            ? 'bg-gray-900 text-white border-gray-900'
            : 'border-gray-200 text-gray-500 hover:border-gray-400',
        ]"
      >
        {{ p }}
      </button>
    </template>

    <!-- Next -->
    <button
      @click="emit('change', meta.page + 1)"
      :disabled="!meta.hasNextPage"
      class="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-sm text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
    >
      ›
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  meta: {
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}>()

const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

const pages = computed(() => {
  const total = props.meta.totalPages
  const current = props.meta.page
  const delta = 1
  const range: (number | string)[] = []

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    } else if (range[range.length - 1] !== '...') {
      range.push('...')
    }
  }

  return range
})
</script>
