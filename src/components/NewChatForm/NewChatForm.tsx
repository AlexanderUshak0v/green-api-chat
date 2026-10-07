import { Icon24ArrowRightOutline } from '@vkontakte/icons'
import { FormItem, IconButton, Input } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useState, type FormEvent } from 'react'
import { useStore } from '@/stores/RootStoreContext'
import { normalizePhone } from '@/utils/phone'

export const NewChatForm = observer(() => {
  const { chatStore } = useStore()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const normalized = normalizePhone(phone)
    if (!normalized) {
      setError('Некорректный номер')
      return
    }
    chatStore.openChat(normalized)
    setPhone('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormItem status={error ? 'error' : 'default'} bottom={error}>
        <Input
          type="tel"
          placeholder="Новый чат по номеру телефона"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          after={
            phone.trim() && (
              <IconButton type="submit" label="Начать чат">
                <Icon24ArrowRightOutline />
              </IconButton>
            )
          }
        />
      </FormItem>
    </form>
  )
})
