import axios from 'axios'
import type { Credentials } from '@/models/Credentials'

// У каждого инстанса свой apiUrl: хост — первые 4 цифры idInstance,
// например 4100.api.green-api.com для 410022759180
const apiUrl = (idInstance: string) => `https://${idInstance.slice(0, 4)}.api.green-api.com`

export const greenApi = axios.create({ timeout: 15_000 })

let token = ''

export const setCredentials = ({ idInstance, apiTokenInstance }: Credentials) => {
  greenApi.defaults.baseURL = `${apiUrl(idInstance)}/waInstance${idInstance}`
  token = apiTokenInstance
}

// GREEN-API принимает токен в пути запроса: /sendMessage/{token}
export const withToken = (method: string) => `/${method}/${token}`

export const isUnauthorized = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 401

// Для несуществующего idInstance хост apiUrl не отвечает,
// поэтому axios видит сетевую ошибку без response
export const isUnknownInstance = (error: unknown) =>
  axios.isAxiosError(error) && !error.response && navigator.onLine
