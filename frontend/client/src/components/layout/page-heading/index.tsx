import { Text, View } from '@tarojs/components'
import './style.scss'
export function MjPageHeading({ eyebrow, title, description }: {eyebrow?: string; title: string; description?: string}) {
  return <View className='mj-page-heading'>
    {eyebrow ? <Text className='mj-page-heading__eyebrow'>{eyebrow}</Text> : null}
    <Text className='mj-page-heading__title'>{title}</Text>
    {description ? <Text className='mj-page-heading__description'>{description}</Text> : null}
  </View>
}
