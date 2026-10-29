import { Image, Text, View } from '@tarojs/components'
import './style.scss'
export function MjAvatar({ name, src, size = 'medium' }: {name: string; src?: string; size?: 'small' | 'medium' | 'large'}) {
  return <View className={`mj-avatar mj-avatar--${size}`}>
    {src ? <Image className='mj-avatar__image' src={src} mode='aspectFill' /> : <Text>{name.slice(0, 1) || '雀'}</Text>}
  </View>
}
