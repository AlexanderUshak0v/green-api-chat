import type { Message } from './Message'

export interface Chat {
  chatId: string
  phone: string
  messages: Message[]
}
