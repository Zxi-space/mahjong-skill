import { Toast } from '@taroify/core'
import '@taroify/core/toast/style'
export interface MjToastProps {
  open: boolean
  message: string
  tone?: 'text' | 'success' | 'fail'
  onClose: () => void
}
export function MjToast({ open, message, tone = 'text', onClose }: MjToastProps) {
  return <Toast open={open} type={tone} duration={2200} onClose={next => { if (!next) onClose() }}>{message}</Toast>
}
