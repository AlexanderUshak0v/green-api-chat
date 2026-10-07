import { Icon56MessagesOutline } from '@vkontakte/icons'
import { Button, FormItem, FormStatus, Input, Placeholder } from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useState, type FormEvent } from 'react'
import { useStore } from '@/stores/RootStoreContext'
import styles from './LoginPage.module.css'

export const LoginPage = observer(() => {
  const { authStore } = useStore()
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    authStore.login({
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    })
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Placeholder icon={<Icon56MessagesOutline />} title="Вход в чат">
          Введите данные инстанса из личного кабинета GREEN-API
        </Placeholder>

        {authStore.error && (
          <FormItem>
            <FormStatus mode="error">{authStore.error}</FormStatus>
          </FormItem>
        )}

        <FormItem top="idInstance" htmlFor="idInstance">
          <Input
            id="idInstance"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            required
          />
        </FormItem>

        <FormItem top="apiTokenInstance" htmlFor="apiTokenInstance">
          <Input
            id="apiTokenInstance"
            type="password"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            required
          />
        </FormItem>

        <FormItem>
          <Button
            type="submit"
            size="l"
            appearance="accent-invariable"
            stretched
            loading={authStore.isLoading}
          >
            Войти
          </Button>
        </FormItem>
      </form>
    </div>
  )
})
