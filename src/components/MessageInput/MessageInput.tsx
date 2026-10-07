import { Icon24SendOutline } from '@vkontakte/icons'
import { FormStatus, Textarea } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { IconButton } from '@/components/IconButton/IconButton'
import { useStore } from '@/stores/RootStoreContext'
import styles from './MessageInput.module.css'

export const MessageInput = observer(() => {
  const { chatStore } = useStore()
  const [text, setText] = useState('')
  const message = text.trim()

  const send = async () => {
    if (message && (await chatStore.sendMessage(message))) {
      setText('')
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    send()
  }

  // Enter отправляет, Shift+Enter переносит строку
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {chatStore.sendError && <FormStatus mode="error">{chatStore.sendError}</FormStatus>}
      <Textarea
        className={styles.field}
        grow
        rows={1}
        maxHeight={160}
        placeholder="Сообщение"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        after={
          message && (
            <IconButton type="submit" label="Отправить сообщение">
              <Icon24SendOutline />
            </IconButton>
          )
        }
      />
    </form>
  )
})
