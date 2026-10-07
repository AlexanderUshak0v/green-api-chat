import { Icon28DoorArrowRightOutline, Icon56MessagesOutline } from '@vkontakte/icons'
import {
  Panel,
  PanelHeader,
  Placeholder,
  SplitCol,
  SplitLayout,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { ChatList } from '@/components/ChatList/ChatList'
import { ChatWindow } from '@/components/ChatWindow/ChatWindow'
import { IconButton } from '@/components/IconButton/IconButton'
import { NewChatForm } from '@/components/NewChatForm/NewChatForm'
import { useStore } from '@/stores/RootStoreContext'
import styles from './ChatPage.module.css'

const SIDEBAR_WIDTH = 360

export const ChatPage = observer(() => {
  const { authStore, chatStore, notificationService } = useStore()
  const { isDesktop } = useAdaptivityWithJSMediaQueries()
  const chat = chatStore.selectedChat
  const hasChats = chatStore.chats.length > 0

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
        <SplitCol
          className={styles.sidebar}
          width={SIDEBAR_WIDTH}
          minWidth={SIDEBAR_WIDTH}
          maxWidth={SIDEBAR_WIDTH}
          stretchedOnMobile={!isDesktop}
        >
          <Panel>
            <PanelHeader
              delimiter="none"
              after={
                <IconButton label="Выйти" title="Выйти" onClick={() => authStore.logout()}>
                  <Icon28DoorArrowRightOutline />
                </IconButton>
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
        <SplitCol className={styles.chat} width="100%" stretchedOnMobile={!isDesktop}>
          {chat ? (
            <ChatWindow chat={chat} />
          ) : (
            <Panel centered disableBackground>
              <Placeholder
                icon={<Icon56MessagesOutline />}
                title={hasChats ? 'Выберите чат' : 'Чатов пока нет'}
              >
                {hasChats ? 'Или введите номер, чтобы начать новый' : 'Введите номер, чтобы начать'}
              </Placeholder>
            </Panel>
          )}
        </SplitCol>
      )}
    </SplitLayout>
  )
})
