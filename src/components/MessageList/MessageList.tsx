import { Placeholder } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { MessageBubble } from '@/components/MessageBubble/MessageBubble'
import type { Message } from '@/models/Message'
import styles from './MessageList.module.css'

type Props = {
  messages: Message[]
}

export const MessageList = observer(({ messages }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [messages.length])

  return (
    <div className={styles.list}>
      {messages.length === 0 && <Placeholder stretched>Сообщений пока нет</Placeholder>}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      <div ref={bottomRef} />
    </div>
  )
})
