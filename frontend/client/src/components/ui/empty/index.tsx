import { Text, View } from '@tarojs/components'
import type { ReactNode } from 'react'
import './style.scss'
export function MjEmpty({ title = '暂无内容', description, action }: { title?: string; description?: string; action?: ReactNode }) {
  return <View className='mj-empty'>
    <View className='mj-empty__glyph' aria-hidden='true'><Text>◇</Text></View>
    <Text className='mj-empty__title'>{title}</Text>
    {description ? <Text className='mj-empty__description'>{description}</Text> : null}
    {action}
  </View>
}
