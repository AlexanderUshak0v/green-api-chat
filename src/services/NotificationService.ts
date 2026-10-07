import { isUnauthorized } from '@/api/green-api/client'
import { deleteNotification } from '@/api/green-api/deleteNotification'
import { receiveNotification } from '@/api/green-api/receiveNotification'
import type { AuthStore } from '@/stores/AuthStore'
import type { ChatStore } from '@/stores/ChatStore'

const RETRY_DELAY = 5_000

export class NotificationService {
  private chatStore: ChatStore
  private authStore: AuthStore
  private controller: AbortController | null = null

  constructor(chatStore: ChatStore, authStore: AuthStore) {
    this.chatStore = chatStore
    this.authStore = authStore
  }

  start() {
    this.stop()
    this.controller = new AbortController()
    this.poll(this.controller.signal)
  }

  stop() {
    this.controller?.abort()
    this.controller = null
  }

  private async poll(signal: AbortSignal) {
    while (!signal.aborted) {
      try {
        const notification = await receiveNotification(signal)
        this.chatStore.setOnline(true)

        if (notification) {
          this.chatStore.handleNotification(notification)
          await deleteNotification(notification.receiptId)
        }
      } catch (error) {
        if (signal.aborted) {
          return
        }
        if (isUnauthorized(error)) {
          this.authStore.logout('Сессия недействительна, войдите заново')
          return
        }
        this.chatStore.setOnline(false)
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      }
    }
  }
}
