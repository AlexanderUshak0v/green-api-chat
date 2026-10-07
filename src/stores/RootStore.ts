import { NotificationService } from '@/services/NotificationService'
import { AuthStore } from './AuthStore'
import { ChatStore } from './ChatStore'

export class RootStore {
  authStore = new AuthStore()
  chatStore = new ChatStore()
  notificationService = new NotificationService(this.chatStore, this.authStore)
}
