import { Popup } from '@taroify/core'
import { Text, View } from '@tarojs/components'
import type { PropsWithChildren } from 'react'
import '@taroify/core/popup/style'
import './style.scss'
export function MjSheet({ open, title, onClose, children }: PropsWithChildren<{open: boolean; title: string; onClose: () => void}>) {
  return <Popup open={open} placement='bottom' rounded onClose={next => { if (!next) onClose() }}>
    <View className='mj-sheet'>
      <View className='mj-sheet__handle' />
      <View className='mj-sheet__header'><Text className='mj-sheet__title'>{title}</Text><Text className='mj-sheet__close' onClick={onClose}>关闭</Text></View>
      <View className='mj-sheet__body'>{children}</View>
    </View>
  </Popup>
}
