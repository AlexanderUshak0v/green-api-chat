import { greenApi, withToken } from '../client'

export const deleteNotification = async (receiptId: number) => {
  await greenApi.delete(`${withToken('deleteNotification')}/${receiptId}`)
}
