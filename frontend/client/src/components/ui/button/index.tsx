import { Button } from '@taroify/core'
import type { ComponentProps } from 'react'
import '@taroify/core/button/style'
import './style.scss'

type BaseProps = ComponentProps<typeof Button>
export type MjButtonTone = 'primary' | 'secondary' | 'danger' | 'success'
export type MjButtonVariant = 'solid' | 'outline' | 'ghost'
export type MjButtonProps = Omit<BaseProps, 'color' | 'variant' | 'size'> & {
  tone?: MjButtonTone
  variant?: MjButtonVariant
  size?: 'large' | 'medium' | 'small'
}

const tones = { primary: 'primary', secondary: 'default', danger: 'danger', success: 'success' } as const
const variants = { solid: 'contained', outline: 'outlined', ghost: 'text' } as const

export function MjButton({
  tone = 'primary', variant = 'solid', size = 'medium', className = '', children, ...rest
}: MjButtonProps) {
  return (
    <Button
      color={tones[tone]}
      variant={variants[variant]}
      size={size}
      className={`mj-button mj-button--${tone} mj-button--${variant} ${className}`.trim()}
      {...rest}
    >{children}</Button>
  )
}
