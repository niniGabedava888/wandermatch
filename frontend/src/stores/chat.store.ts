import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

export interface ChatUser {
  id: number
  name: string
  profilePhoto?: string | null
  travelStyle?: string
}

export interface Chat {
  id: number
  senderId: number
  receiverId: number
  sender: ChatUser
  receiver: ChatUser
  trip?: {
    city: string
    country: string
    startDate: string
    endDate: string
  }
}

export interface Message {
  id: number
  content: string
  createdAt: Date
  interestId: number
  senderId: number
}

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([])
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getMyChats() {
    loading.value = true
    try {
      const res = await api.get('/chat/my')
      chats.value = res.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Getting chats failed'
    } finally {
      loading.value = false
    }
  }

  async function getMessages(interestId: number) {
    loading.value = true
    try {
      const res = await api.get(`/chat/${interestId}/messages`)
      messages.value = res.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Getting chats failed'
    } finally {
      loading.value = false
    }
  }

  function addMessage(message: Message) {
    const tempIndex = messages.value.findIndex(
      (m) => m.isTemp && m.content === message.content && m.senderId === message.senderId,
    )
    if (tempIndex !== -1) {
      // replace temp with real message from server
      messages.value[tempIndex] = message
    } else {
      messages.value.push(message)
    }
  }

  function clearMessages() {
    messages.value = []
  }

  return { getMyChats, getMessages, addMessage, clearMessages, chats, messages, error, loading }
})
