import { describe, expect, it, vi } from 'vitest'
import type { NotificationDto } from '@/api/green-api/receiving/receiveNotification'
import { sendMessage } from '@/api/green-api/sending/sendMessage'
import { checkAccount } from '@/api/green-api/service/checkAccount'
import { ChatStore } from './ChatStore'

vi.mock('@/api/green-api/sending/sendMessage', () => ({
  sendMessage: vi.fn().mockResolvedValue('out-1'),
}))

vi.mock('@/api/green-api/service/checkAccount', () => ({
  checkAccount: vi.fn(),
}))

const PHONE = '79124434049'
const CHAT_ID = '10000000'

const createStore = async () => {
  vi.mocked(checkAccount).mockResolvedValue(CHAT_ID)
  const store = new ChatStore()
  await store.openChat(PHONE)
  return store
}

const notification = (body: Partial<NotificationDto['body']>): NotificationDto => ({
  receiptId: 1,
  body: {
    typeWebhook: 'incomingMessageReceived',
    idMessage: 'in-1',
    timestamp: 1700000000,
    senderData: { chatId: CHAT_ID },
    messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет' } },
    ...body,
  },
})

describe('ChatStore', () => {
  it('открывает чат с chatId, который вернул checkAccount', async () => {
    const store = await createStore()

    expect(checkAccount).toHaveBeenCalledWith(PHONE)
    expect(store.selectedChat?.chatId).toBe(CHAT_ID)
  })

  it('не открывает чат, если аккаунт Telegram не найден', async () => {
    vi.mocked(checkAccount).mockResolvedValue(null)
    const store = new ChatStore()

    await store.openChat(PHONE)

    expect(store.openError).not.toBe('')
    expect(store.chats).toHaveLength(0)
  })

  it('отправляет сообщение по chatId', async () => {
    const store = await createStore()

    await store.sendMessage('Привет')

    expect(sendMessage).toHaveBeenCalledWith(CHAT_ID, 'Привет')
    expect(store.selectedChat?.messages).toHaveLength(1)
  })

  it('добавляет входящее сообщение в чат собеседника', async () => {
    const store = await createStore()

    store.handleNotification(notification({}))

    expect(store.selectedChat?.messages.map((m) => m.text)).toEqual(['Привет'])
  })

  it('не задваивает повторно доставленное сообщение', async () => {
    const store = await createStore()
    store.handleNotification(notification({}))
    store.handleNotification(notification({}))

    expect(store.selectedChat?.messages).toHaveLength(1)
  })

  it('игнорирует сообщения от собеседников без чата', async () => {
    const store = await createStore()

    store.handleNotification(notification({ senderData: { chatId: '555' } }))

    expect(store.chats).toHaveLength(1)
    expect(store.selectedChat?.messages).toHaveLength(0)
  })

  it('сохраняет не текстовое сообщение без текста', async () => {
    const store = await createStore()

    store.handleNotification(notification({ messageData: { typeMessage: 'imageMessage' } }))

    expect(store.selectedChat?.messages[0].text).toBeNull()
  })
})
