import { classNames } from '@vkontakte/vkui'
import type { Message } from '@/models/Message'
import { formatTime } from '@/utils/time'
import styles from './MessageBubble.module.css'

type Props = {
  message: Message
  joinsPrevious: boolean
  joinsNext: boolean
}

export const MessageBubble = ({ message, joinsPrevious, joinsNext }: Props) => (
  <div
    className={classNames(
      styles.bubble,
      message.isOutgoing ? styles.outgoing : styles.incoming,
      joinsPrevious && styles.joinsPrevious,
      !joinsNext && styles.tail,
    )}
  >
    <span className={styles.text}>
      {message.text ?? <span className={styles.unsupported}>Сообщение не поддерживается</span>}
    </span>
    <time className={styles.time}>{formatTime(message.timestamp)}</time>
  </div>
)
