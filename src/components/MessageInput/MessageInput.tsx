import { FormStatus, WriteBar, WriteBarIcon } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { useStore } from '@/stores/RootStoreContext'

export const MessageInput = observer(() => {
  const { chatStore } = useStore()
  const [text, setText] = useState('')

  const send = async () => {
    if (text.trim() && (await chatStore.sendMessage(text.trim()))) {
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
    <form onSubmit={handleSubmit}>
      {chatStore.sendError && <FormStatus mode="error">{chatStore.sendError}</FormStatus>}
      <WriteBar
        placeholder="Сообщение"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={chatStore.isSending}
        after={
          <WriteBarIcon mode="send" type="submit" disabled={chatStore.isSending || !text.trim()} />
        }
      />
    </form>
  )
})
