import { Button, View } from '@tarojs/components'
import './style.scss'
export interface MjTabItem { label: string; value: string }
export function MjTabs({ options, value, onChange }: {options: MjTabItem[]; value: string; onChange: (value: string) => void}) {
  return <View className='mj-tabs'>
    {options.map(tab => <Button key={tab.value} className={`mj-tabs__item ${tab.value === value ? 'mj-tabs__item--active' : ''}`} disabled={tab.value === value} onClick={() => onChange(tab.value)}>{tab.label}</Button>)}
  </View>
}
