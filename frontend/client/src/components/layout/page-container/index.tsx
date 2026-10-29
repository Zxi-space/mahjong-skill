import { View } from '@tarojs/components'
import type { PropsWithChildren } from 'react'
import './style.scss'
export function MjPageContainer({ children, className = '' }: PropsWithChildren<{className?: string}>) {
  return <View className={`mj-page ${className}`.trim()}>{children}</View>
}
