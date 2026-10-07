import { greenApi, withToken } from '../client'

type SettingsDto = {
  webhookUrl: string
  incomingWebhook: 'yes' | 'no'
}

export const getSettings = async () => {
  const { data } = await greenApi.get<SettingsDto>(withToken('getSettings'))
  return data
}
