import { Icon20UserOutline, Icon28UserOutline } from '@vkontakte/icons'
import { Avatar } from '@vkontakte/vkui'
import styles from './ChatAvatar.module.css'

type Props = {
  size: 36 | 48
}

export const ChatAvatar = ({ size }: Props) => (
  <Avatar
    size={size}
    gradientColor="custom"
    noBorder
    className={styles.avatar}
    fallbackIcon={size === 48 ? <Icon28UserOutline /> : <Icon20UserOutline />}
  />
)
