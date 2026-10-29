import { Text, View } from '@tarojs/components'
import type { ReactNode } from 'react'
import './style.scss'
export function MjEmpty({ title = '暂无内容', description, action }: { title?: string; description?: string; action?: ReactNode }) {
  return <View className='mj-empty'><Text className='mj-empty__icon'>🀄</Text><Text className='mj-empty__title'>{title}</Text>{description ? <Text className='mj-empty__description'>{description}</Text> : null}{action}</View>
}
