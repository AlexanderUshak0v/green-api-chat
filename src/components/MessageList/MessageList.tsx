import { Placeholder } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import type { Message } from '@/models/Message'
import { formatTime } from '@/utils/time'
import styles from './MessageList.module.css'

interface Props {
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
        <div
          key={message.id}
          className={`${styles.message} ${message.isOutgoing ? styles.outgoing : styles.incoming}`}
        >
          {message.text ?? (
            <span className={styles.unsupported}>Сообщение этого типа не поддерживается</span>
          )}
          <time className={styles.time}>{formatTime(message.timestamp)}</time>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  )
})
