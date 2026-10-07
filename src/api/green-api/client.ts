import axios from 'axios'
import type { Credentials } from '@/models/Credentials'

export const DEFAULT_API_URL = 'https://api.green-api.com'

export const greenApi = axios.create({ timeout: 15_000 })

let token = ''

export const setCredentials = ({ apiUrl, idInstance, apiTokenInstance }: Credentials) => {
  greenApi.defaults.baseURL = `${apiUrl}/waInstance${idInstance}`
  token = apiTokenInstance
}

// GREEN-API принимает токен в пути запроса: /sendMessage/{token}
export const withToken = (method: string) => `/${method}/${token}`

export const isUnauthorized = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 401
