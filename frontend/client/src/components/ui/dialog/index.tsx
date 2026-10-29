import { Popup } from '@taroify/core'
import { Text, View } from '@tarojs/components'
import '@taroify/core/popup/style'
import { MjButton } from '../button'
import './style.scss'
export interface MjDialogProps {
  open: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
  onConfirm: () => void
  onClose: () => void
}
export function MjDialog({open, title, description, confirmText = '确定', cancelText = '取消', destructive = false, onConfirm, onClose}: MjDialogProps) {
  return <Popup open={open} rounded placement='center' onClose={next => { if (!next) onClose() }}>
    <View className='mj-dialog'>
      <Text className='mj-dialog__title'>{title}</Text>
      <Text className='mj-dialog__description'>{description}</Text>
      <View className='mj-dialog__actions'>
        <MjButton tone='secondary' variant='outline' block onClick={onClose}>{cancelText}</MjButton>
        <MjButton tone={destructive ? 'danger' : 'primary'} block onClick={onConfirm}>{confirmText}</MjButton>
      </View>
    </View>
  </Popup>
}
