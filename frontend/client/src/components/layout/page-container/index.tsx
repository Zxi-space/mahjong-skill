import { View, Text } from '@tarojs/components'
import type { PropsWithChildren } from 'react'
import { useThemeStore } from '../../../theme/theme'
import { MjThemeSwitcher } from '../../ui/theme-switcher'
import { MjMiniNavBar } from '../mini-nav-bar'
import { MjBottomTabBar, type MjTabId } from '../bottom-tab-bar'
import './style.scss'
export interface MjPageContainerProps extends PropsWithChildren {
  className?: string
  title?: string
  tab?: MjTabId
}
export function MjPageContainer({ children, className = '', title = '雀变', tab = 'home' }: MjPageContainerProps) {
  const resolved = useThemeStore((state) => state.resolved)
  return <View className={`mj-screen qb-theme-root qb-theme-${resolved}`}>
    <MjMiniNavBar title={title} home={tab === 'home'} />
    <View className={`mj-page ${className}`.trim()}>
      <View className='mj-page__theme'><Text className='mj-page__theme-label'>外观</Text><MjThemeSwitcher /></View>
      {children}
    </View>
    <MjBottomTabBar active={tab} />
  </View>
}
