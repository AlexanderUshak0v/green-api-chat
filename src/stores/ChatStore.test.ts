import { describe, expect, it, vi } from 'vitest'
import type { NotificationDto } from '@/api/green-api/receiveNotification'
import { sendMessage } from '@/api/green-api/sendMessage'
import { ChatStore } from './ChatStore'

vi.mock('@/api/green-api/sendMessage', () => ({
  sendMessage: vi.fn().mockResolvedValue('out-1'),
}))

const PHONE = '79124434049'
const TELEGRAM_ID = '10000000'

const createStore = () => {
  const store = new ChatStore()
  store.openChat(PHONE)
  return store
}

const notification = (body: Partial<NotificationDto['body']>): NotificationDto => ({
  receiptId: 1,
  body: {
    typeWebhook: 'incomingMessageReceived',
    idMessage: 'in-1',
    timestamp: 1700000000,
    senderData: { chatId: TELEGRAM_ID },
    messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет' } },
    ...body,
  },
})

const fromPhone = (phone = PHONE, chatId = TELEGRAM_ID) =>
  notification({ senderData: { chatId, senderPhoneNumber: Number(phone) } })

describe('ChatStore', () => {
  it('отправляет по номеру, пока Telegram ID неизвестен', async () => {
    const store = createStore()

    await store.sendMessage('Привет')

    expect(sendMessage).toHaveBeenCalledWith(`${PHONE}@c.us`, 'Привет')
    expect(store.selectedChat?.messages).toHaveLength(1)
  })

  it('узнаёт Telegram ID из эха отправки и находит по нему ответ без номера', async () => {
    const store = createStore()
    await store.sendMessage('Привет')

    store.handleNotification(
      notification({ typeWebhook: 'outgoingAPIMessageReceived', idMessage: 'out-1' }),
    )
    store.handleNotification(notification({}))

    expect(store.selectedChat?.telegramId).toBe(TELEGRAM_ID)
    expect(store.selectedChat?.messages.map((m) => m.text)).toEqual(['Привет', 'Привет'])
  })

  it('находит чат по номеру, если Telegram ID ещё неизвестен', () => {
    const store = createStore()

    store.handleNotification(fromPhone())

    expect(store.selectedChat?.messages).toHaveLength(1)
    expect(store.selectedChat?.telegramId).toBe(TELEGRAM_ID)
  })

  it('не задваивает повторно доставленное сообщение', () => {
    const store = createStore()
    store.handleNotification(fromPhone())
    store.handleNotification(fromPhone())

    expect(store.selectedChat?.messages).toHaveLength(1)
  })

  it('игнорирует сообщения от собеседников без чата', () => {
    const store = createStore()

    store.handleNotification(fromPhone('79990000000', '555'))

    expect(store.chats).toHaveLength(1)
    expect(store.selectedChat?.messages).toHaveLength(0)
  })

  it('сохраняет не текстовое сообщение без текста', () => {
    const store = createStore()

    store.handleNotification(
      notification({
        senderData: { chatId: TELEGRAM_ID, senderPhoneNumber: Number(PHONE) },
        messageData: { typeMessage: 'imageMessage' },
      }),
    )

    expect(store.selectedChat?.messages[0].text).toBeNull()
  })
})
