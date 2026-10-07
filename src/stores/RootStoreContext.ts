import { createContext, useContext } from 'react'
import { RootStore } from './RootStore'

const RootStoreContext = createContext(new RootStore())

export const useStore = () => useContext(RootStoreContext)
