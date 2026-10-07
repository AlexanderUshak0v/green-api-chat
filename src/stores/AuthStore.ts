import { makeAutoObservable, runInAction } from 'mobx'
import { isUnauthorized, isUnknownInstance, setCredentials } from '@/api/green-api/client'
import { getSettings } from '@/api/green-api/account/getSettings'
import { getStateInstance } from '@/api/green-api/account/getStateInstance'
import type { Credentials } from '@/models/Credentials'

const STORAGE_KEY = 'green-api-credentials'

export class AuthStore {
  credentials: Credentials | null = null
  isLoading = false
  error = ''

  constructor() {
    makeAutoObservable(this)

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const credentials: Credentials = JSON.parse(saved)
      this.credentials = credentials
      setCredentials(credentials)
    }
  }

  get isLoggedIn() {
    return this.credentials !== null
  }

  async login(credentials: Credentials) {
    if (!/^\d+$/.test(credentials.idInstance)) {
      this.error = 'idInstance должен состоять только из цифр'
      return
    }

    this.isLoading = true
    this.error = ''
    setCredentials(credentials)

    const error = await this._verifyInstance()
    runInAction(() => {
      this.isLoading = false
      this.error = error
      if (!error) {
        this.credentials = credentials
        localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
      }
    })
  }

  // Текст ошибки или пустая строка, если инстанс готов к работе
  private async _verifyInstance() {
    try {
      if ((await getStateInstance()) !== 'authorized') {
        return 'Telegram не подключён к инстансу. Отсканируйте QR-код в личном кабинете GREEN-API'
      }
      return await this._checkSettings()
    } catch (error) {
      if (isUnauthorized(error)) {
        return 'Неверный idInstance или apiTokenInstance'
      }
      return isUnknownInstance(error)
        ? 'Неверный idInstance'
        : 'Не удалось подключиться к GREEN-API'
    }
  }

  // Без этих настроек входящие сообщения не попадут в очередь receiveNotification
  private async _checkSettings() {
    const settings = await getSettings()
    const steps = [
      settings.webhookUrl && 'очистите «Адрес отправки уведомлений (URL)»',
      settings.incomingWebhook !== 'yes' &&
        'включите «Получать уведомления о входящих сообщениях и файлах»',
    ].filter(Boolean)

    return steps.length
      ? `Сообщения не будут приходить. В личном кабинете GREEN-API в настройках уведомлений инстанса ${steps.join(', ')}`
      : ''
  }

  logout(error = '') {
    this.credentials = null
    this.error = error
    localStorage.removeItem(STORAGE_KEY)
  }
}
