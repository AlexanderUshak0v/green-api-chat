import { makeAutoObservable, runInAction } from 'mobx'
import { isUnauthorized, isUnknownInstance, setCredentials } from '@/api/green-api/client'
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
      runInAction(() => {
        if (state === 'authorized') {
          this.credentials = credentials
          localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
        } else {
          this.error =
            'Telegram не подключён к инстансу. Отсканируйте QR-код в личном кабинете GREEN-API'
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

  logout(error = '') {
    this.credentials = null
    this.error = error
    localStorage.removeItem(STORAGE_KEY)
  }
}
