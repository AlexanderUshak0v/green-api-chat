import { Icon28DoorArrowRightOutline, Icon56MessageOutline } from '@vkontakte/icons'
import {
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Placeholder,
  SplitCol,
  SplitLayout,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { ChatList } from '@/components/ChatList/ChatList'
import { ChatWindow } from '@/components/ChatWindow/ChatWindow'
import { NewChatForm } from '@/components/NewChatForm/NewChatForm'
import { useStore } from '@/stores/RootStoreContext'

export const ChatPage = observer(() => {
  const { authStore, chatStore, notificationService } = useStore()
  const { isDesktop } = useAdaptivityWithJSMediaQueries()
  const chat = chatStore.selectedChat

  useEffect(() => {
    notificationService.start()
    return () => {
      notificationService.stop()
      chatStore.clear()
    }
  }, [notificationService, chatStore])

  return (
    <SplitLayout>
      {(isDesktop || !chat) && (
        <SplitCol width={360} maxWidth={360} stretchedOnMobile>
          <Panel>
            <PanelHeader
              after={
                <PanelHeaderButton label="Выйти" onClick={() => authStore.logout()}>
                  <Icon28DoorArrowRightOutline />
                </PanelHeaderButton>
              }
            >
              Чаты
            </PanelHeader>
            <NewChatForm />
            <ChatList />
          </Panel>
        </SplitCol>
      )}

      {(isDesktop || chat) && (
        <SplitCol stretchedOnMobile>
          {chat ? (
            <ChatWindow chat={chat} />
          ) : (
            <Panel centered>
              <Placeholder icon={<Icon56MessageOutline />}>
                Выберите чат или начните новый
              </Placeholder>
            </Panel>
          )}
        </SplitCol>
      )}
    </SplitLayout>
  )
})
