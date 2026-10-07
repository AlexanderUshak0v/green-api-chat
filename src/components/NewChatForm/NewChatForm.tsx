import { Icon24ArrowRightOutline } from '@vkontakte/icons'
import { FormItem, Input } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useState, type FormEvent } from 'react'
import { IconButton } from '@/components/IconButton/IconButton'
import { useStore } from '@/stores/RootStoreContext'

export const NewChatForm = observer(() => {
  const { chatStore } = useStore()
  const [phone, setPhone] = useState('')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (await chatStore.openChat(phone)) {
      setPhone('')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormItem status={chatStore.openError ? 'error' : 'default'} bottom={chatStore.openError}>
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
