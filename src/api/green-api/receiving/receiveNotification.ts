import { greenApi, withToken } from '../client'

// Сколько секунд сервер ждёт новое уведомление, прежде чем вернуть null
const RECEIVE_TIMEOUT = 20

export type NotificationDto = {
  receiptId: number
  body: {
    typeWebhook: string
    idMessage: string
    timestamp: number
    senderData?: {
      chatId: string
    }
    messageData?: {
      typeMessage: string
      textMessageData?: { textMessage: string }
      extendedTextMessageData?: { text: string }
    }
  }
}

export const receiveNotification = async (signal: AbortSignal) => {
  const { data } = await greenApi.get<NotificationDto | null>(withToken('receiveNotification'), {
    params: { receiveTimeout: RECEIVE_TIMEOUT },
    timeout: (RECEIVE_TIMEOUT + 10) * 1000,
    // Пустую очередь сервер отдаёт как 408, а не как null с 200
    validateStatus: (status) => (status >= 200 && status < 300) || status === 408,
    signal,
  })
  return data || null
}
