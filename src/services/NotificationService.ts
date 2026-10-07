import { isUnauthorized } from '@/api/green-api/client'
import { deleteNotification } from '@/api/green-api/receiving/deleteNotification'
import { receiveNotification } from '@/api/green-api/receiving/receiveNotification'
import type { AuthStore } from '@/stores/AuthStore'
import type { ChatStore } from '@/stores/ChatStore'

const RETRY_DELAY = 5_000

export class NotificationService {
  private _chatStore: ChatStore
  private _authStore: AuthStore
  private _controller: AbortController | null = null

  constructor(chatStore: ChatStore, authStore: AuthStore) {
    this._chatStore = chatStore
    this._authStore = authStore
  }

  start() {
    this.stop()
    this._controller = new AbortController()
    this._poll(this._controller.signal)
  }

  stop() {
    this._controller?.abort()
    this._controller = null
  }

  private async _poll(signal: AbortSignal) {
    while (!signal.aborted) {
      try {
        const notification = await receiveNotification(signal)
        this._chatStore.setOnline(true)

        if (notification) {
          this._chatStore.handleNotification(notification)
          await deleteNotification(notification.receiptId)
        }
      } catch (error) {
        if (signal.aborted) {
          return
        }
        if (isUnauthorized(error)) {
          this._authStore.logout('Сессия недействительна, войдите заново')
          return
        }
        this._chatStore.setOnline(false)
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      }
    }
  }
}
