export const formatTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
