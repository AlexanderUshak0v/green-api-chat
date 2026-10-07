import { Button, Flex, FormItem, Input } from '@vkontakte/vkui'
import { useState, type FormEvent } from 'react'
import { useStore } from '@/stores/RootStoreContext'
import { normalizePhone } from '@/utils/phone'

export const NewChatForm = () => {
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
        <Flex gap="m" noWrap>
          <Flex.Item flex="grow">
            <Input
              type="tel"
              placeholder="Номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Flex.Item>
          <Flex.Item flex="content">
            <Button type="submit" size="l" appearance="accent-invariable" disabled={!phone.trim()}>
              Начать чат
            </Button>
          </Flex.Item>
        </Flex>
      </FormItem>
    </form>
  )
}
