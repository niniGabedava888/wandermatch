<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 flex flex-col gap-2.5 z-50 w-80">
      <TransitionGroup name="toast">
        <div
          v-for="n in notifications"
          :key="n.id"
          @click="handleClick(n)"
          class="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 flex items-start gap-3 cursor-pointer hover:border-gray-300 transition-all shadow-sm"
        >
          <!-- Avatar -->
          <div class="relative shrink-0">
            <img
              v-if="n.profilePhoto"
              :src="n.profilePhoto"
              class="w-9 h-9 rounded-full object-cover"
            />
            <div
              v-else
              class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
              style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white"
            >
              {{
                n.title
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              }}
            </div>
            <!-- Type indicator dot -->
            <div
              class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-white"
              :style="n.type === 'interest' ? 'background: #d97706' : 'background: #3b82f6'"
            >
              <span style="font-size: 8px">{{ n.type === 'interest' ? '♥' : '✉' }}</span>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 mb-0.5">{{ n.title }}</p>
            <p class="text-xs text-gray-400 truncate mb-1.5">
              {{
                n.type === 'interest'
                  ? 'is interested in travelling with you!'
                  : 'sent you a message'
              }}
            </p>

            <!-- Link label -->
            <p class="text-xs font-medium" style="color: #d97706">
              {{ n.type === 'interest' ? 'View interests →' : 'Open chat →' }}
            </p>

            <!-- Progress bar -->
            <div class="mt-2 h-0.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full toast-progress"
                :style="n.type === 'interest' ? 'background: #d97706' : 'background: #3b82f6'"
              />
            </div>
          </div>

          <!-- Close -->
          <button
            @click.stop="notificationStore.removeNotification(n.id)"
            class="text-gray-300 hover:text-gray-500 transition shrink-0 mt-0.5"
          >
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useNotificationStore, type Notification } from '@/stores/notification.store'
import { storeToRefs } from 'pinia'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)

const router = useRouter()

function handleClick(n: Notification) {
  router.push(n.link)
  notificationStore.removeNotification(n.id)
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-progress {
  width: 100%;
  animation: shrink 5s linear forwards;
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
