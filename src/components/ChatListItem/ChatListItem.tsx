import { SimpleCell, Subhead, Text } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { ChatAvatar } from '@/components/ChatAvatar/ChatAvatar'
import type { Chat } from '@/models/Chat'
import { useStore } from '@/stores/RootStoreContext'
import { formatPhone } from '@/utils/phone'
import { formatTime } from '@/utils/time'
import styles from './ChatListItem.module.css'

type Props = {
  chat: Chat
}

export const ChatListItem = observer(({ chat }: Props) => {
  const { chatStore } = useStore()
  const lastMessage = chat.messages.at(-1)

  return (
    <SimpleCell
      borderRadiusMode="inherit"
      before={<ChatAvatar size={48} />}
      subtitle={lastMessage && (lastMessage.text ?? 'Сообщение не поддерживается')}
      after={
        lastMessage && (
          <Subhead className={styles.time}>{formatTime(lastMessage.timestamp)}</Subhead>
        )
      }
      activated={chat.chatId === chatStore.selectedChatId}
      onClick={() => chatStore.selectChat(chat.chatId)}
    >
      <Text weight="1">{formatPhone(chat.phone)}</Text>
    </SimpleCell>
  )
})
