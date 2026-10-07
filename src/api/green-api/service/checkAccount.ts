import { greenApi, withToken } from '../client'

type CheckAccountDto = {
  exist: boolean
  chatId: string
}

// chatId аккаунта Telegram по номеру или null, если аккаунт не найден
export const checkAccount = async (phone: string) => {
  const { data } = await greenApi.post<CheckAccountDto>(withToken('checkAccount'), {
    phoneNumber: Number(phone),
  })
  return data.exist ? data.chatId : null
}
