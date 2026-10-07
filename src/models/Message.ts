export interface Message {
  id: string
  // null — стикер, фото и другие не текстовые сообщения
  text: string | null
  isOutgoing: boolean
  timestamp: number
}
