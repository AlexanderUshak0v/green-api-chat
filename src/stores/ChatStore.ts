import { makeAutoObservable, runInAction } from 'mobx'
import type { NotificationDto } from '@/api/green-api/receiveNotification'
import { sendMessage } from '@/api/green-api/sendMessage'
import type { Chat } from '@/models/Chat'

export class ChatStore {
  chats: Chat[] = []
  selectedPhone: string | null = null
  isSending = false
  sendError = ''
  isOnline = true

  constructor() {
    makeAutoObservable(this)
  }

  get selectedChat() {
    return this.chats.find((chat) => chat.phone === this.selectedPhone) ?? null
  }

  openChat(phone: string) {
    if (!this.chats.some((chat) => chat.phone === phone)) {
      this.chats.unshift({ phone, telegramId: null, messages: [] })
    }
    this.selectChat(phone)
  }

  selectChat(phone: string | null) {
    this.selectedPhone = phone
    this.sendError = ''
  }

  setOnline(isOnline: boolean) {
    this.isOnline = isOnline
  }

  clear() {
    this.chats = []
    this.selectedPhone = null
  }

  async sendMessage(text: string) {
    const chat = this.selectedChat
    if (!chat) {
      return false
    }

    this.isSending = true
    this.sendError = ''

    try {
      const chatId = chat.telegramId ?? `${chat.phone}@c.us`
      const id = await sendMessage(chatId, text)
      runInAction(() => {
        chat.messages.push({ id, text, isOutgoing: true, timestamp: Date.now() / 1000 })
      })
      return true
    } catch {
      runInAction(() => {
        this.sendError = 'Не удалось отправить сообщение'
      })
      return false
    } finally {
      runInAction(() => {
        this.isSending = false
      })
    }
  }

  handleNotification({ body }: NotificationDto) {
    const { typeWebhook, idMessage, timestamp, senderData, messageData } = body
    if (!senderData) {
      return
    }

    // Эхо нашей отправки — из него узнаём Telegram ID собеседника
    if (typeWebhook === 'outgoingAPIMessageReceived') {
      const chat = this.chats.find((c) => c.messages.some((m) => m.id === idMessage))
      if (chat) {
        chat.telegramId = senderData.chatId
      }
      return
    }

    if (typeWebhook !== 'incomingMessageReceived') {
      return
    }

    // Telegram присылает номер, только если собеседник его не скрыл, поэтому сначала ищем по ID
    const chat =
      this.chats.find((c) => c.telegramId === senderData.chatId) ??
      this.chats.find((c) => c.phone === String(senderData.senderPhoneNumber))

    if (!chat || chat.messages.some((m) => m.id === idMessage)) {
      return
    }

    chat.telegramId = senderData.chatId
    const text =
      messageData?.textMessageData?.textMessage ??
      messageData?.extendedTextMessageData?.text ??
      null
    chat.messages.push({ id: idMessage, text, isOutgoing: false, timestamp })
  }
}
