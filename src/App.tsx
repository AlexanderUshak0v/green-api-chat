import { observer } from 'mobx-react-lite'
import { ChatPage } from '@/pages/ChatPage/ChatPage'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import { useStore } from '@/stores/RootStoreContext'

const App = observer(() => {
  const { authStore } = useStore()

  return authStore.isLoggedIn ? <ChatPage /> : <LoginPage />
})

export default App
