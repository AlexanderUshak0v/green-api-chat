import { observer } from 'mobx-react-lite'
import type { Message } from '@/models/Message'
import { formatTime } from '@/utils/time'
import styles from './MessageBubble.module.css'

type Props = {
  message: Message
}

export const MessageBubble = observer(({ message }: Props) => (
  <div className={`${styles.bubble} ${message.isOutgoing ? styles.outgoing : styles.incoming}`}>
    {message.text ?? (
      <span className={styles.unsupported}>Сообщение этого типа не поддерживается</span>
    )}
    <time className={styles.time}>{formatTime(message.timestamp)}</time>
  </div>
))
