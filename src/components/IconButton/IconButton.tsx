import { IconButton as VkIconButton, type IconButtonProps } from '@vkontakte/vkui'
import styles from './IconButton.module.css'

export const IconButton = (props: IconButtonProps) => (
  <VkIconButton
    className={styles.button}
    hoverMode={styles.hover}
    activeMode={styles.active}
    focusVisibleMode={styles.focus}
    {...props}
  />
)
