import { useAuthStore } from '@/stores/auth.store'
import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

export function useSocket() {
  function connect() {
    if (socket?.connected) return
    const auth = useAuthStore()
    socket = io('localhost:3000', {
      auth: {
        token: auth.token,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      withCredentials: true,
    })
  }

  function disconnect() {
    socket?.disconnect()
    socket = null
  }

  function emit(event: string, data: any) {
    socket?.emit(event, data)
  }

  function on(event: string, callback: (data: any) => void) {
    socket?.on(event, callback)
  }

  function off(event: string) {
    socket?.off(event)
  }

  function isConnected() {
    return socket !== null
  }
  return { connect, disconnect, emit, on, off, isConnected }
}
