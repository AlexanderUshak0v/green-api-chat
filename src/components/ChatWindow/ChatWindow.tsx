import { Icon20UserOutline } from '@vkontakte/icons'
import {
  Avatar,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  PanelHeaderContent,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
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
    <Panel className={styles.window}>
      <PanelHeader
        delimiter="separator"
        before={!isDesktop && <PanelHeaderBack onClick={() => chatStore.selectChat(null)} />}
      >
        <PanelHeaderContent
          before={<Avatar size={36} fallbackIcon={<Icon20UserOutline />} />}
          subtitle={!chatStore.isOnline && 'Нет соединения…'}
        >
          {formatPhone(chat.phone)}
        </PanelHeaderContent>
      </PanelHeader>

      <MessageList messages={chat.messages} />
      <MessageInput key={chat.phone} />
    </Panel>
  )
})
