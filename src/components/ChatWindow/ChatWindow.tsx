import { Icon28ArrowLeftOutline } from '@vkontakte/icons'
import {
  Panel,
  PanelHeader,
  PanelHeaderContent,
  Text,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { ChatAvatar } from '@/components/ChatAvatar/ChatAvatar'
import { IconButton } from '@/components/IconButton/IconButton'
import { MessageInput } from '@/components/MessageInput/MessageInput'
import { MessageList } from '@/components/MessageList/MessageList'
import type { Chat } from '@/models/Chat'
import { useStore } from '@/stores/RootStoreContext'
import { formatPhone } from '@/utils/phone'
import styles from './ChatWindow.module.css'

type Props = {
  chat: Chat
}

export const ChatWindow = observer(({ chat }: Props) => {
  const { chatStore } = useStore()
  const { isDesktop } = useAdaptivityWithJSMediaQueries()

  return (
    <Panel className={styles.window} disableBackground>
      <PanelHeader
        className={styles.header}
        delimiter="none"
        before={
          !isDesktop && (
            <IconButton label="Назад" onClick={() => chatStore.selectChat(null)}>
              <Icon28ArrowLeftOutline />
            </IconButton>
          )
        }
      >
        <PanelHeaderContent
          before={<ChatAvatar size={36} />}
          subtitle={!chatStore.isOnline && 'Нет соединения…'}
        >
          <Text weight="1">{formatPhone(chat.phone)}</Text>
        </PanelHeaderContent>
      </PanelHeader>

      <MessageList messages={chat.messages} />
      <MessageInput key={chat.chatId} />
    </Panel>
  )
})
