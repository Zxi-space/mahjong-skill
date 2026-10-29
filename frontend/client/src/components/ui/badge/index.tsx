import { Text } from '@tarojs/components'
import type { PropsWithChildren } from 'react'
import './style.scss'
export function MjBadge({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger' }>) {
  return <Text className={`mj-badge mj-badge--${tone}`}>{children}</Text>
}
