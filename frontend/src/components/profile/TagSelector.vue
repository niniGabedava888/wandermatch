<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="item in options"
      :key="item"
      type="button"
      @click="toggle(item)"
      :class="[
        'px-3 py-1 rounded-full text-xs font-medium border transition capitalize',
        selected.includes(item)
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400',
      ]"
    >
      {{ item }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  options: string[]
  selected: string[]
}>()

const emit = defineEmits<{
  (e: 'update:selected', value: string[]): void
}>()

function toggle(item: string) {
  if (props.selected.includes(item)) {
    emit(
      'update:selected',
      props.selected.filter((i) => i !== item),
    )
  } else {
    emit('update:selected', [...props.selected, item])
  }
}
</script>
