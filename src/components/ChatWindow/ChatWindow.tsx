import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { MessageInput } from '@/components/MessageInput/MessageInput'
import { MessageList } from '@/components/MessageList/MessageList'
import type { Chat } from '@/models/Chat'
import { useStore } from '@/stores/RootStoreContext'
import { formatPhone } from '@/utils/phone'
import styles from './ChatWindow.module.css'

interface Props {
  chat: Chat
}

export const ChatWindow = observer(({ chat }: Props) => {
  const { chatStore } = useStore()
  const { isDesktop } = useAdaptivityWithJSMediaQueries()

  return (
    <Panel className={styles.window}>
      <PanelHeader
        before={!isDesktop && <PanelHeaderBack onClick={() => chatStore.selectChat(null)} />}
      >
        {formatPhone(chat.phone)}
      </PanelHeader>

      {!chatStore.isOnline && (
        <div className={styles.offline}>Нет соединения. Переподключаемся…</div>
      )}

      <MessageList messages={chat.messages} />
      <MessageInput key={chat.phone} />
    </Panel>
  )
})
