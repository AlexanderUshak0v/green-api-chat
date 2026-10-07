import { makeAutoObservable, runInAction } from 'mobx'
import type { NotificationDto } from '@/api/green-api/receiving/receiveNotification'
import { sendMessage } from '@/api/green-api/sending/sendMessage'
import { checkAccount } from '@/api/green-api/service/checkAccount'
import type { Chat } from '@/models/Chat'
import { normalizePhone } from '@/utils/phone'

export class ChatStore {
  chats: Chat[] = []
  selectedChatId: string | null = null
  isOpening = false
  openError = ''
  isSending = false
  sendError = ''
  isOnline = true

  constructor() {
    makeAutoObservable(this)
  }

  get selectedChat() {
    return this.chats.find((chat) => chat.chatId === this.selectedChatId) ?? null
  }

  async openChat(input: string) {
    const phone = normalizePhone(input)
    if (!phone) {
      this.openError = 'Некорректный номер'
      return false
    }

    if (this.isOpening) {
      return false
    }

    this.openError = ''
    const existing = this.chats.find((chat) => chat.phone === phone)
    if (existing) {
      this.selectChat(existing.chatId)
      return true
    }

    this.isOpening = true
    const chatId = await checkAccount(phone).catch(() => undefined)

    runInAction(() => {
      this.isOpening = false
      if (chatId === undefined) {
        this.openError = 'Не удалось проверить номер'
      } else if (chatId === null) {
        this.openError = 'Аккаунт Telegram с этим номером не найден'
      } else {
        this.chats.unshift({ chatId, phone, messages: [] })
        this.selectChat(chatId)
      }
    })
    return Boolean(chatId)
  }

  selectChat(chatId: string | null) {
    this.selectedChatId = chatId
    this.sendError = ''
  }

  setOnline(isOnline: boolean) {
    this.isOnline = isOnline
  }

  clear() {
    this.chats = []
    this.selectedChatId = null
    this.openError = ''
    this.sendError = ''
  }

  async sendMessage(text: string) {
    const chat = this.selectedChat
    if (!chat || this.isSending) {
      return false
    }

    this.isSending = true
    this.sendError = ''

    const id = await sendMessage(chat.chatId, text).catch(() => null)

    runInAction(() => {
      this.isSending = false
      if (id === null) {
        this.sendError = 'Не удалось отправить сообщение'
      } else {
        chat.messages.push({ id, text, isOutgoing: true, timestamp: Date.now() / 1000 })
      }
    })
    return id !== null
  }

  handleNotification({ body }: NotificationDto) {
    const { typeWebhook, idMessage, timestamp, senderData, messageData } = body
    if (typeWebhook !== 'incomingMessageReceived') {
      return
    }

    const chat = this.chats.find((c) => c.chatId === senderData?.chatId)
    if (!chat || chat.messages.some((m) => m.id === idMessage)) {
      return
    }

    const text =
      messageData?.textMessageData?.textMessage ??
      messageData?.extendedTextMessageData?.text ??
      null
    chat.messages.push({ id: idMessage, text, isOutgoing: false, timestamp })
  }
}
