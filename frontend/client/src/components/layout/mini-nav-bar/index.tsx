import Taro from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { useMemo } from 'react'
import './style.scss'

export interface MjMiniNavBarProps {
  title: string
  home?: boolean
}

/** Custom navbar: reserve device status bar + WeChat capsule, never cover its actions. */
export function MjMiniNavBar({ title, home = false }: MjMiniNavBarProps) {
  const statusHeight = useMemo(() => {
    if (process.env.TARO_ENV === 'h5') return 0
    try { return Taro.getSystemInfoSync().statusBarHeight || 0 } catch { return 0 }
  }, [])
  const onBack = () => {
    let count = 0
    try { count = Taro.getCurrentPages().length } catch { count = 0 }
    if (count > 1) void Taro.navigateBack()
    else void Taro.reLaunch({ url: '/pages/index/index' })
  }
  return <View className='mj-nav' style={{ paddingTop: `${statusHeight}px` }}>
    <View className='mj-nav__inner'>
      {home ? <View className='mj-nav__side' /> : <View className='mj-nav__back' role='button' aria-label='返回上一页' onClick={onBack}><Text>‹</Text></View>}
      <Text className='mj-nav__title'>{title}</Text>
      <View className='mj-nav__capsule-space' />
    </View>
  </View>
}
