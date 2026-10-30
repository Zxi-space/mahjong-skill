import { View } from '@tarojs/components'
import type { PropsWithChildren } from 'react'
import { useThemeStore } from '../../../theme/theme'
import { MjThemeSwitcher } from '../../ui/theme-switcher'
import './style.scss'
export function MjPageContainer({ children, className = '' }: PropsWithChildren<{className?: string}>) {
  const resolved = useThemeStore((state) => state.resolved)
  return <View className={`mj-page qb-theme-root qb-theme-${resolved} ${className}`.trim()}>
    <View className='mj-page__theme'><MjThemeSwitcher /></View>
    {children}
  </View>
}
