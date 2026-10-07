import axios from 'axios'
import type { Credentials } from '@/models/Credentials'

const API_URL = 'https://api.green-api.com'

export const greenApi = axios.create({ timeout: 15_000 })

let token = ''

export const setCredentials = ({ idInstance, apiTokenInstance }: Credentials) => {
  greenApi.defaults.baseURL = `${API_URL}/waInstance${idInstance}`
  token = apiTokenInstance
}

// GREEN-API принимает токен в пути запроса: /sendMessage/{token}
export const withToken = (method: string) => `/${method}/${token}`

export const isUnauthorized = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 401

// На несуществующий idInstance GREEN-API отвечает 403 без CORS-заголовков,
// поэтому браузер не отдаёт ответ и axios видит ошибку без response
export const isUnknownInstance = (error: unknown) =>
  axios.isAxiosError(error) && !error.response && navigator.onLine
