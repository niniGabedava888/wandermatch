import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: number
  type: 'interest' | 'message'
  title: string
  body: string
  link: string
  profilePhoto?: string | null
  read: boolean
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  function add(n: Omit<Notification, 'id' | 'read'>) {
    const id = Date.now()
    notifications.value = [...notifications.value, { ...n, id, read: false }]
    setTimeout(() => removeNotification(id), 5000)
  }

  function removeNotification(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return { add, notifications, removeNotification }
})
