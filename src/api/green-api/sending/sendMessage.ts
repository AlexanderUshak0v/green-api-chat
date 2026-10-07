import { greenApi, withToken } from '../client'

type SendMessageDto = {
  idMessage: string
}

export const sendMessage = async (chatId: string, message: string) => {
  const { data } = await greenApi.post<SendMessageDto>(withToken('sendMessage'), {
    chatId,
    message,
  })
  return data.idMessage
}
