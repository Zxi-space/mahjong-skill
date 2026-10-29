import { Text, View } from '@tarojs/components'
import './style.scss'
export function MjLoading({ label = '加载中…' }: { label?: string }) {
  return <View className='mj-loading'><View className='mj-loading__spinner' /><Text>{label}</Text></View>
}
