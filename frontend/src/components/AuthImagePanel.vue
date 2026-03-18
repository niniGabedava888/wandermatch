<template>
  <div class="relative hidden md:flex flex-col w-1/2 overflow-hidden rounded-r-2xl">
    <!-- Background image -->
    <img
      :src="currentImage"
      alt="travel"
      class="absolute inset-0 w-full h-full object-cover transition-all duration-700"
    />

    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

    <!-- Testimonial -->
    <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
      <p class="text-sm leading-relaxed italic mb-4 opacity-90">"{{ currentTestimonial.quote }}"</p>
      <div class="flex items-center justify-between">
        <div>
          <p class="font-semibold text-sm">{{ currentTestimonial.name }}</p>
          <p class="text-xs opacity-70">
            {{ currentTestimonial.role }} · {{ currentTestimonial.location }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="prev"
            class="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition text-sm"
          >
            ‹
          </button>
          <button
            @click="next"
            class="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition text-sm"
          >
            ›
          </button>
        </div>
      </div>

      <!-- Dots -->
      <div class="flex gap-1.5 mt-3">
        <div
          v-for="(_, i) in testimonials"
          :key="i"
          @click="current = i"
          :class="[
            'h-1 rounded-full cursor-pointer transition-all duration-300',
            i === current ? 'w-6 bg-white' : 'w-2 bg-white/40',
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const testimonials = [
  {
    quote:
      "WanderMatch helped me find the perfect travel companion for my solo trip to Japan. Couldn't have done it without this platform!",
    name: 'Sarah Mitchell',
    role: 'Solo Traveller',
    location: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    quote:
      'I was nervous about travelling alone but WanderMatch connected me with amazing people who share my love for adventure.',
    name: 'Carlos Rivera',
    role: 'Adventure Seeker',
    location: 'Barcelona, Spain',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  },
  {
    quote: "Met my best travel buddy through WanderMatch. We've now explored 5 countries together!",
    name: 'Aiko Tanaka',
    role: 'Digital Nomad',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
  },
]

const current = ref(0)
const currentTestimonial = computed(() => testimonials[current.value])
const currentImage = computed(() => testimonials[current.value].image)

function next() {
  current.value = (current.value + 1) % testimonials.length
}
function prev() {
  current.value = (current.value - 1 + testimonials.length) % testimonials.length
}
</script>
