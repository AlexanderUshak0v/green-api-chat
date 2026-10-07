import { greenApi, withToken } from '../client'

type StateInstanceDto = {
  stateInstance: string
}

export const getStateInstance = async () => {
  const { data } = await greenApi.get<StateInstanceDto>(withToken('getStateInstance'))
  return data.stateInstance
}
