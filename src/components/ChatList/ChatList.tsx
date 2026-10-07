import { Icon28UserOutline } from '@vkontakte/icons'
import { Avatar, Placeholder, SimpleCell } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/stores/RootStoreContext'
import { formatPhone } from '@/utils/phone'

export const ChatList = observer(() => {
  const { chatStore } = useStore()

  if (chatStore.chats.length === 0) {
    return <Placeholder>Чатов пока нет. Введите номер, чтобы начать</Placeholder>
  }

  return chatStore.chats.map((chat) => {
    const lastMessage = chat.messages.at(-1)

    return (
      <SimpleCell
        key={chat.phone}
        before={<Avatar size={48} fallbackIcon={<Icon28UserOutline />} />}
        subtitle={lastMessage && (lastMessage.text ?? 'Сообщение не поддерживается')}
        activated={chat.phone === chatStore.selectedPhone}
        onClick={() => chatStore.selectChat(chat.phone)}
      >
        {formatPhone(chat.phone)}
      </SimpleCell>
    )
  })
})
