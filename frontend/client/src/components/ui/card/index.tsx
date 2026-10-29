import { View } from '@tarojs/components'
import type { PropsWithChildren } from 'react'
import './style.scss'
export type MjCardProps = PropsWithChildren<{
  className?: string
  tone?: 'surface' | 'mint'
  padded?: boolean
}>
export function MjCard({ children, className = '', tone = 'surface', padded = true }: MjCardProps) {
  return <View className={`mj-card mj-card--${tone} ${padded ? 'mj-card--padded' : ''} ${className}`.trim()}>{children}</View>
}
