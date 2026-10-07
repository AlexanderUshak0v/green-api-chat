import type { Message } from './Message'

export interface Chat {
  phone: string
  telegramId: string | null
  messages: Message[]
}
