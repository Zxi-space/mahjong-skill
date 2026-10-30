import Taro from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import './style.scss'

export type MjTabId = 'home' | 'room' | 'components'
const tabs: Array<{ id: MjTabId; label: string; icon: string; url: string }> = [
  { id: 'home', label: '首页', icon: '⌂', url: '/pages/index/index' },
  { id: 'room', label: '房间演示', icon: '◇', url: '/pages/room/index' },
  { id: 'components', label: '组件示例', icon: '▦', url: '/subpackages/gallery/index' },
]
/** Current navigation contains only real routes; official card library / personal account are not yet implemented. */
export function MjBottomTabBar({ active }: { active: MjTabId }) {
  return <View className='mj-bottom-nav' role='navigation' aria-label='用户端导航'>
    <View className='mj-bottom-nav__inner'>{tabs.map(item => <View
      className={`mj-bottom-nav__item ${active === item.id ? 'is-active' : ''}`}
      key={item.id} role='button' aria-label={item.label}
      onClick={() => { if (active !== item.id) void Taro.redirectTo({ url: item.url }) }}
    ><Text className='mj-bottom-nav__icon'>{item.icon}</Text><Text className='mj-bottom-nav__text'>{item.label}</Text></View>)}</View>
  </View>
}
