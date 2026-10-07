import { Placeholder } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { ChatListItem } from '@/components/ChatListItem/ChatListItem'
import { useStore } from '@/stores/RootStoreContext'

export const ChatList = observer(() => {
  const { chatStore } = useStore()

  if (chatStore.chats.length === 0) {
    return <Placeholder>Чатов пока нет. Введите номер, чтобы начать</Placeholder>
  }

  return chatStore.chats.map((chat) => <ChatListItem key={chat.phone} chat={chat} />)
})
