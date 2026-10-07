import { observer } from 'mobx-react-lite'
import { ChatListItem } from '@/components/ChatListItem/ChatListItem'
import { useStore } from '@/stores/RootStoreContext'

export const ChatList = observer(() => {
  const { chatStore } = useStore()

  return chatStore.chats.map((chat) => <ChatListItem key={chat.chatId} chat={chat} />)
})
