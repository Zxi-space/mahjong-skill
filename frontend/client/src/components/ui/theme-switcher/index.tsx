import { Button, View } from '@tarojs/components'
import { useThemeStore, type ThemePreference } from '../../../theme/theme'
import './style.scss'

const choices: Array<{value: ThemePreference, label: string}> = [
  {value: 'light', label: '浅色'},
  {value: 'dark', label: '深色'},
  {value: 'system', label: '跟随系统'},
]

export function MjThemeSwitcher() {
  const preference = useThemeStore((state) => state.preference)
  const setPreference = useThemeStore((state) => state.setPreference)
  return <View className='mj-theme-switcher' aria-label='显示主题'>
    {choices.map(({value, label}) => <Button
      key={value}
      className={`mj-theme-switcher__item ${preference === value ? 'mj-theme-switcher__item--active' : ''}`}
      aria-label={`${label}主题${preference === value ? '，已选中' : ''}`}
      onClick={() => setPreference(value)}
    >{label}</Button>)}
  </View>
}
