import { Icon28UserOutline } from '@vkontakte/icons'
import { Avatar, SimpleCell } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import type { Chat } from '@/models/Chat'
import { useStore } from '@/stores/RootStoreContext'
import { formatPhone } from '@/utils/phone'

type Props = {
  chat: Chat
}

export const ChatListItem = observer(({ chat }: Props) => {
  const { chatStore } = useStore()
  const lastMessage = chat.messages.at(-1)

  return (
    <SimpleCell
      borderRadiusMode="inherit"
      before={<Avatar size={48} fallbackIcon={<Icon28UserOutline />} />}
      subtitle={lastMessage && (lastMessage.text ?? 'Сообщение не поддерживается')}
      activated={chat.phone === chatStore.selectedPhone}
      onClick={() => chatStore.selectChat(chat.phone)}
    >
      {formatPhone(chat.phone)}
    </SimpleCell>
  )
})
