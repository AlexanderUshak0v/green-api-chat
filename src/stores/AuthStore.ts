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

    try {
      const state = await getStateInstance()
      const settingsError = state === 'authorized' ? await this._checkSettings() : ''
      runInAction(() => {
        if (state !== 'authorized') {
          this.error =
            'Telegram не подключён к инстансу. Отсканируйте QR-код в личном кабинете GREEN-API'
        } else if (settingsError) {
          this.error = settingsError
        } else {
          this.credentials = credentials
          localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
        }
      })
    } catch (error) {
      runInAction(() => {
        if (isUnauthorized(error)) {
          this.error = 'Неверный idInstance или apiTokenInstance'
        } else if (isUnknownInstance(error)) {
          this.error = 'Неверный idInstance'
        } else {
          this.error = 'Не удалось подключиться к GREEN-API'
        }
      })
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  // Без этих настроек уведомления не попадут в очередь receiveNotification.
  // Эхо отправки нужно, чтобы узнать Telegram ID собеседника, скрывшего номер
  private async _checkSettings() {
    const settings = await getSettings()
    const steps: string[] = []
    if (settings.webhookUrl) {
      steps.push('очистите «Адрес отправки уведомлений (URL)»')
    }
    if (settings.incomingWebhook !== 'yes') {
      steps.push('включите «Получать уведомления о входящих сообщениях и файлах»')
    }
    if (settings.outgoingAPIMessageWebhook !== 'yes') {
      steps.push('включите «Получать уведомления о сообщениях, отправленных с API»')
    }
    if (steps.length === 0) {
      return ''
    }
    return `Сообщения не будут приходить. В личном кабинете GREEN-API в настройках уведомлений инстанса ${steps.join(', ')}`
  }

  logout(error = '') {
    this.credentials = null
    this.error = error
    localStorage.removeItem(STORAGE_KEY)
  }
}
